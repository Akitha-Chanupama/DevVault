import React, { useEffect } from 'react';
import { X, Keyboard } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ShortcutRow {
  keys: string[];
  description: string;
}

const SHORTCUTS: ShortcutRow[] = [
  { keys: ['Ctrl', 'K'], description: 'Open global command palette and search' },
  { keys: ['?'], description: 'Open this keyboard shortcuts reference' },
  { keys: ['Ctrl', 'Shift', 'T'], description: 'Cycle color theme (Light / Dark / System)' },
  { keys: ['Ctrl', 'Shift', 'S'], description: 'Navigate to Snippets Manager' },
  { keys: ['Ctrl', 'Shift', 'H'], description: 'Navigate to Workspace History' },
  { keys: ['Esc'], description: 'Close any active modal or command palette' },
];

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-dialog-title"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-black/65 backdrop-blur-xs animate-in fade-in transition-all"
    >
      <div
        className="relative w-full max-w-lg bg-white dark:bg-[#0c1324] border border-slate-200 dark:border-blue-500/30 rounded-2xl shadow-2xl shadow-blue-950/10 dark:shadow-black/90 ring-1 ring-slate-900/5 dark:ring-white/10 overflow-hidden p-6 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-border/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100/70 dark:bg-blue-500/15 border border-blue-200 dark:border-blue-500/25 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 shadow-xs">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h3 id="shortcuts-dialog-title" className="text-base font-bold text-slate-900 dark:text-foreground">
                Keyboard Shortcuts
              </h3>
              <p className="text-xs text-slate-500 dark:text-muted-foreground mt-0.5">
                Quick commands to navigate and control DevVault
              </p>
            </div>
          </div>
          <Button
            size="icon"
            variant="ghost"
            onClick={onClose}
            className="h-8 w-8 rounded-lg text-slate-400 hover:text-blue-800 dark:text-muted-foreground dark:hover:text-foreground hover:bg-blue-100/60 dark:hover:bg-slate-800/60 transition-colors"
            aria-label="Close shortcuts modal"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Shortcuts List */}
        <div className="space-y-1.5 py-1">
          {SHORTCUTS.map((s, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between py-2.5 px-3 rounded-xl bg-slate-50 dark:bg-[#131b2e]/60 border border-slate-200/80 dark:border-border/50 hover:border-blue-300 dark:hover:border-blue-500/30 transition-all text-sm"
            >
              <span className="text-slate-800 dark:text-foreground/90 font-medium">{s.description}</span>
              <div className="flex items-center gap-1.5 font-mono">
                {s.keys.map((k, kIdx) => (
                  <kbd
                    key={kIdx}
                    className="px-2.5 py-1 rounded-md bg-white border border-slate-200 shadow-2xs dark:bg-[#1a253d] dark:border-blue-500/30 text-slate-800 dark:text-blue-200 font-bold text-xs"
                  >
                    {k}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Dismiss footer */}
        <div className="pt-2 text-center text-xs text-slate-500 dark:text-muted-foreground border-t border-slate-200/80 dark:border-border/40">
          Press <kbd className="px-2 py-0.5 rounded bg-slate-100 dark:bg-surface-elevated border border-slate-200 dark:border-border text-slate-700 dark:text-foreground text-xs font-mono font-medium shadow-2xs">Esc</kbd> to dismiss this dialog
        </div>
      </div>
    </div>
  );
};