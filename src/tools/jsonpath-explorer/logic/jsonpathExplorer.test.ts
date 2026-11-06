import { describe, it, expect } from 'vitest';
import { evaluateJsonPath } from './jsonpathExplorer';

describe('jsonpathExplorer logic', () => {
  const sample = JSON.stringify({
    store: {
      book: [
        { category: 'reference', author: 'Nigel Rees', title: 'Sayings', price: 8.95 },
        { category: 'fiction', author: 'Evelyn Waugh', title: 'Sword of Honour', price: 12.99 },
      ],
      bicycle: { color: 'red', price: 19.95 },
    },
  });

  it('evaluates wildcards to find all book authors', () => {
    const result = evaluateJsonPath(sample, '$.store.book[*].author');
    expect(result.success).toBe(true);
    expect(result.matches).toHaveLength(2);
    expect(result.matches[0].value).toBe('Nigel Rees');
    expect(result.matches[1].value).toBe('Evelyn Waugh');
  });

  it('evaluates deep recursive search for all prices', () => {
    const result = evaluateJsonPath(sample, '$..price');
    expect(result.success).toBe(true);
    expect(result.matches).toHaveLength(3);
  });

  it('handles invalid JSONPath query with clear error', () => {
    const result = evaluateJsonPath(sample, '$[?(@.foo > )]');
    expect(result.success).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it('handles invalid JSON input with clear syntax error', () => {
    const result = evaluateJsonPath('invalid { json', '$.foo');
    expect(result.success).toBe(false);
    expect(result.error).toContain('Invalid JSON');
  });
});
