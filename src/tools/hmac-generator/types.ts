export type HmacAlgorithm = 'SHA-256' | 'SHA-384' | 'SHA-512';
export type HmacOutputEncoding = 'hex' | 'base64' | 'base64url';

export interface HmacResult {
  hex: string;
  base64: string;
  base64url: string;
}

export interface HmacVerificationResult {
  isValid: boolean;
  algorithm: HmacAlgorithm;
  computedHex: string;
}
