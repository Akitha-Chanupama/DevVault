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

let transitionTimeout: number | undefined;

const applyThemeWithTransition = (resolved: 'light' | 'dark') => {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;

  // Add buttery-smooth global transition class across all colors and borders
  root.classList.add('theme-transitioning');
  applyThemeToDOM(resolved);

  if (typeof window !== 'undefined') {
    if (transitionTimeout) {
      window.clearTimeout(transitionTimeout);
    }
    // Allow generous 850ms for luxurious, buttery-smooth transition to finish
    transitionTimeout = window.setTimeout(() => {
      root.classList.remove('theme-transitioning');
    }, 850);
  }
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      resolvedTheme: 'dark',

      setTheme: (theme: Theme, _origin?: ThemeEventOrigin) => {
        const resolved = theme === 'system' ? getSystemTheme() : theme;
        applyThemeWithTransition(resolved);
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

