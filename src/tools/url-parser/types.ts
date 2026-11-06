export interface QueryParam {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
}

export interface ParsedUrlDetails {
  isValid: boolean;
  rawUrl: string;
  protocol: string;
  origin: string;
  hostname: string;
  port: string;
  pathname: string;
  hash: string;
  params: QueryParam[];
  error?: string;
}

