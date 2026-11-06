import { describe, it, expect } from 'vitest';
import { parseHttpHeaders } from './headerInspector';

describe('headerInspector logic', () => {
  it('parses typical HTTP response headers and categorizes them', () => {
    const raw = `HTTP/2 200 OK
content-type: application/json; charset=utf-8
cache-control: max-age=3600, public
access-control-allow-origin: *
server: cloudflare
x-content-type-options: nosniff
strict-transport-security: max-age=31536000; includeSubDomains`;

    const result = parseHttpHeaders(raw);
    expect(result.rawCount).toBe(6);

    const ct = result.headers.find((h) => h.name.toLowerCase() === 'content-type');
    expect(ct?.category).toBe('content');

    const cc = result.headers.find((h) => h.name.toLowerCase() === 'cache-control');
    expect(cc?.category).toBe('caching');

    const cors = result.headers.find((h) => h.name.toLowerCase() === 'access-control-allow-origin');
    expect(cors?.category).toBe('cors');

    const sec = result.headers.find((h) => h.name.toLowerCase() === 'x-content-type-options');
    expect(sec?.category).toBe('security');
  });

  it('performs security audit and identifies missing headers', () => {
    const raw = `content-type: text/html
x-content-type-options: nosniff`;

    const result = parseHttpHeaders(raw);
    const nosniffAudit = result.securityAudit.find((a) => a.header === 'X-Content-Type-Options');
    expect(nosniffAudit?.status).toBe('passed');

    const hstsAudit = result.securityAudit.find((a) => a.header === 'Strict-Transport-Security');
    expect(hstsAudit?.status).toBe('missing');
  });

  it('handles empty input gracefully', () => {
    const result = parseHttpHeaders('');
    expect(result.headers).toHaveLength(0);
    expect(result.rawCount).toBe(0);
    expect(result.securityAudit.every((a) => a.status === 'missing')).toBe(true);
  });
});
