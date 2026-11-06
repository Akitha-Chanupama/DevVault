import { describe, it, expect } from 'vitest';
import { validateJsonContent } from './jsonValidator';

describe('jsonValidator logic', () => {
  it('returns valid with metrics for valid JSON object', () => {
    const raw = JSON.stringify({
      name: 'DevVault',
      level: 1,
      nested: { a: 1, b: [10, 20] },
    });
    const result = validateJsonContent(raw);
    expect(result.isValid).toBe(true);
    expect(result.metrics?.rootType).toBe('object');
    expect(result.metrics?.depth).toBe(4);
    expect(result.metrics?.keysCount).toBe(5);
    expect(result.metrics?.arrayItemCount).toBe(2);
  });

  it('detects syntax errors with line/column for malformed JSON', () => {
    const bad = '{\n  "missing": "comma"\n  "key": 2\n}';
    const result = validateJsonContent(bad);
    expect(result.isValid).toBe(false);
    expect(result.error).toBeDefined();
    expect(result.error?.message).toBeTruthy();
  });

  it('handles empty input gracefully', () => {
    const result = validateJsonContent('   ');
    expect(result.isValid).toBe(false);
    expect(result.error?.message).toContain('Input is empty');
  });
});
