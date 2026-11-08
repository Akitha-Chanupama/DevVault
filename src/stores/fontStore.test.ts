import { describe, it, expect, beforeEach } from 'vitest';
import { useFontSizeStore, FONT_SIZE_PX } from './fontStore';

describe('useFontSizeStore', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.style.fontSize = '';
    document.documentElement.removeAttribute('data-font-size');
  });

  it('initializes with default normal font size (16px)', () => {
    useFontSizeStore.getState().initFontSize();
    const state = useFontSizeStore.getState();
    expect(state.fontSize).toBe('normal');
    expect(document.documentElement.style.fontSize).toBe('16px');
    expect(document.documentElement.getAttribute('data-font-size')).toBe('normal');
  });

  it('switches to small font size and updates documentElement', () => {
    useFontSizeStore.getState().setFontSize('small');
    expect(useFontSizeStore.getState().fontSize).toBe('small');
    expect(document.documentElement.style.fontSize).toBe(FONT_SIZE_PX.small);
    expect(document.documentElement.getAttribute('data-font-size')).toBe('small');
  });

  it('switches to large and extra large font sizes', () => {
    useFontSizeStore.getState().setFontSize('large');
    expect(useFontSizeStore.getState().fontSize).toBe('large');
    expect(document.documentElement.style.fontSize).toBe(FONT_SIZE_PX.large);

    useFontSizeStore.getState().setFontSize('xlarge');
    expect(useFontSizeStore.getState().fontSize).toBe('xlarge');
    expect(document.documentElement.style.fontSize).toBe(FONT_SIZE_PX.xlarge);
  });
});
