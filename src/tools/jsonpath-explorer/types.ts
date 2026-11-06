export interface JsonPathMatch {
  path: string;
  value: unknown;
}

export interface JsonPathResult {
  success: boolean;
  matches: JsonPathMatch[];
  formattedMatches: string;
  error?: string;
}
