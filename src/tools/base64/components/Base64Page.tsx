import React, { useState, useEffect } from 'react';
import { ArrowRightLeft } from 'lucide-react';
import { ToolPageHeader } from '@/components/tool-ui/ToolPageHeader';
import { EditorToolbar } from '@/components/tool-ui/EditorToolbar';
import { CopyButton } from '@/components/tool-ui/CopyButton';
import { DownloadButton } from '@/components/tool-ui/DownloadButton';
import { ClearButton } from '@/components/tool-ui/ClearButton';
import { ErrorPanel } from '@/components/tool-ui/ValidationMessage';
import { ToolHelpPanel } from '@/components/tool-ui/EmptyState';
import { Button } from '@/components/ui/button';
import { processBase64 } from '../logic/base64';
import { Base64Mode, Base64Result } from '../types';

export const Base64Page: React.FC = () => {
  const [mode, setMode] = useState<Base64Mode>('encode');
  const [urlSafe, setUrlSafe] = useState<boolean>(false);
  const [stripPadding, setStripPadding] = useState<boolean>(false);
  const [input, setInput] = useState<string>('Hello from DevVault! 🚀');
  const [result, setResult] = useState<Base64Result>({ success: true, output: '' });

  useEffect(() => {
    setResult(processBase64(input, { mode, urlSafe, stripPadding }));
  }, [input, mode, urlSafe, stripPadding]);

  const handleSwap = () => {
    if (result.output && result.success) {
      setInput(result.output);
      setMode(mode === 'encode' ? 'decode' : 'encode');
    }
  };

  return (
    <div className="space-y-6">
      <ToolPageHeader
        toolId="base64"
        title="Base64 Encoder / Decoder"
        description="Encode and decode text strings with full UTF-8/Unicode support, URL-safe variants, and padding controls."
        category="Security"
        privacyMode="browser-only"
      />

      {/* Mode & Options Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-lg border border-border bg-surface shadow-sm">
        <div className="flex items-center gap-2">
          {/* Mode Switcher */}
          <div className="inline-flex rounded-lg border border-border bg-surface-elevated p-0.5">
            <button
              onClick={() => setMode('encode')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                mode === 'encode'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Encode
            </button>
            <button
              onClick={() => setMode('decode')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                mode === 'decode'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Decode
            </button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleSwap}
            disabled={!result.output || !result.success}
            className="text-xs h-8 gap-1.5"
            title="Swap input and output"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Swap</span>
          </Button>
        </div>

        {/* Options for Encode */}
        {mode === 'encode' && (
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <label className="flex items-center gap-1.5 cursor-pointer hover:text-foreground">
              <input
                type="checkbox"
                checked={urlSafe}
                onChange={(e) => setUrlSafe(e.target.checked)}
                className="rounded border-border text-primary focus:ring-primary h-4 w-4"
              />
              <span>URL-Safe (- and _)</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer hover:text-foreground">
              <input
                type="checkbox"
                checked={stripPadding}
                onChange={(e) => setStripPadding(e.target.checked)}
                className="rounded border-border text-primary focus:ring-primary h-4 w-4"
              />
              <span>Strip Padding (=)</span>
            </label>
          </div>
        )}
      </div>

      {/* Error state */}
      {!result.success && result.error && (
        <ErrorPanel error={result.error} />
      )}

      {/* Dual Panel Editor Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input Panel */}
        <div className="flex flex-col">
          <EditorToolbar
            title={mode === 'encode' ? 'Plaintext Input' : 'Base64 Encoded Input'}
            subtitle={`${new Blob([input]).size} bytes`}
            actions={
              <ClearButton
                onClear={() => setInput('')}
                disabled={!input}
              />
            }
          />
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              mode === 'encode'
                ? 'Type or paste plain text to encode...'
                : 'Paste Base64 string to decode...'
            }
            rows={14}
            className="w-full resize-none rounded-b-lg border border-border bg-surface p-4 font-mono text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Output Panel */}
        <div className="flex flex-col">
          <EditorToolbar
            title={mode === 'encode' ? 'Base64 Output' : 'Decoded Plaintext'}
            subtitle={result.output ? `${new Blob([result.output]).size} bytes` : undefined}
            actions={
              <>
                <CopyButton content={result.output} />
                <DownloadButton
                  content={result.output}
                  filename={mode === 'encode' ? 'encoded.b64' : 'decoded.txt'}
                  mimeType="text/plain"
                  label="Download"
                />
              </>
            }
          />
          <textarea
            value={result.output}
            readOnly
            placeholder="Result will appear here..."
            rows={14}
            className="w-full resize-none rounded-b-lg border border-border bg-surface p-4 font-mono text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
        </div>
      </div>

      <ToolHelpPanel
        title="About Base64 Encoding"
        description="Base64 represents binary data in an ASCII string format by translating it into a radix-64 representation."
        features={[
          'Encodes using full UTF-8 TextEncoder, properly protecting emojis and non-Latin character sets from truncation.',
          'Supports URL-safe Base64 (replacing + with - and / with _) for query parameters and JWT tokens.',
          'Optionally strips padding (=) characters for compact storage.',
          'Client-side execution: no data leaves your browser.',
        ]}
      />
    </div>
  );
};

export default Base64Page;
