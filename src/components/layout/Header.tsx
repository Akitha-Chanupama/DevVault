import React from 'react';
import {
  Search,
  Sun,
  Moon,
  Laptop,
  Menu,
  Github,
  Command,
  Keyboard,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useThemeStore } from '@/stores/themeStore';
import { useWorkspaceStore } from '@/stores/workspaceStore';

interface HeaderProps {
  onOpenShortcuts?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenShortcuts }) => {
  const { theme, resolvedTheme, setTheme } = useThemeStore();
  const { toggleSidebar, setCommandPaletteOpen } = useWorkspaceStore();

  const handleCycleTheme = () => {
    if (theme === 'dark') setTheme('light');
    else if (theme === 'light') setTheme('system');
    else setTheme('dark');
  };

  const getThemeIcon = () => {
    if (theme === 'system') return <Laptop className="w-4 h-4 text-primary" />;
    return resolvedTheme === 'dark' ? (
      <Moon className="w-4 h-4 text-primary" />
    ) : (
      <Sun className="w-4 h-4 text-warning" />
    );
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-border bg-surface/80 px-4 backdrop-blur-md transition-colors sm:px-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="lg:hidden h-8 w-8 text-muted-foreground hover:text-foreground"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-4 h-4" />
        </Button>

        {/* Global Command Palette search trigger */}
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="flex h-9 w-64 md:w-80 items-center justify-between rounded-md border border-border bg-surface-elevated/80 px-3 text-xs text-muted-foreground hover:border-muted-foreground/40 hover:bg-surface-elevated transition-colors shadow-sm"
          aria-label="Open command palette"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5" />
            <span>Search utilities and actions...</span>
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-border bg-surface px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
            <Command className="w-2.5 h-2.5" /> K
          </kbd>
        </button>
      </div>

      <div className="flex items-center gap-2">
        {/* Keyboard Shortcuts Trigger Button */}
        {onOpenShortcuts && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onOpenShortcuts}
            className="h-8 w-8 text-muted-foreground hover:text-foreground hidden sm:inline-flex"
            title="Keyboard shortcuts (?)"
            aria-label="Keyboard shortcuts"
          >
            <Keyboard className="w-4 h-4" />
          </Button>
        )}

        {/* Theme Mode Selector Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCycleTheme}
          className="h-8 px-2.5 text-xs text-muted-foreground hover:text-foreground gap-1.5 border border-transparent hover:border-border"
          title={`Theme: ${theme} (click to cycle)`}
        >
          {getThemeIcon()}
          <span className="capitalize hidden sm:inline">{theme}</span>
        </Button>

        {/* GitHub link */}
        <a
          href="https://github.com"
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-surface-elevated transition-colors"
          title="DevVault on GitHub"
          aria-label="DevVault on GitHub"
        >
          <Github className="w-4 h-4" />
        </a>
      </div>
    </header>
  );
};
