import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Home,
  LayoutGrid,
  Code,
  Send,
  Shield,
  FileText,
  Sparkles,
  Code2,
  Database,
  Globe,
  Clock,
  Star,
  History,
  Layers,
  Settings,
  HelpCircle,
  PanelLeftClose,
  PanelLeft,
} from 'lucide-react';
import { TOOL_REGISTRY } from '@/tools/registry';
import { useWorkspaceStore } from '@/stores/workspaceStore';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SidebarProps {
  onOpenHelp?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenHelp }) => {
  const location = useLocation();
  const { sidebarOpen, toggleSidebar } = useWorkspaceStore();

  const totalCount = TOOL_REGISTRY.length;

  const categories = [
    { name: 'JSON & Data', icon: <Code className="w-4 h-4 shrink-0" /> },
    { name: 'API & HTTP', icon: <Send className="w-4 h-4 shrink-0" /> },
    { name: 'Security', icon: <Shield className="w-4 h-4 shrink-0" /> },
    { name: 'Text & Code', icon: <FileText className="w-4 h-4 shrink-0" /> },
    { name: 'Generators', icon: <Sparkles className="w-4 h-4 shrink-0" /> },
    { name: 'Web Development', icon: <Code2 className="w-4 h-4 shrink-0" /> },
    { name: 'Database', icon: <Database className="w-4 h-4 shrink-0" /> },
    { name: 'Network', icon: <Globe className="w-4 h-4 shrink-0" /> },
    { name: 'Time & Date', icon: <Clock className="w-4 h-4 shrink-0" /> },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={cn(
          'fixed top-0 bottom-0 left-0 z-40 flex flex-col border-r border-border bg-sidebar transition-all duration-200 ease-in-out lg:static select-none',
          sidebarOpen ? 'w-64' : 'w-0 lg:w-16 overflow-hidden'
        )}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-border shrink-0">
          <NavLink to="/" className="flex items-center gap-3 overflow-hidden group">
            {/* DevVault stylized bracket logo badge */}
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600/15 border border-blue-500/30 text-blue-400 font-bold font-mono text-sm shadow-xs shadow-blue-500/10 shrink-0 group-hover:scale-105 group-hover:border-blue-500/50 transition-all">
              &lt;/&gt;
            </div>
            {sidebarOpen && (
              <span className="font-bold text-base tracking-tight text-foreground">
                Dev<span className="text-blue-500">Vault</span>
              </span>
            )}
          </NavLink>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="hidden lg:flex h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-elevated"
            title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            aria-label="Toggle sidebar width"
          >
            {sidebarOpen ? (
              <PanelLeftClose className="w-4 h-4" />
            ) : (
              <PanelLeft className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* Scrollable Navigation Body */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {/* Main Top Nav */}
          <div className="space-y-1.5">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                cn(
                  'group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all',
                  isActive
                    ? 'bg-blue-600 text-white font-semibold shadow-sm shadow-blue-900/40'
                    : 'text-slate-300 dark:text-slate-300 hover:text-white hover:bg-surface-elevated/70'
                )
              }
            >
              <Home className="w-4 h-4 shrink-0" />
              {sidebarOpen && <span>Dashboard</span>}
            </NavLink>

            <NavLink
              to="/tools"
              className={({ isActive }) =>
                cn(
                  'group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all',
                  isActive
                    ? 'bg-blue-600 text-white font-semibold shadow-sm shadow-blue-900/40'
                    : 'text-slate-300 dark:text-slate-300 hover:text-white hover:bg-surface-elevated/70'
                )
              }
            >
              <div className="flex items-center gap-3 min-w-0">
                <LayoutGrid className="w-4 h-4 shrink-0" />
                {sidebarOpen && <span>All Tools</span>}
              </div>
              {sidebarOpen && (
                <span className="text-xs font-mono font-medium text-muted-foreground bg-surface-elevated px-2 py-0.5 rounded-full border border-border group-hover:border-blue-500/30 transition-colors">
                  {totalCount}
                </span>
              )}
            </NavLink>
          </div>

          {/* Categories Section */}
          <div className="space-y-1">
            {sidebarOpen && (
              <div className="px-3.5 pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/75">
                Categories
              </div>
            )}
            {categories.map((cat) => {
              const isCurrent =
                location.pathname === '/tools' &&
                location.search.includes(encodeURIComponent(cat.name));

              return (
                <NavLink
                  key={cat.name}
                  to={`/tools?category=${encodeURIComponent(cat.name)}`}
                  className={cn(
                    'group flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm font-medium transition-all',
                    isCurrent
                      ? 'bg-primary/15 text-blue-400 font-semibold border border-blue-500/20'
                      : 'text-slate-300 dark:text-slate-300 hover:text-white hover:bg-surface-elevated/70'
                  )}
                  title={cat.name}
                >
                  <span className="text-muted-foreground group-hover:text-blue-400 transition-colors">
                    {cat.icon}
                  </span>
                  {sidebarOpen && <span className="truncate">{cat.name}</span>}
                </NavLink>
              );
            })}
          </div>

          {/* Workspace Section */}
          <div className="space-y-1">
            {sidebarOpen && (
              <div className="px-3.5 pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/75">
                Workspace
              </div>
            )}
            <NavLink
              to="/snippets"
              className={({ isActive }) =>
                cn(
                  'group flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm font-medium transition-all',
                  isActive
                    ? 'bg-primary/15 text-blue-400 font-semibold border border-blue-500/20'
                    : 'text-slate-300 dark:text-slate-300 hover:text-white hover:bg-surface-elevated/70'
                )
              }
              title="Snippets"
            >
              <Code className="w-4 h-4 shrink-0 text-muted-foreground group-hover:text-blue-400 transition-colors" />
              {sidebarOpen && <span>Snippets</span>}
            </NavLink>

            <NavLink
              to="/tools?filter=favorites"
              className={({ isActive }) =>
                cn(
                  'group flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm font-medium transition-all',
                  isActive
                    ? 'bg-primary/15 text-blue-400 font-semibold border border-blue-500/20'
                    : 'text-slate-300 dark:text-slate-300 hover:text-white hover:bg-surface-elevated/70'
                )
              }
              title="Favorites"
            >
              <Star className="w-4 h-4 shrink-0 text-muted-foreground group-hover:text-amber-400 transition-colors" />
              {sidebarOpen && <span>Favorites</span>}
            </NavLink>

            <NavLink
              to="/history"
              className={({ isActive }) =>
                cn(
                  'group flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm font-medium transition-all',
                  isActive
                    ? 'bg-primary/15 text-blue-400 font-semibold border border-blue-500/20'
                    : 'text-slate-300 dark:text-slate-300 hover:text-white hover:bg-surface-elevated/70'
                )
              }
              title="History"
            >
              <History className="w-4 h-4 shrink-0 text-muted-foreground group-hover:text-blue-400 transition-colors" />
              {sidebarOpen && <span>History</span>}
            </NavLink>

            <NavLink
              to="/snippets?tab=collections"
              className={({ isActive }) =>
                cn(
                  'group flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm font-medium transition-all',
                  isActive
                    ? 'bg-primary/15 text-blue-400 font-semibold border border-blue-500/20'
                    : 'text-slate-300 dark:text-slate-300 hover:text-white hover:bg-surface-elevated/70'
                )
              }
              title="Collections"
            >
              <Layers className="w-4 h-4 shrink-0 text-muted-foreground group-hover:text-blue-400 transition-colors" />
              {sidebarOpen && <span>Collections</span>}
            </NavLink>
          </div>
        </div>

        {/* Bottom Section: Settings & Help */}
        <div className="p-3 border-t border-border shrink-0 space-y-1">
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              cn(
                'group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all',
                isActive
                  ? 'bg-primary/15 text-blue-400 font-semibold border border-blue-500/20'
                  : 'text-slate-300 dark:text-slate-300 hover:text-white hover:bg-surface-elevated/70'
              )
            }
            title="Settings"
          >
            <Settings className="w-4 h-4 shrink-0 text-muted-foreground group-hover:text-blue-400 transition-colors" />
            {sidebarOpen && <span>Settings</span>}
          </NavLink>

          <button
            type="button"
            onClick={onOpenHelp}
            className="w-full group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-300 dark:text-slate-300 hover:text-white hover:bg-surface-elevated/70 transition-all text-left"
            title="Help & Docs"
          >
            <HelpCircle className="w-4 h-4 shrink-0 text-muted-foreground group-hover:text-blue-400 transition-colors" />
            {sidebarOpen && <span>Help & Docs</span>}
          </button>
        </div>
      </aside>
    </>
  );
};