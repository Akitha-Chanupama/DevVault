import React from 'react';
import Editor, { OnChange, OnMount } from '@monaco-editor/react';
import { useThemeStore } from '@/stores/themeStore';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CodeEditorProps {
  value: string;
  onChange?: (value: string) => void;
  language?: string;
  readOnly?: boolean;
  placeholder?: string;
  height?: string | number;
  minHeight?: string | number;
  wordWrap?: 'on' | 'off' | 'wordWrapColumn' | 'bounded';
  className?: string;
  lineNumbers?: 'on' | 'off' | 'relative' | 'interval';
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  language = 'json',
  readOnly = false,
  height = '420px',
  wordWrap = 'on',
  className,
  lineNumbers = 'on',
}) => {
  const resolvedTheme = useThemeStore((state) => state.resolvedTheme);

  const handleEditorChange: OnChange = (val) => {
    if (onChange) {
      onChange(val ?? '');
    }
  };

  const handleEditorMount: OnMount = (editor) => {
    // Configure editor defaults
    editor.updateOptions({
      fontFamily: 'JetBrains Mono, Menlo, Monaco, Consolas, monospace',
      fontSize: 13,
      lineHeight: 20,
      renderWhitespace: 'selection',
      scrollBeyondLastLine: false,
      tabSize: 2,
    });
  };

  return (
    <div
      className={cn(
        'relative border border-border rounded-b-lg overflow-hidden bg-surface',
        className
      )}
      style={{ height }}
    >
      <Editor
        height="100%"
        language={language}
        value={value}
        theme={resolvedTheme === 'dark' ? 'vs-dark' : 'light'}
        onChange={handleEditorChange}
        onMount={handleEditorMount}
        loading={
          <div className="flex h-full w-full items-center justify-center gap-2 bg-surface text-muted-foreground text-xs">
            <Loader2 className="w-4 h-4 animate-spin text-primary" />
            <span>Loading editor...</span>
          </div>
        }
        options={{
          readOnly,
          wordWrap,
          lineNumbers,
          minimap: { enabled: false },
          automaticLayout: true,
          padding: { top: 12, bottom: 12 },
          folding: true,
          overviewRulerBorder: false,
          hideCursorInOverviewRuler: true,
          glyphMargin: false,
          fixedOverflowWidgets: true,
          renderLineHighlight: 'all',
          scrollbar: {
            verticalScrollbarSize: 8,
            horizontalScrollbarSize: 8,
          },
        }}
      />
    </div>
  );
};
