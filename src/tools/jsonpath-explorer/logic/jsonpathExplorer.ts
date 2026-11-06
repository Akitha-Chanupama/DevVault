import { JSONPath } from 'jsonpath-plus';
import { JsonPathResult, JsonPathMatch } from '../types';

export function evaluateJsonPath(jsonText: string, pathExpression: string): JsonPathResult {
  const trimmedJson = jsonText.trim();
  const trimmedPath = pathExpression.trim() || '$';

  if (!trimmedJson) {
    return { success: true, matches: [], formattedMatches: '' };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(trimmedJson);
  } catch (err) {
    return {
      success: false,
      matches: [],
      formattedMatches: '',
      error: `Invalid JSON: ${(err as Error).message}`,
    };
  }

  try {
    const rawMatches = JSONPath({
      path: trimmedPath,
      json: parsed,
      resultType: 'all',
    }) as Array<{ path: string; value: unknown }>;

    const matches: JsonPathMatch[] = rawMatches.map((m) => ({
      path: m.path,
      value: m.value,
    }));

    const extractedValues = matches.map((m) => m.value);
    const formattedMatches = JSON.stringify(extractedValues, null, 2);

    return {
      success: true,
      matches,
      formattedMatches,
    };
  } catch (err) {
    return {
      success: false,
      matches: [],
      formattedMatches: '',
      error: `Invalid JSONPath expression: ${(err as Error).message}`,
    };
  }
}

