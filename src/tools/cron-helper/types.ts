export interface CronScheduledDate {
  local: string;
  utc: string;
  relative: string;
}

export interface CronHelperResult {
  isValid: boolean;
  explanation: string;
  nextDates: CronScheduledDate[];
  error?: string;
  fields: {
    minute: string;
    hour: string;
    dayOfMonth: string;
    month: string;
    dayOfWeek: string;
  };
}

export interface CronPreset {
  label: string;
  expression: string;
  description: string;
}
