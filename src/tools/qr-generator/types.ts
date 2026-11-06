export type QrErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export interface QrCodeOptions {
  errorCorrectionLevel: QrErrorCorrectionLevel;
  margin: number;
  width: number;
  darkColor: string;
  lightColor: string;
}

export interface QrCodeResult {
  svg: string;
  dataUrl: string;
}
