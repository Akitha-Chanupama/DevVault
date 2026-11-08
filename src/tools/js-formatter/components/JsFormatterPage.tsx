import React, { useState, useEffect } from 'react';
import { Code2, Upload, RefreshCw, Wand2 } from 'lucide-react';
import { ToolPageHeader } from '@/components/tool-ui/ToolPageHeader';
import { CopyButton } from '@/components/tool-ui/CopyButton';
import { DownloadButton } from '@/components/tool-ui/DownloadButton';
import { ClearButton } from '@/components/tool-ui/ClearButton';
import { ValidationMessage, ErrorPanel } from '@/components/tool-ui/ValidationMessage';
import { ToolHelpPanel } from '@/components/tool-ui/EmptyState';
import { CodeEditor } from '@/components/editor/CodeEditor';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { formatJs } from '../logic/jsFormatter';
import { JsDialect, JsFormatOptions } from '../types';
import { toast } from 'sonner';

const SAMPLE_JS = `// JavaScript Sample
const devVaultApp = {
  name: 'DevVault',
  version: '1.0.0',
  isPrivate: true,
  tools: ['JSON Formatter', 'CSS Minifier', 'JS Formatter'],
};

async function calculateMetrics(data, factor = 1.5) {
  if (!data || !Array.isArray(data)) {
    throw new Error('Invalid data payload');
  }
  return data
    .map((item, index) => ({ id: index + 1, score: item * factor }))
    .filter((entry) => entry.score > 10);
}`;

const SAMPLE_TS = `// TypeScript Sample
interface UtilityTool<T = string> {
  id: string;
  name: string;
  category: 'Web Development' | 'Security' | 'Generators';
  run: (payload: T) => Promise<boolean>;
}

type ToolStatus = 'available' | 'maintenance' | 'planned';

class ToolRunner implements UtilityTool {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly category: 'Web Development' | 'Security' | 'Generators',
    private status: ToolStatus = 'available'
  ) {}

  public async run(payload: string): Promise<boolean> {
    console.log(\`Executing \${this.name} with \${payload.length} bytes\`);
    return this.status === 'available';
  }
}`;

export const JsFormatterPage: React.FC = () => {
  const [dialect, setDialect] = useState<JsDialect>('javascript');
  const [input, setInput] = useState<string>(SAMPLE_JS);
  const [output, setOutput] = useState<string>('');
  const [tabWidth, setTabWidth] = useState<number>(2);
  const [useTabs, setUseTabs] = useState<boolean>(false);
  const [semi, setSemi] = useState<boolean>(true);
  const [singleQuote, setSingleQuote] = useState<boolean>(true);
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
    const options: JsFormatOptions = {
      dialect,
      tabWidth,
      useTabs,
      semi,
      singleQuote,
      trailingComma: 'es5',
    };

    formatJs(input, options).then((result) => {
      if (isCancelled) return;
      if (result.success) {
        setOutput(result.output);
        setIsValid(true);
        setErrorMessage(null);
      } else {
        setOutput('');
        setIsValid(false);
        setErrorMessage(result.error ?? 'Syntax error during formatting');
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [input, dialect, tabWidth, useTabs, semi, singleQuote]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size exceeds 10MB limit for browser formatting');
      return;
    }

    const isTs = file.name.endsWith('.ts') || file.name.endsWith('.tsx');
    if (isTs) {
      setDialect('typescript');
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
        toolId="js-formatter"
        title="JavaScript & TypeScript Formatter"
        description="Format, standardize, and beautify JavaScript and TypeScript code safely in the browser with customizable styles."
        category="Web Development"
        privacyMode="browser-only"
      />

      {/* Control Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-lg border border-border bg-surface shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          {/* Dialect Selector */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mr-2">
            <span>Language:</span>
            <select
              value={dialect}
              onChange={(e) => setDialect(e.target.value as JsDialect)}
              className="h-8 rounded-md border border-border bg-surface-elevated px-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
            >
              <option value="javascript">JavaScript (ESNext / JSX)</option>
              <option value="typescript">TypeScript (TS / TSX)</option>
            </select>
          </div>

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

          {/* Toggle: Semicolons */}
          <Button
            variant={semi ? 'default' : 'secondary'}
            size="sm"
            onClick={() => setSemi(!semi)}
            className="text-xs h-8 gap-1.5 whitespace-nowrap"
            title="Toggle semicolons"
          >
            {semi ? 'Semicolons: On' : 'Semicolons: Off'}
          </Button>

          {/* Toggle: Quotes */}
          <Button
            variant={singleQuote ? 'default' : 'secondary'}
            size="sm"
            onClick={() => setSingleQuote(!singleQuote)}
            className="text-xs h-8 gap-1.5 whitespace-nowrap"
            title="Toggle single or double quotes"
          >
            {singleQuote ? 'Single Quotes' : 'Double Quotes'}
          </Button>

          {/* Sample Code Button */}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              if (dialect === 'typescript') {
                setInput(SAMPLE_TS);
              } else {
                setInput(SAMPLE_JS);
              }
              toast.success(`Sample ${dialect === 'typescript' ? 'TypeScript' : 'JavaScript'} loaded`);
            }}
            className="text-xs h-8 gap-1.5 whitespace-nowrap"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Sample Code
          </Button>
        </div>

        {/* Right side upload button */}
        <div className="flex items-center gap-2">
          <label
            className={cn(
              buttonVariants({ variant: 'outline', size: 'sm' }),
              'cursor-pointer text-xs h-8 gap-1.5 whitespace-nowrap'
            )}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Code</span>
            <input
              type="file"
              accept=".js,.jsx,.ts,.tsx,.mjs,.cjs"
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
              <Code2 className="w-4 h-4 text-primary" />
              Source {dialect === 'typescript' ? 'TypeScript' : 'JavaScript'}
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
            language={dialect}
            placeholder={`Paste raw, unformatted ${dialect === 'typescript' ? 'TypeScript' : 'JavaScript'} here...`}
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
                <Wand2 className="w-4 h-4 text-primary" />
                Formatted Code
              </span>
              {isValid === true && (
                <ValidationMessage
                  isValid={true}
                  message={`Clean AST Code (${output.split('\n').length} lines)`}
                />
              )}
            </div>
            <div className="flex items-center gap-1.5">
              <CopyButton content={output} />
              <DownloadButton
                content={output}
                filename={dialect === 'typescript' ? 'formatted.ts' : 'formatted.js'}
                mimeType="text/javascript"
              />
            </div>
          </div>

          <CodeEditor
            value={output}
            language={dialect}
            readOnly
            placeholder="Formatted code will appear here..."
            height="460px"
          />
        </div>
      </div>

      {/* Information / Help Section */}
      <ToolHelpPanel
        title="About JavaScript & TypeScript Formatter"
        description="Format, standardize, and beautify JS and TS code using the Babel and TypeScript AST engines via Prettier."
        features={[
          'Pure AST-based parsing and formatting with ZERO code execution (eval-free and safe).',
          'Supports modern ESNext syntax, JSX, TypeScript interfaces, generics, enums, and decorators.',
          'Customizable formatting rules: 2/4 spaces or tab indentation, optional semicolons, and single/double quotes.',
          '100% private and client-side — your proprietary code never leaves your local browser memory.',
        ]}
      />
    </div>
  );
};

export default JsFormatterPage;
