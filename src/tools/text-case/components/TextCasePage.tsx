import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { ToolPageHeader } from '@/components/tool-ui/ToolPageHeader';
import { EditorToolbar } from '@/components/tool-ui/EditorToolbar';
import { CopyButton } from '@/components/tool-ui/CopyButton';
import { ClearButton } from '@/components/tool-ui/ClearButton';
import { ToolHelpPanel } from '@/components/tool-ui/EmptyState';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { convertToAllCases } from '../logic/textCase';

const SAMPLE_TEXT = 'DevVault developer productivity platform';

export const TextCasePage: React.FC = () => {
  const [input, setInput] = useState<string>(SAMPLE_TEXT);
  const cases = convertToAllCases(input);

  return (
    <div className="space-y-6">
      <ToolPageHeader
        toolId="text-case"
        title="Text Case Converter"
        description="Convert string values simultaneously across camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE, and more."
        category="Text & Code"
        privacyMode="browser-only"
      />

      {/* Input Card */}
      <Card className="bg-surface">
        <EditorToolbar
          title="Input Text"
          subtitle={`${input.length} characters, ${input.trim() ? input.trim().split(/\s+/).length : 0} words`}
          actions={
            <div className="flex items-center gap-1.5">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setInput(SAMPLE_TEXT)}
                className="text-xs h-7 px-2"
              >
                <RefreshCw className="w-3.5 h-3.5 shrink-0" />
                <span>Sample</span>
              </Button>
              <ClearButton onClear={() => setInput('')} disabled={!input} />
            </div>
          }
        />
        <div className="p-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type or paste any text or code identifier to transform..."
            rows={3}
            className="w-full resize-y rounded-md border border-border bg-surface-elevated p-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </Card>

      {/* Converted Cases Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cases.map((item) => (
          <Card key={item.type} className="p-4 bg-surface space-y-2 hover:border-primary/40 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-xs text-foreground block font-mono">
                  {item.type}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  {item.description}
                </span>
              </div>
              <CopyButton content={item.value} label="Copy" />
            </div>

            <div className="p-2.5 rounded bg-surface-elevated border border-border min-h-[42px] flex items-center">
              <span className="font-mono text-xs text-foreground break-all select-all">
                {item.value || <span className="text-muted-foreground italic">None</span>}
              </span>
            </div>
          </Card>
        ))}
      </div>

      <ToolHelpPanel
        title="About Text Case Conversions"
        description="Standardizes variable naming conventions across languages and frameworks (JavaScript, Python, Rust, CSS, SQL, etc.)."
        features={[
          'Intelligent token splitting: correctly parses camelCase, snake_case, and acronyms (e.g. JSONParser).',
          'Simultaneous live conversion: generates all 9 target formats as you type.',
          'One-click clipboard copy for immediate pasting into your code editor or terminal.',
          'Handles punctuation, underscores, and variable whitespace gracefully.',
        ]}
      />
    </div>
  );
};

export default TextCasePage;
