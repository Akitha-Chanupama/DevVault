export interface HtmlFormatOptions {
  tabWidth: number;
  useTabs: boolean;
  printWidth: number;
}

export interface HtmlFormatResult {
  success: boolean;
  formattedHtml: string;
  error?: string;
}
