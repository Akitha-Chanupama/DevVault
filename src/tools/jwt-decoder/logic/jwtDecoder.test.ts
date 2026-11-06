import { describe, it, expect } from 'vitest';
import { decodeJwt, base64UrlDecode } from './jwtDecoder';

describe('jwtDecoder logic', () => {
  // Standard test token with payload: { sub: "1234567890", name: "John Doe", iat: 1516239022 }
  const testToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

  it('correctly decodes standard JWT header and payload', () => {
    const result = decodeJwt(testToken);
    expect(result.isValid).toBe(true);
    expect(result.header?.alg).toBe('HS256');
    expect(result.header?.typ).toBe('JWT');
    expect(result.payload?.sub).toBe('1234567890');
    expect(result.payload?.name).toBe('John Doe');
    expect(result.signature).toBe('SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c');
  });

  it('identifies expired tokens based on exp claim', () => {
    // exp is in 2018
    const expiredToken =
      'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyMSIsImV4cCI6MTUxNjIzOTAyMn0.signature';
    const result = decodeJwt(expiredToken);
    expect(result.isValid).toBe(true);
    expect(result.claims.isExpired).toBe(true);
    expect(result.claims.timeRemaining).toContain('ago');
  });

  it('fails on malformed token with fewer than 3 segments', () => {
    const result = decodeJwt('header.payload');
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('Expected 3 dot-separated segments');
  });

  it('handles unicode in base64url', () => {
    // Encoded JSON containing emoji
    const decoded = base64UrlDecode('eyJuYW1lIjoi4p2k77iPIn0');
    expect(JSON.parse(decoded).name).toBe('❤️');
  });
});

