import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { ToolPageHeader } from '@/components/tool-ui/ToolPageHeader';
import { EditorToolbar } from '@/components/tool-ui/EditorToolbar';
import { ClearButton } from '@/components/tool-ui/ClearButton';
import { CopyButton } from '@/components/tool-ui/CopyButton';
import { DownloadButton } from '@/components/tool-ui/DownloadButton';
import { ErrorPanel } from '@/components/tool-ui/ValidationMessage';
import { ToolHelpPanel } from '@/components/tool-ui/EmptyState';
import { CodeEditor } from '@/components/editor/CodeEditor';
import { Button } from '@/components/ui/button';
import { SupportedSqlDialect, SqlFormatOptions } from '../types';
import { formatSqlQuery, DEFAULT_SQL_OPTIONS } from '../logic/sqlFormatter';
import type { KeywordCase } from 'sql-formatter';

const SAMPLE_SQL = `select u.id, u.email, p.full_name, count(o.id) as total_orders, sum(o.total_amount) as lifetime_spend from users u left join profiles p on p.user_id = u.id left join orders o on o.user_id = u.id where u.status = 'active' and u.created_at >= '2026-01-01' group by u.id, u.email, p.full_name having count(o.id) > 2 order by lifetime_spend desc limit 50;`;

const DIALECTS: Array<{ id: SupportedSqlDialect; label: string }> = [
  { id: 'sql', label: 'Standard ANSI SQL' },
  { id: 'postgresql', label: 'PostgreSQL' },
  { id: 'mysql', label: 'MySQL / MariaDB' },
  { id: 'sqlite', label: 'SQLite' },
  { id: 'tsql', label: 'Transact-SQL (SQL Server)' },
  { id: 'bigquery', label: 'Google BigQuery' },
];

export const SqlFormatterPage: React.FC = () => {
  const [inputSql, setInputSql] = useState<string>(SAMPLE_SQL);
  const [language, setLanguage] = useState<SupportedSqlDialect>('postgresql');
  const [tabWidth, setTabWidth] = useState<number>(2);
  const [keywordCase, setKeywordCase] = useState<KeywordCase>('upper');

  const options: SqlFormatOptions = {
    language,
    tabWidth,
    useTabs: false,
    keywordCase,
  };

  const result = formatSqlQuery(inputSql, options);

  const handleBeautifyInPlace = () => {
    if (result.success && result.formattedSql) {
      setInputSql(result.formattedSql);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <ToolPageHeader
        toolId="sql-formatter"
        title="SQL Query Formatter & Beautifier"
        description="Format, prettify, and standardize SQL queries across PostgreSQL, MySQL, SQLite, BigQuery, and T-SQL dialects."
        category="Database"
        privacyMode="browser-only"
      />

      {/* Control Bar */}
      <div className="bg-card border rounded-lg p-4 mb-6 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
              Dialect
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as SupportedSqlDialect)}
              className="h-8 px-2.5 text-xs bg-muted/50 border rounded-md font-medium focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {DIALECTS.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
              Keyword Casing
            </label>
            <select
              value={keywordCase}
              onChange={(e) => setKeywordCase(e.target.value as KeywordCase)}
              className="h-8 px-2.5 text-xs bg-muted/50 border rounded-md font-medium focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="upper">UPPERCASE (SELECT, FROM)</option>
              <option value="lower">lowercase (select, from)</option>
              <option value="preserve">Preserve Original</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
              Indentation
            </label>
            <select
              value={tabWidth}
              onChange={(e) => setTabWidth(Number(e.target.value))}
              className="h-8 px-2.5 text-xs bg-muted/50 border rounded-md font-medium focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value={2}>2 spaces</option>
              <option value={4}>4 spaces</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto">
          <Button
            variant="default"
            size="sm"
            onClick={handleBeautifyInPlace}
            className="gap-1.5 h-8 text-xs font-semibold"
          >
            <Sparkles className="w-3.5 h-3.5" /> Beautify Input
          </Button>
        </div>
      </div>

      {result.error && (
        <div className="mb-6">
          <ErrorPanel error={`SQL Format Notice: ${result.error}`} />
        </div>
      )}

      {/* Split Editor: Raw vs Formatted */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Pane */}
        <div className="bg-card border rounded-lg p-4 shadow-sm flex flex-col">
          <EditorToolbar
            title="Input Query"
            actions={<ClearButton onClear={() => setInputSql('')} disabled={!inputSql} />}
          />
          <div className="flex-1 border rounded-md overflow-hidden min-h-[460px]">
            <CodeEditor
              value={inputSql}
              onChange={(val) => setInputSql(val || '')}
              language="sql"
              height="460px"
            />
          </div>
          <div className="mt-3 flex justify-between items-center text-xs text-muted-foreground">
            <span>{inputSql.length} characters</span>
            <button
              type="button"
              onClick={() => {
                setInputSql(SAMPLE_SQL);
                setLanguage(DEFAULT_SQL_OPTIONS.language);
              }}
              className="text-primary hover:underline"
            >
              Load Sample Query
            </button>
          </div>
        </div>

        {/* Formatted Pane */}
        <div className="bg-card border rounded-lg p-4 shadow-sm flex flex-col">
          <EditorToolbar
            title="Formatted Output"
            actions={
              <div className="flex items-center gap-1">
                <CopyButton content={result.formattedSql} />
                <DownloadButton content={result.formattedSql} filename="query.sql" mimeType="application/sql" />
              </div>
            }
          />
          <div className="flex-1 border rounded-md overflow-hidden min-h-[460px]">
            <CodeEditor
              value={result.formattedSql}
              readOnly
              language="sql"
              height="460px"
            />
          </div>
        </div>
      </div>

      <div className="mt-8">
        <ToolHelpPanel
          title="SQL Query Formatter"
          description="Transform unreadable one-line SQL queries into clean, beautifully structured, dialect-aware statements."
          tips={[
            'Format complex multi-table JOINs and nested subqueries',
            'Enforce uppercase keyword conventions for code reviews and documentation',
            'Beautify queries exported from ORMs (Prisma, Drizzle, Hibernate, Sequelize)',
          ]}
        />
      </div>
    </div>
  );
};

export default SqlFormatterPage;
