import React, { useState, useEffect } from 'react';
import { SearchCode, RefreshCw } from 'lucide-react';
import { ToolPageHeader } from '@/components/tool-ui/ToolPageHeader';
import { EditorToolbar } from '@/components/tool-ui/EditorToolbar';
import { CopyButton } from '@/components/tool-ui/CopyButton';
import { ClearButton } from '@/components/tool-ui/ClearButton';
import { ErrorPanel } from '@/components/tool-ui/ValidationMessage';
import { ToolHelpPanel } from '@/components/tool-ui/EmptyState';
import { CodeEditor } from '@/components/editor/CodeEditor';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { evaluateJsonPath } from '../logic/jsonpathExplorer';
import { JsonPathResult } from '../types';

const SAMPLE_JSON = `{
  "store": {
    "book": [
      {
        "category": "reference",
        "author": "Nigel Rees",
        "title": "Sayings of the Century",
        "price": 8.95
      },
      {
        "category": "fiction",
        "author": "Evelyn Waugh",
        "title": "Sword of Honour",
        "price": 12.99
      },
      {
        "category": "fiction",
        "author": "Herman Melville",
        "title": "Moby Dick",
        "isbn": "0-553-21311-3",
        "price": 8.99
      }
    ],
    "bicycle": {
      "color": "red",
      "price": 19.95
    }
  }
}`;

export const JsonpathExplorerPage: React.FC = () => {
  const [jsonText, setJsonText] = useState<string>(SAMPLE_JSON);
  const [expression, setExpression] = useState<string>('$.store.book[*].author');
  const [result, setResult] = useState<JsonPathResult>({
    success: true,
    matches: [],
    formattedMatches: '',
  });

  useEffect(() => {
    setResult(evaluateJsonPath(jsonText, expression));
  }, [jsonText, expression]);

  const presetExpressions = [
    { label: 'All Authors', path: '$.store.book[*].author' },
    { label: 'All Prices (Recursive)', path: '$..price' },
    { label: 'All Books', path: '$.store.book[*]' },
    { label: 'First Book', path: '$.store.book[0]' },
  ];

  return (
    <div className="space-y-6">
      <ToolPageHeader
        toolId="jsonpath-explorer"
        title="JSONPath Explorer"
        description="Query, filter, and extract nodes from complex JSON documents using standard JSONPath expressions."
        category="JSON & Data"
        privacyMode="browser-only"
      />

      {/* Query Expression Bar Card */}
      <Card className="p-4 bg-surface space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
            <SearchCode className="w-4 h-4 text-primary" />
            <span>JSONPath Expression</span>
          </label>
          {/* Quick presets */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {presetExpressions.map((p) => (
              <Button
                key={p.path}
                variant="secondary"
                size="sm"
                onClick={() => setExpression(p.path)}
                className="text-[11px] h-6 px-2"
              >
                {p.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <Input
            value={expression}
            onChange={(e) => setExpression(e.target.value)}
            placeholder="e.g. $.store.book[*].author or $..price"
            className="font-mono text-xs"
          />
          <CopyButton content={expression} label="Copy Query" />
        </div>
      </Card>

      {/* Error state */}
      {!result.success && result.error && (
        <ErrorPanel error={result.error} />
      )}

      {/* Dual Panel Editor Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Source JSON Panel */}
        <div className="flex flex-col">
          <EditorToolbar
            title="JSON Source"
            subtitle={`${new Blob([jsonText]).size} bytes`}
            actions={
              <div className="flex items-center gap-1.5">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setJsonText(SAMPLE_JSON)}
                  className="text-xs h-7 px-2"
                >
                  <RefreshCw className="w-3.5 h-3.5 shrink-0" />
                  <span>Sample</span>
                </Button>
                <ClearButton onClear={() => setJsonText('')} disabled={!jsonText} />
              </div>
            }
          />
          <CodeEditor
            value={jsonText}
            onChange={(val) => setJsonText(val)}
            language="json"
            placeholder="Paste JSON source document..."
            height="460px"
          />
        </div>

        {/* Evaluation Output Panel */}
        <div className="flex flex-col">
          <EditorToolbar
            title={`Matches (${result.matches.length})`}
            subtitle={result.formattedMatches ? `${result.matches.length} elements extracted` : undefined}
            actions={<CopyButton content={result.formattedMatches} label="Copy Results" />}
          />
          <CodeEditor
            value={result.formattedMatches}
            readOnly={true}
            language="json"
            placeholder="Query results will appear here as JSON..."
            height="460px"
          />
        </div>
      </div>

      <ToolHelpPanel
        title="About JSONPath Syntax"
        description="JSONPath is the query language for JSON, similar to XPath for XML."
        features={[
          '$: Refers to the root object or element.',
          '. or []: Child operator (e.g. $.store or $[store]).',
          '..: Recursive descent to search all levels (e.g. $..author).',
          '*: Wildcard matching all elements or properties.',
          'Client-side evaluation: instantaneous queries without network requests.',
        ]}
      />
    </div>
  );
};

export default JsonpathExplorerPage;
