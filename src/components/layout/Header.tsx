import React from 'react';
import {
  Search,
  Sun,
  Moon,
  Laptop,
  Menu,
  Keyboard,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useThemeStore } from '@/stores/themeStore';
import { useWorkspaceStore } from '@/stores/workspaceStore';

interface HeaderProps {
  onOpenShortcuts?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenShortcuts }) => {
  const { theme, setTheme } = useThemeStore();
  const { toggleSidebar, setCommandPaletteOpen } = useWorkspaceStore();

  const isMac = typeof window !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const shortcutKey = isMac ? '⌘ + K' : 'Ctrl + K';

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-surface/95 dark:bg-background/95 px-4 backdrop-blur-md transition-colors sm:px-6 shrink-0">
      <div className="flex items-center gap-3">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="lg:hidden h-9 w-9 rounded-lg text-slate-600 hover:text-slate-900 dark:text-muted-foreground dark:hover:text-foreground hover:bg-slate-100 dark:hover:bg-surface-elevated"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </Button>

        {/* Global tool search input matching reference */}
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="flex h-10 w-64 sm:w-80 md:w-96 items-center justify-between rounded-xl border border-border bg-surface-elevated/50 hover:bg-surface dark:bg-surface px-3.5 text-sm text-slate-600 dark:text-muted-foreground hover:border-blue-400 dark:hover:border-blue-500/40 hover:shadow-xs transition-all shadow-2xs group"
          aria-label="Open command palette"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <Search className="w-4 h-4 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-500 transition-colors shrink-0" />
            <span className="truncate">Search tools...</span>
          </div>
          <kbd className="hidden sm:inline-flex text-[11px] font-mono px-2 py-0.5 rounded-md bg-surface border border-border text-slate-500 dark:text-muted-foreground/90 shrink-0">
            {shortcutKey}
          </kbd>
        </button>
      </div>

      <div className="flex items-center gap-3">
        {/* Keyboard Shortcuts Trigger */}
        {onOpenShortcuts && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onOpenShortcuts}
            className="h-9 w-9 rounded-xl text-slate-500 hover:text-slate-900 dark:text-muted-foreground dark:hover:text-foreground hover:bg-slate-100 dark:hover:bg-surface-elevated hidden sm:inline-flex"
            title="Keyboard shortcuts (?)"
            aria-label="Keyboard shortcuts"
          >
            <Keyboard className="w-4 h-4" />
          </Button>
        )}

        {/* 3-State Theme Selector Pill */}
        <div
          role="radiogroup"
          aria-label="Theme mode selector"
          className="flex items-center gap-1 bg-surface-elevated dark:bg-surface border border-border p-1 rounded-full shadow-2xs"
        >
          <button
            type="button"
            role="radio"
            aria-checked={theme === 'light'}
            onClick={() => setTheme('light')}
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
              theme === 'light'
                ? 'bg-surface text-amber-600 dark:text-amber-400 shadow-xs border border-border'
                : 'text-slate-500 dark:text-muted-foreground hover:text-slate-900 dark:hover:text-foreground'
            }`}
            title="Light mode"
            aria-label="Light mode"
          >
            <Sun className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            role="radio"
            aria-checked={theme === 'dark'}
            onClick={() => setTheme('dark')}
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
              theme === 'dark'
                ? 'bg-primary/20 text-blue-600 dark:text-blue-400 shadow-xs border border-primary/30'
                : 'text-slate-500 dark:text-muted-foreground hover:text-slate-900 dark:hover:text-foreground'
            }`}
            title="Dark mode"
            aria-label="Dark mode"
          >
            <Moon className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            role="radio"
            aria-checked={theme === 'system'}
            onClick={() => setTheme('system')}
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
              theme === 'system'
                ? 'bg-primary/20 text-blue-600 dark:text-blue-400 shadow-xs border border-primary/30'
                : 'text-slate-500 dark:text-muted-foreground hover:text-slate-900 dark:hover:text-foreground'
            }`}
            title="System theme"
            aria-label="System theme"
          >
            <Laptop className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* User avatar badge */}
        <div
          className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-elevated border border-border text-foreground font-bold text-xs select-none shadow-2xs"
          title="Developer Profile"
        >
          JD
        </div>
      </div>
    </header>
  );
};