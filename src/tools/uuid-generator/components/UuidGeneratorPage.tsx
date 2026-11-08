import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { ToolPageHeader } from '@/components/tool-ui/ToolPageHeader';
import { CopyButton } from '@/components/tool-ui/CopyButton';
import { DownloadButton } from '@/components/tool-ui/DownloadButton';
import { ToolHelpPanel } from '@/components/tool-ui/EmptyState';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { generateUuids } from '../logic/uuidGenerator';
import { UuidOptions } from '../types';

export const UuidGeneratorPage: React.FC = () => {
  const [options, setOptions] = useState<UuidOptions>({
    count: 5,
    uppercase: false,
    hyphens: true,
  });

  const [uuids, setUuids] = useState<string[]>([]);

  const handleRegenerate = () => {
    setUuids(generateUuids(options));
  };

  useEffect(() => {
    handleRegenerate();
  }, [options]);

  const allUuidsText = uuids.join('\n');

  return (
    <div className="space-y-6">
      <ToolPageHeader
        toolId="uuid-generator"
        title="UUID Generator"
        description="Generate cryptographically random RFC 4122 Version 4 Universally Unique Identifiers (UUIDs)."
        category="Generators"
        privacyMode="browser-only"
      />

      {/* Primary Top UUID Card if generating */}
      {uuids[0] && (
        <Card className="p-6 bg-surface border-primary/30 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Primary Generated UUID
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRegenerate}
                className="text-xs h-8 gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Regenerate</span>
              </Button>
              <CopyButton content={uuids[0]} label="Copy UUID" />
            </div>
          </div>

          <div className="p-4 rounded-lg bg-surface-elevated border border-border">
            <p className="font-mono text-base sm:text-xl font-bold tracking-wide text-primary break-all select-all">
              {uuids[0]}
            </p>
          </div>
        </Card>
      )}

      {/* Controls Card */}
      <Card className="bg-surface p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="font-medium text-foreground">Quantity:</span>
            <select
              value={options.count}
              onChange={(e) => setOptions({ ...options, count: parseInt(e.target.value, 10) })}
              className="h-8 rounded-md border border-border bg-surface-elevated px-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
            >
              <option value="1">1 UUID</option>
              <option value="5">5 UUIDs</option>
              <option value="10">10 UUIDs</option>
              <option value="25">25 UUIDs</option>
              <option value="50">50 UUIDs</option>
              <option value="100">100 UUIDs</option>
            </select>
          </div>

          <label className="flex items-center gap-1.5 cursor-pointer text-foreground hover:text-primary transition-colors">
            <input
              type="checkbox"
              checked={options.hyphens}
              onChange={(e) => setOptions({ ...options, hyphens: e.target.checked })}
              className="rounded border-border text-primary focus:ring-primary h-4 w-4"
            />
            <span>Include Hyphens</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer text-foreground hover:text-primary transition-colors">
            <input
              type="checkbox"
              checked={options.uppercase}
              onChange={(e) => setOptions({ ...options, uppercase: e.target.checked })}
              className="rounded border-border text-primary focus:ring-primary h-4 w-4"
            />
            <span>Uppercase</span>
          </label>
        </div>

        <div className="flex items-center gap-2">
          <CopyButton content={allUuidsText} label="Copy All" />
          <DownloadButton
            content={allUuidsText}
            filename="uuids.txt"
            mimeType="text/plain"
            label="Download List"
          />
        </div>
      </Card>

      {/* Generated List */}
      <Card className="p-4 bg-surface space-y-1">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          Batch Output ({uuids.length} records)
        </div>
        <div className="divide-y divide-border/60 max-h-96 overflow-y-auto">
          {uuids.map((id, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-2 text-xs font-mono hover:bg-surface-elevated/40 px-2 rounded transition-colors"
            >
              <span className="text-foreground select-all">{id}</span>
              <CopyButton content={id} label="Copy" className="h-6 px-2 text-[11px]" />
            </div>
          ))}
        </div>
      </Card>

      <ToolHelpPanel
        title="About UUID Version 4"
        description="A Version 4 UUID is a 128-bit label generated using cryptographically strong pseudo-random numbers."
        features={[
          'Conforms to RFC 4122 specifications with standard version and variant bits.',
          'Collision probability is negligible: ~1 in 2^122.',
          'Built using browser-native crypto.randomUUID().',
          'Fast bulk export for seed scripts, database migrations, and testing datasets.',
        ]}
      />
    </div>
  );
};

export default UuidGeneratorPage;
