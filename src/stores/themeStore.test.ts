import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useThemeStore } from './themeStore';

describe('useThemeStore', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = '';
  });

  it('initializes with default system or dark theme', () => {
    useThemeStore.getState().initTheme();
    const state = useThemeStore.getState();
    expect(state.theme).toBeDefined();
    expect(['light', 'dark']).toContain(state.resolvedTheme);
  });

  it('switches to light theme and updates documentElement class', () => {
    useThemeStore.getState().setTheme('light');
    expect(useThemeStore.getState().theme).toBe('light');
    expect(useThemeStore.getState().resolvedTheme).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('switches to dark theme and adds dark class to documentElement', () => {
    useThemeStore.getState().setTheme('dark');
    expect(useThemeStore.getState().theme).toBe('dark');
    expect(useThemeStore.getState().resolvedTheme).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('invokes document.startViewTransition when available', () => {
    const mockReady = Promise.resolve();
    const mockStartViewTransition = vi.fn((cb: () => void) => {
      cb();
      return {
        ready: mockReady,
      };
    });

    const originalSVT = (document as unknown as { startViewTransition?: unknown }).startViewTransition;
    (document as unknown as { startViewTransition: unknown }).startViewTransition = mockStartViewTransition;

    useThemeStore.setState({ theme: 'light', resolvedTheme: 'light' });
    useThemeStore.getState().setTheme('dark', { clientX: 100, clientY: 200 });

    expect(mockStartViewTransition).toHaveBeenCalled();
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(document.documentElement.style.getPropertyValue('--x')).toBe('100px');
    expect(document.documentElement.style.getPropertyValue('--y')).toBe('200px');

    if (originalSVT) {
      (document as unknown as { startViewTransition: unknown }).startViewTransition = originalSVT;
    } else {
      delete (document as unknown as { startViewTransition?: unknown }).startViewTransition;
    }
  });
});
