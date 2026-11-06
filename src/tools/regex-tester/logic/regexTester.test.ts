import { describe, it, expect } from 'vitest';
import { executeRegexTest } from './regexTester';

describe('regexTester logic', () => {
  it('matches pattern globally and captures groups', () => {
    const pattern = '(\\w+)@(\\w+\\.\\w+)';
    const text = 'Contact alice@example.com or bob@test.org for info.';
    const flags = { g: true, i: false, m: false, s: false, u: false };

    const result = executeRegexTest(pattern, flags, text);
    expect(result.success).toBe(true);
    expect(result.count).toBe(2);
    expect(result.matches[0].match).toBe('alice@example.com');
    expect(result.matches[0].groups[0].value).toBe('alice');
    expect(result.matches[0].groups[1].value).toBe('example.com');
    expect(result.matches[1].match).toBe('bob@test.org');
  });

  it('supports named capture groups', () => {
    const pattern = '(?<user>\\w+)@(?<domain>\\w+\\.\\w+)';
    const text = 'test user@vault.dev now';
    const flags = { g: true, i: false, m: false, s: false, u: false };

    const result = executeRegexTest(pattern, flags, text);
    expect(result.success).toBe(true);
    expect(result.count).toBe(1);
    const userGroup = result.matches[0].groups.find((g) => g.name === 'user');
    expect(userGroup?.value).toBe('user');
  });

  it('performs string replacement when replacePattern is provided', () => {
    const pattern = 'apple';
    const text = 'apple pie and apple cider';
    const flags = { g: true, i: false, m: false, s: false, u: false };

    const result = executeRegexTest(pattern, flags, text, 'orange');
    expect(result.success).toBe(true);
    expect(result.replacement).toBe('orange pie and orange cider');
  });

  it('returns helpful error message for malformed regex syntax', () => {
    const pattern = '([a-z';
    const text = 'anything';
    const flags = { g: false, i: false, m: false, s: false, u: false };

    const result = executeRegexTest(pattern, flags, text);
    expect(result.success).toBe(false);
    expect(result.error).toBeTruthy();
  });
});
