import { describe, it, expect } from 'vitest';
import {
  parseHexToRgb,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  calculateContrastRatio,
  getColorDetails,
} from './colorConverter';

describe('colorConverter logic', () => {
  it('converts between HEX and RGB correctly', () => {
    const rgb = parseHexToRgb('#3b82f6');
    expect(rgb).toEqual({ r: 59, g: 130, b: 246 });

    const hex = rgbToHex({ r: 59, g: 130, b: 246 });
    expect(hex.toLowerCase()).toBe('#3b82f6');
  });

  it('converts RGB to HSL and back with minimal rounding loss', () => {
    const rgb = { r: 255, g: 0, b: 0 };
    const hsl = rgbToHsl(rgb);
    expect(hsl).toEqual({ h: 0, s: 100, l: 50 });

    const backRgb = hslToRgb(hsl);
    expect(backRgb).toEqual(rgb);
  });

  it('calculates WCAG contrast ratio accurately for black on white (21:1)', () => {
    const black = { r: 0, g: 0, b: 0 };
    const white = { r: 255, g: 255, b: 255 };

    const result = calculateContrastRatio(black, white);
    expect(result.ratio).toBe(21);
    expect(result.aaNormal).toBe(true);
    expect(result.aaaNormal).toBe(true);
  });

  it('correctly fails WCAG AA normal text on low contrast (e.g., white on yellow)', () => {
    const yellow = { r: 255, g: 255, b: 0 };
    const white = { r: 255, g: 255, b: 255 };

    const result = calculateContrastRatio(yellow, white);
    expect(result.ratio).toBeLessThan(4.5);
    expect(result.aaNormal).toBe(false);
  });

  it('extracts complete color details', () => {
    const details = getColorDetails({ r: 16, g: 185, b: 129 });
    expect(details.hex).toBe('#10b981');
    expect(details.rgbString).toBe('rgb(16, 185, 129)');
    expect(details.hslString).toContain('hsl(');
  });
});

