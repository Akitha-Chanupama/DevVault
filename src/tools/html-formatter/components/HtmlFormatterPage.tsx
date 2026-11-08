import React, { useState, useEffect } from 'react';
import { FileCode, Upload, RefreshCw, Wand2 } from 'lucide-react';
import { ToolPageHeader } from '@/components/tool-ui/ToolPageHeader';
import { CopyButton } from '@/components/tool-ui/CopyButton';
import { DownloadButton } from '@/components/tool-ui/DownloadButton';
import { ClearButton } from '@/components/tool-ui/ClearButton';
import { ValidationMessage, ErrorPanel } from '@/components/tool-ui/ValidationMessage';
import { ToolHelpPanel } from '@/components/tool-ui/EmptyState';
import { CodeEditor } from '@/components/editor/CodeEditor';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { formatHtml } from '../logic/htmlFormatter';
import { HtmlFormatOptions } from '../types';
import { toast } from 'sonner';

const SAMPLE_HTML = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>DevVault</title>
<style>body{margin:0;font-family:sans-serif;}</style>
</head>
<body><header class="main-header">
<div class="container"><h1>DevVault HTML Formatter</h1>
<nav><ul><li><a href="#features">Features</a></li><li><a href="#about">About</a></li></ul></nav>
</div></header>
<main><section id="features"><h2>Key Benefits</h2>
<p>Offline formatting with <strong>zero telemetry</strong>.</p>
</section></main>
<footer><p>&copy; 2026 DevVault. Local-first developer platform.</p></footer>
</body></html>`;

export const HtmlFormatterPage: React.FC = () => {
  const [input, setInput] = useState<string>(SAMPLE_HTML);
  const [output, setOutput] = useState<string>('');
  const [tabWidth, setTabWidth] = useState<number>(2);
  const [useTabs, setUseTabs] = useState<boolean>(false);
  const [printWidth, setPrintWidth] = useState<number>(80);
  const [isValid, setIsValid] = useState<boolean | null>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!input.trim()) {
      setOutput('');
      setIsValid(null);
      setErrorMessage(null);
      return;
    }

    let isCancelled = false;
    const options: HtmlFormatOptions = {
      tabWidth,
      useTabs,
      printWidth,
    };

    formatHtml(input, options).then((result) => {
      if (isCancelled) return;
      if (result.success) {
        setOutput(result.formattedHtml);
        setIsValid(true);
        setErrorMessage(null);
      } else {
        setOutput('');
        setIsValid(false);
        setErrorMessage(result.error ?? 'HTML parsing error');
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [input, tabWidth, useTabs, printWidth]);

  const handleFormat = () => {
    if (!input.trim()) return;
    formatHtml(input, { tabWidth, useTabs, printWidth }).then((result) => {
      if (result.success) {
        setOutput(result.formattedHtml);
        setIsValid(true);
        setErrorMessage(null);
        toast.success('HTML formatted');
      } else {
        setIsValid(false);
        setErrorMessage(result.error ?? 'HTML parsing error');
        toast.error('Cannot format invalid HTML');
      }
    });
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
        toolId="html-formatter"
        title="HTML Formatter & Beautifier"
        description="Clean, indent, and format HTML markup safely in the browser using the Prettier AST engine."
        category="Web Development"
        privacyMode="browser-only"
      />

      {/* Control Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-lg border border-border bg-surface shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          {/* Indentation Selector */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mr-2">
            <span>Indentation:</span>
            <select
              value={useTabs ? 'tab' : String(tabWidth)}
              onChange={(e) => {
                if (e.target.value === 'tab') {
                  setUseTabs(true);
                  setTabWidth(2);
                } else {
                  setUseTabs(false);
                  setTabWidth(parseInt(e.target.value, 10));
                }
              }}
              className="h-8 rounded-md border border-border bg-surface-elevated px-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
            >
              <option value="2">2 Spaces</option>
              <option value="4">4 Spaces</option>
              <option value="tab">1 Tab</option>
            </select>
          </div>

          {/* Line Wrap / Print Width */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mr-2">
            <span>Wrap Width:</span>
            <select
              value={printWidth}
              onChange={(e) => setPrintWidth(parseInt(e.target.value, 10))}
              className="h-8 rounded-md border border-border bg-surface-elevated px-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
            >
              <option value={80}>80 Characters</option>
              <option value={100}>100 Characters</option>
              <option value={120}>120 Characters</option>
            </select>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setInput(SAMPLE_HTML);
              toast.success('Sample HTML loaded');
            }}
            className="text-xs h-8 gap-1.5 whitespace-nowrap"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Sample HTML
          </Button>
        </div>

        {/* Right side upload button */}
        <div className="flex items-center gap-2">
          <label
            className={cn(
              buttonVariants({ variant: 'outline', size: 'sm' }),
              'cursor-pointer text-xs h-8 gap-1.5 whitespace-nowrap inline-flex items-center'
            )}
            title="Upload HTML file"
          >
            <Upload className="w-3.5 h-3.5 shrink-0" />
            <span>Upload .html</span>
            <input
              type="file"
              accept=".html,.htm,.xhtml"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Editors Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Input Panel */}
        <div className="space-y-2">
          <div className="flex items-center justify-between pb-1">
            <span className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-1.5">
              <FileCode className="w-4 h-4 text-primary" />
              Source HTML
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {input.length.toLocaleString()} chars
              </span>
              <ClearButton onClear={() => setInput('')} disabled={!input} />
            </div>
          </div>

          <CodeEditor
            value={input}
            onChange={(val) => setInput(val || '')}
            language="html"
            placeholder="Paste raw, unformatted, or minified HTML here... (Press Ctrl+Enter to format)"
            height="460px"
            onExecute={handleFormat}
          />

          {isValid === false && errorMessage && (
            <ErrorPanel error={errorMessage} />
          )}
        </div>

        {/* Output Panel */}
        <div className="space-y-2">
          <div className="flex items-center justify-between pb-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Wand2 className="w-4 h-4 text-primary" />
                Formatted HTML
              </span>
              {isValid === true && (
                <ValidationMessage
                  isValid={true}
                  message={`Clean HTML (${output.split('\n').length} lines)`}
                />
              )}
            </div>
            <div className="flex items-center gap-1.5">
              <CopyButton content={output} />
              <DownloadButton
                content={output}
                filename="formatted.html"
                mimeType="text/html"
              />
            </div>
          </div>

          <CodeEditor
            value={output}
            language="html"
            readOnly
            placeholder="Formatted, indented HTML will appear here..."
            height="460px"
          />
        </div>
      </div>

      {/* Information / Help Section */}
      <ToolHelpPanel
        title="About HTML Formatter & Beautifier"
        description="Format, indent, and standardize nested HTML5 documents without server execution."
        features={[
          'Pure browser-based AST formatting powered by Prettier HTML standalone engine.',
          'Configurable indentation (2 spaces, 4 spaces, or 1 tab) and print wrap limits.',
          'Handles embedded <style> and <script> tags seamlessly within the markup.',
          'Zero data transmission — all parsing runs purely in local memory.',
        ]}
      />
    </div>
  );
};

export default HtmlFormatterPage;
