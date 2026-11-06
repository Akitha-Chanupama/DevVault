export interface TimezoneItem {
  id: string;
  name: string;
  timeZone: string;
  city: string;
}

export interface ConvertedTimezoneInfo {
  id: string;
  name: string;
  timeZone: string;
  city: string;
  formattedTime: string;
  formattedDate: string;
  offsetString: string;
  isDaytime: boolean;
  relativeHoursDiff: number;
}

