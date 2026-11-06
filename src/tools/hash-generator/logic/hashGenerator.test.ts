import { describe, it, expect } from 'vitest';
import { generateAllHashes, computeHash } from './hashGenerator';

describe('hashGenerator logic', () => {
  it('generates correct known NIST test vector for empty string SHA-256', async () => {
    const data = new TextEncoder().encode('');
    const digest = await computeHash('SHA-256', data);
    expect(digest.hex).toBe(
      'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
    );
    expect(digest.bitLength).toBe(256);
  });

  it('generates correct SHA-256 digest for "hello world"', async () => {
    const data = new TextEncoder().encode('hello world');
    const digest = await computeHash('SHA-256', data);
    expect(digest.hex).toBe(
      'b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9'
    );
  });

  it('generates SHA-256, SHA-384, and SHA-512 simultaneously', async () => {
    const result = await generateAllHashes('DevVault');
    expect(result.digests).toHaveLength(3);
    const [sha256, sha384, sha512] = result.digests;

    expect(sha256.algorithm).toBe('SHA-256');
    expect(sha256.hex.length).toBe(64);

    expect(sha384.algorithm).toBe('SHA-384');
    expect(sha384.hex.length).toBe(96);

    expect(sha512.algorithm).toBe('SHA-512');
    expect(sha512.hex.length).toBe(128);
  });
});

