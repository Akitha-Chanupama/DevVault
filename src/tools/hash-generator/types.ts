export type HashAlgorithm = 'SHA-256' | 'SHA-384' | 'SHA-512';

export interface HashDigest {
  algorithm: HashAlgorithm;
  hex: string;
  base64: string;
  bitLength: number;
}

export interface HashResult {
  input: string;
  digests: HashDigest[];
  executionTimeMs: number;
}
