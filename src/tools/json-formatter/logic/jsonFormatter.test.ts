import { describe, it, expect } from 'vitest';
import {
  formatJson,
  minifyJson,
  validateJson,
  sortObjectKeys,
} from './jsonFormatter';

describe('jsonFormatter logic', () => {
  it('formats valid JSON with 2 spaces indentation', () => {
    const raw = '{"name":"DevVault","version":1,"features":["local","fast"]}';
    const result = formatJson(raw, { indent: '2', sortKeys: false });
    expect(result.success).toBe(true);
    expect(result.output).toBe(
      '{\n  "name": "DevVault",\n  "version": 1,\n  "features": [\n    "local",\n    "fast"\n  ]\n}'
    );
  });

  it('formats valid JSON with 4 spaces and tabs', () => {
    const raw = '{"a":1}';
    const result4 = formatJson(raw, { indent: '4', sortKeys: false });
    expect(result4.output).toBe('{\n    "a": 1\n}');

    const resultTab = formatJson(raw, { indent: 'tab', sortKeys: false });
    expect(resultTab.output).toBe('{\n\t"a": 1\n}');
  });

  it('sorts object keys alphabetically without reordering arrays', () => {
    const raw = '{"z":1,"a":2,"arr":[3,1,2]}';
    const result = formatJson(raw, { indent: '2', sortKeys: true });
    expect(result.success).toBe(true);

    const parsed = JSON.parse(result.output);
    expect(Object.keys(parsed)).toEqual(['a', 'arr', 'z']);
    expect(parsed.arr).toEqual([3, 1, 2]); // array order preserved!

    // Direct pure test of sortObjectKeys
    expect(Object.keys(sortObjectKeys({ z: 1, a: 2 }) as object)).toEqual(['a', 'z']);
  });

  it('returns detailed parse error for invalid JSON', () => {
    const invalid = '{\n  "name": "DevVault",,\n}';
    const result = formatJson(invalid, { indent: '2', sortKeys: false });
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
    expect(result.error?.message).toBeTruthy();
  });

  it('minifies JSON properly', () => {
    const multiline = `
    {
      "title": "Minify Test",
      "values": [ 1, 2, 3 ]
    }
    `;
    const result = minifyJson(multiline);
    expect(result.success).toBe(true);
    expect(result.output).toBe('{"title":"Minify Test","values":[1,2,3]}');
  });

  it('validates valid and invalid JSON correctly', () => {
    expect(validateJson('{"ok":true}').success).toBe(true);
    expect(validateJson('{invalid}').success).toBe(false);
    expect(validateJson('').success).toBe(true);
  });
});
