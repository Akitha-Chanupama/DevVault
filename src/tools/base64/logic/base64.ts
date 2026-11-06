import { Base64Options, Base64Result } from '../types';

/**
 * Encodes text to Base64 using UTF-8 TextEncoder
 */
export function encodeBase64(input: string, options: Pick<Base64Options, 'urlSafe' | 'stripPadding'>): Base64Result {
  if (!input) {
    return { success: true, output: '', byteSize: 0 };
  }

  try {
    const bytes = new TextEncoder().encode(input);
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    let encoded = btoa(binary);

    if (options.urlSafe) {
      encoded = encoded.replace(/\+/g, '-').replace(/\//g, '_');
    }

    if (options.stripPadding) {
      encoded = encoded.replace(/=+$/, '');
    }

    return {
      success: true,
      output: encoded,
      byteSize: bytes.byteLength,
    };
  } catch (err) {
    return {
      success: false,
      output: '',
      error: (err as Error).message || 'Failed to encode to Base64.',
    };
  }
}

/**
 * Decodes Base64 to text using UTF-8 TextDecoder
 */
export function decodeBase64(input: string): Base64Result {
  const trimmed = input.trim();
  if (!trimmed) {
    return { success: true, output: '', byteSize: 0 };
  }

  try {
    // Normalize URL-safe characters back to standard Base64
    let base64 = trimmed.replace(/-/g, '+').replace(/_/g, '/');
    // Restore missing padding if needed
    while (base64.length % 4 !== 0) {
      base64 += '=';
    }

    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const decoded = new TextDecoder().decode(bytes);

    return {
      success: true,
      output: decoded,
      byteSize: bytes.byteLength,
    };
  } catch (err) {
    return {
      success: false,
      output: '',
      error: 'Malformed Base64 input. Please check for invalid characters or corrupt encoding.',
    };
  }
}

export function processBase64(input: string, options: Base64Options): Base64Result {
  if (options.mode === 'encode') {
    return encodeBase64(input, {
      urlSafe: options.urlSafe,
      stripPadding: options.stripPadding,
    });
  } else {
    return decodeBase64(input);
  }
}

