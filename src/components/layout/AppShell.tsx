import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { CommandPalette } from '@/features/command-palette/CommandPalette';
import { KeyboardShortcutsModal } from './KeyboardShortcutsModal';
import { AssistantFAB } from '@/features/assistant/components/AssistantFAB';
import { AssistantModal } from '@/features/assistant/components/AssistantModal';
import { Toaster } from 'sonner';
import { useThemeStore } from '@/stores/themeStore';

export const AppShell: React.FC = () => {
  const resolvedTheme = useThemeStore((state) => state.resolvedTheme);
  const { theme, setTheme } = useThemeStore();
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Smooth scroll-to-top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location.pathname]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isInput =
        activeEl?.tagName === 'INPUT' ||
        activeEl?.tagName === 'TEXTAREA' ||
        (activeEl as HTMLElement)?.isContentEditable;

      if (!isInput) {
        if (e.key === '?') {
          e.preventDefault();
          setShortcutsOpen((prev) => !prev);
        }
      }

      // Theme toggle shortcut: Ctrl + Shift + T
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 't') {
        e.preventDefault();
        if (theme === 'dark') setTheme('light');
        else if (theme === 'light') setTheme('system');
        else setTheme('dark');
      }

      // Navigation shortcuts
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 's') {
        e.preventDefault();
        navigate('/snippets');
      }

      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'h') {
        e.preventDefault();
        navigate('/history');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [theme, setTheme, navigate]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header onOpenShortcuts={() => setShortcutsOpen(true)} />
      <div className="flex flex-1 min-w-0">
        <Sidebar />
        <main className="flex-1 px-4 py-6 sm:px-8 max-w-7xl w-full mx-auto min-w-0">
          <div key={location.pathname} className="animate-page-enter">
            <Outlet />
          </div>
        </main>
      </div>

      <CommandPalette />
      <KeyboardShortcutsModal isOpen={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
      <AssistantModal />
      <AssistantFAB />
      <Toaster
        theme={resolvedTheme}
        position="bottom-right"
        offset="80px"
        toastOptions={{
          style: {
            background: 'var(--surface-elevated)',
            color: 'var(--foreground)',
            borderColor: 'var(--border)',
          },
        }}
      />
    </div>
  );
};
