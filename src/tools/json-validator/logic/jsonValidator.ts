import { extractParseError } from '@/tools/json-formatter/logic/jsonFormatter';
import { JsonValidationResult } from '../types';

function calculateJsonMetrics(val: unknown): {
  depth: number;
  keysCount: number;
  arrayItemCount: number;
  rootType: 'object' | 'array' | 'primitive';
} {
  let keysCount = 0;
  let arrayItemCount = 0;

  const getDepth = (item: unknown): number => {
    if (item === null || typeof item !== 'object') {
      return 1;
    }
    if (Array.isArray(item)) {
      arrayItemCount += item.length;
      if (item.length === 0) return 1;
      return 1 + Math.max(...item.map(getDepth));
    }
    const keys = Object.keys(item as Record<string, unknown>);
    keysCount += keys.length;
    if (keys.length === 0) return 1;
    return 1 + Math.max(...keys.map((k) => getDepth((item as Record<string, unknown>)[k])));
  };

  const depth = getDepth(val);
  const rootType = Array.isArray(val)
    ? 'array'
    : val !== null && typeof val === 'object'
    ? 'object'
    : 'primitive';

  return { depth, keysCount, arrayItemCount, rootType };
}

export function validateJsonContent(input: string): JsonValidationResult {
  const trimmed = input.trim();
  if (!trimmed) {
    return {
      isValid: false,
      error: { message: 'Input is empty. Please enter or paste JSON to validate.' },
    };
  }

  try {
    const parsed = JSON.parse(trimmed);
    const metrics = calculateJsonMetrics(parsed);

    return {
      isValid: true,
      metrics: {
        byteSize: new Blob([trimmed]).size,
        characterCount: trimmed.length,
        lineCount: trimmed.split('\n').length,
        ...metrics,
      },
    };
  } catch (err) {
    const error = extractParseError(trimmed, err as Error);
    return {
      isValid: false,
      error,
    };
  }
}
