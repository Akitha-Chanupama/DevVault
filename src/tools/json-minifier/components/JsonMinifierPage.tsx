import React, { useState, useEffect } from 'react';
import { TrendingDown, RefreshCw } from 'lucide-react';
import { ToolPageHeader } from '@/components/tool-ui/ToolPageHeader';
import { EditorToolbar } from '@/components/tool-ui/EditorToolbar';
import { CopyButton } from '@/components/tool-ui/CopyButton';
import { DownloadButton } from '@/components/tool-ui/DownloadButton';
import { ClearButton } from '@/components/tool-ui/ClearButton';
import { ErrorPanel } from '@/components/tool-ui/ValidationMessage';
import { ToolHelpPanel } from '@/components/tool-ui/EmptyState';
import { CodeEditor } from '@/components/editor/CodeEditor';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { executeJsonMinify } from '../logic/jsonMinifier';
import { MinifyResult } from '../types';

const SAMPLE_JSON = `{
  "api": "DevVault JSON Minifier",
  "version": "1.0.0",
  "features": [
    "Whitespace removal",
    "Linebreak removal",
    "String literal preservation"
  ],
  "author": {
    "role": "Developer",
    "status": "Active"
  }
}`;

export const JsonMinifierPage: React.FC = () => {
  const [input, setInput] = useState<string>(SAMPLE_JSON);
  const [result, setResult] = useState<MinifyResult>({ success: true, minified: '' });

  useEffect(() => {
    setResult(executeJsonMinify(input));
  }, [input]);

  return (
    <div className="space-y-6">
      <ToolPageHeader
        toolId="json-minifier"
        title="JSON Minifier"
        description="Compress and compact JSON data by stripping unnecessary whitespace and line breaks while preserving data integrity."
        category="JSON & Data"
        privacyMode="browser-only"
      />

      {/* Compression Statistics Banner */}
      {result.success && result.stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Card className="p-3 bg-surface">
            <div className="text-[11px] text-muted-foreground mb-1">Original Size</div>
            <div className="text-base font-bold text-foreground">
              {result.stats.originalBytes} B
            </div>
          </Card>

          <Card className="p-3 bg-surface">
            <div className="text-[11px] text-muted-foreground mb-1">Minified Size</div>
            <div className="text-base font-bold text-foreground">
              {result.stats.minifiedBytes} B
            </div>
          </Card>

          <Card className="p-3 bg-surface">
            <div className="text-[11px] text-muted-foreground mb-1">Bytes Saved</div>
            <div className="text-base font-bold text-success">
              -{result.stats.savingsBytes} B
            </div>
          </Card>

          <Card className="p-3 bg-surface">
            <div className="text-[11px] text-muted-foreground flex items-center gap-1 mb-1">
              <TrendingDown className="w-3 h-3 text-primary" />
              <span>Reduction</span>
            </div>
            <div className="text-base font-bold text-primary">
              {result.stats.savingsPercent}%
            </div>
          </Card>
        </div>
      )}

      {/* Error state */}
      {!result.success && result.error && (
        <ErrorPanel
          error={result.error.message}
          line={result.error.line}
          column={result.error.column}
        />
      )}

      {/* Dual Panel Editor Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input Panel */}
        <div className="flex flex-col">
          <EditorToolbar
            title="Formatted JSON Input"
            subtitle={`${new Blob([input]).size} bytes`}
            actions={
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setInput(SAMPLE_JSON)}
                  className="text-xs h-7 px-2"
                >
                  <RefreshCw className="w-3 h-3 mr-1" />
                  <span>Sample</span>
                </Button>
                <ClearButton onClear={() => setInput('')} disabled={!input} />
              </div>
            }
          />
          <CodeEditor
            value={input}
            onChange={(val) => setInput(val)}
            language="json"
            placeholder="Paste JSON to minify..."
            height="460px"
          />
        </div>

        {/* Output Panel */}
        <div className="flex flex-col">
          <EditorToolbar
            title="Minified Result"
            subtitle={result.minified ? `${new Blob([result.minified]).size} bytes` : undefined}
            actions={
              <>
                <CopyButton content={result.minified} />
                <DownloadButton
                  content={result.minified}
                  filename="minified.json"
                  mimeType="application/json"
                  label="Download"
                />
              </>
            }
          />
          <CodeEditor
            value={result.minified}
            readOnly={true}
            language="json"
            placeholder="Minified JSON will appear here..."
            height="460px"
          />
        </div>
      </div>

      <ToolHelpPanel
        title="About JSON Minification"
        description="Minifying JSON eliminates superfluous whitespace, indentation tabs, and carriage returns to produce the smallest valid byte payload."
        features={[
          'Reduces network transfer size for APIs, config payloads, and databases.',
          'Strict compliance: verifies valid JSON before minifying to avoid generating corrupt payloads.',
          'Safe string handling: characters inside strings (including spaces and escaped newlines) are strictly preserved.',
        ]}
      />
    </div>
  );
};

export default JsonMinifierPage;
