import { DecodedJwtResult, JwtClaimSummary } from '../types';

/**
 * Base64URL decode string handling unicode properly
 */
export function base64UrlDecode(str: string): string {
  // Convert Base64URL to standard Base64
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  // Pad with '=' to make length multiple of 4
  while (base64.length % 4 !== 0) {
    base64 += '=';
  }

  // Safe unicode decode
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

function formatRelativeTime(secondsDiff: number): string {
  const isPast = secondsDiff < 0;
  const absSec = Math.abs(secondsDiff);

  if (absSec < 60) return isPast ? `${absSec}s ago` : `in ${absSec}s`;
  const minutes = Math.floor(absSec / 60);
  if (minutes < 60) return isPast ? `${minutes}m ago` : `in ${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return isPast ? `${hours}h ago` : `in ${hours}h`;
  const days = Math.floor(hours / 24);
  return isPast ? `${days}d ago` : `in ${days}d`;
}

export function decodeJwt(rawToken: string): DecodedJwtResult {
  const trimmed = rawToken.trim();
  if (!trimmed) {
    return {
      isValid: false,
      header: null,
      payload: null,
      signature: '',
      headerRaw: '',
      payloadRaw: '',
      claims: {},
      error: 'Please enter a JSON Web Token.',
    };
  }

  const parts = trimmed.split('.');
  if (parts.length !== 3) {
    return {
      isValid: false,
      header: null,
      payload: null,
      signature: '',
      headerRaw: '',
      payloadRaw: '',
      claims: {},
      error: `Invalid JWT format. Expected 3 dot-separated segments (header.payload.signature), but received ${parts.length}.`,
    };
  }

  const [headerB64, payloadB64, signature] = parts;

  try {
    const headerStr = base64UrlDecode(headerB64);
    const payloadStr = base64UrlDecode(payloadB64);

    const header = JSON.parse(headerStr);
    const payload = JSON.parse(payloadStr);

    const nowSec = Math.floor(Date.now() / 1000);
    const claims: JwtClaimSummary = {
      issuer: payload.iss,
      subject: payload.sub,
      audience: payload.aud,
      expiration: payload.exp,
      notBefore: payload.nbf,
      issuedAt: payload.iat,
      jwtId: payload.jti,
    };

    if (typeof payload.exp === 'number') {
      claims.isExpired = nowSec > payload.exp;
      claims.timeRemaining = formatRelativeTime(payload.exp - nowSec);
    }

    return {
      isValid: true,
      header,
      payload,
      signature,
      headerRaw: JSON.stringify(header, null, 2),
      payloadRaw: JSON.stringify(payload, null, 2),
      claims,
    };
  } catch (err) {
    return {
      isValid: false,
      header: null,
      payload: null,
      signature,
      headerRaw: '',
      payloadRaw: '',
      claims: {},
      error: `Failed to decode JWT segments: ${(err as Error).message}`,
    };
  }
}

