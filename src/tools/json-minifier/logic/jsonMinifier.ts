import { extractParseError } from '@/tools/json-formatter/logic/jsonFormatter';
import { MinifyResult } from '../types';

export function executeJsonMinify(input: string): MinifyResult {
  const trimmed = input.trim();
  if (!trimmed) {
    return {
      success: true,
      minified: '',
    };
  }

  try {
    const parsed = JSON.parse(trimmed);
    const minified = JSON.stringify(parsed);

    const originalBytes = new Blob([trimmed]).size;
    const minifiedBytes = new Blob([minified]).size;
    const savingsBytes = Math.max(0, originalBytes - minifiedBytes);
    const savingsPercent =
      originalBytes > 0
        ? Math.round((savingsBytes / originalBytes) * 100 * 10) / 10
        : 0;

    return {
      success: true,
      minified,
      stats: {
        originalBytes,
        minifiedBytes,
        savingsBytes,
        savingsPercent,
      },
    };
  } catch (err) {
    const error = extractParseError(trimmed, err as Error);
    return {
      success: false,
      minified: '',
      error,
    };
  }
}

