import { HeaderCategory, ParsedHeader, SecurityAuditItem, HeaderInspectionResult } from '../types';

const KNOWN_HEADER_METADATA: Record<string, { category: HeaderCategory; description: string }> = {
  // Security
  'content-security-policy': {
    category: 'security',
    description: 'Restricts resources (scripts, images, stylesheets) the browser can load, preventing XSS.',
  },
  'strict-transport-security': {
    category: 'security',
    description: 'Enforces secure HTTPS connections and prevents SSL-stripping man-in-the-middle attacks.',
  },
  'x-content-type-options': {
    category: 'security',
    description: 'Prevents MIME-type sniffing (should be set to "nosniff").',
  },
  'x-frame-options': {
    category: 'security',
    description: 'Prevents clickjacking by controlling whether the site can be embedded in an iframe.',
  },
  'referrer-policy': {
    category: 'security',
    description: 'Controls how much referrer information is sent with outgoing requests.',
  },
  'permissions-policy': {
    category: 'security',
    description: 'Restricts access to browser features and APIs (e.g., camera, microphone, geolocation).',
  },
  'cross-origin-embedder-policy': {
    category: 'security',
    description: 'Prevents loading cross-origin resources that do not explicitly grant permission.',
  },
  'cross-origin-opener-policy': {
    category: 'security',
    description: 'Ensures top-level document does not share a browsing context group with cross-origin documents.',
  },
  'cross-origin-resource-policy': {
    category: 'security',
    description: 'Restricts resource loading to same-origin or same-site.',
  },

  // Caching
  'cache-control': {
    category: 'caching',
    description: 'Directives for caching mechanisms in requests and responses (max-age, no-cache, must-revalidate).',
  },
  'etag': {
    category: 'caching',
    description: 'Unique identifier for a specific version of a resource, used for conditional revalidation.',
  },
  'expires': {
    category: 'caching',
    description: 'The date and time after which the response is considered stale.',
  },
  'last-modified': {
    category: 'caching',
    description: 'The date and time at which the origin server believes the resource was last modified.',
  },
  'age': {
    category: 'caching',
    description: 'The time in seconds the object has been in a proxy cache.',
  },
  'vary': {
    category: 'caching',
    description: 'Specifies which request headers must match for a cached response to be used.',
  },

  // CORS
  'access-control-allow-origin': {
    category: 'cors',
    description: 'Specifies which origins are permitted to access the resource.',
  },
  'access-control-allow-methods': {
    category: 'cors',
    description: 'Specifies the HTTP methods allowed when accessing the resource in response to a preflight request.',
  },
  'access-control-allow-headers': {
    category: 'cors',
    description: 'Specifies which HTTP headers can be used during the actual request.',
  },
  'access-control-allow-credentials': {
    category: 'cors',
    description: 'Indicates whether the response to the request can be exposed when the credentials flag is true.',
  },
  'access-control-max-age': {
    category: 'cors',
    description: 'Indicates how long the results of a preflight request can be cached.',
  },
  'access-control-expose-headers': {
    category: 'cors',
    description: 'Lists which response headers can be made available to scripts in the browser.',
  },

  // Content
  'content-type': {
    category: 'content',
    description: 'The MIME type and character encoding of the resource representation.',
  },
  'content-length': {
    category: 'content',
    description: 'The size of the entity-body in decimal number of octets (bytes).',
  },
  'content-encoding': {
    category: 'content',
    description: 'Specifies compression algorithms used (e.g., gzip, br, deflate).',
  },
  'content-language': {
    category: 'content',
    description: 'Describes the natural language(s) intended for the target audience.',
  },
  'content-disposition': {
    category: 'content',
    description: 'Indicates if the content is expected to be displayed inline or downloaded as an attachment.',
  },
};

const SECURITY_CHECKS: Array<{
  header: string;
  recommendation: string;
  validate?: (val: string) => 'passed' | 'warning';
}> = [
  {
    header: 'Strict-Transport-Security',
    recommendation: 'Enforce HTTPS with max-age=31536000; includeSubDomains; preload',
    validate: (val) => (val.toLowerCase().includes('max-age') ? 'passed' : 'warning'),
  },
  {
    header: 'Content-Security-Policy',
    recommendation: 'Define strict CSP policy directives to mitigate XSS vulnerabilities.',
    validate: () => 'passed',
  },
  {
    header: 'X-Content-Type-Options',
    recommendation: 'Set to "nosniff" to prevent MIME-confusion attacks.',
    validate: (val) => (val.toLowerCase().trim() === 'nosniff' ? 'passed' : 'warning'),
  },
  {
    header: 'X-Frame-Options',
    recommendation: 'Set to "DENY" or "SAMEORIGIN" to prevent clickjacking.',
    validate: (val) => {
      const v = val.toUpperCase().trim();
      return v === 'DENY' || v === 'SAMEORIGIN' ? 'passed' : 'warning';
    },
  },
  {
    header: 'Referrer-Policy',
    recommendation: 'Set to "strict-origin-when-cross-origin" or "no-referrer".',
    validate: () => 'passed',
  },
];

export function parseHttpHeaders(rawInput: string): HeaderInspectionResult {
  const lines = rawInput.split(/\r?\n/);
  const headers: ParsedHeader[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const colonIdx = trimmed.indexOf(':');
    if (colonIdx === -1) {
      // Could be HTTP status line (e.g. HTTP/1.1 200 OK)
      continue;
    }

    const name = trimmed.substring(0, colonIdx).trim();
    const value = trimmed.substring(colonIdx + 1).trim();
    const lowerName = name.toLowerCase();

    const meta = KNOWN_HEADER_METADATA[lowerName];
    const category: HeaderCategory = meta ? meta.category : 'general';
    const description = meta ? meta.description : undefined;

    headers.push({
      name,
      value,
      category,
      description,
    });
  }

  // Security audit
  const headerMap = new Map<string, string>();
  headers.forEach((h) => headerMap.set(h.name.toLowerCase(), h.value));

  const securityAudit: SecurityAuditItem[] = SECURITY_CHECKS.map((check) => {
    const lowerCheck = check.header.toLowerCase();
    const val = headerMap.get(lowerCheck);

    if (val !== undefined) {
      const status = check.validate ? check.validate(val) : 'passed';
      return {
        header: check.header,
        status,
        value: val,
        recommendation: check.recommendation,
      };
    }

    return {
      header: check.header,
      status: 'missing',
      recommendation: check.recommendation,
    };
  });

  return {
    headers,
    rawCount: headers.length,
    securityAudit,
  };
}

