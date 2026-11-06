import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, Search, Info } from 'lucide-react';
import { ToolPageHeader } from '@/components/tool-ui/ToolPageHeader';
import { EditorToolbar } from '@/components/tool-ui/EditorToolbar';
import { ClearButton } from '@/components/tool-ui/ClearButton';
import { CopyButton } from '@/components/tool-ui/CopyButton';
import { ToolHelpPanel } from '@/components/tool-ui/EmptyState';
import { parseHttpHeaders } from '../logic/headerInspector';
import { HeaderCategory } from '../types';

const SAMPLE_HEADERS = `HTTP/2 200 OK
date: Thu, 06 Nov 2026 12:00:00 GMT
content-type: application/json; charset=utf-8
content-encoding: gzip
cache-control: public, max-age=86400, stale-while-revalidate=60
etag: W/"4f-178b88"
vary: Accept-Encoding
access-control-allow-origin: *
access-control-allow-methods: GET, POST, OPTIONS
strict-transport-security: max-age=31536000; includeSubDomains; preload
content-security-policy: default-src 'self'; script-src 'self' 'unsafe-inline'; object-src 'none'
x-content-type-options: nosniff
x-frame-options: DENY
referrer-policy: strict-origin-when-cross-origin
server: cloudflare`;

export const HeaderInspectorPage: React.FC = () => {
  const [rawText, setRawText] = useState<string>(SAMPLE_HEADERS);
  const [filterCategory, setFilterCategory] = useState<HeaderCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const result = parseHttpHeaders(rawText);

  const filteredHeaders = result.headers.filter((h) => {
    const matchesCategory = filterCategory === 'all' || h.category === filterCategory;
    const matchesSearch =
      !searchQuery ||
      h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.value.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const passedCount = result.securityAudit.filter((a) => a.status === 'passed').length;
  const totalAudit = result.securityAudit.length;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <ToolPageHeader
        toolId="header-inspector"
        title="HTTP Header Inspector"
        description="Inspect, parse, and categorize HTTP headers with automated security posture evaluation."
        category="API & HTTP"
        privacyMode="browser-only"
      />

      {/* Security Health Score Banner */}
      <div className="bg-card border rounded-lg p-5 mb-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`p-3 rounded-full ${
              passedCount === totalAudit
                ? 'bg-emerald-500/10 text-emerald-500'
                : passedCount >= 3
                ? 'bg-amber-500/10 text-amber-500'
                : 'bg-rose-500/10 text-rose-500'
            }`}
          >
            {passedCount === totalAudit ? (
              <ShieldCheck className="w-6 h-6" />
            ) : passedCount >= 3 ? (
              <AlertTriangle className="w-6 h-6" />
            ) : (
              <ShieldAlert className="w-6 h-6" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-sm">Security Headers Score</h3>
            <p className="text-xs text-muted-foreground">
              {passedCount} of {totalAudit} essential security headers correctly configured
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {result.securityAudit.map((item) => (
            <span
              key={item.header}
              className={`text-xs px-2.5 py-1 rounded-md border font-mono flex items-center gap-1.5 ${
                item.status === 'passed'
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                  : item.status === 'warning'
                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                  : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30'
              }`}
            >
              {item.status === 'passed' && '✓'}
              {item.status === 'warning' && '!'}
              {item.status === 'missing' && '✕'}
              {item.header}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Textarea */}
        <div className="lg:col-span-5 bg-card border rounded-lg p-4 shadow-sm flex flex-col">
          <EditorToolbar
            title="Raw Headers Input"
            actions={<ClearButton onClear={() => setRawText('')} disabled={!rawText} />}
          />
          <textarea
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            placeholder="Paste raw HTTP headers here (e.g. from curl -I or devtools)..."
            className="w-full flex-1 min-h-[380px] p-3 font-mono text-xs bg-background border rounded-md resize-none focus:outline-none focus:ring-1 focus:ring-primary leading-relaxed"
          />
          <div className="mt-3 flex justify-between items-center text-xs text-muted-foreground">
            <span>{result.rawCount} header lines parsed</span>
            <button
              type="button"
              onClick={() => setRawText(SAMPLE_HEADERS)}
              className="text-primary hover:underline"
            >
              Load Sample Headers
            </button>
          </div>
        </div>

        {/* Categorized Headers Viewer */}
        <div className="lg:col-span-7 bg-card border rounded-lg p-4 shadow-sm flex flex-col">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-2 justify-between items-center border-b pb-3 mb-4">
            <div className="flex flex-wrap gap-1">
              {(['all', 'security', 'caching', 'cors', 'content', 'general'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-2.5 py-1 text-xs rounded-md capitalize font-medium transition-colors ${
                    filterCategory === cat
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-44">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Filter headers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-8 pl-8 pr-2.5 text-xs bg-background border rounded-md"
              />
            </div>
          </div>

          {/* Headers List */}
          <div className="flex-1 overflow-y-auto max-h-[480px] space-y-2 pr-1">
            {filteredHeaders.length === 0 ? (
              <div className="text-center p-8 text-xs text-muted-foreground">
                No headers found matching criteria.
              </div>
            ) : (
              filteredHeaders.map((header, idx) => (
                <div
                  key={`${header.name}-${idx}`}
                  className="p-3 bg-muted/30 border rounded-md hover:bg-muted/50 transition-colors group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-semibold text-xs text-foreground">
                        {header.name}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-mono uppercase bg-muted text-muted-foreground border">
                        {header.category}
                      </span>
                    </div>
                    <CopyButton content={`${header.name}: ${header.value}`} />
                  </div>
                  <div className="font-mono text-xs text-muted-foreground break-all mt-1">
                    {header.value}
                  </div>
                  {header.description && (
                    <div className="mt-2 text-[11px] text-muted-foreground flex items-center gap-1">
                      <Info className="w-3 h-3 shrink-0" />
                      <span>{header.description}</span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <ToolHelpPanel
          title="HTTP Header Inspector"
          description="Analyze raw HTTP response or request headers with automated security auditing and categorizations."
          tips={[
            'Paste response headers from curl -I https://example.com to verify HSTS and CSP directives',
            'Check CORS response permissions for frontend web apps',
            'Verify caching rules (max-age, ETag, stale-while-revalidate)',
          ]}
        />
      </div>
    </div>
  );
};

export default HeaderInspectorPage;
