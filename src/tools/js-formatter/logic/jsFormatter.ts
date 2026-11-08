import * as prettier from 'prettier/standalone';
import * as parserBabel from 'prettier/plugins/babel';
import * as parserEstree from 'prettier/plugins/estree';
import * as parserTypescript from 'prettier/plugins/typescript';
import { JsFormatOptions, JsFormatResult } from '../types';

export const DEFAULT_JS_OPTIONS: JsFormatOptions = {
  dialect: 'javascript',
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  trailingComma: 'es5',
};

export async function formatJs(
  rawCode: string,
  options: Partial<JsFormatOptions> = {}
): Promise<JsFormatResult> {
  const merged: JsFormatOptions = { ...DEFAULT_JS_OPTIONS, ...options };

  if (!rawCode.trim()) {
    return { success: true, output: '' };
  }

  try {
    const isTypescript = merged.dialect === 'typescript';

    const formatted = await prettier.format(rawCode, {
      parser: isTypescript ? 'typescript' : 'babel',
      plugins: [parserBabel, parserTypescript, parserEstree],
      tabWidth: merged.tabWidth,
      useTabs: merged.useTabs,
      semi: merged.semi,
      singleQuote: merged.singleQuote,
      trailingComma: merged.trailingComma,
    });

    return {
      success: true,
      output: formatted,
    };
  } catch (err) {
    return {
      success: false,
      output: rawCode,
      error: (err as Error).message,
    };
  }
}
