export type JsDialect = 'javascript' | 'typescript';

export interface JsFormatOptions {
  dialect: JsDialect;
  tabWidth: number;
  useTabs: boolean;
  semi: boolean;
  singleQuote: boolean;
  trailingComma: 'none' | 'es5' | 'all';
}

export interface JsFormatResult {
  success: boolean;
  output: string;
  error?: string;
}
