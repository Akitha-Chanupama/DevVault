import { TimestampDetails } from '../types';

export function getRelativeTimeString(date: Date, baseDate = new Date()): string {
  const diffMs = date.getTime() - baseDate.getTime();
  const diffSec = Math.round(diffMs / 1000);
  const isPast = diffSec < 0;
  const absSec = Math.abs(diffSec);

  if (absSec < 5) return 'just now';
  if (absSec < 60) return isPast ? `${absSec} seconds ago` : `in ${absSec} seconds`;

  const minutes = Math.floor(absSec / 60);
  if (minutes < 60) return isPast ? `${minutes} minute${minutes > 1 ? 's' : ''} ago` : `in ${minutes} minute${minutes > 1 ? 's' : ''}`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return isPast ? `${hours} hour${hours > 1 ? 's' : ''} ago` : `in ${hours} hour${hours > 1 ? 's' : ''}`;

  const days = Math.floor(hours / 24);
  if (days < 30) return isPast ? `${days} day${days > 1 ? 's' : ''} ago` : `in ${days} day${days > 1 ? 's' : ''}`;

  const months = Math.floor(days / 30);
  if (months < 12) return isPast ? `${months} month${months > 1 ? 's' : ''} ago` : `in ${months} month${months > 1 ? 's' : ''}`;

  const years = Math.floor(days / 365);
  return isPast ? `${years} year${years > 1 ? 's' : ''} ago` : `in ${years} year${years > 1 ? 's' : ''}`;
}

export function parseTimestampInput(rawInput: string | number): TimestampDetails {
  const trimmed = String(rawInput).trim();
  if (!trimmed) {
    return {
      isValid: false,
      seconds: 0,
      milliseconds: 0,
      utcDateString: '',
      utcIsoString: '',
      localDateString: '',
      relativeTime: '',
      timezoneName: '',
      error: 'Please enter a timestamp or date.',
    };
  }

  let ms: number;
  const numeric = Number(trimmed);

  if (!isNaN(numeric)) {
    // If input is 10 digits or less (up to year 2286 in seconds), treat as seconds
    // If input is 13 digits or more, treat as milliseconds
    if (Math.abs(numeric) < 100000000000) {
      ms = numeric * 1000;
    } else {
      ms = numeric;
    }
  } else {
    // Try parsing as ISO or date string
    ms = Date.parse(trimmed);
  }

  if (isNaN(ms) || ms < -8640000000000000 || ms > 8640000000000000) {
    return {
      isValid: false,
      seconds: 0,
      milliseconds: 0,
      utcDateString: '',
      utcIsoString: '',
      localDateString: '',
      relativeTime: '',
      timezoneName: '',
      error: 'Invalid timestamp. Must be a valid epoch number or recognized date string.',
    };
  }

  const date = new Date(ms);
  const seconds = Math.floor(ms / 1000);
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Local';

  return {
    isValid: true,
    seconds,
    milliseconds: ms,
    utcDateString: date.toUTCString(),
    utcIsoString: date.toISOString(),
    localDateString: date.toLocaleString(),
    relativeTime: getRelativeTimeString(date),
    timezoneName: tz,
  };
}

export function dateToTimestamp(isoOrDate: string): TimestampDetails {
  return parseTimestampInput(isoOrDate);
}
