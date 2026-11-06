import React, { useState } from 'react';
import {
  Link as LinkIcon,
  Plus,
  Trash2,
  RefreshCw,
  Copy,
  Hash,
} from 'lucide-react';
import { ToolPageHeader } from '@/components/tool-ui/ToolPageHeader';
import { CopyButton } from '@/components/tool-ui/CopyButton';
import { ClearButton } from '@/components/tool-ui/ClearButton';
import { ErrorPanel } from '@/components/tool-ui/ValidationMessage';
import { ToolHelpPanel } from '@/components/tool-ui/EmptyState';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { parseUrlString, reconstructUrl } from '../logic/urlParser';
import { ParsedUrlDetails, QueryParam } from '../types';
import { toast } from 'sonner';

const SAMPLE_URL =
  'https://api.github.com:443/repos/octocat/Hello-World/issues?state=open&sort=created&direction=desc#activity';

export const UrlParserPage: React.FC = () => {
  const [urlInput, setUrlInput] = useState<string>(SAMPLE_URL);
  const [details, setDetails] = useState<ParsedUrlDetails>(() => parseUrlString(SAMPLE_URL));
  const [params, setParams] = useState<QueryParam[]>(() => parseUrlString(SAMPLE_URL).params);

  // Parse whenever the top input changes
  const handleUrlInputChange = (val: string) => {
    setUrlInput(val);
    const parsed = parseUrlString(val);
    setDetails(parsed);
    if (parsed.isValid) {
      setParams(parsed.params);
    }
  };

  // Sync back to top URL input when any query parameter is modified
  const handleParamsChange = (newParams: QueryParam[]) => {
    setParams(newParams);
    if (details.isValid) {
      const reconstructed = reconstructUrl(details, newParams);
      setUrlInput(reconstructed);
    }
  };

  const handleToggleParam = (id: string) => {
    const updated = params.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p));
    handleParamsChange(updated);
  };

  const handleUpdateParamKey = (id: string, key: string) => {
    const updated = params.map((p) => (p.id === id ? { ...p, key } : p));
    handleParamsChange(updated);
  };

  const handleUpdateParamValue = (id: string, value: string) => {
    const updated = params.map((p) => (p.id === id ? { ...p, value } : p));
    handleParamsChange(updated);
  };

  const handleDeleteParam = (id: string) => {
    const updated = params.filter((p) => p.id !== id);
    handleParamsChange(updated);
  };

  const handleAddParam = () => {
    const newParam: QueryParam = {
      id: Math.random().toString(36).substring(2, 9),
      key: '',
      value: '',
      enabled: true,
    };
    setParams([...params, newParam]);
  };

  const handleCopyParamsAsJson = async () => {
    const paramObj: Record<string, string> = {};
    params.forEach((p) => {
      if (p.enabled && p.key) {
        paramObj[p.key] = p.value;
      }
    });
    try {
      await navigator.clipboard.writeText(JSON.stringify(paramObj, null, 2));
      toast.success('Query parameters copied as JSON');
    } catch {
      toast.error('Failed to copy parameters');
    }
  };

  return (
    <div className="space-y-6">
      <ToolPageHeader
        toolId="url-parser"
        title="URL Parser & Builder"
        description="Deconstruct URLs into their core structural components, inspect and modify query parameters, and rebuild URLs safely."
        category="API & HTTP"
        privacyMode="browser-only"
      />

      {/* Main URL Input Card */}
      <Card className="p-4 bg-surface space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
            <LinkIcon className="w-3.5 h-3.5 text-primary" />
            <span>Target URL</span>
          </label>
          <div className="flex items-center gap-1.5">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleUrlInputChange(SAMPLE_URL)}
              className="text-xs h-7 px-2"
            >
              <RefreshCw className="w-3 h-3 mr-1" />
              <span>Sample</span>
            </Button>
            <ClearButton onClear={() => handleUrlInputChange('')} disabled={!urlInput} />
          </div>
        </div>

        <div className="flex gap-2">
          <Input
            value={urlInput}
            onChange={(e) => handleUrlInputChange(e.target.value)}
            placeholder="Paste URL here (e.g., https://example.com/path?key=val)..."
            className="font-mono text-xs"
          />
          <CopyButton content={urlInput} />
        </div>

        {!details.isValid && details.error && (
          <ErrorPanel error={details.error} />
        )}
      </Card>

      {/* Deconstructed URL Components */}
      {details.isValid && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          <Card className="p-3 bg-surface">
            <div className="text-[11px] text-muted-foreground mb-1">Protocol</div>
            <div className="text-xs font-mono font-semibold text-primary truncate">
              {details.protocol || '—'}
            </div>
          </Card>

          <Card className="p-3 bg-surface col-span-2">
            <div className="text-[11px] text-muted-foreground mb-1">Hostname</div>
            <div className="text-xs font-mono font-semibold text-foreground truncate">
              {details.hostname || '—'}
            </div>
          </Card>

          <Card className="p-3 bg-surface">
            <div className="text-[11px] text-muted-foreground mb-1">Port</div>
            <div className="text-xs font-mono font-semibold text-foreground truncate">
              {details.port || 'Default'}
            </div>
          </Card>

          <Card className="p-3 bg-surface col-span-2">
            <div className="text-[11px] text-muted-foreground mb-1">Pathname</div>
            <div className="text-xs font-mono font-semibold text-foreground truncate">
              {details.pathname || '/'}
            </div>
          </Card>
        </div>
      )}

      {/* Query Parameters Editor */}
      {details.isValid && (
        <Card className="bg-surface">
          <CardHeader className="py-3 px-4 border-b border-border flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Hash className="w-4 h-4 text-primary" />
                <span>Query Parameters ({params.length})</span>
              </CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyParamsAsJson}
                disabled={params.length === 0}
                className="text-xs h-8"
              >
                <Copy className="w-3.5 h-3.5 mr-1" />
                <span>Export as JSON</span>
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleAddParam}
                className="text-xs h-8 gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Parameter</span>
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-4 space-y-2">
            {params.length === 0 ? (
              <div className="text-center py-8 text-xs text-muted-foreground border border-dashed border-border rounded-lg">
                No query parameters found in this URL. Click "Add Parameter" to attach one.
              </div>
            ) : (
              <div className="space-y-2">
                <div className="grid grid-cols-12 gap-2 text-[11px] font-semibold text-muted-foreground px-2">
                  <div className="col-span-1 text-center">Active</div>
                  <div className="col-span-5">Key / Parameter Name</div>
                  <div className="col-span-5">Decoded Value</div>
                  <div className="col-span-1 text-right">Action</div>
                </div>

                {params.map((param) => (
                  <div
                    key={param.id}
                    className={`grid grid-cols-12 gap-2 items-center p-2 rounded-md border transition-colors ${
                      param.enabled
                        ? 'border-border bg-surface-elevated/40'
                        : 'border-border/50 bg-surface-elevated/10 opacity-60'
                    }`}
                  >
                    {/* Enable Checkbox */}
                    <div className="col-span-1 flex justify-center">
                      <input
                        type="checkbox"
                        checked={param.enabled}
                        onChange={() => handleToggleParam(param.id)}
                        className="rounded border-border text-primary focus:ring-primary h-4 w-4"
                        title={param.enabled ? 'Disable parameter' : 'Enable parameter'}
                      />
                    </div>

                    {/* Param Key Input */}
                    <div className="col-span-5">
                      <Input
                        value={param.key}
                        onChange={(e) => handleUpdateParamKey(param.id, e.target.value)}
                        placeholder="Key"
                        className="h-8 font-mono text-xs"
                      />
                    </div>

                    {/* Param Value Input */}
                    <div className="col-span-5">
                      <Input
                        value={param.value}
                        onChange={(e) => handleUpdateParamValue(param.id, e.target.value)}
                        placeholder="Value"
                        className="h-8 font-mono text-xs"
                      />
                    </div>

                    {/* Delete action */}
                    <div className="col-span-1 flex justify-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteParam(param.id)}
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        title="Delete parameter"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <ToolHelpPanel
        title="About URL Parsing & Reconstruction"
        description="This utility parses RFC 3986 compliant Uniform Resource Locators using the browser standard WHATWG URL API."
        features={[
          'Separates Protocol, Host, Port, Pathname, and Hash fragments.',
          'Decodes URL-encoded parameters (such as %20 to spaces) automatically.',
          'Interactive parameter builder: toggle, rename, update, or remove search parameters with instant URL synchronization.',
          'Export parameters directly to JSON for API documentation or mock payloads.',
          'Privacy guarantee: DevVault never sends or requests the URL across the internet.',
        ]}
      />
    </div>
  );
};

export default UrlParserPage;
