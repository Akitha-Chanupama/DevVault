import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'light' | 'dark' | 'system';

export interface ThemeEventOrigin {
  clientX?: number;
  clientY?: number;
}

export interface ThemeTransitionState {
  targetTheme: Theme;
  targetResolved: 'light' | 'dark';
  origin?: ThemeEventOrigin;
  phase: 'entering' | 'holding' | 'leaving';
}

interface ThemeState {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  transition: ThemeTransitionState | null;
  setTheme: (theme: Theme, origin?: ThemeEventOrigin) => void;
  initTheme: () => void;
  dismissTransition: () => void;
}

const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const applyThemeToDOM = (resolved: 'light' | 'dark') => {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (resolved === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
};

let phaseTimer1: number | undefined;
let phaseTimer2: number | undefined;
let phaseTimer3: number | undefined;

const clearTransitionTimers = () => {
  if (typeof window === 'undefined') return;
  if (phaseTimer1) window.clearTimeout(phaseTimer1);
  if (phaseTimer2) window.clearTimeout(phaseTimer2);
  if (phaseTimer3) window.clearTimeout(phaseTimer3);
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      resolvedTheme: 'dark',
      transition: null,

      dismissTransition: () => {
        clearTransitionTimers();
        set({ transition: null });
      },

      setTheme: (theme: Theme, origin?: ThemeEventOrigin) => {
        const resolved = theme === 'system' ? getSystemTheme() : theme;
        const current = get();

        // Check for test environment or reduced-motion preference
        const isTest = typeof process !== 'undefined' && process.env?.NODE_ENV === 'test';
        const prefersReducedMotion =
          typeof window !== 'undefined' &&
          window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

        if (isTest || prefersReducedMotion || typeof window === 'undefined') {
          clearTransitionTimers();
          applyThemeToDOM(resolved);
          set({ theme, resolvedTheme: resolved, transition: null });
          return;
        }

        // If theme is already identical and not in an active transition, no-op
        if (current.theme === theme && current.resolvedTheme === resolved && !current.transition) {
          return;
        }

        clearTransitionTimers();

        // Phase 1: Mount atmospheric veil and animate HUD into view (0ms - 320ms)
        set({
          transition: {
            targetTheme: theme,
            targetResolved: resolved,
            origin,
            phase: 'entering',
          },
        });

        // Phase 2: At peak veil coverage (320ms), cleanly swap the DOM theme behind the veil
        phaseTimer1 = window.setTimeout(() => {
          applyThemeToDOM(resolved);
          set((s) => ({
            theme,
            resolvedTheme: resolved,
            transition: s.transition ? { ...s.transition, phase: 'holding' } : null,
          }));

          // Phase 3: Veil begins smooth dissolve (440ms - 920ms)
          phaseTimer2 = window.setTimeout(() => {
            set((s) => ({
              transition: s.transition ? { ...s.transition, phase: 'leaving' } : null,
            }));

            // Phase 4: Unmount transition overlay (at 920ms)
            phaseTimer3 = window.setTimeout(() => {
              set({ transition: null });
            }, 480);
          }, 120);
        }, 320);
      },

      initTheme: () => {
        const currentTheme = get().theme;
        const resolved = currentTheme === 'system' ? getSystemTheme() : currentTheme;
        applyThemeToDOM(resolved);
        set({ resolvedTheme: resolved, transition: null });

        if (typeof window !== 'undefined') {
          const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
          const handleChange = (e: MediaQueryListEvent) => {
            if (get().theme === 'system') {
              const newResolved = e.matches ? 'dark' : 'light';
              applyThemeToDOM(newResolved);
              set({ resolvedTheme: newResolved });
            }
          };
          mediaQuery.addEventListener('change', handleChange);
        }
      },
    }),
    {
      name: 'devvault-theme',
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);
