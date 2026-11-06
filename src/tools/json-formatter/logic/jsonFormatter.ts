import {
  JsonFormatterOptions,
  JsonTransformResult,
  ParseErrorDetail,
} from '../types';

/**
 * Extracts line and column from JSON parse error if possible
 */
export function extractParseError(rawInput: string, error: Error): ParseErrorDetail {
  const message = error.message;

  // Modern V8/Chrome errors: "Unexpected token 'x', ... at position 42"
  const positionMatch = message.match(/at position (\d+)/i);
  if (positionMatch) {
    const pos = parseInt(positionMatch[1], 10);
    const lines = rawInput.slice(0, pos).split('\n');
    const line = lines.length;
    const column = lines[lines.length - 1].length + 1;
    return {
      message: message.replace(/\s+at position \d+/i, ''),
      line,
      column,
    };
  }

  // Firefox/Safari errors: "line 4 column 12 of the JSON data"
  const lineColMatch = message.match(/line (\d+) column (\d+)/i);
  if (lineColMatch) {
    return {
      message,
      line: parseInt(lineColMatch[1], 10),
      column: parseInt(lineColMatch[2], 10),
    };
  }

  return { message };
}

/**
 * Recursively sort keys of an object without mutating array order
 */
export function sortObjectKeys(value: unknown): unknown {
  if (value === null || typeof value !== 'object') {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(sortObjectKeys);
  }

  const sortedObj: Record<string, unknown> = {};
  const keys = Object.keys(value as Record<string, unknown>).sort();
  for (const key of keys) {
    sortedObj[key] = sortObjectKeys((value as Record<string, unknown>)[key]);
  }
  return sortedObj;
}

/**
 * Formats JSON with chosen indentation and optional key sorting
 */
export function formatJson(
  input: string,
  options: JsonFormatterOptions
): JsonTransformResult {
  const trimmed = input.trim();
  if (!trimmed) {
    return { success: true, output: '' };
  }

  try {
    let parsed = JSON.parse(trimmed);

    if (options.sortKeys) {
      parsed = sortObjectKeys(parsed);
    }

    const space = options.indent === 'tab' ? '\t' : parseInt(options.indent, 10);
    const output = JSON.stringify(parsed, null, space);
    return { success: true, output };
  } catch (err) {
    const errorDetail = extractParseError(trimmed, err as Error);
    return { success: false, output: '', error: errorDetail };
  }
}

/**
 * Minifies JSON by stripping whitespace
 */
export function minifyJson(input: string): JsonTransformResult {
  const trimmed = input.trim();
  if (!trimmed) {
    return { success: true, output: '' };
  }

  try {
    const parsed = JSON.parse(trimmed);
    const output = JSON.stringify(parsed);
    return { success: true, output };
  } catch (err) {
    const errorDetail = extractParseError(trimmed, err as Error);
    return { success: false, output: '', error: errorDetail };
  }
}

/**
 * Validates JSON syntax and returns parsed details
 */
export function validateJson(input: string): JsonTransformResult {
  const trimmed = input.trim();
  if (!trimmed) {
    return { success: true, output: '' };
  }

  try {
    JSON.parse(trimmed);
    return { success: true, output: trimmed };
  } catch (err) {
    const errorDetail = extractParseError(trimmed, err as Error);
    return { success: false, output: '', error: errorDetail };
  }
}
