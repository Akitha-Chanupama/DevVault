import { CronExpressionParser } from 'cron-parser';
import { CronHelperResult, CronScheduledDate, CronPreset } from '../types';

export const CRON_PRESETS: CronPreset[] = [
  { label: 'Every Minute', expression: '* * * * *', description: 'Fires at the start of every minute' },
  { label: 'Every 5 Minutes', expression: '*/5 * * * *', description: 'Fires every 5 minutes' },
  { label: 'Every 15 Minutes', expression: '*/15 * * * *', description: 'Fires every 15 minutes' },
  { label: 'Every Hour', expression: '0 * * * *', description: 'Fires at minute 0 of every hour' },
  { label: 'Every Day at Midnight', expression: '0 0 * * *', description: 'Fires daily at 00:00' },
  { label: 'Every Day at 9:00 AM', expression: '0 9 * * *', description: 'Fires daily at 09:00' },
  { label: 'Every Weekday at 9 AM', expression: '0 9 * * 1-5', description: 'Fires Monday through Friday at 09:00' },
  { label: 'Every Sunday at Midnight', expression: '0 0 * * 0', description: 'Fires weekly on Sunday at 00:00' },
  { label: 'First Day of Month', expression: '0 0 1 * *', description: 'Fires on the 1st of every month at midnight' },
];

const DAYS_OF_WEEK: Record<string, string> = {
  '0': 'Sunday',
  '1': 'Monday',
  '2': 'Tuesday',
  '3': 'Wednesday',
  '4': 'Thursday',
  '5': 'Friday',
  '6': 'Saturday',
  '7': 'Sunday',
  'SUN': 'Sunday',
  'MON': 'Monday',
  'TUE': 'Tuesday',
  'WED': 'Wednesday',
  'THU': 'Thursday',
  'FRI': 'Friday',
  'SAT': 'Saturday',
};

const MONTHS: Record<string, string> = {
  '1': 'January',
  '2': 'February',
  '3': 'March',
  '4': 'April',
  '5': 'May',
  '6': 'June',
  '7': 'July',
  '8': 'August',
  '9': 'September',
  '10': 'October',
  '11': 'November',
  '12': 'December',
};

function formatRelativeDistance(target: Date, now: Date): string {
  const diffMs = target.getTime() - now.getTime();
  if (diffMs <= 0) return 'Just now';

  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) {
    const remHours = diffHours % 24;
    return `in ${diffDays}d ${remHours}h`;
  }
  if (diffHours > 0) {
    const remMin = diffMin % 60;
    return `in ${diffHours}h ${remMin}m`;
  }
  if (diffMin > 0) {
    return `in ${diffMin} minute${diffMin === 1 ? '' : 's'}`;
  }
  return `in ${diffSec} second${diffSec === 1 ? '' : 's'}`;
}

export function explainCron(
  minute: string,
  hour: string,
  dayOfMonth: string,
  month: string,
  dayOfWeek: string
): string {
  const parts: string[] = [];

  // Minute
  if (minute === '*' && hour === '*') {
    parts.push('Every minute');
  } else if (minute.startsWith('*/')) {
    const interval = minute.substring(2);
    parts.push(`Every ${interval} minutes`);
  } else if (minute !== '*' && hour === '*') {
    parts.push(`At minute ${minute} past every hour`);
  } else if (hour !== '*' && minute !== '*') {
    const pad = (v: string) => v.padStart(2, '0');
    parts.push(`At ${pad(hour)}:${pad(minute)}`);
  } else if (hour !== '*' && minute === '*') {
    parts.push(`Every minute during hour ${hour}`);
  }

  // Day of Month & Month
  if (dayOfMonth !== '*' && month === '*') {
    parts.push(`on day ${dayOfMonth} of the month`);
  } else if (dayOfMonth !== '*' && month !== '*') {
    const mName = MONTHS[month] || `month ${month}`;
    parts.push(`on day ${dayOfMonth} of ${mName}`);
  } else if (dayOfMonth === '*' && month !== '*') {
    const mName = MONTHS[month] || `month ${month}`;
    parts.push(`in ${mName}`);
  }

  // Day of Week
  if (dayOfWeek !== '*') {
    if (dayOfWeek === '1-5') {
      parts.push('Monday through Friday');
    } else {
      const dName = DAYS_OF_WEEK[dayOfWeek.toUpperCase()] || `day-of-week ${dayOfWeek}`;
      parts.push(`on ${dName}`);
    }
  }

  return parts.join(', ') || 'Custom schedule';
}

export function evaluateCronExpression(cronStr: string, count = 5): CronHelperResult {
  const trimmed = cronStr.trim();
  const fieldsArray = trimmed.split(/\s+/);

  const emptyFields = {
    minute: '*',
    hour: '*',
    dayOfMonth: '*',
    month: '*',
    dayOfWeek: '*',
  };

  if (fieldsArray.length < 5 || fieldsArray.length > 6) {
    return {
      isValid: false,
      explanation: 'Invalid cron format: standard cron requires 5 fields (or 6 with seconds).',
      nextDates: [],
      error: `Expected 5 or 6 fields, but found ${fieldsArray.length}. Format: [min] [hour] [day] [month] [weekday]`,
      fields: emptyFields,
    };
  }

  // In 5-field cron: minute hour dayOfMonth month dayOfWeek
  // If 6-field: second minute hour dayOfMonth month dayOfWeek
  const isSixField = fieldsArray.length === 6;
  const offset = isSixField ? 1 : 0;

  const currentFields = {
    minute: fieldsArray[offset],
    hour: fieldsArray[offset + 1],
    dayOfMonth: fieldsArray[offset + 2],
    month: fieldsArray[offset + 3],
    dayOfWeek: fieldsArray[offset + 4],
  };

  try {
    const interval = CronExpressionParser.parse(trimmed);
    const explanation = explainCron(
      currentFields.minute,
      currentFields.hour,
      currentFields.dayOfMonth,
      currentFields.month,
      currentFields.dayOfWeek
    );

    const now = new Date();
    const nextDates: CronScheduledDate[] = [];

    for (let i = 0; i < count; i++) {
      const nextDate = interval.next().toDate();
      nextDates.push({
        local: nextDate.toLocaleString(),
        utc: nextDate.toUTCString(),
        relative: formatRelativeDistance(nextDate, now),
      });
    }

    return {
      isValid: true,
      explanation,
      nextDates,
      fields: currentFields,
    };
  } catch (err) {
    return {
      isValid: false,
      explanation: 'Invalid cron schedule syntax.',
      nextDates: [],
      error: (err as Error).message,
      fields: currentFields,
    };
  }
}
