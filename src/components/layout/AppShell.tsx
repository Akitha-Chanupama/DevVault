import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { CommandPalette } from '@/features/command-palette/CommandPalette';
import { Toaster } from 'sonner';
import { useThemeStore } from '@/stores/themeStore';

export const AppShell: React.FC = () => {
  const resolvedTheme = useThemeStore((state) => state.resolvedTheme);

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <div className="flex flex-1 flex-col min-w-0">
        <Header />
        <main className="flex-1 px-4 py-6 sm:px-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      <CommandPalette />
      <Toaster
        theme={resolvedTheme}
        position="bottom-right"
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

