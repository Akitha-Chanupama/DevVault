export type CssIndentOption = '2' | '4' | 'tab';

export interface CssFormatOptions {
  tabWidth: number;
  useTabs: boolean;
  singleQuote?: boolean;
}

export interface CssFormatResult {
  success: boolean;
  output: string;
  error?: string;
}

export interface CssMinifyResult {
  success: boolean;
  output: string;
  originalSize: number;
  minifiedSize: number;
  savingsPercent: number;
}

