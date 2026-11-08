import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import { Eye, Edit3, Columns, BookOpen } from 'lucide-react';
import { ToolPageHeader } from '@/components/tool-ui/ToolPageHeader';
import { EditorToolbar } from '@/components/tool-ui/EditorToolbar';
import { ClearButton } from '@/components/tool-ui/ClearButton';
import { CopyButton } from '@/components/tool-ui/CopyButton';
import { DownloadButton } from '@/components/tool-ui/DownloadButton';
import { ToolHelpPanel } from '@/components/tool-ui/EmptyState';
import { CodeEditor } from '@/components/editor/CodeEditor';
import { calculateMarkdownStats } from '../logic/markdownEditor';

const SAMPLE_MARKDOWN = `# DevVault Markdown Playground

Welcome to **DevVault's** native Markdown editor! Everything executes locally in your browser with zero remote transmission.

## Features
- [x] Full GitHub Flavored Markdown (tables, task lists, strikethrough)
- [x] Real-time sanitized HTML preview (protects against XSS)
- [x] Split, Editor-only, or Preview-only layouts
- [ ] Export directly as \`.md\` file

### Code Example
\`\`\`typescript
interface DeveloperTool {
  id: string;
  name: string;
  localOnly: boolean;
}

const vaultTool: DeveloperTool = {
  id: 'markdown-editor',
  name: 'Markdown Studio',
  localOnly: true,
};
\`\`\`

### Data Table
| Tool | Latency | Privacy |
| :--- | :--- | :--- |
| DevVault | ~0ms | 100% Local |
| Cloud tools | 250ms+ | Data logged |

> "Simplicity is prerequisite for reliability." — Edsger W. Dijkstra
`;

export const MarkdownEditorPage: React.FC = () => {
  const [content, setContent] = useState<string>(SAMPLE_MARKDOWN);
  const [viewMode, setViewMode] = useState<'split' | 'editor' | 'preview'>('split');

  const stats = calculateMarkdownStats(content);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <ToolPageHeader
        toolId="markdown-editor"
        title="Markdown Editor & Previewer"
        description="Write and preview GitHub Flavored Markdown in real time with sanitized rendering and live document stats."
        category="Text & Code"
        privacyMode="browser-only"
      />

      {/* Control Bar */}
      <div className="bg-card border rounded-lg p-3 mb-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Layout Modes */}
        <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-md border text-xs font-medium">
          <button
            type="button"
            onClick={() => setViewMode('split')}
            className={`px-3 py-1.5 rounded flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              viewMode === 'split'
                ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                : 'text-muted-foreground hover:bg-muted'
            }`}
          >
            <Columns className="w-3.5 h-3.5 shrink-0" /> Split View
          </button>
          <button
            type="button"
            onClick={() => setViewMode('editor')}
            className={`px-3 py-1.5 rounded flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              viewMode === 'editor'
                ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                : 'text-muted-foreground hover:bg-muted'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5 shrink-0" /> Editor Only
          </button>
          <button
            type="button"
            onClick={() => setViewMode('preview')}
            className={`px-3 py-1.5 rounded flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              viewMode === 'preview'
                ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                : 'text-muted-foreground hover:bg-muted'
            }`}
          >
            <Eye className="w-3.5 h-3.5 shrink-0" /> Preview Only
          </button>
        </div>

        {/* Document Stats */}
        <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground">
          <span>{stats.words} words</span>
          <span>{stats.characters} chars</span>
          <span>{stats.lines} lines</span>
          <span className="flex items-center gap-1">
            <BookOpen className="w-3 h-3" /> {stats.readingTimeMinutes} min read
          </span>
        </div>
      </div>

      {/* Editor & Preview Workspace */}
      <div
        className={`grid gap-6 ${
          viewMode === 'split'
            ? 'grid-cols-1 lg:grid-cols-2'
            : 'grid-cols-1'
        }`}
      >
        {/* Editor Pane */}
        {(viewMode === 'split' || viewMode === 'editor') && (
          <div className="bg-card border rounded-lg p-4 shadow-sm flex flex-col">
            <EditorToolbar
              title="Markdown Source"
              actions={
                <div className="flex items-center gap-1">
                  <CopyButton content={content} />
                  <DownloadButton content={content} filename="document.md" mimeType="text/markdown" />
                  <ClearButton onClear={() => setContent('')} disabled={!content} />
                </div>
              }
            />
            <div className="flex-1 border rounded-md overflow-hidden min-h-[500px]">
              <CodeEditor
                value={content}
                onChange={(val) => setContent(val || '')}
                language="markdown"
                height="500px"
              />
            </div>
          </div>
        )}

        {/* Preview Pane */}
        {(viewMode === 'split' || viewMode === 'preview') && (
          <div className="bg-card border rounded-lg p-4 shadow-sm flex flex-col">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <span className="text-sm font-semibold flex items-center gap-2">
                <Eye className="w-4 h-4 text-primary" /> Rendered Output
              </span>
              <span className="text-xs text-muted-foreground font-mono">Sanitized HTML</span>
            </div>
            <div className="flex-1 border rounded-md p-6 bg-background overflow-y-auto max-h-[500px] prose dark:prose-invert max-w-none text-foreground leading-relaxed text-sm">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeSanitize]}
                components={{
                  h1: ({ ...props }) => <h1 className="text-2xl font-bold border-b pb-2 mb-4" {...props} />,
                  h2: ({ ...props }) => <h2 className="text-xl font-bold border-b pb-1.5 mt-6 mb-3" {...props} />,
                  h3: ({ ...props }) => <h3 className="text-lg font-semibold mt-4 mb-2" {...props} />,
                  p: ({ ...props }) => <p className="my-2 leading-relaxed" {...props} />,
                  ul: ({ ...props }) => <ul className="list-disc pl-6 my-2 space-y-1" {...props} />,
                  ol: ({ ...props }) => <ol className="list-decimal pl-6 my-2 space-y-1" {...props} />,
                  li: ({ ...props }) => <li className="my-0.5" {...props} />,
                  blockquote: ({ ...props }) => (
                    <blockquote className="border-l-4 border-primary/60 pl-4 py-1 italic my-3 text-muted-foreground" {...props} />
                  ),
                  code: ({ className, children, ...props }) => {
                    const isInline = !className;
                    return isInline ? (
                      <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-xs text-primary" {...props}>
                        {children}
                      </code>
                    ) : (
                      <pre className="bg-muted/70 p-3 rounded-md overflow-x-auto my-3 border font-mono text-xs">
                        <code className={className} {...props}>
                          {children}
                        </code>
                      </pre>
                    );
                  },
                  table: ({ ...props }) => (
                    <div className="overflow-x-auto my-4">
                      <table className="w-full border-collapse border text-xs font-mono" {...props} />
                    </div>
                  ),
                  th: ({ ...props }) => <th className="border bg-muted/60 p-2 font-semibold text-left" {...props} />,
                  td: ({ ...props }) => <td className="border p-2" {...props} />,
                }}
              >
                {content || '*No content to render*'}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8">
        <ToolHelpPanel
          title="Markdown Editor & Previewer"
          description="A distraction-free markdown workspace with live sanitized preview and formatting shortcuts."
          tips={[
            'Draft READMEs and technical documentation with instantaneous preview',
            'Format tables, task lists, and syntax-highlighted code blocks',
            'Calculate document metrics and estimated reading time',
          ]}
        />
      </div>
    </div>
  );
};

export default MarkdownEditorPage;
