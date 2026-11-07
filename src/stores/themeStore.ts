import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'light' | 'dark' | 'system';

export interface ThemeEventOrigin {
  clientX?: number;
  clientY?: number;
}

interface ThemeState {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme, origin?: ThemeEventOrigin) => void;
  initTheme: () => void;
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

const applyThemeWithTransition = (
  resolved: 'light' | 'dark',
  origin?: ThemeEventOrigin
) => {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;

  // Check for document.startViewTransition support
  const hasViewTransition = typeof (document as unknown as { startViewTransition?: unknown }).startViewTransition === 'function';
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  if (hasViewTransition && !prefersReducedMotion) {
    const x = origin?.clientX ?? (typeof window !== 'undefined' ? window.innerWidth / 2 : 0);
    const y = origin?.clientY ?? 32;
    const endRadius = typeof window !== 'undefined'
      ? Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))
      : 1000;

    try {
      const doc = document as unknown as {
        startViewTransition: (cb: () => void) => { ready: Promise<void> };
      };
      const transition = doc.startViewTransition(() => {
        applyThemeToDOM(resolved);
      });

      transition.ready.then(() => {
        root.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${endRadius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: 440,
            easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
            pseudoElement: '::view-transition-new(root)',
          }
        );
      }).catch(() => {
        applyThemeToDOM(resolved);
      });
    } catch {
      applyThemeToDOM(resolved);
    }
  } else {
    // Smooth CSS interpolation fallback
    root.classList.add('theme-transitioning');
    applyThemeToDOM(resolved);
    if (typeof window !== 'undefined') {
      window.setTimeout(() => {
        root.classList.remove('theme-transitioning');
      }, 380);
    }
  }
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      resolvedTheme: 'dark',

      setTheme: (theme: Theme, origin?: ThemeEventOrigin) => {
        const resolved = theme === 'system' ? getSystemTheme() : theme;
        applyThemeWithTransition(resolved, origin);
        set({ theme, resolvedTheme: resolved });
      },

      initTheme: () => {
        const currentTheme = get().theme;
        const resolved = currentTheme === 'system' ? getSystemTheme() : currentTheme;
        applyThemeToDOM(resolved);
        set({ resolvedTheme: resolved });

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

