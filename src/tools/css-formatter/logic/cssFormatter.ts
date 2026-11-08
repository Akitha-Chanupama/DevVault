import * as prettier from 'prettier/standalone';
import * as parserPostcss from 'prettier/plugins/postcss';
import { CssFormatOptions, CssFormatResult, CssMinifyResult } from '../types';

export const DEFAULT_CSS_OPTIONS: CssFormatOptions = {
  tabWidth: 2,
  useTabs: false,
  singleQuote: true,
};

export async function formatCss(
  rawCss: string,
  options: Partial<CssFormatOptions> = {}
): Promise<CssFormatResult> {
  const merged: CssFormatOptions = { ...DEFAULT_CSS_OPTIONS, ...options };

  if (!rawCss.trim()) {
    return { success: true, output: '' };
  }

  try {
    const formatted = await prettier.format(rawCss, {
      parser: 'css',
      plugins: [parserPostcss],
      tabWidth: merged.tabWidth,
      useTabs: merged.useTabs,
      singleQuote: merged.singleQuote ?? true,
    });

    return {
      success: true,
      output: formatted,
    };
  } catch (err) {
    return {
      success: false,
      output: rawCss,
      error: (err as Error).message,
    };
  }
}

export function minifyCss(rawCss: string): CssMinifyResult {
  if (!rawCss.trim()) {
    return {
      success: true,
      output: '',
      originalSize: 0,
      minifiedSize: 0,
      savingsPercent: 0,
    };
  }

  const originalSize = new TextEncoder().encode(rawCss).length;

  try {
    let minified = rawCss
      // Strip block comments
      .replace(/\/\*[\s\S]*?\*\//g, '')
      // Collapse whitespace
      .replace(/\s+/g, ' ')
      // Strip spaces around delimiters: { } : ; , > ~ +
      .replace(/\s*([\{\}\:\;\,>\~\+])\s*/g, '$1')
      // Remove trailing semicolons before closing braces
      .replace(/;}/g, '}')
      // Trim leading/trailing whitespace
      .trim();

    const minifiedSize = new TextEncoder().encode(minified).length;
    const savingsPercent =
      originalSize > 0
        ? Math.max(0, Math.round(((originalSize - minifiedSize) / originalSize) * 100))
        : 0;

    return {
      success: true,
      output: minified,
      originalSize,
      minifiedSize,
      savingsPercent,
    };
  } catch {
    return {
      success: false,
      output: rawCss,
      originalSize,
      minifiedSize: originalSize,
      savingsPercent: 0,
    };
  }
}
