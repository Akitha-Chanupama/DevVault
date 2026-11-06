export interface PasswordOptions {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
  excludeAmbiguous: boolean;
  count: number;
}

export type PasswordStrengthLevel = 'Weak' | 'Fair' | 'Good' | 'Strong' | 'Very Strong';

export interface GeneratedPasswordInfo {
  password: string;
  entropyBits: number;
  strengthLevel: PasswordStrengthLevel;
}
