import React, { useState } from 'react';
import { Play, Copy, Check, Clock } from 'lucide-react';
import { ToolPageHeader } from '@/components/tool-ui/ToolPageHeader';
import { EditorToolbar } from '@/components/tool-ui/EditorToolbar';
import { ClearButton } from '@/components/tool-ui/ClearButton';
import { CopyButton } from '@/components/tool-ui/CopyButton';
import { ErrorPanel } from '@/components/tool-ui/ValidationMessage';
import { ToolHelpPanel } from '@/components/tool-ui/EmptyState';
import { RegexFlags } from '../types';
import { executeRegexTest } from '../logic/regexTester';

const SAMPLE_TEXT = `User 1: John Doe (email: john.doe@example.com, phone: +1-555-0199)
User 2: Jane Smith (email: jane.smith@techcorp.io, phone: +44-20-7946-0958)
User 3: Alex Rivera (email: alex.rivera@domain.org, phone: +61-2-9999-1234)`;

const SAMPLE_PATTERN = `(?<name>[A-Z][a-z]+ [A-Z][a-z]+) \\(email: (?<email>[\\w.]+@[\\w.]+), phone: (?<phone>[+\\d-]+)\\)`;

export const RegexTesterPage: React.FC = () => {
  const [pattern, setPattern] = useState<string>(SAMPLE_PATTERN);
  const [flags, setFlags] = useState<RegexFlags>({
    g: true,
    i: false,
    m: true,
    s: false,
    u: false,
  });
  const [testString, setTestString] = useState<string>(SAMPLE_TEXT);
  const [replacePattern, setReplacePattern] = useState<string>('$1 <$2>');
  const [showReplace, setShowReplace] = useState<boolean>(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const result = executeRegexTest(
    pattern,
    flags,
    testString,
    showReplace ? replacePattern : undefined
  );

  const toggleFlag = (flag: keyof RegexFlags) => {
    setFlags((prev) => ({ ...prev, [flag]: !prev[flag] }));
  };

  const handleCopyMatch = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <ToolPageHeader
        toolId="regex-tester"
        title="Regular Expression Tester"
        description="Test, validate, and debug regular expressions in real time with capture groups and replacement preview."
        category="Text & Code"
        privacyMode="browser-only"
      />

      {/* Pattern and Flags Bar */}
      <div className="bg-card border rounded-lg p-4 mb-6 shadow-sm space-y-4">
        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
            Regular Expression
          </label>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="flex-1 flex items-center bg-background border rounded-md px-3 font-mono text-sm focus-within:ring-1 focus-within:ring-primary">
              <span className="text-muted-foreground mr-1">/</span>
              <input
                type="text"
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                placeholder="Enter regex pattern..."
                className="flex-1 bg-transparent py-2 focus:outline-none font-mono text-sm"
              />
              <span className="text-muted-foreground ml-1">/</span>
            </div>

            {/* Flags Checklist */}
            <div className="flex items-center gap-1.5 bg-muted/40 p-1 rounded-md border text-xs font-mono">
              {(['g', 'i', 'm', 's', 'u'] as Array<keyof RegexFlags>).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => toggleFlag(f)}
                  title={`${f.toUpperCase()} flag`}
                  className={`w-7 h-7 rounded font-bold transition-colors ${
                    flags[f]
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Replacement Toggle Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t text-xs">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showReplace}
              onChange={(e) => setShowReplace(e.target.checked)}
              className="rounded text-primary focus:ring-0"
            />
            <span className="font-medium">Enable Replacement Preview</span>
          </label>

          {result.success && (
            <div className="flex items-center gap-3 text-muted-foreground font-mono">
              <span>{result.count} match{result.count === 1 ? '' : 'es'}</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" /> {result.executionTimeMs}ms
              </span>
            </div>
          )}
        </div>

        {showReplace && (
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
              Replace With Pattern (supports $1, $2, etc.)
            </label>
            <input
              type="text"
              value={replacePattern}
              onChange={(e) => setReplacePattern(e.target.value)}
              placeholder="e.g. $1-$2"
              className="w-full h-9 px-3 bg-background border rounded-md font-mono text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        )}
      </div>

      {result.error && (
        <div className="mb-6">
          <ErrorPanel error={`Regex Error: ${result.error}`} />
        </div>
      )}

      {/* Main Grid: Test String vs Matches / Replacement */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Test String Input */}
        <div className="bg-card border rounded-lg p-4 shadow-sm flex flex-col">
          <EditorToolbar
            title="Test Input String"
            actions={<ClearButton onClear={() => setTestString('')} disabled={!testString} />}
          />
          <textarea
            value={testString}
            onChange={(e) => setTestString(e.target.value)}
            placeholder="Type or paste test string here..."
            className="w-full flex-1 min-h-[350px] p-3 font-mono text-xs bg-background border rounded-md resize-none focus:outline-none focus:ring-1 focus:ring-primary leading-relaxed"
          />
          <div className="mt-3 flex justify-between items-center text-xs text-muted-foreground">
            <span>{testString.length} characters</span>
            <button
              type="button"
              onClick={() => {
                setPattern(SAMPLE_PATTERN);
                setTestString(SAMPLE_TEXT);
              }}
              className="text-primary hover:underline"
            >
              Reset to Sample
            </button>
          </div>
        </div>

        {/* Results Area */}
        <div className="bg-card border rounded-lg p-4 shadow-sm flex flex-col">
          <div className="flex items-center justify-between border-b pb-3 mb-4">
            <span className="text-sm font-semibold">
              {showReplace ? 'Replacement & Matches' : 'Matched Groups'}
            </span>
            {showReplace && result.replacement !== undefined && (
              <CopyButton content={result.replacement} label="Copy Replacement" />
            )}
          </div>

          {showReplace && result.replacement !== undefined && (
            <div className="mb-4">
              <label className="text-xs font-medium text-muted-foreground block mb-1.5">
                Replacement Output:
              </label>
              <textarea
                value={result.replacement}
                readOnly
                className="w-full h-28 p-2.5 font-mono text-xs bg-muted/30 border rounded-md resize-none focus:outline-none"
              />
            </div>
          )}

          {/* Matches List */}
          <div className="flex-1 overflow-y-auto max-h-[380px] space-y-3 pr-1">
            {result.matches.length === 0 ? (
              <div className="text-center p-10 text-xs text-muted-foreground">
                <Play className="w-8 h-8 mx-auto mb-2 opacity-30 stroke-[1.5]" />
                No matches found with current pattern and test string.
              </div>
            ) : (
              result.matches.map((m, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-muted/20 border rounded-md space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-primary font-mono">
                      Match #{idx + 1}
                      <span className="ml-2 font-normal text-muted-foreground text-[11px]">
                        [{m.start} .. {m.end}]
                      </span>
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyMatch(m.match, idx)}
                      className="text-muted-foreground hover:text-foreground text-[11px] flex items-center gap-1 font-mono"
                    >
                      {copiedIndex === idx ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-500" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" /> Copy
                        </>
                      )}
                    </button>
                  </div>

                  <div className="p-2 bg-background border rounded font-mono break-all text-xs">
                    {m.match}
                  </div>

                  {m.groups.length > 0 && (
                    <div className="pt-2 border-t border-border/40 space-y-1">
                      <span className="text-[11px] font-medium text-muted-foreground">
                        Capture Groups:
                      </span>
                      {m.groups.map((g, gIdx) => (
                        <div
                          key={gIdx}
                          className="flex items-start gap-2 font-mono text-[11px]"
                        >
                          <span className="text-muted-foreground shrink-0 w-20">
                            {g.name ? `${g.name}:` : `Group #${g.index}:`}
                          </span>
                          <span className="text-foreground font-semibold break-all">
                            {g.value || <em className="text-muted-foreground font-normal">empty</em>}
                          </span>
                        </div>
                      ))}
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
          title="Regular Expression Tester"
          description="Evaluate and debug regular expressions with interactive match inspection, named capture groups, and regex substitution."
          tips={[
            'Match emails and extract names: (?<name>[a-z]+)@(?<domain>[a-z.]+)',
            'Format phone numbers or timestamps using capture groups ($1-$2)',
            'Test unicode and multiline expressions across large text payloads',
          ]}
        />
      </div>
    </div>
  );
};

export default RegexTesterPage;
