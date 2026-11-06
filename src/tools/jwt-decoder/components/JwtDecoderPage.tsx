import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Clock,
  User,
  Calendar,
  RefreshCw,
} from 'lucide-react';
import { ToolPageHeader } from '@/components/tool-ui/ToolPageHeader';
import { EditorToolbar } from '@/components/tool-ui/EditorToolbar';
import { CopyButton } from '@/components/tool-ui/CopyButton';
import { ClearButton } from '@/components/tool-ui/ClearButton';
import { ErrorPanel } from '@/components/tool-ui/ValidationMessage';
import { ToolHelpPanel } from '@/components/tool-ui/EmptyState';
import { CodeEditor } from '@/components/editor/CodeEditor';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { decodeJwt } from '../logic/jwtDecoder';
import { DecodedJwtResult } from '../types';

const SAMPLE_JWT =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkZXYtMTI4MzkxIiwibmFtZSI6IkFsZXggTW9yZ2FuIiwiZW1haWwiOiJhbGV4QGRldnZhdWx0LmRldiIsInJvbGVzIjpbImFkbWluIiwiZGV2ZWxvcGVyIl0sImlhdCI6MTcwMDAwMDAwMCwiZXhwIjoyMDgwMDAwMDAwfQ.5TzJ7_p7O7Z4-b1kR-XqOQ8mG0_vE5qR1sO5-wU9mYw';

export const JwtDecoderPage: React.FC = () => {
  const [tokenInput, setTokenInput] = useState<string>(SAMPLE_JWT);
  const [result, setResult] = useState<DecodedJwtResult>(() => decodeJwt(SAMPLE_JWT));

  useEffect(() => {
    setResult(decodeJwt(tokenInput));
  }, [tokenInput]);

  const formatTimestamp = (epochSeconds?: number) => {
    if (!epochSeconds) return 'Not present';
    const date = new Date(epochSeconds * 1000);
    return `${date.toLocaleString()} (${epochSeconds})`;
  };

  return (
    <div className="space-y-6">
      <ToolPageHeader
        toolId="jwt-decoder"
        title="JWT Decoder"
        description="Decode, inspect, and analyze JSON Web Token (JWT) headers, claims, and expiry dates locally in your browser."
        category="Security"
        privacyMode="browser-only"
      />

      {/* Prominent Cryptographic Notice as required by Section 5.5 */}
      <div className="rounded-lg border border-warning/30 bg-warning/10 p-3.5 text-xs text-warning flex items-start gap-3">
        <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-semibold">Notice: Decoding does not verify signatures</span>
          <p className="text-warning/90 leading-relaxed">
            This tool parses and displays base64url encoded token data client-side. It does not verify the cryptographic signature against a public key or shared secret. Never consider an unverified token authentic.
          </p>
        </div>
      </div>

      {/* Raw Token Input */}
      <Card className="bg-surface">
        <EditorToolbar
          title="Encoded JSON Web Token"
          subtitle={`${tokenInput.length} chars`}
          actions={
            <div className="flex items-center gap-1.5">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTokenInput(SAMPLE_JWT)}
                className="text-xs h-7 px-2"
              >
                <RefreshCw className="w-3 h-3 mr-1" />
                <span>Sample</span>
              </Button>
              <ClearButton onClear={() => setTokenInput('')} disabled={!tokenInput} />
            </div>
          }
        />
        <div className="p-3">
          <textarea
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            placeholder="Paste your JWT token here (eyJhbGci...)..."
            rows={4}
            className="w-full resize-y rounded-md border border-border bg-surface-elevated p-3 font-mono text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </Card>

      {/* Decoding Error if invalid */}
      {!result.isValid && result.error && (
        <ErrorPanel error={result.error} />
      )}

      {/* Claims Summary Bar if valid */}
      {result.isValid && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {/* Expiration Status */}
          <Card className="p-3 bg-surface">
            <div className="text-[11px] text-muted-foreground flex items-center gap-1 mb-1">
              <Clock className="w-3.5 h-3.5 text-primary" />
              <span>Token Status</span>
            </div>
            <div className="flex items-center gap-2">
              {result.claims.expiration ? (
                result.claims.isExpired ? (
                  <Badge variant="destructive">Expired {result.claims.timeRemaining}</Badge>
                ) : (
                  <Badge variant="success">Active (expires {result.claims.timeRemaining})</Badge>
                )
              ) : (
                <Badge variant="secondary">No exp claim</Badge>
              )}
            </div>
          </Card>

          {/* Subject */}
          <Card className="p-3 bg-surface">
            <div className="text-[11px] text-muted-foreground flex items-center gap-1 mb-1">
              <User className="w-3.5 h-3.5 text-secondary" />
              <span>Subject (sub)</span>
            </div>
            <div className="text-xs font-mono font-semibold text-foreground truncate">
              {result.claims.subject || '—'}
            </div>
          </Card>

          {/* Issued At */}
          <Card className="p-3 bg-surface">
            <div className="text-[11px] text-muted-foreground flex items-center gap-1 mb-1">
              <Calendar className="w-3.5 h-3.5 text-success" />
              <span>Issued At (iat)</span>
            </div>
            <div className="text-[11px] font-mono text-foreground truncate">
              {formatTimestamp(result.claims.issuedAt)}
            </div>
          </Card>

          {/* Expires At */}
          <Card className="p-3 bg-surface">
            <div className="text-[11px] text-muted-foreground flex items-center gap-1 mb-1">
              <Clock className="w-3.5 h-3.5 text-warning" />
              <span>Expires At (exp)</span>
            </div>
            <div className="text-[11px] font-mono text-foreground truncate">
              {formatTimestamp(result.claims.expiration)}
            </div>
          </Card>
        </div>
      )}

      {/* Decoded Header and Payload Editors */}
      {result.isValid && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Header Panel */}
          <div className="flex flex-col">
            <EditorToolbar
              title="Header (JOSE)"
              subtitle="Algorithm & Token Type"
              actions={<CopyButton content={result.headerRaw} />}
            />
            <CodeEditor
              value={result.headerRaw}
              readOnly={true}
              language="json"
              height="340px"
            />
          </div>

          {/* Payload Panel */}
          <div className="flex flex-col">
            <EditorToolbar
              title="Payload (Claims)"
              subtitle="Identity & Custom Data"
              actions={<CopyButton content={result.payloadRaw} />}
            />
            <CodeEditor
              value={result.payloadRaw}
              readOnly={true}
              language="json"
              height="340px"
            />
          </div>
        </div>
      )}

      {/* Signature info */}
      {result.isValid && result.signature && (
        <Card className="p-3 bg-surface">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-foreground">Signature Segment</span>
            <CopyButton content={result.signature} label="Copy Sig" />
          </div>
          <p className="font-mono text-xs text-muted-foreground break-all bg-surface-elevated p-2 rounded border border-border">
            {result.signature}
          </p>
        </Card>
      )}

      <ToolHelpPanel
        title="About JSON Web Tokens"
        description="A JSON Web Token (RFC 7519) consists of three parts separated by dots: Header, Payload, and Signature."
        features={[
          'Decodes Header (specifying algorithm like HS256, RS256) and Payload claims.',
          'Extracts timestamps (iat, exp, nbf) and translates epoch timestamps to local time.',
          'Evaluates token expiration and remaining lifetime automatically.',
          'Zero transmission: tokens are never sent over the wire or saved to logs.',
        ]}
      />
    </div>
  );
};

export default JwtDecoderPage;
