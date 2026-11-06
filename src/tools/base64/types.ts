export type Base64Mode = 'encode' | 'decode';

export interface Base64Options {
  mode: Base64Mode;
  urlSafe: boolean;
  stripPadding: boolean;
}

export interface Base64Result {
  success: boolean;
  output: string;
  error?: string;
  byteSize?: number;
}
