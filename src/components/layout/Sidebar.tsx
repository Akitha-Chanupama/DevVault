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
    { name: 'JSON & Data', icon: <Code className="w-4 h-4" /> },
    { name: 'API & HTTP', icon: <Send className="w-4 h-4" /> },
    { name: 'Security', icon: <Shield className="w-4 h-4" /> },
    { name: 'Text & Code', icon: <FileText className="w-4 h-4" /> },
    { name: 'Generators', icon: <Sparkles className="w-4 h-4" /> },
    { name: 'Web Development', icon: <Code2 className="w-4 h-4" /> },
    { name: 'Database', icon: <Database className="w-4 h-4" /> },
    { name: 'Network', icon: <Globe className="w-4 h-4" /> },
    { name: 'Time & Date', icon: <Clock className="w-4 h-4" /> },
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
          sidebarOpen ? 'w-60' : 'w-0 lg:w-16 overflow-hidden'
        )}
      >
        {/* Brand Header */}
        <div className="flex h-14 items-center justify-between px-4 border-b border-border">
          <NavLink to="/" className="flex items-center gap-2.5 overflow-hidden">
            {/* DevVault stylized bracket logo */}
            <div className="flex items-center justify-center text-primary font-bold text-lg tracking-tighter">
              &lt;/&gt;
            </div>
            {sidebarOpen && (
              <span className="font-bold text-base tracking-tight text-foreground">
                DevVault
              </span>
            )}
          </NavLink>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="hidden lg:flex h-7 w-7 text-muted-foreground hover:text-foreground"
            title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            aria-label="Toggle sidebar width"
          >
            {sidebarOpen ? <PanelLeftClose className="w-3.5 h-3.5" /> : <PanelLeft className="w-3.5 h-3.5" />}
          </Button>
        </div>

        {/* Scrollable Navigation Body */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-5">
          {/* Main Top Nav */}
          <div className="space-y-1">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors',
                  isActive
                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                    : 'text-muted-foreground hover:bg-surface-elevated hover:text-foreground'
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
                  'flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors',
                  isActive
                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                    : 'text-muted-foreground hover:bg-surface-elevated hover:text-foreground'
                )
              }
            >
              <div className="flex items-center gap-3">
                <LayoutGrid className="w-4 h-4 shrink-0" />
                {sidebarOpen && <span>All Tools</span>}
              </div>
              {sidebarOpen && (
                <span className="text-[11px] font-mono text-muted-foreground bg-surface-elevated px-2 py-0.5 rounded-full border border-border">
                  {totalCount}
                </span>
              )}
            </NavLink>
          </div>

          {/* Categories Section */}
          <div className="space-y-1">
            {sidebarOpen && (
              <div className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
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
                    'flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                    isCurrent
                      ? 'bg-primary/15 text-primary font-semibold'
                      : 'text-muted-foreground hover:bg-surface-elevated hover:text-foreground'
                  )}
                  title={cat.name}
                >
                  <span className="shrink-0">{cat.icon}</span>
                  {sidebarOpen && <span className="truncate">{cat.name}</span>}
                </NavLink>
              );
            })}
          </div>

          {/* Workspace Section */}
          <div className="space-y-1">
            {sidebarOpen && (
              <div className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                Workspace
              </div>
            )}
            <NavLink
              to="/snippets"
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                  isActive
                    ? 'bg-primary/15 text-primary font-semibold'
                    : 'text-muted-foreground hover:bg-surface-elevated hover:text-foreground'
                )
              }
              title="Snippets"
            >
              <Code className="w-4 h-4 shrink-0" />
              {sidebarOpen && <span>Snippets</span>}
            </NavLink>

            <NavLink
              to="/tools?filter=favorites"
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                  isActive
                    ? 'bg-primary/15 text-primary font-semibold'
                    : 'text-muted-foreground hover:bg-surface-elevated hover:text-foreground'
                )
              }
              title="Favorites"
            >
              <Star className="w-4 h-4 shrink-0" />
              {sidebarOpen && <span>Favorites</span>}
            </NavLink>

            <NavLink
              to="/history"
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                  isActive
                    ? 'bg-primary/15 text-primary font-semibold'
                    : 'text-muted-foreground hover:bg-surface-elevated hover:text-foreground'
                )
              }
              title="History"
            >
              <History className="w-4 h-4 shrink-0" />
              {sidebarOpen && <span>History</span>}
            </NavLink>

            <NavLink
              to="/snippets?tab=collections"
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                  isActive
                    ? 'bg-primary/15 text-primary font-semibold'
                    : 'text-muted-foreground hover:bg-surface-elevated hover:text-foreground'
                )
              }
              title="Collections"
            >
              <Layers className="w-4 h-4 shrink-0" />
              {sidebarOpen && <span>Collections</span>}
            </NavLink>
          </div>
        </div>

        {/* Bottom Section: Settings & Help */}
        <div className="p-3 border-t border-border space-y-1">
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors',
                isActive
                  ? 'bg-primary/15 text-primary font-semibold'
                  : 'text-muted-foreground hover:bg-surface-elevated hover:text-foreground'
              )
            }
            title="Settings"
          >
            <Settings className="w-4 h-4 shrink-0" />
            {sidebarOpen && <span>Settings</span>}
          </NavLink>

          <button
            type="button"
            onClick={onOpenHelp}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:bg-surface-elevated hover:text-foreground transition-colors text-left"
            title="Help & Docs"
          >
            <HelpCircle className="w-4 h-4 shrink-0" />
            {sidebarOpen && <span>Help & Docs</span>}
          </button>
        </div>
      </aside>
    </>
  );
};
