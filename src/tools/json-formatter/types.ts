export type IndentOption = '2' | '4' | 'tab';

export interface JsonFormatterOptions {
  indent: IndentOption;
  sortKeys: boolean;
}

export interface ParseErrorDetail {
  message: string;
  line?: number;
  column?: number;
}

export interface JsonTransformResult {
  success: boolean;
  output: string;
  error?: ParseErrorDetail;
}

