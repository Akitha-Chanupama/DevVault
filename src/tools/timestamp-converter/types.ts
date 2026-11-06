export interface TimestampDetails {
  isValid: boolean;
  seconds: number;
  milliseconds: number;
  utcDateString: string;
  utcIsoString: string;
  localDateString: string;
  relativeTime: string;
  timezoneName: string;
  error?: string;
}
