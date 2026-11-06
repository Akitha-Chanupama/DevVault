import { describe, it, expect } from 'vitest';
import { generateSyntheticJson } from './randomJson';
import { SchemaField } from '../types';

describe('randomJson logic', () => {
  it('generates the specified count of synthetic records', () => {
    const fields: SchemaField[] = [
      { id: '1', name: 'userId', type: 'uuid' },
      { id: '2', name: 'email', type: 'email' },
      { id: '3', name: 'count', type: 'number' },
    ];

    const jsonStr = generateSyntheticJson({ count: 5, fields });
    const parsed = JSON.parse(jsonStr);

    expect(Array.isArray(parsed)).toBe(true);
    expect(parsed).toHaveLength(5);
    expect(parsed[0]).toHaveProperty('userId');
    expect(parsed[0]).toHaveProperty('email');
    expect(parsed[0]).toHaveProperty('count');
    expect(typeof parsed[0].count).toBe('number');
  });

  it('clamps record count within safety bounds (1 to 100)', () => {
    const minStr = generateSyntheticJson({ count: -10, fields: [] });
    expect(JSON.parse(minStr)).toHaveLength(1);

    const maxStr = generateSyntheticJson({ count: 250, fields: [] });
    expect(JSON.parse(maxStr)).toHaveLength(100);
  });
});
