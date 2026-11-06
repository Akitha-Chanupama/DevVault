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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in"
    >
      <div
        className="relative w-full max-w-lg bg-card border rounded-xl shadow-xl overflow-hidden p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2">
            <Keyboard className="w-5 h-5 text-primary" />
            <h3 id="shortcuts-dialog-title" className="text-base font-bold text-foreground">
              Keyboard Shortcuts
            </h3>
          </div>
          <Button
            size="icon"
            variant="ghost"
            onClick={onClose}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            aria-label="Close shortcuts modal"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-2.5 py-1">
          {SHORTCUTS.map((s, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between py-1.5 border-b border-border/40 text-xs"
            >
              <span className="text-muted-foreground font-medium">{s.description}</span>
              <div className="flex items-center gap-1 font-mono">
                {s.keys.map((k, kIdx) => (
                  <kbd
                    key={kIdx}
                    className="px-2 py-1 rounded bg-muted text-foreground border font-bold text-[11px] shadow-2xs"
                  >
                    {k}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2 text-center text-xs text-muted-foreground">
          Press <kbd className="px-1.5 py-0.5 rounded bg-muted border text-[10px] font-mono">Esc</kbd> to dismiss this dialog
        </div>
      </div>
    </div>
  );
};
