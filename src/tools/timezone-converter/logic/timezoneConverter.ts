import { TimezoneItem, ConvertedTimezoneInfo } from '../types';

export const DEFAULT_TIMEZONES: TimezoneItem[] = [
  { id: 'utc', name: 'Coordinated Universal Time', timeZone: 'UTC', city: 'UTC' },
  { id: 'london', name: 'Greenwich / British Time', timeZone: 'Europe/London', city: 'London' },
  { id: 'berlin', name: 'Central European Time', timeZone: 'Europe/Berlin', city: 'Berlin / Paris' },
  { id: 'ny', name: 'Eastern Time (US)', timeZone: 'America/New_York', city: 'New York' },
  { id: 'sf', name: 'Pacific Time (US)', timeZone: 'America/Los_Angeles', city: 'San Francisco' },
  { id: 'colombo', name: 'Sri Lanka / India Time', timeZone: 'Asia/Colombo', city: 'Colombo / Mumbai' },
  { id: 'singapore', name: 'Singapore Standard Time', timeZone: 'Asia/Singapore', city: 'Singapore' },
  { id: 'tokyo', name: 'Japan Standard Time', timeZone: 'Asia/Tokyo', city: 'Tokyo' },
  { id: 'sydney', name: 'Australian Eastern Time', timeZone: 'Australia/Sydney', city: 'Sydney' },
];

export function isValidIanaTimezone(tz: string): boolean {
  try {
    Intl.DateTimeFormat(undefined, { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

export function getTimezoneOffsetMinutes(date: Date, timeZone: string): number {
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone,
      timeZoneName: 'shortOffset',
    });
    const parts = formatter.formatToParts(date);
    const tzPart = parts.find((p) => p.type === 'timeZoneName')?.value || 'GMT';

    const match = tzPart.match(/GMT([+-])(\d+)(?::(\d+))?/);
    if (!match) return 0;

    const sign = match[1] === '-' ? -1 : 1;
    const hours = parseInt(match[2], 10);
    const minutes = match[3] ? parseInt(match[3], 10) : 0;

    return sign * (hours * 60 + minutes);
  } catch {
    return 0;
  }
}

export function formatTimezoneDate(date: Date, item: TimezoneItem, baseTimezone: string): ConvertedTimezoneInfo {
  const timeFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: item.timeZone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  const dateFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: item.timeZone,
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const hour24Formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: item.timeZone,
    hour: 'numeric',
    hour12: false,
  });

  const hour24 = parseInt(hour24Formatter.format(date), 10);
  const isDaytime = hour24 >= 6 && hour24 < 18;

  const targetOffsetMin = getTimezoneOffsetMinutes(date, item.timeZone);
  const baseOffsetMin = getTimezoneOffsetMinutes(date, baseTimezone);
  const diffMin = targetOffsetMin - baseOffsetMin;
  const relativeHoursDiff = Math.round((diffMin / 60) * 10) / 10;

  const sign = targetOffsetMin >= 0 ? '+' : '-';
  const absMin = Math.abs(targetOffsetMin);
  const offsetHours = Math.floor(absMin / 60);
  const offsetMins = absMin % 60;
  const offsetString = `UTC${sign}${offsetHours}${offsetMins > 0 ? `:${offsetMins.toString().padStart(2, '0')}` : ''}`;

  return {
    id: item.id,
    name: item.name,
    timeZone: item.timeZone,
    city: item.city,
    formattedTime: timeFormatter.format(date),
    formattedDate: dateFormatter.format(date),
    offsetString,
    isDaytime,
    relativeHoursDiff,
  };
}
