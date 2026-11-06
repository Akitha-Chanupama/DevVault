import { describe, it, expect } from 'vitest';
import { processBase64, encodeBase64, decodeBase64 } from './base64';

describe('base64 logic', () => {
  it('encodes and decodes standard ASCII text', () => {
    const raw = 'DevVault Developer Tools';
    const encoded = encodeBase64(raw, { urlSafe: false, stripPadding: false });
    expect(encoded.success).toBe(true);
    expect(encoded.output).toBe('RGV2VmF1bHQgRGV2ZWxvcGVyIFRvb2xz');

    const decoded = decodeBase64(encoded.output);
    expect(decoded.success).toBe(true);
    expect(decoded.output).toBe(raw);
  });

  it('correctly handles multi-byte UTF-8 and emojis without throwing', () => {
    const unicodeText = '🚀 DevVault 现代工具 🔒';
    const encoded = encodeBase64(unicodeText, { urlSafe: false, stripPadding: false });
    expect(encoded.success).toBe(true);

    const decoded = decodeBase64(encoded.output);
    expect(decoded.success).toBe(true);
    expect(decoded.output).toBe(unicodeText);
  });

  it('supports URL-safe base64 encoding and unpadded decoding', () => {
    const text = 'test?query=val&flag=true';
    const encoded = encodeBase64(text, { urlSafe: true, stripPadding: true });
    expect(encoded.output).not.toContain('+');
    expect(encoded.output).not.toContain('/');
    expect(encoded.output).not.toContain('=');

    const decoded = decodeBase64(encoded.output);
    expect(decoded.output).toBe(text);
  });

  it('reports error on malformed base64 input', () => {
    const malformed = 'Not Valid Base64!@#';
    const decoded = decodeBase64(malformed);
    expect(decoded.success).toBe(false);
    expect(decoded.error).toContain('Malformed Base64');

    const res = processBase64('test', { mode: 'encode', urlSafe: false, stripPadding: false });
    expect(res.success).toBe(true);
  });
});
