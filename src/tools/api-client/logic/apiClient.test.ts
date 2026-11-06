import { describe, it, expect } from 'vitest';
import { constructRequestUrl } from './apiClient';
import { QueryItem } from '../types';

describe('apiClient logic', () => {
  it('appends enabled query params to standard URL', () => {
    const params: QueryItem[] = [
      { id: '1', key: 'q', value: 'search', enabled: true },
      { id: '2', key: 'page', value: '2', enabled: true },
      { id: '3', key: 'disabled', value: 'ignored', enabled: false },
    ];
    const url = 'https://api.example.com/items';
    const result = constructRequestUrl(url, params);
    expect(result).toBe('https://api.example.com/items?q=search&page=2');
  });

  it('handles existing query parameters correctly', () => {
    const params: QueryItem[] = [
      { id: '1', key: 'limit', value: '10', enabled: true },
    ];
    const url = 'https://api.example.com/items?sort=asc';
    const result = constructRequestUrl(url, params);
    expect(result).toBe('https://api.example.com/items?sort=asc&limit=10');
  });

  it('returns fallback URL if URL string is invalid', () => {
    const params: QueryItem[] = [
      { id: '1', key: 'q', value: 'test', enabled: true },
    ];
    const url = 'invalid-url';
    const result = constructRequestUrl(url, params);
    expect(result).toBe('invalid-url');
  });
});
