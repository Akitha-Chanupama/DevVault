import { describe, it, expect } from 'vitest';
import {
  generateSinglePassword,
  generatePasswords,
  buildCharset,
  calculateEntropy,
} from './passwordGenerator';

describe('passwordGenerator logic', () => {
  it('generates a password of exact requested length', () => {
    const opts = {
      length: 24,
      uppercase: true,
      lowercase: true,
      numbers: true,
      symbols: true,
      excludeAmbiguous: false,
      count: 1,
    };
    const result = generateSinglePassword(opts);
    expect(result.password.length).toBe(24);
    expect(result.entropyBits).toBeGreaterThan(100);
    expect(result.strengthLevel).toBe('Very Strong');
  });

  it('excludes ambiguous characters when requested', () => {
    const opts = {
      length: 50,
      uppercase: true,
      lowercase: true,
      numbers: true,
      symbols: false,
      excludeAmbiguous: true,
      count: 1,
    };
    const result = generateSinglePassword(opts);
    expect(result.password).not.toMatch(/[l1Io0O]/);
  });

  it('throws when no character group is selected', () => {
    const opts = {
      length: 16,
      uppercase: false,
      lowercase: false,
      numbers: false,
      symbols: false,
      excludeAmbiguous: false,
      count: 1,
    };
    expect(() => generateSinglePassword(opts)).toThrow(
      'At least one character group must be selected'
    );
  });

  it('calculates entropy and builds charset properly', () => {
    const charset = buildCharset({
      length: 10,
      uppercase: true,
      lowercase: true,
      numbers: false,
      symbols: false,
      excludeAmbiguous: false,
      count: 1,
    });
    expect(charset.length).toBe(52);

    const entropy = calculateEntropy(16, 64);
    expect(entropy.entropyBits).toBe(96);
    expect(entropy.strengthLevel).toBe('Strong');

    const bulk = generatePasswords({
      length: 10,
      uppercase: true,
      lowercase: true,
      numbers: true,
      symbols: false,
      excludeAmbiguous: false,
      count: 3,
    });
    expect(bulk).toHaveLength(3);
  });
});
