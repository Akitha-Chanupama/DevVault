export interface MatchGroup {
  name?: string;
  index: number;
  value: string;
}

export interface RegexMatch {
  index: number;
  match: string;
  groups: MatchGroup[];
  start: number;
  end: number;
}

export interface RegexTestResult {
  success: boolean;
  matches: RegexMatch[];
  count: number;
  error?: string;
  replacement?: string;
  executionTimeMs: number;
}

export interface RegexFlags {
  g: boolean; // Global
  i: boolean; // Case insensitive
  m: boolean; // Multiline
  s: boolean; // Dot all
  u: boolean; // Unicode
}

