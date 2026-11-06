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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 dark:bg-black/55 backdrop-blur-sm animate-in fade-in transition-all"
    >
      <div
        className="relative w-full max-w-lg bg-white/95 dark:bg-[#0c1324]/95 backdrop-blur-2xl border border-slate-200 dark:border-blue-500/30 rounded-2xl shadow-2xl shadow-black/90 ring-1 ring-black/5 dark:ring-white/10 overflow-hidden p-6 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-border/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 dark:bg-blue-500/15 border border-blue-500/25 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 shadow-xs">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h3 id="shortcuts-dialog-title" className="text-base font-bold text-foreground">
                Keyboard Shortcuts
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Quick commands to navigate and control DevVault
              </p>
            </div>
          </div>
          <Button
            size="icon"
            variant="ghost"
            onClick={onClose}
            className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-elevated transition-colors"
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
              className="flex items-center justify-between py-2.5 px-3 rounded-xl bg-surface-elevated/40 dark:bg-[#131b2e]/60 border border-border/50 hover:border-blue-500/30 transition-all text-sm"
            >
              <span className="text-foreground/90 font-medium">{s.description}</span>
              <div className="flex items-center gap-1.5 font-mono">
                {s.keys.map((k, kIdx) => (
                  <kbd
                    key={kIdx}
                    className="px-2.5 py-1 rounded-md bg-surface border border-border dark:bg-[#1a253d] dark:border-blue-500/30 text-foreground dark:text-blue-200 font-bold text-xs shadow-2xs"
                  >
                    {k}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Dismiss footer */}
        <div className="pt-2 text-center text-xs text-muted-foreground border-t border-border/40">
          Press <kbd className="px-2 py-0.5 rounded bg-surface-elevated border border-border text-foreground text-xs font-mono font-medium">Esc</kbd> to dismiss this dialog
        </div>
      </div>
    </div>
  );
};