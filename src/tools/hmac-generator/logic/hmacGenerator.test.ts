import { describe, it, expect } from 'vitest';
import { generateHmac, verifyHmac } from './hmacGenerator';

describe('hmacGenerator logic', () => {
  it('generates correct HMAC-SHA256 matching standard RFC test vectors', async () => {
    const key = 'key';
    const message = 'The quick brown fox jumps over the lazy dog';
    const result = await generateHmac(message, key, 'SHA-256');

    expect(result.hex).toBe('f7bc83f430538424b13298e6aa6fb143ef4d59a14946175997479dbc2d1a3cd8');
    expect(result.base64).toBeTruthy();
    expect(result.base64url).toBeTruthy();
  });

  it('correctly verifies valid HMAC signatures across hex and base64 formats', async () => {
    const key = 'my-secret-key';
    const message = 'payload-data';
    const computed = await generateHmac(message, key, 'SHA-256');

    const verifyHex = await verifyHmac(message, key, computed.hex, 'SHA-256');
    expect(verifyHex.isValid).toBe(true);

    const verifyBase64 = await verifyHmac(message, key, computed.base64, 'SHA-256');
    expect(verifyBase64.isValid).toBe(true);
  });

  it('rejects tampered or mismatched signatures', async () => {
    const key = 'secret';
    const message = 'original';
    const tampered = 'wrong-hex-value';

    const verification = await verifyHmac(message, key, tampered, 'SHA-256');
    expect(verification.isValid).toBe(false);
  });
});
