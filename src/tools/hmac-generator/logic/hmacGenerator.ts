import { HmacAlgorithm, HmacResult, HmacVerificationResult } from '../types';

function bufferToHex(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function bufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function bufferToBase64Url(buffer: ArrayBuffer): string {
  return bufferToBase64(buffer)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export async function generateHmac(
  message: string,
  secretKey: string,
  algorithm: HmacAlgorithm
): Promise<HmacResult> {
  if (!secretKey) {
    return { hex: '', base64: '', base64url: '' };
  }

  const enc = new TextEncoder();
  const keyData = enc.encode(secretKey);
  const msgData = enc.encode(message);

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: { name: algorithm } },
    false,
    ['sign', 'verify']
  );

  const signature = await crypto.subtle.sign('HMAC', cryptoKey, msgData);

  return {
    hex: bufferToHex(signature),
    base64: bufferToBase64(signature),
    base64url: bufferToBase64Url(signature),
  };
}

export async function verifyHmac(
  message: string,
  secretKey: string,
  expectedSignature: string,
  algorithm: HmacAlgorithm
): Promise<HmacVerificationResult> {
  const computed = await generateHmac(message, secretKey, algorithm);

  const cleanExpected = expectedSignature.trim().toLowerCase();
  const cleanHex = computed.hex.toLowerCase();
  const cleanBase64 = computed.base64.trim();
  const cleanBase64Url = computed.base64url.trim();

  const isValid =
    cleanExpected === cleanHex ||
    expectedSignature.trim() === cleanBase64 ||
    expectedSignature.trim() === cleanBase64Url;

  return {
    isValid,
    algorithm,
    computedHex: computed.hex,
  };
}

