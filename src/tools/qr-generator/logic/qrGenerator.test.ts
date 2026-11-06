import { describe, it, expect } from 'vitest';
import { generateQrCode } from './qrGenerator';

describe('qrGenerator logic', () => {
  it('generates valid SVG and data URL for valid text', async () => {
    const result = await generateQrCode('https://devvault.app');
    expect(result.svg).toContain('<svg');
    expect(result.svg).toContain('</svg>');
    expect(result.dataUrl).toContain('data:image/png;base64,');
  });

  it('respects error correction level and color overrides', async () => {
    const result = await generateQrCode('custom text', {
      errorCorrectionLevel: 'H',
      darkColor: '#1e40af',
      lightColor: '#f8fafc',
    });
    expect(result.svg).toContain('#1e40af');
    expect(result.svg).toContain('#f8fafc');
  });

  it('returns empty result when text is blank', async () => {
    const result = await generateQrCode('');
    expect(result.svg).toBe('');
    expect(result.dataUrl).toBe('');
  });
});

