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

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      resolvedTheme: 'dark',

      setTheme: (theme: Theme, origin?: ThemeEventOrigin) => {
        const resolved = theme === 'system' ? getSystemTheme() : theme;
        const current = get();

        // If theme is already identical, no-op
        if (current.theme === theme && current.resolvedTheme === resolved) {
          return;
        }

        // Check if View Transition API is supported and reduced-motion is not requested
        const isViewTransitionSupported =
          typeof document !== 'undefined' &&
          'startViewTransition' in document &&
          typeof (document as any).startViewTransition === 'function' &&
          !(
            typeof window !== 'undefined' &&
            window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
          );

        if (!isViewTransitionSupported) {
          applyThemeToDOM(resolved);
          set({ theme, resolvedTheme: resolved });
          return;
        }

        // Coordinates of the click origin or top-right theme switch position
        const x = origin?.clientX ?? (typeof window !== 'undefined' ? window.innerWidth - 80 : 0);
        const y = origin?.clientY ?? (typeof window !== 'undefined' ? 32 : 0);

        if (typeof document !== 'undefined') {
          document.documentElement.style.setProperty('--x', `${x}px`);
          document.documentElement.style.setProperty('--y', `${y}px`);
        }

        // Calculate maximum radius to fully cover screen from origin point
        const endRadius = Math.hypot(
          Math.max(x, window.innerWidth - x),
          Math.max(y, window.innerHeight - y)
        );

        // Run the View Transition
        const transition = (document as any).startViewTransition(() => {
          applyThemeToDOM(resolved);
          set({ theme, resolvedTheme: resolved });
        });

        transition.ready
          .then(() => {
            try {
              document.documentElement.animate(
                {
                  clipPath: [
                    `circle(0px at ${x}px ${y}px)`,
                    `circle(${endRadius}px at ${x}px ${y}px)`,
                  ],
                },
                {
                  duration: 480,
                  easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
                  pseudoElement: '::view-transition-new(root)',
                }
              );
            } catch {
              // Fallback if pseudoElement animation is unsupported
            }
          })
          .catch(() => {
            // Transition aborted or interrupted - safe no-op
          });
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
