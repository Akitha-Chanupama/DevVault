import { describe, it, expect } from 'vitest';
import { computeLineDiff } from './diffChecker';

describe('diffChecker logic', () => {
  it('correctly identifies identical text as unchanged', () => {
    const text = 'line 1\nline 2\nline 3';
    const result = computeLineDiff(text, text);
    expect(result.additions).toBe(0);
    expect(result.deletions).toBe(0);
    expect(result.unchanged).toBe(3);
    expect(result.lines.every((l) => l.type === 'unchanged')).toBe(true);
  });

  it('detects single line modifications as deletion and addition', () => {
    const orig = 'const name = "DevVault";\nconst version = 1;';
    const mod = 'const name = "DevVault";\nconst version = 2;\nconst active = true;';

    const result = computeLineDiff(orig, mod);
    expect(result.unchanged).toBe(1);
    expect(result.deletions).toBe(1);
    expect(result.additions).toBe(2);
  });

  it('handles empty strings and edge cases without errors', () => {
    const res1 = computeLineDiff('', '');
    expect(res1.lines).toHaveLength(0);

    const res2 = computeLineDiff('test', '');
    expect(res2.deletions).toBe(1);

    const res3 = computeLineDiff('', 'test');
    expect(res3.additions).toBe(1);
  });
});

