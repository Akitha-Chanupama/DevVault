export interface JsonValidationResult {
  isValid: boolean;
  error?: {
    message: string;
    line?: number;
    column?: number;
  };
  metrics?: {
    byteSize: number;
    characterCount: number;
    lineCount: number;
    depth: number;
    keysCount: number;
    arrayItemCount: number;
    rootType: 'object' | 'array' | 'primitive';
  };
}

