import { describe, it, expect } from 'vitest';
import {
  isValidIanaTimezone,
  formatTimezoneDate,
  DEFAULT_TIMEZONES,
} from './timezoneConverter';

describe('timezoneConverter logic', () => {
  it('validates IANA timezone identifiers correctly', () => {
    expect(isValidIanaTimezone('UTC')).toBe(true);
    expect(isValidIanaTimezone('America/New_York')).toBe(true);
    expect(isValidIanaTimezone('Asia/Tokyo')).toBe(true);
    expect(isValidIanaTimezone('Invalid/City_Name')).toBe(false);
  });

  it('formats dates in specific timezones accurately', () => {
    // 2026-11-06T12:00:00Z
    const fixedDate = new Date('2026-11-06T12:00:00Z');
    const tokyoItem = DEFAULT_TIMEZONES.find((t) => t.id === 'tokyo')!;
    const info = formatTimezoneDate(fixedDate, tokyoItem, 'UTC');

    expect(info.timeZone).toBe('Asia/Tokyo');
    expect(info.offsetString).toBe('UTC+9');
    expect(info.relativeHoursDiff).toBe(9);
    expect(info.formattedDate).toContain('Nov 6');
  });

  it('calculates correct relative offset difference between timezones', () => {
    const fixedDate = new Date('2026-11-06T12:00:00Z');
    const nyItem = DEFAULT_TIMEZONES.find((t) => t.id === 'ny')!;
    const info = formatTimezoneDate(fixedDate, nyItem, 'UTC');

    expect(info.relativeHoursDiff).toBeLessThan(0);
    expect(info.offsetString).toContain('UTC-');
  });
});
