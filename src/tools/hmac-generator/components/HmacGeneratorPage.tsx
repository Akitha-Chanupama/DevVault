import React, { useState, useEffect } from 'react';
import { Key, ShieldCheck, ShieldAlert, Lock, CheckCircle2 } from 'lucide-react';
import { ToolPageHeader } from '@/components/tool-ui/ToolPageHeader';
import { EditorToolbar } from '@/components/tool-ui/EditorToolbar';
import { ClearButton } from '@/components/tool-ui/ClearButton';
import { CopyButton } from '@/components/tool-ui/CopyButton';
import { ToolHelpPanel } from '@/components/tool-ui/EmptyState';
import { HmacAlgorithm, HmacResult } from '../types';
import { generateHmac, verifyHmac } from '../logic/hmacGenerator';

export const HmacGeneratorPage: React.FC = () => {
  const [algorithm, setAlgorithm] = useState<HmacAlgorithm>('SHA-256');
  const [secretKey, setSecretKey] = useState<string>('super-secret-api-key');
  const [message, setMessage] = useState<string>('GET /api/v1/resource\nTimestamp: 1700000000');
  const [hmacResult, setHmacResult] = useState<HmacResult>({ hex: '', base64: '', base64url: '' });

  const [testSig, setTestSig] = useState<string>('');
  const [verified, setVerified] = useState<boolean | null>(null);

  useEffect(() => {
    let active = true;
    generateHmac(message, secretKey, algorithm).then((res) => {
      if (active) setHmacResult(res);
    });
    return () => {
      active = false;
    };
  }, [message, secretKey, algorithm]);

  const handleVerify = async () => {
    if (!testSig.trim()) {
      setVerified(null);
      return;
    }
    const res = await verifyHmac(message, secretKey, testSig, algorithm);
    setVerified(res.isValid);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <ToolPageHeader
        toolId="hmac-generator"
        title="HMAC Generator & Verifier"
        description="Compute and verify Hash-based Message Authentication Codes (HMAC) using native Web Crypto APIs."
        category="Security"
        privacyMode="browser-only"
      />

      {/* Configuration Bar */}
      <div className="bg-card border rounded-lg p-4 mb-6 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
              Hash Algorithm
            </label>
            <select
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value as HmacAlgorithm)}
              className="w-full h-10 px-3 bg-muted/50 border rounded-md font-mono text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="SHA-256">HMAC-SHA-256 (Standard)</option>
              <option value="SHA-384">HMAC-SHA-384</option>
              <option value="SHA-512">HMAC-SHA-512 (High Security)</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-primary" /> Secret Key
            </label>
            <input
              type="text"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              placeholder="Enter secret key..."
              className="w-full h-10 px-3 bg-background border rounded-md font-mono text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
      </div>

      {/* Main Grid: Message Input vs Outputs & Verification */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Message */}
        <div className="bg-card border rounded-lg p-4 shadow-sm flex flex-col">
          <EditorToolbar
            title="Payload / Message"
            actions={<ClearButton onClear={() => setMessage('')} disabled={!message} />}
          />
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter payload string or message to sign..."
            className="w-full flex-1 min-h-[300px] p-3 font-mono text-xs bg-background border rounded-md resize-none focus:outline-none focus:ring-1 focus:ring-primary leading-relaxed"
          />
          <div className="mt-3 text-xs text-muted-foreground font-mono">
            {message.length} bytes (UTF-8)
          </div>
        </div>

        {/* Generated Signatures & Verification */}
        <div className="space-y-6">
          {/* Signatures Panel */}
          <div className="bg-card border rounded-lg p-4 shadow-sm space-y-4">
            <h3 className="text-sm font-semibold flex items-center gap-2 border-b pb-2">
              <Lock className="w-4 h-4 text-primary" /> Computed HMAC Signatures
            </h3>

            <div>
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                <span className="font-medium">Hexadecimal (lowercase)</span>
                <CopyButton content={hmacResult.hex} />
              </div>
              <div className="p-2.5 bg-muted/40 border rounded-md font-mono text-xs break-all select-all">
                {hmacResult.hex || 'Enter a secret key to compute'}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                <span className="font-medium">Base64</span>
                <CopyButton content={hmacResult.base64} />
              </div>
              <div className="p-2.5 bg-muted/40 border rounded-md font-mono text-xs break-all select-all">
                {hmacResult.base64 || 'Enter a secret key to compute'}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                <span className="font-medium">Base64URL (JWT standard)</span>
                <CopyButton content={hmacResult.base64url} />
              </div>
              <div className="p-2.5 bg-muted/40 border rounded-md font-mono text-xs break-all select-all">
                {hmacResult.base64url || 'Enter a secret key to compute'}
              </div>
            </div>
          </div>

          {/* Verification Panel */}
          <div className="bg-card border rounded-lg p-4 shadow-sm space-y-3">
            <h3 className="text-sm font-semibold flex items-center gap-2 border-b pb-2">
              <ShieldCheck className="w-4 h-4 text-primary" /> Constant-Time Signature Verification
            </h3>
            <p className="text-xs text-muted-foreground">
              Paste an incoming signature (Hex or Base64) to verify authenticity against the payload and key.
            </p>

            <div className="flex gap-2">
              <input
                type="text"
                value={testSig}
                onChange={(e) => {
                  setTestSig(e.target.value);
                  setVerified(null);
                }}
                placeholder="Paste expected signature here..."
                className="flex-1 h-9 px-3 bg-background border rounded-md font-mono text-xs focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button
                type="button"
                onClick={handleVerify}
                className="px-4 h-9 bg-primary text-primary-foreground text-xs font-semibold rounded-md hover:bg-primary/90 transition-colors"
              >
                Verify
              </button>
            </div>

            {verified === true && (
              <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-md text-emerald-600 dark:text-emerald-400 text-xs font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                Signature verified! The payload and secret key match exactly.
              </div>
            )}

            {verified === false && (
              <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-md text-rose-600 dark:text-rose-400 text-xs font-medium flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                Signature mismatch! The payload, key, or signature does not match.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <ToolHelpPanel
          title="HMAC Generator & Verifier"
          description="Authenticate API webhook payloads (GitHub, Stripe, Shopify, AWS) with cryptographic HMAC signatures."
          tips={[
            'Verify GitHub webhook signatures: sha256=xxx',
            'Compute Stripe or Slack request signature headers',
            'Test JWT HMAC-SHA256 (HS256) signature components',
          ]}
        />
      </div>
    </div>
  );
};

export default HmacGeneratorPage;
