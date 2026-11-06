import React, { useState, useRef } from 'react';
import { Send, StopCircle, Plus, Trash2, Globe, Clock, ShieldAlert } from 'lucide-react';
import { ToolPageHeader } from '@/components/tool-ui/ToolPageHeader';
import { CopyButton } from '@/components/tool-ui/CopyButton';
import { ToolHelpPanel } from '@/components/tool-ui/EmptyState';
import { CodeEditor } from '@/components/editor/CodeEditor';
import { Button } from '@/components/ui/button';
import { HttpMethod, BodyType, HeaderItem, QueryItem, ApiResponseDetails } from '../types';
import { executeHttpRequest } from '../logic/apiClient';

const HTTP_METHODS: HttpMethod[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'];

export const ApiClientPage: React.FC = () => {
  const [method, setMethod] = useState<HttpMethod>('GET');
  const [url, setUrl] = useState<string>('https://jsonplaceholder.typicode.com/todos/1');
  const [activeTab, setActiveTab] = useState<'params' | 'headers' | 'body'>('params');
  const [bodyType, setBodyType] = useState<BodyType>('json');
  const [bodyContent, setBodyContent] = useState<string>('{\n  "title": "foo",\n  "completed": false\n}');

  const [queryParams, setQueryParams] = useState<QueryItem[]>([
    { id: '1', key: '', value: '', enabled: true },
  ]);

  const [headers, setHeaders] = useState<HeaderItem[]>([
    { id: '1', key: 'Accept', value: 'application/json', enabled: true },
  ]);

  const [loading, setLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<ApiResponseDetails | null>(null);
  const [responseTab, setResponseTab] = useState<'body' | 'headers'>('body');

  const abortControllerRef = useRef<AbortController | null>(null);

  const handleSend = async () => {
    if (!url.trim()) return;

    abortControllerRef.current = new AbortController();
    setLoading(true);
    setResponse(null);

    try {
      const res = await executeHttpRequest({
        method,
        url: url.trim(),
        headers,
        queryParams,
        bodyType,
        bodyContent,
        abortSignal: abortControllerRef.current.signal,
      });
      setResponse(res);
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setLoading(false);
    }
  };

  const addQueryParam = () => {
    setQueryParams((prev) => [
      ...prev,
      { id: Math.random().toString(36).substring(7), key: '', value: '', enabled: true },
    ]);
  };

  const updateQueryParam = (id: string, updates: Partial<QueryItem>) => {
    setQueryParams((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const removeQueryParam = (id: string) => {
    setQueryParams((prev) => prev.filter((item) => item.id !== id));
  };

  const addHeader = () => {
    setHeaders((prev) => [
      ...prev,
      { id: Math.random().toString(36).substring(7), key: '', value: '', enabled: true },
    ]);
  };

  const updateHeader = (id: string, updates: Partial<HeaderItem>) => {
    setHeaders((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const removeHeader = (id: string) => {
    setHeaders((prev) => prev.filter((item) => item.id !== id));
  };

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
    if (status >= 300 && status < 400) return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
    if (status >= 400 && status < 500) return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
    return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <ToolPageHeader
        toolId="api-client"
        title="HTTP API Client"
        description="Browser-based REST client for making web requests and inspecting responses directly with zero telemetry."
        category="API & HTTP"
        privacyMode="browser-only"
      />

      {/* URL bar & Action */}
      <div className="bg-card border rounded-lg p-4 mb-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-2">
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value as HttpMethod)}
            className="h-10 px-3 py-2 bg-muted/60 border rounded-md font-semibold text-sm focus:outline-none focus:ring-1 focus:ring-primary w-full md:w-32"
          >
            {HTTP_METHODS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://api.example.com/v1/resource"
            className="flex-1 h-10 px-4 bg-background border rounded-md text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
          />
          {loading ? (
            <Button
              variant="destructive"
              className="gap-2 h-10 px-5"
              onClick={handleCancel}
            >
              <StopCircle className="w-4 h-4" /> Cancel
            </Button>
          ) : (
            <Button
              variant="default"
              className="gap-2 h-10 px-6"
              onClick={handleSend}
            >
              <Send className="w-4 h-4" /> Send
            </Button>
          )}
        </div>
      </div>

      {/* Request Configuration & Response Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Request Area */}
        <div className="bg-card border rounded-lg p-4 shadow-sm flex flex-col">
          <div className="flex items-center justify-between border-b pb-3 mb-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('params')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  activeTab === 'params'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                Params ({queryParams.filter((p) => p.key).length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('headers')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  activeTab === 'headers'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                Headers ({headers.filter((h) => h.key).length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('body')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  activeTab === 'body'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                Body
              </button>
            </div>
          </div>

          <div className="flex-1">
            {/* Params Tab */}
            {activeTab === 'params' && (
              <div className="space-y-2">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-muted-foreground font-medium">Query Parameters</span>
                  <Button size="sm" variant="outline" onClick={addQueryParam} className="h-7 text-xs gap-1">
                    <Plus className="w-3 h-3" /> Add Param
                  </Button>
                </div>
                {queryParams.map((param) => (
                  <div key={param.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={param.enabled}
                      onChange={(e) => updateQueryParam(param.id, { enabled: e.target.checked })}
                      className="rounded border-muted-foreground/30 text-primary focus:ring-0"
                    />
                    <input
                      type="text"
                      placeholder="Key"
                      value={param.key}
                      onChange={(e) => updateQueryParam(param.id, { key: e.target.value })}
                      className="flex-1 h-8 px-2.5 text-xs bg-background border rounded font-mono"
                    />
                    <input
                      type="text"
                      placeholder="Value"
                      value={param.value}
                      onChange={(e) => updateQueryParam(param.id, { value: e.target.value })}
                      className="flex-1 h-8 px-2.5 text-xs bg-background border rounded font-mono"
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => removeQueryParam(param.id)}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Headers Tab */}
            {activeTab === 'headers' && (
              <div className="space-y-2">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-muted-foreground font-medium">HTTP Headers</span>
                  <Button size="sm" variant="outline" onClick={addHeader} className="h-7 text-xs gap-1">
                    <Plus className="w-3 h-3" /> Add Header
                  </Button>
                </div>
                {headers.map((header) => (
                  <div key={header.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={header.enabled}
                      onChange={(e) => updateHeader(header.id, { enabled: e.target.checked })}
                      className="rounded border-muted-foreground/30 text-primary focus:ring-0"
                    />
                    <input
                      type="text"
                      placeholder="Header Name"
                      value={header.key}
                      onChange={(e) => updateHeader(header.id, { key: e.target.value })}
                      className="flex-1 h-8 px-2.5 text-xs bg-background border rounded font-mono"
                    />
                    <input
                      type="text"
                      placeholder="Value"
                      value={header.value}
                      onChange={(e) => updateHeader(header.id, { value: e.target.value })}
                      className="flex-1 h-8 px-2.5 text-xs bg-background border rounded font-mono"
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => removeHeader(header.id)}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Body Tab */}
            {activeTab === 'body' && (
              <div>
                <div className="flex items-center gap-4 mb-3">
                  <label className="text-xs font-medium text-muted-foreground">Type:</label>
                  {(['none', 'json', 'text', 'urlencoded'] as BodyType[]).map((t) => (
                    <label key={t} className="flex items-center gap-1.5 text-xs cursor-pointer">
                      <input
                        type="radio"
                        name="bodyType"
                        value={t}
                        checked={bodyType === t}
                        onChange={() => setBodyType(t)}
                        className="text-primary focus:ring-0"
                      />
                      <span className="capitalize">{t}</span>
                    </label>
                  ))}
                </div>
                {bodyType !== 'none' && (
                  <div className="border rounded-md overflow-hidden h-[300px]">
                    <CodeEditor
                      value={bodyContent}
                      onChange={(val) => setBodyContent(val || '')}
                      language={bodyType === 'json' ? 'json' : 'text'}
                      height="300px"
                    />
                  </div>
                )}
                {bodyType === 'none' && (
                  <div className="p-8 text-center text-xs text-muted-foreground border rounded-md border-dashed">
                    No body will be transmitted with this request.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Response Area */}
        <div className="bg-card border rounded-lg p-4 shadow-sm flex flex-col">
          <div className="flex items-center justify-between border-b pb-3 mb-4">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold">Response</span>
              {response && (
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs px-2 py-0.5 font-mono font-bold rounded border ${getStatusColor(
                      response.status
                    )}`}
                  >
                    {response.status ? `${response.status} ${response.statusText}` : response.statusText}
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {response.durationMs}ms
                  </span>
                </div>
              )}
            </div>

            {response && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setResponseTab('body')}
                  className={`px-2.5 py-1 text-xs font-medium rounded ${
                    responseTab === 'body'
                      ? 'bg-muted text-foreground'
                      : 'text-muted-foreground hover:bg-muted/50'
                  }`}
                >
                  Body
                </button>
                <button
                  type="button"
                  onClick={() => setResponseTab('headers')}
                  className={`px-2.5 py-1 text-xs font-medium rounded ${
                    responseTab === 'headers'
                      ? 'bg-muted text-foreground'
                      : 'text-muted-foreground hover:bg-muted/50'
                  }`}
                >
                  Headers ({Object.keys(response.headers).length})
                </button>
                <CopyButton content={response.data} />
              </div>
            )}
          </div>

          <div className="flex-1 flex flex-col">
            {!response && !loading && (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
                <Globe className="w-12 h-12 stroke-[1.2] mb-3 opacity-40" />
                <p className="text-sm font-medium">Ready to send request</p>
                <p className="text-xs mt-1">Configure method and endpoint above, then click Send</p>
              </div>
            )}

            {loading && (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-3"></div>
                <p className="text-xs">Dispatching client-side fetch...</p>
              </div>
            )}

            {response && responseTab === 'body' && (
              <div className="flex-1 flex flex-col">
                {response.isCorsError && (
                  <div className="mb-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-md text-xs text-amber-600 dark:text-amber-400 flex items-start gap-2">
                    <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">Browser CORS Restriction</p>
                      <p className="mt-0.5">
                        This web app operates purely inside your browser without an intermediary proxy server to protect your data privacy. The target server must send valid <code className="font-mono bg-muted/60 px-1 rounded">Access-Control-Allow-Origin</code> headers for cross-origin browser requests.
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex-1 border rounded-md overflow-hidden min-h-[300px]">
                  <CodeEditor
                    value={response.data}
                    readOnly
                    language={response.isJson ? 'json' : 'text'}
                    height="100%"
                  />
                </div>
              </div>
            )}

            {response && responseTab === 'headers' && (
              <div className="flex-1 border rounded-md p-3 font-mono text-xs overflow-y-auto max-h-[400px] space-y-1.5">
                {Object.keys(response.headers).length === 0 ? (
                  <p className="text-muted-foreground italic">No headers exposed by the response or origin.</p>
                ) : (
                  Object.entries(response.headers).map(([k, v]) => (
                    <div key={k} className="flex border-b border-border/40 pb-1">
                      <span className="font-semibold text-primary w-1/3 truncate">{k}:</span>
                      <span className="text-muted-foreground break-all w-2/3">{v}</span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <ToolHelpPanel
          title="HTTP API Client"
          description="Send direct HTTP requests (GET, POST, PUT, DELETE, etc.) directly from your browser engine with privacy preservation."
          tips={[
            'Test REST API endpoints with custom headers and JSON payloads',
            'Inspect response latency and HTTP headers returned by APIs',
            'Verify CORS compatibility for modern client-side integrations',
          ]}
        />
      </div>
    </div>
  );
};

export default ApiClientPage;
