import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
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
  PanelLeftClose,
  PanelLeft,
} from 'lucide-react';
import { TOOL_REGISTRY } from '@/tools/registry';
import { useWorkspaceStore } from '@/stores/workspaceStore';
import { cn } from '@/lib/utils';

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const { sidebarOpen, toggleSidebar } = useWorkspaceStore();

  const [tooltip, setTooltip] = useState<{
    label: string;
    badge?: string | number;
    top: number;
    left: number;
  } | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollDown, setCanScrollDown] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    // Check if scrollable content extends below the current scroll viewport
    const hasMoreBelow =
      el.scrollHeight > el.clientHeight && el.scrollTop + el.clientHeight < el.scrollHeight - 8;
    setCanScrollDown(hasMoreBelow);
  }, []);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    checkScroll();
    const rafId = requestAnimationFrame(checkScroll);

    el.addEventListener('scroll', checkScroll, { passive: true });

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        checkScroll();
      });
      resizeObserver.observe(el);
    }

    return () => {
      cancelAnimationFrame(rafId);
      el.removeEventListener('scroll', checkScroll);
      resizeObserver?.disconnect();
    };
  }, [checkScroll]);

  useEffect(() => {
    checkScroll();
  }, [sidebarOpen, location.pathname, location.search, checkScroll]);

  const showTooltip = (e: React.MouseEvent<HTMLElement>, label: string, badge?: string | number) => {
    if (sidebarOpen) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({
      label,
      badge,
      top: rect.top + rect.height / 2,
      left: rect.right + 12,
    });
  };

  const hideTooltip = () => {
    setTooltip(null);
  };

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
        {/* Navigation Body with smooth scroll fade */}
        <div className="relative flex-1 min-h-0 flex flex-col">
          <div
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden px-3 pt-3.5 pb-4 space-y-4"
            style={{
              WebkitMaskImage: canScrollDown
                ? 'linear-gradient(to bottom, black calc(100% - 3.5rem), transparent 100%)'
                : undefined,
              maskImage: canScrollDown
                ? 'linear-gradient(to bottom, black calc(100% - 3.5rem), transparent 100%)'
                : undefined,
            }}
          >
          {/* Main Top Nav */}
          <div className="space-y-1.5">
            <NavLink
              to="/"
              end
              onMouseEnter={(e) => showTooltip(e, 'Dashboard')}
              onMouseLeave={hideTooltip}
              onClick={hideTooltip}
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
              onMouseEnter={(e) => showTooltip(e, 'All Tools', totalCount)}
              onMouseLeave={hideTooltip}
              onClick={hideTooltip}
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
                  onMouseEnter={(e) => showTooltip(e, cat.name)}
                  onMouseLeave={hideTooltip}
                  onClick={hideTooltip}
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
              onMouseEnter={(e) => showTooltip(e, 'Snippets')}
              onMouseLeave={hideTooltip}
              onClick={hideTooltip}
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
              onMouseEnter={(e) => showTooltip(e, 'Favorites')}
              onMouseLeave={hideTooltip}
              onClick={hideTooltip}
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
              onMouseEnter={(e) => showTooltip(e, 'History')}
              onMouseLeave={hideTooltip}
              onClick={hideTooltip}
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
              onMouseEnter={(e) => showTooltip(e, 'Collections')}
              onMouseLeave={hideTooltip}
              onClick={hideTooltip}
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

        {/* Bottom Scroll Fade Gradient Overlay (matching reference design) */}
        <div
          className={cn(
            'pointer-events-none absolute bottom-0 left-0 right-0 h-14 bg-gradient-to-t from-sidebar via-sidebar/80 to-transparent z-10 transition-opacity duration-200',
            canScrollDown ? 'opacity-100' : 'opacity-0'
          )}
          aria-hidden="true"
        />
      </div>

      {/* Bottom Section: Settings & Help */}
      <div className="p-2.5 shrink-0 space-y-1.5">
          <NavLink
            to="/settings"
            onMouseEnter={(e) => showTooltip(e, 'Settings')}
            onMouseLeave={hideTooltip}
            onClick={hideTooltip}
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
            onMouseEnter={(e) => showTooltip(e, 'About Developer')}
            onMouseLeave={hideTooltip}
            onClick={hideTooltip}
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

          {/* Sidebar Collapse / Expand Toggle */}
          <button
            type="button"
            onClick={() => {
              hideTooltip();
              toggleSidebar();
            }}
            onMouseEnter={(e) => showTooltip(e, sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar')}
            onMouseLeave={hideTooltip}
            className={cn(
              'group flex items-center rounded-xl text-sm font-medium transition-all w-full cursor-pointer',
              sidebarOpen
                ? 'gap-3 px-3.5 py-2.5 justify-start text-slate-700 dark:text-slate-300 hover:text-blue-800 dark:hover:text-white hover:bg-blue-100/60 dark:hover:bg-slate-800/60'
                : 'w-10 h-10 mx-auto justify-center p-0 text-slate-700 dark:text-slate-300 hover:text-blue-800 dark:hover:text-white hover:bg-blue-100/60 dark:hover:bg-slate-800/60'
            )}
            title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {sidebarOpen ? (
              <>
                <PanelLeftClose className="w-4 h-4 shrink-0 text-slate-500 group-hover:text-blue-600 dark:text-muted-foreground dark:group-hover:text-blue-400 transition-colors" />
                <span>Collapse</span>
              </>
            ) : (
              <PanelLeft className="w-4 h-4 shrink-0 text-slate-500 group-hover:text-blue-600 dark:text-muted-foreground dark:group-hover:text-blue-400 transition-colors" />
            )}
          </button>
        </div>
      </aside>

      {/* Floating Tooltip Portal for Collapsed Sidebar */}
      {tooltip && typeof document !== 'undefined' && createPortal(
        <div
          style={{ top: `${tooltip.top}px`, left: `${tooltip.left}px`, transform: 'translateY(-50%)' }}
          className="fixed z-50 pointer-events-none flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 text-white dark:bg-[#141B2A] dark:text-slate-100 text-xs font-semibold shadow-xl border border-slate-700/80 dark:border-blue-500/30 animate-in fade-in zoom-in-95 duration-100"
        >
          <span>{tooltip.label}</span>
          {tooltip.badge !== undefined && (
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
              {tooltip.badge}
            </span>
          )}
        </div>,
        document.body
      )}
    </>
  );
};
