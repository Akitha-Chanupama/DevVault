import React, { useState, useEffect } from 'react';
import { Palette, Upload, RefreshCw, Wand2, Minimize2, CheckCircle2 } from 'lucide-react';
import { ToolPageHeader } from '@/components/tool-ui/ToolPageHeader';
import { CopyButton } from '@/components/tool-ui/CopyButton';
import { DownloadButton } from '@/components/tool-ui/DownloadButton';
import { ClearButton } from '@/components/tool-ui/ClearButton';
import { ValidationMessage, ErrorPanel } from '@/components/tool-ui/ValidationMessage';
import { ToolHelpPanel } from '@/components/tool-ui/EmptyState';
import { CodeEditor } from '@/components/editor/CodeEditor';
import { Button, buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { formatCss, minifyCss } from '../logic/cssFormatter';
import { CssFormatOptions, CssMinifyResult } from '../types';
import { toast } from 'sonner';

const SAMPLE_CSS = `/* DevVault Theme Definition */
:root {
  --primary-color: #2563eb;
  --background: #090d16;
  --surface: #141b2a;
  --border-radius: 8px;
}

.developer-card {
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  background-color: var(--surface);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--border-radius);
  transition: transform 0.2s ease-in-out;
}

.developer-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
}

@media (max-width: 768px) {
  .developer-card {
    padding: 1rem;
  }
}`;

export const CssFormatterPage: React.FC = () => {
  const [input, setInput] = useState<string>(SAMPLE_CSS);
  const [output, setOutput] = useState<string>('');
  const [tabWidth, setTabWidth] = useState<number>(2);
  const [useTabs, setUseTabs] = useState<boolean>(false);
  const [isMinified, setIsMinified] = useState<boolean>(false);
  const [minifyStats, setMinifyStats] = useState<CssMinifyResult | null>(null);
  const [isValid, setIsValid] = useState<boolean | null>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const runFormat = (cssInput: string) => {
    if (!cssInput.trim()) {
      setOutput('');
      setIsValid(null);
      setErrorMessage(null);
      setMinifyStats(null);
      return;
    }

    const options: CssFormatOptions = {
      tabWidth,
      useTabs,
    };

    formatCss(cssInput, options).then((result) => {
      if (result.success) {
        setOutput(result.output);
        setIsValid(true);
        setErrorMessage(null);
        setIsMinified(false);
        setMinifyStats(null);
      } else {
        setOutput('');
        setIsValid(false);
        setErrorMessage(result.error ?? 'CSS parsing error');
      }
    });
  };

  useEffect(() => {
    if (!isMinified) {
      runFormat(input);
    }
  }, [input, tabWidth, useTabs]);

  const handleMinify = () => {
    if (!input.trim()) return;
    const stats = minifyCss(input);
    if (stats.success) {
      setOutput(stats.output);
      setIsMinified(true);
      setMinifyStats(stats);
      setIsValid(true);
      setErrorMessage(null);
      toast.success(`Minified: Saved ${stats.savingsPercent}% (${(stats.originalSize - stats.minifiedSize).toLocaleString()} bytes)`);
    } else {
      toast.error('Failed to minify CSS');
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
      setIsMinified(false);
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
        toolId="css-formatter"
        title="CSS Formatter & Minifier"
        description="Format, beautify, and minify modern CSS and SCSS stylesheets with customizable indentation and instant compression."
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

          {/* Action: Format */}
          <Button
            variant={!isMinified ? 'default' : 'secondary'}
            size="sm"
            onClick={() => runFormat(input)}
            className="text-xs h-8 gap-1.5 whitespace-nowrap"
          >
            <Wand2 className="w-3.5 h-3.5" />
            Format CSS
          </Button>

          {/* Action: Minify */}
          <Button
            variant={isMinified ? 'default' : 'secondary'}
            size="sm"
            onClick={handleMinify}
            className="text-xs h-8 gap-1.5 whitespace-nowrap"
          >
            <Minimize2 className="w-3.5 h-3.5" />
            Minify CSS
          </Button>

          {/* Sample CSS */}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setInput(SAMPLE_CSS);
              setIsMinified(false);
              toast.success('Sample CSS loaded');
            }}
            className="text-xs h-8 gap-1.5 whitespace-nowrap"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Sample CSS
          </Button>
        </div>

        {/* Right side upload button & Minify stats badge */}
        <div className="flex items-center gap-2">
          {minifyStats && (
            <Badge variant="success" className="text-xs h-8 px-2.5 gap-1.5 font-mono whitespace-nowrap">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Saved {minifyStats.savingsPercent}% ({(minifyStats.originalSize - minifyStats.minifiedSize).toLocaleString()} B)
            </Badge>
          )}

          <label
            className={cn(
              buttonVariants({ variant: 'outline', size: 'sm' }),
              'cursor-pointer text-xs h-8 gap-1.5 whitespace-nowrap'
            )}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload .css</span>
            <input
              type="file"
              accept=".css,.scss,.less"
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
              <Palette className="w-4 h-4 text-primary" />
              Source CSS
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
            onChange={(val) => {
              setInput(val || '');
              setIsMinified(false);
            }}
            language="css"
            placeholder="Paste raw, unformatted, or minified CSS/SCSS here..."
            height="460px"
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
                {isMinified ? <Minimize2 className="w-4 h-4 text-primary" /> : <Wand2 className="w-4 h-4 text-primary" />}
                {isMinified ? 'Minified CSS' : 'Formatted CSS'}
              </span>
              {isValid === true && (
                <ValidationMessage
                  isValid={true}
                  message={isMinified ? 'Minified CSS' : `Clean CSS (${output.split('\n').length} lines)`}
                />
              )}
            </div>
            <div className="flex items-center gap-1.5">
              <CopyButton content={output} />
              <DownloadButton
                content={output}
                filename={isMinified ? 'styles.min.css' : 'styles.css'}
                mimeType="text/css"
              />
            </div>
          </div>

          <CodeEditor
            value={output}
            language="css"
            readOnly
            placeholder="Formatted or minified CSS will appear here..."
            height="460px"
          />
        </div>
      </div>

      {/* Information / Help Section */}
      <ToolHelpPanel
        title="About CSS Formatter & Minifier"
        description="Format, standardize, and compress cascading stylesheets using PostCSS and Prettier AST parsing."
        features={[
          'AST-based formatting powered by Prettier PostCSS engine supporting CSS3, media queries, and nested rules.',
          'Instant CSS minification stripping comments, redundant spaces, and trailing semicolons with byte metrics.',
          'Customizable indentation (2 spaces, 4 spaces, or 1 tab) and single/double quote normalization.',
          '100% private and offline — executes entirely in browser memory with zero network calls.',
        ]}
      />
    </div>
  );
};

export default CssFormatterPage;
