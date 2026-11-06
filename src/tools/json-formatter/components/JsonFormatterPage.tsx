import React, { useState, useEffect, useTransition } from 'react';
import {
  Minimize2,
  CheckCircle2,
  ArrowUpDown,
  Upload,
  RefreshCw,
} from 'lucide-react';
import { ToolPageHeader } from '@/components/tool-ui/ToolPageHeader';
import { EditorToolbar } from '@/components/tool-ui/EditorToolbar';
import { CopyButton } from '@/components/tool-ui/CopyButton';
import { DownloadButton } from '@/components/tool-ui/DownloadButton';
import { ClearButton } from '@/components/tool-ui/ClearButton';
import { ValidationMessage, ErrorPanel } from '@/components/tool-ui/ValidationMessage';
import { ToolHelpPanel } from '@/components/tool-ui/EmptyState';
import { CodeEditor } from '@/components/editor/CodeEditor';
import { Button } from '@/components/ui/button';
import { formatJson, minifyJson, validateJson } from '../logic/jsonFormatter';
import { IndentOption, ParseErrorDetail } from '../types';
import { toast } from 'sonner';

const SAMPLE_JSON = `{
  "app": "DevVault",
  "version": "1.0.0",
  "privacy": "local-first",
  "features": [
    "JSON Formatter & Validator",
    "Zero data leakage",
    "Offline capable",
    "High performance"
  ],
  "settings": {
    "theme": "system",
    "editor": {
      "tabSize": 2,
      "wordWrap": true
    }
  }
}`;

export const JsonFormatterPage: React.FC = () => {
  const [input, setInput] = useState<string>(SAMPLE_JSON);
  const [output, setOutput] = useState<string>('');
  const [indent, setIndent] = useState<IndentOption>('2');
  const [sortKeys, setSortKeys] = useState<boolean>(false);
  const [isValid, setIsValid] = useState<boolean | null>(true);
  const [errorDetail, setErrorDetail] = useState<ParseErrorDetail | null>(null);
  const [, startTransition] = useTransition();

  // Run format on mount & whenever input / options change
  useEffect(() => {
    if (!input.trim()) {
      setOutput('');
      setIsValid(null);
      setErrorDetail(null);
      return;
    }

    startTransition(() => {
      const result = formatJson(input, { indent, sortKeys });
      if (result.success) {
        setOutput(result.output);
        setIsValid(true);
        setErrorDetail(null);
      } else {
        setOutput('');
        setIsValid(false);
        setErrorDetail(result.error ?? null);
      }
    });
  }, [input, indent, sortKeys]);

  const handleMinify = () => {
    if (!input.trim()) return;
    const result = minifyJson(input);
    if (result.success) {
      setOutput(result.output);
      setIsValid(true);
      setErrorDetail(null);
      toast.success('JSON minified successfully');
    } else {
      setIsValid(false);
      setErrorDetail(result.error ?? null);
      toast.error('Cannot minify invalid JSON');
    }
  };

  const handleValidateOnly = () => {
    if (!input.trim()) {
      toast.info('Please enter JSON text to validate');
      return;
    }
    const result = validateJson(input);
    if (result.success) {
      setIsValid(true);
      setErrorDetail(null);
      toast.success('JSON syntax is valid');
    } else {
      setIsValid(false);
      setErrorDetail(result.error ?? null);
      toast.error('JSON syntax contains errors');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size exceeds 10MB limit for browser formatting');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setInput(content);
      toast.success(`Loaded ${file.name}`);
    };
    reader.onerror = () => {
      toast.error('Failed to read file');
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      <ToolPageHeader
        toolId="json-formatter"
        title="JSON Formatter & Beautifier"
        description="Format, validate, beautify, and inspect JSON payloads locally with customizable indentation and key sorting."
        category="JSON & Data"
        privacyMode="browser-only"
      />

      {/* Control Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-lg border border-border bg-surface shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          {/* Indentation Selector */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mr-2">
            <span>Indentation:</span>
            <select
              value={indent}
              onChange={(e) => setIndent(e.target.value as IndentOption)}
              className="h-8 rounded-md border border-border bg-surface-elevated px-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="2">2 Spaces</option>
              <option value="4">4 Spaces</option>
              <option value="tab">1 Tab</option>
            </select>
          </div>

          {/* Sort Keys Toggle */}
          <Button
            variant={sortKeys ? 'default' : 'secondary'}
            size="sm"
            onClick={() => setSortKeys(!sortKeys)}
            className="text-xs h-8 gap-1.5"
            title="Sort object keys alphabetically"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>Sort Keys</span>
          </Button>

          {/* Minify Action */}
          <Button
            variant="secondary"
            size="sm"
            onClick={handleMinify}
            className="text-xs h-8 gap-1.5"
            title="Remove whitespace and compact"
          >
            <Minimize2 className="w-3.5 h-3.5" />
            <span>Minify</span>
          </Button>

          {/* Validate Action */}
          <Button
            variant="secondary"
            size="sm"
            onClick={handleValidateOnly}
            className="text-xs h-8 gap-1.5"
            title="Check JSON syntax validity"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Validate</span>
          </Button>
        </div>

        <div className="flex items-center gap-2">
          {/* File Upload Button */}
          <label className="cursor-pointer">
            <input
              type="file"
              accept=".json,application/json,text/plain"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button
              variant="outline"
              size="sm"
              asChild
              className="text-xs h-8 gap-1.5 cursor-pointer pointer-events-none"
            >
              <span>
                <Upload className="w-3.5 h-3.5" />
                <span>Upload .json</span>
              </span>
            </Button>
          </label>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setInput(SAMPLE_JSON)}
            className="text-xs h-8 text-muted-foreground hover:text-foreground"
            title="Load sample JSON"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1" />
            <span>Sample</span>
          </Button>
        </div>
      </div>

      {/* Error / Validation Feedback */}
      {errorDetail && (
        <ErrorPanel
          error={errorDetail.message}
          line={errorDetail.line}
          column={errorDetail.column}
        />
      )}

      {isValid === true && (
        <ValidationMessage isValid={true} message="Valid JSON syntax" />
      )}

      {/* Dual Panel Editor Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input Panel */}
        <div className="flex flex-col">
          <EditorToolbar
            title="Input JSON"
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
            placeholder="Paste or type raw JSON here..."
            height="460px"
          />
        </div>

        {/* Output Panel */}
        <div className="flex flex-col">
          <EditorToolbar
            title="Formatted Output"
            subtitle={output ? `${new Blob([output]).size} bytes` : undefined}
            actions={
              <>
                <CopyButton content={output} />
                <DownloadButton
                  content={output}
                  filename="formatted.json"
                  mimeType="application/json"
                  label="Download"
                />
              </>
            }
          />
          <CodeEditor
            value={output}
            readOnly={true}
            language="json"
            placeholder="Formatted output will appear here..."
            height="460px"
          />
        </div>
      </div>

      {/* Help & Documentation Panel */}
      <ToolHelpPanel
        title="About JSON Formatter & Validator"
        description="This utility parses and standardizes JavaScript Object Notation (JSON) structures using native browser APIs for high speed and complete data privacy."
        features={[
          'Indentation formatting with 2 spaces, 4 spaces, or hard tabs.',
          'Alphabetical object key sorting (preserves array ordering without changes).',
          'Whitespace minification for reducing payload bandwidth.',
          'Pinpointed syntax diagnostics with exact line and column numbers.',
          'Local file upload and instant export of .json files.',
        ]}
        tips={[
          'JSON strings must use double quotes (") for keys and string values.',
          'Trailing commas after the last property or array element are invalid in standard JSON.',
          'All operations run 100% inside your browser session — no tokens or data are ever transmitted to any remote server.',
        ]}
      />
    </div>
  );
};

export default JsonFormatterPage;
