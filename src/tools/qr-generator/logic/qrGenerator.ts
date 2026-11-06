import QRCode from 'qrcode';
import { QrCodeOptions, QrCodeResult } from '../types';

export const DEFAULT_QR_OPTIONS: QrCodeOptions = {
  errorCorrectionLevel: 'M',
  margin: 2,
  width: 320,
  darkColor: '#000000',
  lightColor: '#ffffff',
};

export async function generateQrCode(
  text: string,
  options: Partial<QrCodeOptions> = {}
): Promise<QrCodeResult> {
  const merged: QrCodeOptions = { ...DEFAULT_QR_OPTIONS, ...options };

  if (!text) {
    return { svg: '', dataUrl: '' };
  }

  const svg = await QRCode.toString(text, {
    type: 'svg',
    errorCorrectionLevel: merged.errorCorrectionLevel,
    margin: merged.margin,
    width: merged.width,
    color: {
      dark: merged.darkColor,
      light: merged.lightColor,
    },
  });

  const dataUrl = await QRCode.toDataURL(text, {
    errorCorrectionLevel: merged.errorCorrectionLevel,
    margin: merged.margin,
    width: merged.width,
    color: {
      dark: merged.darkColor,
      light: merged.lightColor,
    },
  });

  return { svg, dataUrl };
}

