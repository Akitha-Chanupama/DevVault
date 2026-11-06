import { HashAlgorithm, HashDigest, HashResult } from '../types';

export const SUPPORTED_ALGORITHMS: HashAlgorithm[] = ['SHA-256', 'SHA-384', 'SHA-512'];

export async function computeHash(
  algorithm: HashAlgorithm,
  data: Uint8Array
): Promise<HashDigest> {
  const buffer = await crypto.subtle.digest(algorithm, data as BufferSource);
  const hashArray = Array.from(new Uint8Array(buffer));

  // Convert buffer to hex string
  const hex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

  // Convert buffer to base64
  let binary = '';
  for (let i = 0; i < hashArray.length; i++) {
    binary += String.fromCharCode(hashArray[i]);
  }
  const base64 = btoa(binary);

  const bitLengths: Record<HashAlgorithm, number> = {
    'SHA-256': 256,
    'SHA-384': 384,
    'SHA-512': 512,
  };

  return {
    algorithm,
    hex,
    base64,
    bitLength: bitLengths[algorithm],
  };
}

export async function generateAllHashes(input: string): Promise<HashResult> {
  const start = performance.now();
  const data = new TextEncoder().encode(input);

  const digests = await Promise.all(
    SUPPORTED_ALGORITHMS.map((alg) => computeHash(alg, data))
  );

  const executionTimeMs = Math.round((performance.now() - start) * 100) / 100;

  return {
    input,
    digests,
    executionTimeMs,
  };
}
