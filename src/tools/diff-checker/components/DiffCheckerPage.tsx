import React, { useState, useMemo } from 'react';
import {
  GitCompare,
  ArrowRightLeft,
  Columns,
  AlignJustify,
  RefreshCw,
} from 'lucide-react';
import { ToolPageHeader } from '@/components/tool-ui/ToolPageHeader';
import { EditorToolbar } from '@/components/tool-ui/EditorToolbar';
import { CopyButton } from '@/components/tool-ui/CopyButton';
import { ClearButton } from '@/components/tool-ui/ClearButton';
import { ToolHelpPanel } from '@/components/tool-ui/EmptyState';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { computeLineDiff } from '../logic/diffChecker';
import { DiffViewMode } from '../types';

const SAMPLE_ORIGINAL = `function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total += items[i].price;
  }
  return total;
}`;

const SAMPLE_MODIFIED = `function calculateTotal(items, taxRate = 0) {
  const subtotal = items.reduce((acc, item) => acc + item.price, 0);
  const tax = subtotal * taxRate;
  return subtotal + tax;
}`;

export const DiffCheckerPage: React.FC = () => {
  const [original, setOriginal] = useState<string>(SAMPLE_ORIGINAL);
  const [modified, setModified] = useState<string>(SAMPLE_MODIFIED);
  const [viewMode, setViewMode] = useState<DiffViewMode>('split');

  const diffResult = useMemo(
    () => computeLineDiff(original, modified),
    [original, modified]
  );

  const handleSwap = () => {
    const temp = original;
    setOriginal(modified);
    setModified(temp);
  };

  const formattedUnifiedDiff = useMemo(() => {
    return diffResult.lines
      .map((line) => {
        const prefix = line.type === 'added' ? '+ ' : line.type === 'removed' ? '- ' : '  ';
        return `${prefix}${line.value}`;
      })
      .join('\n');
  }, [diffResult]);

  return (
    <div className="space-y-6">
      <ToolPageHeader
        toolId="diff-checker"
        title="Text Diff Checker"
        description="Compare text and code side-by-side or unified with line-level addition, removal, and change highlighting."
        category="Text & Code"
        privacyMode="browser-only"
      />

      {/* Control Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-lg border border-border bg-surface shadow-sm">
        <div className="flex items-center gap-2">
          {/* View mode switcher */}
          <div className="inline-flex rounded-lg border border-border bg-surface-elevated p-0.5">
            <button
              onClick={() => setViewMode('split')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                viewMode === 'split'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Split View</span>
            </button>
            <button
              onClick={() => setViewMode('unified')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                viewMode === 'unified'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <AlignJustify className="w-3.5 h-3.5" />
              <span>Unified View</span>
            </button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleSwap}
            className="text-xs h-8 gap-1.5"
            title="Swap Original and Modified"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Swap Sides</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setOriginal(SAMPLE_ORIGINAL);
              setModified(SAMPLE_MODIFIED);
            }}
            className="text-xs h-8 gap-1 text-muted-foreground hover:text-foreground"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sample</span>
          </Button>
        </div>

        {/* Change Counts Badges */}
        <div className="flex items-center gap-2">
          <Badge variant="success" className="text-xs font-mono">
            +{diffResult.additions} Added
          </Badge>
          <Badge variant="destructive" className="text-xs font-mono">
            -{diffResult.deletions} Removed
          </Badge>
          <CopyButton content={formattedUnifiedDiff} label="Copy Diff" />
        </div>
      </div>

      {/* Inputs (Split Mode Editable) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Original Input */}
        <div className="flex flex-col">
          <EditorToolbar
            title="Original Text"
            subtitle={`${new Blob([original]).size} bytes`}
            actions={<ClearButton onClear={() => setOriginal('')} disabled={!original} />}
          />
          <textarea
            value={original}
            onChange={(e) => setOriginal(e.target.value)}
            placeholder="Paste original text here..."
            rows={8}
            className="w-full resize-y rounded-b-lg border border-border bg-surface p-3 font-mono text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Modified Input */}
        <div className="flex flex-col">
          <EditorToolbar
            title="Modified Text"
            subtitle={`${new Blob([modified]).size} bytes`}
            actions={<ClearButton onClear={() => setModified('')} disabled={!modified} />}
          />
          <textarea
            value={modified}
            onChange={(e) => setModified(e.target.value)}
            placeholder="Paste modified text here..."
            rows={8}
            className="w-full resize-y rounded-b-lg border border-border bg-surface p-3 font-mono text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Visual Diff Output */}
      <Card className="bg-surface overflow-hidden">
        <div className="px-4 py-2.5 border-b border-border bg-surface-elevated text-xs font-semibold text-foreground flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitCompare className="w-4 h-4 text-primary" />
            <span>Diff Representation ({diffResult.lines.length} lines)</span>
          </div>
          <span className="text-[11px] font-normal text-muted-foreground">
            {viewMode === 'split' ? 'Split View' : 'Unified View'}
          </span>
        </div>

        <div className="p-0 overflow-x-auto font-mono text-xs divide-y divide-border/40 max-h-[520px] overflow-y-auto">
          {diffResult.lines.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-xs font-sans">
              No differences detected. Both text inputs are identical or empty.
            </div>
          ) : (
            diffResult.lines.map((line, idx) => {
              if (line.type === 'added') {
                return (
                  <div
                    key={idx}
                    className="flex items-start bg-success/15 hover:bg-success/20 text-foreground transition-colors py-0.5 px-3"
                  >
                    <span className="w-8 shrink-0 text-right pr-3 select-none text-muted-foreground/60"></span>
                    <span className="w-8 shrink-0 text-right pr-3 select-none text-success font-semibold">
                      {line.modifiedLineNumber}
                    </span>
                    <span className="w-4 shrink-0 text-success font-bold select-none">+</span>
                    <span className="flex-1 whitespace-pre-wrap break-all">{line.value}</span>
                  </div>
                );
              }

              if (line.type === 'removed') {
                return (
                  <div
                    key={idx}
                    className="flex items-start bg-destructive/15 hover:bg-destructive/20 text-foreground transition-colors py-0.5 px-3"
                  >
                    <span className="w-8 shrink-0 text-right pr-3 select-none text-destructive font-semibold">
                      {line.originalLineNumber}
                    </span>
                    <span className="w-8 shrink-0 text-right pr-3 select-none text-muted-foreground/60"></span>
                    <span className="w-4 shrink-0 text-destructive font-bold select-none">-</span>
                    <span className="flex-1 whitespace-pre-wrap break-all line-through decoration-destructive/60">
                      {line.value}
                    </span>
                  </div>
                );
              }

              return (
                <div
                  key={idx}
                  className="flex items-start hover:bg-surface-elevated/40 text-foreground/80 py-0.5 px-3"
                >
                  <span className="w-8 shrink-0 text-right pr-3 select-none text-muted-foreground/50">
                    {line.originalLineNumber}
                  </span>
                  <span className="w-8 shrink-0 text-right pr-3 select-none text-muted-foreground/50">
                    {line.modifiedLineNumber}
                  </span>
                  <span className="w-4 shrink-0 text-muted-foreground/40 select-none"> </span>
                  <span className="flex-1 whitespace-pre-wrap break-all">{line.value}</span>
                </div>
              );
            })
          )}
        </div>
      </Card>

      <ToolHelpPanel
        title="About Text Diffing"
        description="Calculates delta changes between two text documents line-by-line using the Longest Common Subsequence (LCS) algorithm."
        features={[
          'Unified & Split Views: switch between side-by-side analysis and compact patch view.',
          'Precise line numbering: maps additions and removals back to source and target lines.',
          'One-click Swap button to reverse original and modified positions instantly.',
          'Zero server calls: diff comparison completes in your browser memory with zero exposure of sensitive code.',
        ]}
      />
    </div>
  );
};

export default DiffCheckerPage;
