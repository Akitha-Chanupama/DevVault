import React, { useState, useEffect } from 'react';
import {
  FileCode,
  Layers,
  Hash,
  Database,
  RefreshCw,
} from 'lucide-react';
import { ToolPageHeader } from '@/components/tool-ui/ToolPageHeader';
import { EditorToolbar } from '@/components/tool-ui/EditorToolbar';
import { ClearButton } from '@/components/tool-ui/ClearButton';
import { ErrorPanel, ValidationMessage } from '@/components/tool-ui/ValidationMessage';
import { ToolHelpPanel } from '@/components/tool-ui/EmptyState';
import { CodeEditor } from '@/components/editor/CodeEditor';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { validateJsonContent } from '../logic/jsonValidator';
import { JsonValidationResult } from '../types';

const SAMPLE_VALID_JSON = `{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Config",
  "port": 8080,
  "debug": true,
  "database": {
    "host": "localhost",
    "port": 5432,
    "ssl": false
  },
  "tags": ["production", "api", "v1"]
}`;

export const JsonValidatorPage: React.FC = () => {
  const [input, setInput] = useState<string>(SAMPLE_VALID_JSON);
  const [result, setResult] = useState<JsonValidationResult>({ isValid: true });

  useEffect(() => {
    setResult(validateJsonContent(input));
  }, [input]);

  return (
    <div className="space-y-6">
      <ToolPageHeader
        toolId="json-validator"
        title="JSON Validator"
        description="Validate JSON syntax and structure with deep diagnostics, structural metrics, and line-level error detection."
        category="JSON & Data"
        privacyMode="browser-only"
      />

      {/* Validation status badge banner */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {result.isValid ? (
          <ValidationMessage isValid={true} message="Valid JSON syntax: Payload conforms to RFC 8259 specifications" />
        ) : (
          <ValidationMessage isValid={false} message={result.error?.message || 'Syntax error detected'} />
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={() => setInput(SAMPLE_VALID_JSON)}
          className="text-xs h-8 gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Load Valid Sample</span>
        </Button>
      </div>

      {/* Error Details if invalid */}
      {!result.isValid && result.error && (
        <ErrorPanel
          error={result.error.message}
          line={result.error.line}
          column={result.error.column}
        />
      )}

      {/* Metrics Grid if valid */}
      {result.isValid && result.metrics && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          <Card className="p-3 bg-surface">
            <div className="text-[11px] text-muted-foreground flex items-center gap-1 mb-1">
              <Database className="w-3 h-3 text-primary" />
              <span>Root Type</span>
            </div>
            <div className="text-base font-bold text-foreground capitalize">
              {result.metrics.rootType}
            </div>
          </Card>

          <Card className="p-3 bg-surface">
            <div className="text-[11px] text-muted-foreground flex items-center gap-1 mb-1">
              <Layers className="w-3 h-3 text-secondary" />
              <span>Nesting Depth</span>
            </div>
            <div className="text-base font-bold text-foreground">
              {result.metrics.depth} levels
            </div>
          </Card>

          <Card className="p-3 bg-surface">
            <div className="text-[11px] text-muted-foreground flex items-center gap-1 mb-1">
              <Hash className="w-3 h-3 text-success" />
              <span>Object Keys</span>
            </div>
            <div className="text-base font-bold text-foreground">
              {result.metrics.keysCount}
            </div>
          </Card>

          <Card className="p-3 bg-surface">
            <div className="text-[11px] text-muted-foreground flex items-center gap-1 mb-1">
              <FileCode className="w-3 h-3 text-warning" />
              <span>Array Items</span>
            </div>
            <div className="text-base font-bold text-foreground">
              {result.metrics.arrayItemCount}
            </div>
          </Card>

          <Card className="p-3 bg-surface">
            <div className="text-[11px] text-muted-foreground flex items-center gap-1 mb-1">
              <Hash className="w-3 h-3 text-primary" />
              <span>Lines</span>
            </div>
            <div className="text-base font-bold text-foreground">
              {result.metrics.lineCount}
            </div>
          </Card>

          <Card className="p-3 bg-surface">
            <div className="text-[11px] text-muted-foreground flex items-center gap-1 mb-1">
              <Database className="w-3 h-3 text-secondary" />
              <span>Byte Size</span>
            </div>
            <div className="text-base font-bold text-foreground">
              {result.metrics.byteSize} B
            </div>
          </Card>
        </div>
      )}

      {/* Editor Panel */}
      <div className="flex flex-col">
        <EditorToolbar
          title="JSON Document to Validate"
          subtitle={`${new Blob([input]).size} bytes`}
          actions={
            <ClearButton
              onClear={() => setInput('')}
              disabled={!input}
            />
          }
        />
        <CodeEditor
          value={input}
          onChange={(val) => setInput(val)}
          language="json"
          height="480px"
        />
      </div>

      <ToolHelpPanel
        title="About JSON Validation"
        description="The JSON Validator verifies syntax compliance according to the strict ECMA-404 / RFC 8259 JSON standards."
        features={[
          'Instant real-time syntax checking as you type.',
          'Precise line and column error diagnostics.',
          'Structural metrics including nesting depth and key counts.',
          'Zero network transmission: all parsing is conducted in your local browser sandbox.',
        ]}
      />
    </div>
  );
};

export default JsonValidatorPage;
