import React, { useState } from 'react';
import { Plus, Trash2, RefreshCw } from 'lucide-react';
import { ToolPageHeader } from '@/components/tool-ui/ToolPageHeader';
import { EditorToolbar } from '@/components/tool-ui/EditorToolbar';
import { CopyButton } from '@/components/tool-ui/CopyButton';
import { DownloadButton } from '@/components/tool-ui/DownloadButton';
import { ToolHelpPanel } from '@/components/tool-ui/EmptyState';
import { CodeEditor } from '@/components/editor/CodeEditor';
import { Button } from '@/components/ui/button';
import { SchemaField, FieldDataType } from '../types';
import { generateSyntheticJson } from '../logic/randomJson';

const FIELD_TYPES: Array<{ type: FieldDataType; label: string }> = [
  { type: 'uuid', label: 'UUID (v4)' },
  { type: 'id', label: 'Sequence ID (1, 2, ...)' },
  { type: 'fullName', label: 'Full Name' },
  { type: 'email', label: 'Email Address' },
  { type: 'role', label: 'User Role' },
  { type: 'status', label: 'Status' },
  { type: 'number', label: 'Number (100-999)' },
  { type: 'boolean', label: 'Boolean (true/false)' },
  { type: 'isoDate', label: 'ISO 8601 Timestamp' },
  { type: 'country', label: 'Country' },
];

const INITIAL_FIELDS: SchemaField[] = [
  { id: '1', name: 'id', type: 'uuid' },
  { id: '2', name: 'name', type: 'fullName' },
  { id: '3', name: 'email', type: 'email' },
  { id: '4', name: 'role', type: 'role' },
  { id: '5', name: 'active', type: 'boolean' },
];

export const RandomJsonPage: React.FC = () => {
  const [fields, setFields] = useState<SchemaField[]>(INITIAL_FIELDS);
  const [count, setCount] = useState<number>(5);
  const [jsonOutput, setJsonOutput] = useState<string>(() =>
    generateSyntheticJson({ count: 5, fields: INITIAL_FIELDS })
  );

  const handleGenerate = () => {
    setJsonOutput(generateSyntheticJson({ count, fields }));
  };

  const addField = () => {
    setFields((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substring(7),
        name: `field_${prev.length + 1}`,
        type: 'fullName',
      },
    ]);
  };

  const updateField = (id: string, updates: Partial<SchemaField>) => {
    setFields((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...updates } : f))
    );
  };

  const removeField = (id: string) => {
    setFields((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <ToolPageHeader
        toolId="random-json"
        title="Random JSON Data Generator"
        description="Generate privacy-preserving mock JSON datasets and fixtures for development and testing entirely in your browser."
        category="Generators"
        privacyMode="browser-only"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Schema Builder Column */}
        <div className="lg:col-span-5 bg-card border rounded-lg p-5 shadow-sm space-y-5 flex flex-col">
          <div className="flex items-center justify-between border-b pb-3">
            <span className="text-sm font-semibold">Schema Definition</span>
            <Button size="sm" variant="outline" onClick={addField} className="h-7 text-xs gap-1">
              <Plus className="w-3.5 h-3.5" /> Add Field
            </Button>
          </div>

          {/* Fields list */}
          <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[360px] pr-1">
            {fields.map((field) => (
              <div key={field.id} className="flex items-center gap-2">
                <input
                  type="text"
                  value={field.name}
                  onChange={(e) => updateField(field.id, { name: e.target.value })}
                  placeholder="Key name"
                  className="w-1/2 h-8 px-2.5 font-mono text-xs bg-surface text-foreground border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <select
                  value={field.type}
                  onChange={(e) => updateField(field.id, { type: e.target.value as FieldDataType })}
                  className="w-1/2 h-8 px-2 text-xs bg-surface text-foreground border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                >
                  {FIELD_TYPES.map((t) => (
                    <option key={t.type} value={t.type} className="bg-surface text-foreground">
                      {t.label}
                    </option>
                  ))}
                </select>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => removeField(field.id)}
                  disabled={fields.length <= 1}
                  className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            ))}
          </div>

          {/* Options & Action */}
          <div className="pt-3 border-t space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-muted-foreground">Record Count (1 - 100):</label>
              <input
                type="number"
                min={1}
                max={100}
                value={count}
                onChange={(e) => setCount(Math.max(1, Math.min(100, Number(e.target.value) || 1)))}
                className="w-20 h-8 px-2 text-center font-mono text-xs bg-surface text-foreground border border-border rounded-md"
              />
            </div>

            <Button onClick={handleGenerate} className="w-full gap-2">
              <RefreshCw className="w-4 h-4" /> Generate JSON Fixture
            </Button>
          </div>
        </div>

        {/* JSON Preview Column */}
        <div className="lg:col-span-7 bg-card border rounded-lg p-4 shadow-sm flex flex-col">
          <EditorToolbar
            title={`JSON Output (${count} records)`}
            actions={
              <div className="flex items-center gap-1">
                <CopyButton content={jsonOutput} />
                <DownloadButton content={jsonOutput} filename="mock-data.json" mimeType="application/json" />
              </div>
            }
          />

          <div className="flex-1 border rounded-md overflow-hidden min-h-[460px]">
            <CodeEditor
              value={jsonOutput}
              readOnly
              language="json"
              height="460px"
            />
          </div>
        </div>
      </div>

      <div className="mt-8">
        <ToolHelpPanel
          title="Random JSON Data Generator"
          description="Craft realistic JSON mocks with custom keys, types, and counts without sending proprietary schemas to external servers."
          tips={[
            'Generate 20 user profile objects with UUID, full name, and email for UI testing',
            'Create test fixtures for unit tests and API mocking',
            'Export mock records directly as JSON files for seeding local databases',
          ]}
        />
      </div>
    </div>
  );
};

export default RandomJsonPage;
