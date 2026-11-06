import {
  PasswordOptions,
  PasswordStrengthLevel,
  GeneratedPasswordInfo,
} from '../types';

const CHARS_UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const CHARS_LOWER = 'abcdefghijklmnopqrstuvwxyz';
const CHARS_NUMBERS = '0123456789';
const CHARS_SYMBOLS = '!@#$%^&*()-_=+[]{}|;:,.<>?';
const AMBIGUOUS_CHARS = new Set(['l', '1', 'I', 'o', '0', 'O', '|', '`', '\'', '"', ';', ':']);

/**
 * Gets a cryptographically secure random integer in [0, max - 1] without modulo bias
 */
function getSecureRandomInt(max: number): number {
  if (max <= 1) return 0;
  // Calculate highest multiple of max below 2^32
  const limit = Math.floor(0x100000000 / max) * max;
  const buffer = new Uint32Array(1);

  while (true) {
    crypto.getRandomValues(buffer);
    if (buffer[0] < limit) {
      return buffer[0] % max;
    }
  }
}

export function buildCharset(options: PasswordOptions): string {
  let charset = '';
  if (options.uppercase) charset += CHARS_UPPER;
  if (options.lowercase) charset += CHARS_LOWER;
  if (options.numbers) charset += CHARS_NUMBERS;
  if (options.symbols) charset += CHARS_SYMBOLS;

  if (options.excludeAmbiguous) {
    charset = charset
      .split('')
      .filter((char) => !AMBIGUOUS_CHARS.has(char))
      .join('');
  }

  return charset;
}

export function calculateEntropy(length: number, poolSize: number): {
  entropyBits: number;
  strengthLevel: PasswordStrengthLevel;
} {
  if (length <= 0 || poolSize <= 0) {
    return { entropyBits: 0, strengthLevel: 'Weak' };
  }

  const entropyBits = Math.round(length * Math.log2(poolSize));

  let strengthLevel: PasswordStrengthLevel = 'Weak';
  if (entropyBits >= 128) strengthLevel = 'Very Strong';
  else if (entropyBits >= 80) strengthLevel = 'Strong';
  else if (entropyBits >= 60) strengthLevel = 'Good';
  else if (entropyBits >= 36) strengthLevel = 'Fair';

  return { entropyBits, strengthLevel };
}

export function generateSinglePassword(options: PasswordOptions): GeneratedPasswordInfo {
  const charset = buildCharset(options);
  if (!charset) {
    throw new Error('At least one character group must be selected.');
  }

  const length = Math.max(4, Math.min(128, options.length));
  const chars: string[] = [];

  for (let i = 0; i < length; i++) {
    const idx = getSecureRandomInt(charset.length);
    chars.push(charset[idx]);
  }

  const password = chars.join('');
  const { entropyBits, strengthLevel } = calculateEntropy(length, charset.length);

  return {
    password,
    entropyBits,
    strengthLevel,
  };
}

export function generatePasswords(options: PasswordOptions): GeneratedPasswordInfo[] {
  const count = Math.max(1, Math.min(50, options.count));
  const results: GeneratedPasswordInfo[] = [];

  for (let i = 0; i < count; i++) {
    results.push(generateSinglePassword(options));
  }

  return results;
}

