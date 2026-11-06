import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Grid,
  FileCode2,
  Send,
  ShieldCheck,
  FileText,
  Sparkles,
  Code2,
  Database,
  Clock,
  Star,
  Shield,
  PanelLeftClose,
  PanelLeft,
} from 'lucide-react';
import { TOOL_REGISTRY } from '@/tools/registry';
import { useWorkspaceStore } from '@/stores/workspaceStore';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const { sidebarOpen, toggleSidebar, favorites } = useWorkspaceStore();

  const availableCount = TOOL_REGISTRY.filter((t) => t.status === 'available').length;
  const totalCount = TOOL_REGISTRY.length;

  const categoryIcons: Record<string, React.ReactNode> = {
    'JSON & Data': <FileCode2 className="w-4 h-4 text-primary" />,
    'API & HTTP': <Send className="w-4 h-4 text-secondary" />,
    'Security': <ShieldCheck className="w-4 h-4 text-success" />,
    'Text & Code': <FileText className="w-4 h-4 text-warning" />,
    'Generators': <Sparkles className="w-4 h-4 text-purple-400" />,
    'Web Development': <Code2 className="w-4 h-4 text-blue-400" />,
    'Database': <Database className="w-4 h-4 text-emerald-400" />,
    'Time & Date': <Clock className="w-4 h-4 text-amber-400" />,
  };

  const favoritedTools = TOOL_REGISTRY.filter((t) => favorites.includes(t.id));

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
          'fixed top-0 bottom-0 left-0 z-40 flex flex-col border-r border-border bg-surface transition-all duration-200 ease-in-out lg:static',
          sidebarOpen ? 'w-64' : 'w-0 lg:w-16 overflow-hidden'
        )}
      >
        {/* Brand header */}
        <div className="flex h-14 items-center justify-between px-4 border-b border-border">
          <NavLink to="/" className="flex items-center gap-2.5 overflow-hidden">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 text-primary">
              <Shield className="w-4 h-4" />
            </div>
            {sidebarOpen && (
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight text-foreground">
                  Dev<span className="text-primary">Vault</span>
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-surface-elevated border border-border text-muted-foreground">
                  v1.0
                </span>
              </div>
            )}
          </NavLink>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="hidden lg:flex h-7 w-7 text-muted-foreground hover:text-foreground"
            title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {sidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeft className="w-4 h-4" />}
          </Button>
        </div>

        {/* Scrollable navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {/* Main Links */}
          <div className="space-y-1">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary font-semibold'
                    : 'text-muted-foreground hover:bg-surface-elevated hover:text-foreground'
                )
              }
            >
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              {sidebarOpen && <span>Dashboard</span>}
            </NavLink>

            <NavLink
              to="/tools"
              className={({ isActive }) =>
                cn(
                  'flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary font-semibold'
                    : 'text-muted-foreground hover:bg-surface-elevated hover:text-foreground'
                )
              }
            >
              <div className="flex items-center gap-3">
                <Grid className="w-4 h-4 shrink-0" />
                {sidebarOpen && <span>All Tools</span>}
              </div>
              {sidebarOpen && (
                <span className="text-[11px] font-mono text-muted-foreground/70 bg-surface-elevated px-1.5 py-0.2 rounded border border-border">
                  {totalCount}
                </span>
              )}
            </NavLink>
          </div>

          {/* Quick Access: Favorites */}
          {sidebarOpen && favoritedTools.length > 0 && (
            <div className="space-y-1">
              <div className="px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70 flex items-center justify-between">
                <span>Favorites</span>
                <Star className="w-3 h-3 text-warning fill-warning" />
              </div>
              <div className="space-y-0.5 pt-1">
                {favoritedTools.slice(0, 5).map((tool) => (
                  <NavLink
                    key={tool.id}
                    to={tool.route}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center justify-between px-3 py-1.5 rounded-md text-xs transition-colors',
                        isActive
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'text-muted-foreground hover:bg-surface-elevated hover:text-foreground'
                      )
                    }
                  >
                    <span className="truncate">{tool.name}</span>
                    {tool.status === 'available' ? (
                      <span className="w-1.5 h-1.5 rounded-full bg-success" />
                    ) : (
                      <span className="text-[10px] text-muted-foreground/50">Soon</span>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          )}

          {/* Tools by Category */}
          {sidebarOpen && (
            <div className="space-y-4">
              <div className="px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                Tool Categories
              </div>

              <div className="space-y-1">
                {Object.entries(categoryIcons).map(([cat, icon]) => {
                  const catTools = TOOL_REGISTRY.filter((t) => t.category === cat);
                  const isCurrentCategory =
                    location.pathname === '/tools' && location.search.includes(encodeURIComponent(cat));

                  return (
                    <NavLink
                      key={cat}
                      to={`/tools?category=${encodeURIComponent(cat)}`}
                      className={cn(
                        'flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors',
                        isCurrentCategory
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:bg-surface-elevated hover:text-foreground'
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        {icon}
                        <span>{cat}</span>
                      </div>
                      <span className="text-[10px] text-muted-foreground/60">
                        {catTools.length}
                      </span>
                    </NavLink>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Footer */}
        {sidebarOpen && (
          <div className="p-3 border-t border-border bg-surface-elevated/40 space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
              <span>Status</span>
              <span className="flex items-center gap-1.5 font-medium text-foreground">
                <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                {availableCount} Active / {totalCount} Planned
              </span>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};
