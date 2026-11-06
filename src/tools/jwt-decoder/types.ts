export interface JwtClaimSummary {
  issuer?: string;
  subject?: string;
  audience?: string;
  expiration?: number;
  notBefore?: number;
  issuedAt?: number;
  jwtId?: string;
  isExpired?: boolean;
  timeRemaining?: string;
}

export interface DecodedJwtResult {
  isValid: boolean;
  header: Record<string, unknown> | null;
  payload: Record<string, unknown> | null;
  signature: string;
  headerRaw: string;
  payloadRaw: string;
  claims: JwtClaimSummary;
  error?: string;
}
