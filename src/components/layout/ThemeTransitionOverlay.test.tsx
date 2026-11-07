import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeTransitionOverlay } from './ThemeTransitionOverlay';
import { useThemeStore } from '@/stores/themeStore';

describe('ThemeTransitionOverlay', () => {
  beforeEach(() => {
    useThemeStore.setState({
      theme: 'dark',
      resolvedTheme: 'dark',
      transition: null,
    });
  });

  it('renders nothing when there is no active transition', () => {
    const { container } = render(<ThemeTransitionOverlay />);
    expect(container.firstChild).toBeNull();
  });

  it('renders dark mode transition HUD when switching to dark', () => {
    useThemeStore.setState({
      transition: {
        targetTheme: 'dark',
        targetResolved: 'dark',
        phase: 'entering',
        origin: { clientX: 200, clientY: 50 },
      },
    });

    render(<ThemeTransitionOverlay />);
    expect(screen.getByText('Switching to Obsidian Dark')).toBeInTheDocument();
    expect(screen.getByText('Dark Theme')).toBeInTheDocument();
  });

  it('renders light mode transition HUD when switching to light', () => {
    useThemeStore.setState({
      transition: {
        targetTheme: 'light',
        targetResolved: 'light',
        phase: 'entering',
        origin: { clientX: 300, clientY: 50 },
      },
    });

    render(<ThemeTransitionOverlay />);
    expect(screen.getByText('Switching to Pristine Light')).toBeInTheDocument();
    expect(screen.getByText('Light Theme')).toBeInTheDocument();
  });
});
