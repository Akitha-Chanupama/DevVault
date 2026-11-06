import { describe, it, expect } from 'vitest';
import { executeJsonMinify } from './jsonMinifier';

describe('jsonMinifier logic', () => {
  it('strips all indentation and whitespace outside strings', () => {
    const raw = `{
      "message": "Hello World with spaces preserved",
      "count": 42,
      "nested": { "ok": true }
    }`;
    const result = executeJsonMinify(raw);
    expect(result.success).toBe(true);
    expect(result.minified).toBe(
      '{"message":"Hello World with spaces preserved","count":42,"nested":{"ok":true}}'
    );
    expect(result.stats?.savingsBytes).toBeGreaterThan(0);
    expect(result.stats?.savingsPercent).toBeGreaterThan(0);
  });

  it('fails with detailed error for invalid JSON', () => {
    const bad = '{ "unclosed": "string }';
    const result = executeJsonMinify(bad);
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
    expect(result.minified).toBe('');
  });
});
