import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Search,
  Sun,
  Moon,
  Laptop,
  Keyboard,
  PanelLeftClose,
  PanelLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useThemeStore } from '@/stores/themeStore';
import { useWorkspaceStore } from '@/stores/workspaceStore';

interface HeaderProps {
  onOpenShortcuts?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenShortcuts }) => {
  const { theme, setTheme } = useThemeStore();
  const { sidebarOpen, toggleSidebar, setCommandPaletteOpen } = useWorkspaceStore();

  const isMac = typeof window !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const shortcutKey = isMac ? '⌘ + K' : 'Ctrl + K';

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-sidebar/95 dark:bg-background/95 px-4 backdrop-blur-md transition-colors sm:px-6 shrink-0">
      <div className="flex items-center gap-2 sm:gap-3.5 min-w-0">
        {/* Brand Logo & Project Name - Permanently visible at top, never collapsed */}
        <NavLink to="/" className="flex items-center gap-2.5 shrink-0 group mr-1">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100/70 dark:bg-blue-600/15 border border-blue-200 dark:border-blue-500/30 text-blue-600 dark:text-blue-400 font-bold font-mono text-sm shadow-xs shadow-blue-500/10 shrink-0 group-hover:scale-105 group-hover:border-blue-400 dark:group-hover:border-blue-500/50 transition-all">
            &lt;/&gt;
          </div>
          <span className="font-bold text-base tracking-tight text-slate-900 dark:text-foreground hidden sm:inline-block">
            Dev<span className="text-blue-600 dark:text-blue-500">Vault</span>
          </span>
        </NavLink>

        {/* Sidebar Collapse Toggle Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="h-8 w-8 rounded-lg text-slate-500 hover:text-blue-800 dark:text-muted-foreground dark:hover:text-foreground hover:bg-blue-100/60 dark:hover:bg-slate-800/60 transition-colors shrink-0"
          title={sidebarOpen ? 'Collapse navigation items' : 'Expand navigation items'}
          aria-label="Toggle navigation menu"
        >
          {sidebarOpen ? (
            <PanelLeftClose className="w-4 h-4" />
          ) : (
            <PanelLeft className="w-4 h-4" />
          )}
        </Button>

        {/* Subtle vertical separator */}
        <div className="h-5 w-px bg-border/80 hidden md:block mx-1 shrink-0" />

        {/* Global tool search input matching reference */}
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="flex h-10 w-44 sm:w-64 md:w-80 lg:w-96 items-center justify-between rounded-xl border border-border bg-surface hover:bg-white dark:bg-surface dark:hover:bg-slate-800/60 px-3.5 text-sm text-slate-600 dark:text-muted-foreground hover:border-blue-400 dark:hover:border-blue-500/40 hover:shadow-xs transition-all shadow-2xs group"
          aria-label="Open command palette"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <Search className="w-4 h-4 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-500 transition-colors shrink-0" />
            <span className="truncate">Search tools...</span>
          </div>
          <kbd className="hidden sm:inline-flex text-[11px] font-mono px-2 py-0.5 rounded-md bg-surface-elevated dark:bg-surface border border-border text-slate-600 dark:text-muted-foreground/90 shrink-0">
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
            className="h-9 w-9 rounded-xl text-slate-500 hover:text-blue-800 dark:text-muted-foreground dark:hover:text-foreground hover:bg-blue-100/60 dark:hover:bg-slate-800/60 hidden sm:inline-flex"
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