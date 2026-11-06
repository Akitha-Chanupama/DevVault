export interface MinifyResult {
  success: boolean;
  minified: string;
  error?: {
    message: string;
    line?: number;
    column?: number;
  };
  stats?: {
    originalBytes: number;
    minifiedBytes: number;
    savingsBytes: number;
    savingsPercent: number;
  };
}
