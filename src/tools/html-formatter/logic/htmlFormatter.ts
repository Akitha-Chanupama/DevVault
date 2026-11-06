import * as prettier from 'prettier/standalone';
import * as parserHtml from 'prettier/plugins/html';
import { HtmlFormatOptions, HtmlFormatResult } from '../types';

export const DEFAULT_HTML_OPTIONS: HtmlFormatOptions = {
  tabWidth: 2,
  useTabs: false,
  printWidth: 80,
};

export async function formatHtml(
  rawHtml: string,
  options: Partial<HtmlFormatOptions> = {}
): Promise<HtmlFormatResult> {
  const merged: HtmlFormatOptions = { ...DEFAULT_HTML_OPTIONS, ...options };

  if (!rawHtml.trim()) {
    return { success: true, formattedHtml: '' };
  }

  try {
    const formatted = await prettier.format(rawHtml, {
      parser: 'html',
      plugins: [parserHtml],
      tabWidth: merged.tabWidth,
      useTabs: merged.useTabs,
      printWidth: merged.printWidth,
    });

    return {
      success: true,
      formattedHtml: formatted,
    };
  } catch (err) {
    return {
      success: false,
      formattedHtml: rawHtml,
      error: (err as Error).message,
    };
  }
}
