import { describe, it, expect } from 'vitest';
import { parseTimestampInput, getRelativeTimeString } from './timestampConverter';

describe('timestampConverter logic', () => {
  it('correctly converts 10-digit epoch seconds to UTC ISO string', () => {
    // 1700000000 = Tue, 14 Nov 2023 22:13:20 GMT
    const result = parseTimestampInput('1700000000');
    expect(result.isValid).toBe(true);
    expect(result.seconds).toBe(1700000000);
    expect(result.milliseconds).toBe(1700000000000);
    expect(result.utcIsoString).toBe('2023-11-14T22:13:20.000Z');
  });

  it('correctly converts 13-digit epoch milliseconds', () => {
    const result = parseTimestampInput('1700000000123');
    expect(result.isValid).toBe(true);
    expect(result.seconds).toBe(1700000000);
    expect(result.milliseconds).toBe(1700000000123);
    expect(result.utcIsoString).toBe('2023-11-14T22:13:20.123Z');
  });

  it('converts human date string to epoch values', () => {
    const result = parseTimestampInput('2025-01-01T00:00:00.000Z');
    expect(result.isValid).toBe(true);
    expect(result.seconds).toBe(1735689600);
  });

  it('calculates relative time correctly', () => {
    const now = new Date(1700000000000);
    const past = new Date(1700000000000 - 3600 * 1000 * 2); // 2 hours ago
    expect(getRelativeTimeString(past, now)).toBe('2 hours ago');

    const future = new Date(1700000000000 + 86400 * 1000 * 3); // in 3 days
    expect(getRelativeTimeString(future, now)).toBe('in 3 days');
  });

  it('rejects invalid non-date input', () => {
    const result = parseTimestampInput('not-a-date');
    expect(result.isValid).toBe(false);
    expect(result.error).toBeTruthy();
  });
});
