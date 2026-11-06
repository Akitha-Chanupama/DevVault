export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';
export type BodyType = 'none' | 'json' | 'text' | 'urlencoded';

export interface HeaderItem {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
}

export interface QueryItem {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
}

export interface ApiResponseDetails {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  data: string;
  isJson: boolean;
  durationMs: number;
  isCorsError?: boolean;
}

