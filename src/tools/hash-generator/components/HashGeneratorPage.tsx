import React, { useState, useEffect } from 'react';
import { Fingerprint, RefreshCw } from 'lucide-react';
import { ToolPageHeader } from '@/components/tool-ui/ToolPageHeader';
import { EditorToolbar } from '@/components/tool-ui/EditorToolbar';
import { CopyButton } from '@/components/tool-ui/CopyButton';
import { ClearButton } from '@/components/tool-ui/ClearButton';
import { ToolHelpPanel } from '@/components/tool-ui/EmptyState';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { generateAllHashes } from '../logic/hashGenerator';
import { HashResult } from '../types';

export const HashGeneratorPage: React.FC = () => {
  const [input, setInput] = useState<string>('DevVault');
  const [result, setResult] = useState<HashResult | null>(null);
  const [uppercase, setUppercase] = useState<boolean>(false);

  useEffect(() => {
    let active = true;
    generateAllHashes(input).then((res) => {
      if (active) {
        setResult(res);
      }
    });
    return () => {
      active = false;
    };
  }, [input]);

  return (
    <div className="space-y-6">
      <ToolPageHeader
        toolId="hash-generator"
        title="Hash Generator"
        description="Generate standard cryptographic digests (SHA-256, SHA-384, SHA-512) directly via the Web Crypto API."
        category="Security"
        privacyMode="browser-only"
      />

      {/* Security notice regarding digests vs password hashing */}
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-xs text-muted-foreground flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Fingerprint className="w-4 h-4 text-primary shrink-0" />
          <span>
            Cryptographic digests are one-way checksums, not reversible encryption. Do not use plain un-salted SHA hashes for passwords.
          </span>
        </div>
        <label className="flex items-center gap-1.5 cursor-pointer text-foreground font-medium shrink-0 ml-4">
          <input
            type="checkbox"
            checked={uppercase}
            onChange={(e) => setUppercase(e.target.checked)}
            className="rounded border-border text-primary focus:ring-primary h-4 w-4"
          />
          <span>Uppercase Hex</span>
        </label>
      </div>

      {/* Input Textarea Card */}
      <Card className="bg-surface">
        <EditorToolbar
          title="Input Text to Hash"
          subtitle={`${new Blob([input]).size} bytes`}
          actions={
            <div className="flex items-center gap-1.5">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setInput('DevVault')}
                className="text-xs h-7 px-2"
              >
                <RefreshCw className="w-3 h-3 mr-1" />
                <span>Reset</span>
              </Button>
              <ClearButton onClear={() => setInput('')} disabled={!input} />
            </div>
          }
        />
        <div className="p-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type or paste text to compute cryptographic hashes in real-time..."
            rows={4}
            className="w-full resize-y rounded-md border border-border bg-surface-elevated p-3 font-mono text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </Card>

      {/* Computed Hash Cards */}
      <div className="space-y-3">
        {result?.digests.map((digest) => {
          const hexOutput = uppercase ? digest.hex.toUpperCase() : digest.hex;
          return (
            <Card key={digest.algorithm} className="p-4 bg-surface space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-foreground">{digest.algorithm}</span>
                  <Badge variant="secondary" className="font-mono text-[10px]">
                    {digest.bitLength} bits
                  </Badge>
                </div>
                <div className="flex items-center gap-1.5">
                  <CopyButton content={hexOutput} label="Copy Hex" />
                  <CopyButton content={digest.base64} label="Copy Base64" />
                </div>
              </div>

              {/* Hex View */}
              <div>
                <span className="text-[11px] font-semibold text-muted-foreground block mb-1">
                  Hex Digest ({hexOutput.length} chars)
                </span>
                <p className="font-mono text-xs text-foreground break-all bg-surface-elevated p-2.5 rounded border border-border selection:bg-primary/20">
                  {hexOutput}
                </p>
              </div>

              {/* Base64 View */}
              <div>
                <span className="text-[11px] font-semibold text-muted-foreground block mb-1">
                  Base64 Digest ({digest.base64.length} chars)
                </span>
                <p className="font-mono text-xs text-muted-foreground break-all bg-surface-elevated/60 p-2 rounded border border-border/80">
                  {digest.base64}
                </p>
              </div>
            </Card>
          );
        })}
      </div>

      <ToolHelpPanel
        title="About Cryptographic Hash Algorithms"
        description="Cryptographic hash functions map data of arbitrary size to a fixed-size bit string. They are deterministic, fast to compute, and computationally infeasible to invert."
        features={[
          'SHA-256: 256-bit hash, universally adopted in TLS/SSL certificates, Bitcoin, and git commit trees.',
          'SHA-384 & SHA-512: Higher security bit margins suited for high-assurance enterprise systems.',
          'High Performance: Powered by your hardware via the native browser Web Cryptography API.',
          'Local execution: zero network latency and no transmission of confidential payloads.',
        ]}
      />
    </div>
  );
};

export default HashGeneratorPage;
