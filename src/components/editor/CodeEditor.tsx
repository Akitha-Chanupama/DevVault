import React from 'react';
import Editor, { OnChange, OnMount, BeforeMount } from '@monaco-editor/react';
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
  onExecute?: () => void;
}

const defineDevVaultThemes: BeforeMount = (monaco) => {
  monaco.editor.defineTheme('devvault-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: '', background: '141B2A' },
      { token: 'comment', foreground: '6272A4', fontStyle: 'italic' },
      { token: 'string', foreground: '7DD3FC' },
      { token: 'keyword', foreground: 'F472B6' },
      { token: 'number', foreground: '60A5FA' },
      { token: 'type', foreground: '34D399' },
      { token: 'delimiter', foreground: '94A3B8' },
    ],
    colors: {
      'editor.background': '#141B2A',
      'editor.foreground': '#F1F5F9',
      'editorGutter.background': '#141B2A',
      'editorLineNumber.foreground': '#475569',
      'editorLineNumber.activeForeground': '#60A5FA',
      'editor.lineHighlightBackground': '#192338',
      'editor.selectionBackground': '#263756',
      'editor.inactiveSelectionBackground': '#1e2d47',
      'editorCursor.foreground': '#60A5FA',
      'editorWhitespace.foreground': '#263247',
    },
  });

  monaco.editor.defineTheme('devvault-light', {
    base: 'vs',
    inherit: true,
    rules: [
      { token: '', background: 'FFFFFF' },
      { token: 'comment', foreground: '64748B', fontStyle: 'italic' },
      { token: 'string', foreground: '0284C7' },
      { token: 'keyword', foreground: 'DB2777' },
      { token: 'number', foreground: '2563EB' },
      { token: 'type', foreground: '059669' },
      { token: 'delimiter', foreground: '475569' },
    ],
    colors: {
      'editor.background': '#FFFFFF',
      'editor.foreground': '#0C1E36',
      'editorGutter.background': '#FFFFFF',
      'editorLineNumber.foreground': '#94A3B8',
      'editorLineNumber.activeForeground': '#2563EB',
      'editor.lineHighlightBackground': '#F0F6FC',
      'editor.selectionBackground': '#BAE6FD',
      'editor.inactiveSelectionBackground': '#E0F2FE',
      'editorCursor.foreground': '#2563EB',
      'editorWhitespace.foreground': '#E2EDF9',
    },
  });
};

export const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  language = 'json',
  readOnly = false,
  height = '420px',
  wordWrap = 'on',
  className,
  lineNumbers = 'on',
  onExecute,
}) => {
  const resolvedTheme = useThemeStore((state) => state.resolvedTheme);

  const handleEditorChange: OnChange = (val) => {
    if (onChange) {
      onChange(val ?? '');
    }
  };

  const handleEditorMount: OnMount = (editor, monaco) => {
    // Configure editor defaults
    editor.updateOptions({
      fontFamily: 'JetBrains Mono, Menlo, Monaco, Consolas, monospace',
      fontSize: 13,
      lineHeight: 20,
      renderWhitespace: 'selection',
      scrollBeyondLastLine: false,
      tabSize: 2,
    });

    if (onExecute) {
      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
        onExecute();
      });
    }
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
        theme={resolvedTheme === 'dark' ? 'devvault-dark' : 'devvault-light'}
        beforeMount={defineDevVaultThemes}
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
