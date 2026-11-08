import { describe, it, expect } from 'vitest';
import { formatCss, minifyCss } from './cssFormatter';

describe('cssFormatter logic', () => {
  it('formats unindented CSS with consistent indentation', async () => {
    const raw = '.card{background-color:#ffffff;color:#090d16;padding:16px;}';
    const result = await formatCss(raw, { tabWidth: 2 });

    expect(result.success).toBe(true);
    expect(result.output).toContain('.card {');
    expect(result.output).toContain('  background-color: #ffffff;');
    expect(result.output).toContain('  color: #090d16;');
    expect(result.output).toContain('}');
  });

  it('handles empty input gracefully', async () => {
    const result = await formatCss('');
    expect(result.success).toBe(true);
    expect(result.output).toBe('');
  });

  it('minifies CSS correctly and removes comments and extra whitespace', () => {
    const raw = `
      /* Header styles */
      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    `;
    const result = minifyCss(raw);

    expect(result.success).toBe(true);
    expect(result.output).toBe('.header{display:flex;align-items:center;justify-content:space-between}');
    expect(result.savingsPercent).toBeGreaterThan(0);
    expect(result.minifiedSize).toBeLessThan(result.originalSize);
  });

  it('returns graceful fallback on invalid CSS', async () => {
    const malformed = 'body { color: ;;; invalid';
    const result = await formatCss(malformed);
    expect(typeof result.output).toBe('string');
  });
});

