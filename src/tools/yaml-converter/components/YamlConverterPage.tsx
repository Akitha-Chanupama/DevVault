import React, { useState, useEffect } from 'react';
import { ArrowRightLeft, RefreshCw } from 'lucide-react';
import { ToolPageHeader } from '@/components/tool-ui/ToolPageHeader';
import { EditorToolbar } from '@/components/tool-ui/EditorToolbar';
import { CopyButton } from '@/components/tool-ui/CopyButton';
import { DownloadButton } from '@/components/tool-ui/DownloadButton';
import { ClearButton } from '@/components/tool-ui/ClearButton';
import { ErrorPanel } from '@/components/tool-ui/ValidationMessage';
import { ToolHelpPanel } from '@/components/tool-ui/EmptyState';
import { CodeEditor } from '@/components/editor/CodeEditor';
import { Button } from '@/components/ui/button';
import { jsonToYaml, yamlToJson } from '../logic/yamlConverter';
import { YamlConvertDirection, YamlConvertResult } from '../types';

const SAMPLE_JSON = `{
  "name": "DevVault",
  "version": "1.0.0",
  "environment": "production",
  "server": {
    "host": "127.0.0.1",
    "port": 8080
  },
  "database": {
    "engine": "postgresql",
    "pool_size": 10
  },
  "features": [
    "local-first",
    "privacy-first",
    "instant-sync"
  ]
}`;

interface YamlConverterPageProps {
  initialDirection?: YamlConvertDirection;
}

export const YamlConverterPage: React.FC<YamlConverterPageProps> = ({
  initialDirection = 'json-to-yaml',
}) => {
  const [direction, setDirection] = useState<YamlConvertDirection>(initialDirection);
  const [input, setInput] = useState<string>(SAMPLE_JSON);
  const [result, setResult] = useState<YamlConvertResult>({ success: true, output: '' });

  useEffect(() => {
    if (direction === 'json-to-yaml') {
      setResult(jsonToYaml(input));
    } else {
      setResult(yamlToJson(input));
    }
  }, [input, direction]);

  const handleSwap = () => {
    if (result.output && result.success) {
      setInput(result.output);
      setDirection(direction === 'json-to-yaml' ? 'yaml-to-json' : 'json-to-yaml');
    }
  };

  const isJsonToYaml = direction === 'json-to-yaml';

  return (
    <div className="space-y-6">
      <ToolPageHeader
        toolId={isJsonToYaml ? 'json-to-yaml' : 'yaml-to-json'}
        title={isJsonToYaml ? 'JSON to YAML Converter' : 'YAML to JSON Converter'}
        description="Convert structured documents bidirectionally between JSON and YAML formats in real-time."
        category="JSON & Data"
        privacyMode="browser-only"
      />

      {/* Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-lg border border-border bg-surface shadow-sm">
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-lg border border-border bg-surface-elevated p-0.5">
            <button
              onClick={() => setDirection('json-to-yaml')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                isJsonToYaml
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              JSON to YAML
            </button>
            <button
              onClick={() => setDirection('yaml-to-json')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                !isJsonToYaml
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              YAML to JSON
            </button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleSwap}
            disabled={!result.output || !result.success}
            className="text-xs h-8 gap-1.5"
            title="Swap input and output direction"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Swap Formats</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setInput(SAMPLE_JSON)}
            className="text-xs h-8 gap-1 text-muted-foreground hover:text-foreground"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sample</span>
          </Button>
        </div>
      </div>

      {/* Error state */}
      {!result.success && result.error && (
        <ErrorPanel error={result.error} />
      )}

      {/* Dual Panel Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input Panel */}
        <div className="flex flex-col">
          <EditorToolbar
            title={isJsonToYaml ? 'Source JSON' : 'Source YAML'}
            subtitle={`${new Blob([input]).size} bytes`}
            actions={<ClearButton onClear={() => setInput('')} disabled={!input} />}
          />
          <CodeEditor
            value={input}
            onChange={(val) => setInput(val)}
            language={isJsonToYaml ? 'json' : 'yaml'}
            placeholder={isJsonToYaml ? 'Paste JSON here...' : 'Paste YAML here...'}
            height="460px"
          />
        </div>

        {/* Output Panel */}
        <div className="flex flex-col">
          <EditorToolbar
            title={isJsonToYaml ? 'Converted YAML' : 'Converted JSON'}
            subtitle={result.output ? `${new Blob([result.output]).size} bytes` : undefined}
            actions={
              <>
                <CopyButton content={result.output} />
                <DownloadButton
                  content={result.output}
                  filename={isJsonToYaml ? 'converted.yaml' : 'converted.json'}
                  mimeType={isJsonToYaml ? 'text/yaml' : 'application/json'}
                  label="Download"
                />
              </>
            }
          />
          <CodeEditor
            value={result.output}
            readOnly={true}
            language={isJsonToYaml ? 'yaml' : 'json'}
            placeholder="Converted output will appear here..."
            height="460px"
          />
        </div>
      </div>

      <ToolHelpPanel
        title="About JSON and YAML Compatibility"
        description="JSON and YAML share many data model structures, but have subtle differences in comments, anchors, and multiline string blocks."
        features={[
          'Safely maps objects, arrays, primitives, and boolean values.',
          'Comments in YAML are omitted when converted to standard JSON (which does not support comments).',
          'Conforms to standard YAML 1.2 and RFC 8259 JSON standards.',
          'Entirely client-side: no documents are posted to remote endpoints.',
        ]}
      />
    </div>
  );
};

export default YamlConverterPage;

