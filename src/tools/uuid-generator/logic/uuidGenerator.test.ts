import { describe, it, expect } from 'vitest';
import { generateUuids, formatUuid } from './uuidGenerator';

describe('uuidGenerator logic', () => {
  it('generates standard lowercase hyphenated UUID v4', () => {
    const [uuid] = generateUuids({ count: 1, uppercase: false, hyphens: true });
    expect(uuid).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/
    );
  });

  it('supports uppercase and hyphenless formats', () => {
    const raw = '123e4567-e89b-12d3-a456-426614174000';
    const formatted = formatUuid(raw, { uppercase: true, hyphens: false });
    expect(formatted).toBe('123E4567E89B12D3A456426614174000');
  });

  it('generates multiple unique UUIDs', () => {
    const uuids = generateUuids({ count: 10, uppercase: false, hyphens: true });
    expect(uuids).toHaveLength(10);
    const unique = new Set(uuids);
    expect(unique.size).toBe(10);
  });
});

