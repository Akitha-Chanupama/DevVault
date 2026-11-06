import { describe, it, expect } from 'vitest';
import { parseUrlString, reconstructUrl } from './urlParser';

describe('urlParser logic', () => {
  it('parses complete URL with query params and hash correctly', () => {
    const raw = 'https://api.devvault.dev:8443/v1/search?query=hello+world&limit=25#results';
    const result = parseUrlString(raw);

    expect(result.isValid).toBe(true);
    expect(result.protocol).toBe('https:');
    expect(result.hostname).toBe('api.devvault.dev');
    expect(result.port).toBe('8443');
    expect(result.pathname).toBe('/v1/search');
    expect(result.hash).toBe('#results');
    expect(result.params).toHaveLength(2);
    expect(result.params[0].key).toBe('query');
    expect(result.params[0].value).toBe('hello world');
    expect(result.params[1].key).toBe('limit');
    expect(result.params[1].value).toBe('25');
  });

  it('handles URL without scheme by normalizing to https', () => {
    const result = parseUrlString('example.com/api/test?v=1');
    expect(result.isValid).toBe(true);
    expect(result.hostname).toBe('example.com');
    expect(result.pathname).toBe('/api/test');
  });

  it('reconstructs URL accurately from parts and updated parameters', () => {
    const parsed = parseUrlString('https://example.com/search');
    const updatedParams = [
      { id: '1', key: 'q', value: 'react', enabled: true },
      { id: '2', key: 'disabled_filter', value: 'xyz', enabled: false },
      { id: '3', key: 'sort', value: 'desc', enabled: true },
    ];

    const reconstructed = reconstructUrl(parsed, updatedParams);
    expect(reconstructed).toBe('https://example.com/search?q=react&sort=desc');
  });

  it('reports error on invalid URLs', () => {
    const result = parseUrlString('http://');
    expect(result.isValid).toBe(false);
    expect(result.error).toBeTruthy();
  });
});
