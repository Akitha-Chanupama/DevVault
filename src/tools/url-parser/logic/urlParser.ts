import { ParsedUrlDetails, QueryParam } from '../types';

export function parseUrlString(raw: string): ParsedUrlDetails {
  const trimmed = raw.trim();
  if (!trimmed) {
    return {
      isValid: false,
      rawUrl: '',
      protocol: '',
      origin: '',
      hostname: '',
      port: '',
      pathname: '',
      hash: '',
      params: [],
      error: 'Please enter a URL to parse.',
    };
  }

  // Prepend protocol if missing for user convenience
  const hasScheme = /^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//.test(trimmed);
  const normalized = hasScheme ? trimmed : `https://${trimmed}`;

  try {
    const urlObj = new URL(normalized);
    const params: QueryParam[] = [];

    urlObj.searchParams.forEach((value, key) => {
      params.push({
        id: Math.random().toString(36).substring(2, 9),
        key,
        value,
        enabled: true,
      });
    });

    return {
      isValid: true,
      rawUrl: trimmed,
      protocol: urlObj.protocol,
      origin: urlObj.origin,
      hostname: urlObj.hostname,
      port: urlObj.port || (urlObj.protocol === 'https:' ? '443' : urlObj.protocol === 'http:' ? '80' : ''),
      pathname: urlObj.pathname,
      hash: urlObj.hash,
      params,
    };
  } catch (err) {
    return {
      isValid: false,
      rawUrl: trimmed,
      protocol: '',
      origin: '',
      hostname: '',
      port: '',
      pathname: '',
      hash: '',
      params: [],
      error: (err as Error).message || 'Invalid URL format.',
    };
  }
}

export function reconstructUrl(
  baseDetails: Omit<ParsedUrlDetails, 'params'>,
  params: QueryParam[]
): string {
  try {
    const scheme = baseDetails.protocol ? baseDetails.protocol.replace(/:$/, '') : 'https';
    const host = baseDetails.hostname || 'localhost';
    const portPart = baseDetails.port && baseDetails.port !== '80' && baseDetails.port !== '443'
      ? `:${baseDetails.port}`
      : '';
    const path = baseDetails.pathname ? (baseDetails.pathname.startsWith('/') ? baseDetails.pathname : `/${baseDetails.pathname}`) : '/';
    
    const url = new URL(`${scheme}://${host}${portPart}${path}`);
    
    params.forEach((p) => {
      if (p.enabled && p.key.trim()) {
        url.searchParams.append(p.key.trim(), p.value);
      }
    });

    if (baseDetails.hash) {
      url.hash = baseDetails.hash.startsWith('#') ? baseDetails.hash : `#${baseDetails.hash}`;
    }

    return url.toString();
  } catch {
    return '';
  }
}

