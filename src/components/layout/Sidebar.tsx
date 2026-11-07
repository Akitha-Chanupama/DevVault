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
  User,
} from 'lucide-react';
import { TOOL_REGISTRY } from '@/tools/registry';
import { useWorkspaceStore } from '@/stores/workspaceStore';
import { cn } from '@/lib/utils';

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const { sidebarOpen, toggleSidebar } = useWorkspaceStore();

  const searchParams = new URLSearchParams(location.search);
  const currentCategory = searchParams.get('category');
  const currentFilter = searchParams.get('filter');
  const currentTab = searchParams.get('tab');

  const isAllToolsActive = location.pathname === '/tools' && !currentCategory && !currentFilter;
  const isFavoritesActive = location.pathname === '/tools' && currentFilter === 'favorites';
  const isSnippetsActive = location.pathname === '/snippets' && !currentTab;
  const isCollectionsActive = location.pathname === '/snippets' && currentTab === 'collections';

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
          className="fixed inset-0 top-16 z-30 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={cn(
          'border-r border-border bg-sidebar transition-all duration-200 ease-in-out select-none flex flex-col',
          'fixed top-16 bottom-0 left-0 z-40 lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] lg:shrink-0',
          sidebarOpen ? 'w-64' : 'w-0 lg:w-16 overflow-hidden'
        )}
      >
        {/* Navigation Body - Spaced & Non-scrollable on standard viewports */}
        <div className="flex-1 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden px-3 py-3.5 space-y-4">
          {/* Main Top Nav */}
          <div className="space-y-1.5">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                cn(
                  'group flex items-center rounded-xl text-sm font-medium transition-all',
                  sidebarOpen ? 'gap-3 px-3.5 py-2.5 justify-start' : 'w-10 h-10 mx-auto justify-center p-0',
                  isActive
                    ? 'bg-blue-600 text-white font-semibold shadow-sm shadow-blue-600/20'
                    : 'text-slate-700 dark:text-slate-300 hover:text-blue-800 dark:hover:text-white hover:bg-blue-100/60 dark:hover:bg-slate-800/60'
                )
              }
              title="Dashboard"
            >
              <Home className="w-4 h-4 shrink-0" />
              {sidebarOpen && <span>Dashboard</span>}
            </NavLink>

            <NavLink
              to="/tools"
              className={cn(
                'group flex items-center rounded-xl text-sm font-medium transition-all',
                sidebarOpen ? 'justify-between px-3.5 py-2.5' : 'w-10 h-10 mx-auto justify-center p-0',
                isAllToolsActive
                  ? 'bg-blue-600 text-white font-semibold shadow-sm shadow-blue-600/20'
                  : 'text-slate-700 dark:text-slate-300 hover:text-blue-800 dark:hover:text-white hover:bg-blue-100/60 dark:hover:bg-slate-800/60'
              )}
              title={`All Tools (${totalCount})`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <LayoutGrid className="w-4 h-4 shrink-0" />
                {sidebarOpen && <span>All Tools</span>}
              </div>
              {sidebarOpen && (
                <span
                  className={cn(
                    'text-xs font-mono font-medium px-2 py-0.5 rounded-full border transition-colors',
                    isAllToolsActive
                      ? 'bg-blue-700/80 text-white border-blue-400/40'
                      : 'text-blue-700 dark:text-muted-foreground bg-blue-100/70 dark:bg-surface-elevated border-blue-200/80 dark:border-border group-hover:border-blue-400 dark:group-hover:border-blue-500/30'
                  )}
                >
                  {totalCount}
                </span>
              )}
            </NavLink>
          </div>

          {/* Categories Section */}
          <div className="space-y-1.5">
            {sidebarOpen && (
              <div className="px-3 pt-1 pb-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-muted-foreground/80">
                Categories
              </div>
            )}
            {categories.map((cat) => {
              const isCurrent = location.pathname === '/tools' && currentCategory === cat.name;

              return (
                <NavLink
                  key={cat.name}
                  to={`/tools?category=${encodeURIComponent(cat.name)}`}
                  className={cn(
                    'group flex items-center rounded-xl text-sm font-medium transition-all',
                    sidebarOpen ? 'gap-3 px-3.5 py-2 justify-start' : 'w-10 h-10 mx-auto justify-center p-0',
                    isCurrent
                      ? 'bg-blue-600 text-white font-semibold shadow-sm shadow-blue-600/20'
                      : 'text-slate-700 dark:text-slate-300 hover:text-blue-800 dark:hover:text-white hover:bg-blue-100/60 dark:hover:bg-slate-800/60'
                  )}
                  title={cat.name}
                >
                  <span
                    className={cn(
                      'transition-colors',
                      isCurrent
                        ? 'text-white'
                        : 'text-slate-500 group-hover:text-blue-600 dark:text-muted-foreground dark:group-hover:text-blue-400'
                    )}
                  >
                    {cat.icon}
                  </span>
                  {sidebarOpen && <span className="truncate">{cat.name}</span>}
                </NavLink>
              );
            })}
          </div>

          {/* Workspace Section */}
          <div className="space-y-1.5">
            {sidebarOpen && (
              <div className="px-3 pt-1 pb-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-muted-foreground/80">
                Workspace
              </div>
            )}
            <NavLink
              to="/snippets"
              className={cn(
                'group flex items-center rounded-xl text-sm font-medium transition-all',
                sidebarOpen ? 'gap-3 px-3.5 py-2 justify-start' : 'w-10 h-10 mx-auto justify-center p-0',
                isSnippetsActive
                  ? 'bg-blue-600 text-white font-semibold shadow-sm shadow-blue-600/20'
                  : 'text-slate-700 dark:text-slate-300 hover:text-blue-800 dark:hover:text-white hover:bg-blue-100/60 dark:hover:bg-slate-800/60'
              )}
              title="Snippets"
            >
              <Code
                className={cn(
                  'w-4 h-4 shrink-0 transition-colors',
                  isSnippetsActive
                    ? 'text-white'
                    : 'text-slate-500 group-hover:text-blue-600 dark:text-muted-foreground dark:group-hover:text-blue-400'
                )}
              />
              {sidebarOpen && <span>Snippets</span>}
            </NavLink>

            <NavLink
              to="/tools?filter=favorites"
              className={cn(
                'group flex items-center rounded-xl text-sm font-medium transition-all',
                sidebarOpen ? 'gap-3 px-3.5 py-2 justify-start' : 'w-10 h-10 mx-auto justify-center p-0',
                isFavoritesActive
                  ? 'bg-blue-600 text-white font-semibold shadow-sm shadow-blue-600/20'
                  : 'text-slate-700 dark:text-slate-300 hover:text-blue-800 dark:hover:text-white hover:bg-blue-100/60 dark:hover:bg-slate-800/60'
              )}
              title="Favorites"
            >
              <Star
                className={cn(
                  'w-4 h-4 shrink-0 transition-colors',
                  isFavoritesActive
                    ? 'fill-white text-white'
                    : 'text-slate-500 group-hover:text-amber-500 dark:text-muted-foreground dark:group-hover:text-amber-400'
                )}
              />
              {sidebarOpen && <span>Favorites</span>}
            </NavLink>

            <NavLink
              to="/history"
              className={({ isActive }) =>
                cn(
                  'group flex items-center rounded-xl text-sm font-medium transition-all',
                  sidebarOpen ? 'gap-3 px-3.5 py-2 justify-start' : 'w-10 h-10 mx-auto justify-center p-0',
                  isActive
                    ? 'bg-blue-600 text-white font-semibold shadow-sm shadow-blue-600/20'
                    : 'text-slate-700 dark:text-slate-300 hover:text-blue-800 dark:hover:text-white hover:bg-blue-100/60 dark:hover:bg-slate-800/60'
                )
              }
              title="History"
            >
              {({ isActive }) => (
                <>
                  <History
                    className={cn(
                      'w-4 h-4 shrink-0 transition-colors',
                      isActive
                        ? 'text-white'
                        : 'text-slate-500 group-hover:text-blue-600 dark:text-muted-foreground dark:group-hover:text-blue-400'
                    )}
                  />
                  {sidebarOpen && <span>History</span>}
                </>
              )}
            </NavLink>

            <NavLink
              to="/snippets?tab=collections"
              className={cn(
                'group flex items-center rounded-xl text-sm font-medium transition-all',
                sidebarOpen ? 'gap-3 px-3.5 py-2 justify-start' : 'w-10 h-10 mx-auto justify-center p-0',
                isCollectionsActive
                  ? 'bg-blue-600 text-white font-semibold shadow-sm shadow-blue-600/20'
                  : 'text-slate-700 dark:text-slate-300 hover:text-blue-800 dark:hover:text-white hover:bg-blue-100/60 dark:hover:bg-slate-800/60'
              )}
              title="Collections"
            >
              <Layers
                className={cn(
                  'w-4 h-4 shrink-0 transition-colors',
                  isCollectionsActive
                    ? 'text-white'
                    : 'text-slate-500 group-hover:text-blue-600 dark:text-muted-foreground dark:group-hover:text-blue-400'
                )}
              />
              {sidebarOpen && <span>Collections</span>}
            </NavLink>
          </div>
        </div>

        {/* Bottom Section: Settings & Help */}
        <div className="p-2.5 border-t border-border shrink-0 space-y-1.5">
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              cn(
                'group flex items-center rounded-xl text-sm font-medium transition-all',
                sidebarOpen ? 'gap-3 px-3.5 py-2.5 justify-start' : 'w-10 h-10 mx-auto justify-center p-0',
                isActive
                  ? 'bg-blue-600 text-white font-semibold shadow-sm shadow-blue-600/20'
                  : 'text-slate-700 dark:text-slate-300 hover:text-blue-800 dark:hover:text-white hover:bg-blue-100/60 dark:hover:bg-slate-800/60'
              )
            }
            title="Settings"
          >
            {({ isActive }) => (
              <>
                <Settings
                  className={cn(
                    'w-4 h-4 shrink-0 transition-colors',
                    isActive
                      ? 'text-white'
                      : 'text-slate-500 group-hover:text-blue-600 dark:text-muted-foreground dark:group-hover:text-blue-400'
                  )}
                />
                {sidebarOpen && <span>Settings</span>}
              </>
            )}
          </NavLink>

          <NavLink
            to="/about"
            className={({ isActive }) =>
              cn(
                'group flex items-center rounded-xl text-sm font-medium transition-all',
                sidebarOpen ? 'gap-3 px-3.5 py-2.5 justify-start' : 'w-10 h-10 mx-auto justify-center p-0',
                isActive
                  ? 'bg-blue-600 text-white font-semibold shadow-sm shadow-blue-600/20'
                  : 'text-slate-700 dark:text-slate-300 hover:text-blue-800 dark:hover:text-white hover:bg-blue-100/60 dark:hover:bg-slate-800/60'
              )
            }
            title="About Developer"
          >
            {({ isActive }) => (
              <>
                <User
                  className={cn(
                    'w-4 h-4 shrink-0 transition-colors',
                    isActive
                      ? 'text-white'
                      : 'text-slate-500 group-hover:text-blue-600 dark:text-muted-foreground dark:group-hover:text-blue-400'
                  )}
                />
                {sidebarOpen && <span>About Developer</span>}
              </>
            )}
          </NavLink>
        </div>
      </aside>
    </>
  );
};
