import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Star,
  Zap,
  FileCode2,
  Layers,
  Terminal,
  History,
  LayoutGrid,
  Shield,
  Database,
  Link2,
  Hash,
  KeyRound,
} from 'lucide-react';
import { TOOL_REGISTRY, TOOL_CATEGORIES } from '@/tools/registry';
import { useWorkspaceStore } from '@/stores/workspaceStore';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// Core 6 utilities featured in reference screenshot
const CORE_TOOL_CONFIG: Record<
  string,
  { shortDesc: string; icon: React.ReactNode; badgeClass: string }
> = {
  'json-formatter': {
    shortDesc: 'Format, validate, and beautify JSON data.',
    icon: <span className="font-mono font-bold text-lg leading-none text-blue-400">{`{}`}</span>,
    badgeClass: 'bg-blue-500/10 text-blue-400 border-blue-500/25',
  },
  'jwt-decoder': {
    shortDesc: 'Decode and inspect JWT tokens.',
    icon: <Shield className="w-5 h-5 text-emerald-400" />,
    badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
  },
  'sql-formatter': {
    shortDesc: 'Format and beautify SQL queries.',
    icon: <Database className="w-5 h-5 text-purple-400" />,
    badgeClass: 'bg-purple-500/10 text-purple-400 border-purple-500/25',
  },
  'url-parser': {
    shortDesc: 'Parse and analyze URLs.',
    icon: <Link2 className="w-5 h-5 text-cyan-400" />,
    badgeClass: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/25',
  },
  'hash-generator': {
    shortDesc: 'Generate cryptographic hashes.',
    icon: <Hash className="w-5 h-5 text-amber-400" />,
    badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/25',
  },
  'password-generator': {
    shortDesc: 'Create strong and secure passwords.',
    icon: <KeyRound className="w-5 h-5 text-emerald-400" />,
    badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
  },
};

const CORE_TOOL_IDS = [
  'json-formatter',
  'jwt-decoder',
  'sql-formatter',
  'url-parser',
  'hash-generator',
  'password-generator',
];

export const DashboardPage: React.FC = () => {
  const { favorites, recentTools, toggleFavorite } = useWorkspaceStore();

  const coreTools = CORE_TOOL_IDS.map((id) => TOOL_REGISTRY.find((t) => t.id === id)).filter(
    (t): t is typeof TOOL_REGISTRY[0] => Boolean(t)
  );

  const favoriteToolList = TOOL_REGISTRY.filter((t) => favorites.includes(t.id));
  const recentToolList = recentTools
    .map((rt) => TOOL_REGISTRY.find((t) => t.id === rt.id))
    .filter((t): t is typeof TOOL_REGISTRY[0] => Boolean(t));

  return (
    <div className="space-y-8 animate-in fade-in duration-150">
      {/* Hero Section matching reference */}
      <div className="relative rounded-2xl border border-blue-900/40 dark:border-[#263247] bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-slate-50 dark:from-[#090e1c] dark:via-[#0c152a] dark:to-[#122244] p-6 sm:p-10 lg:p-12 overflow-hidden shadow-xs">
        {/* Subtle decorative wave and </> code watermark on the right */}
        <div className="absolute right-0 top-0 bottom-0 w-2/5 pointer-events-none hidden md:flex items-center justify-end pr-6 lg:pr-12 select-none overflow-hidden">
          <svg
            className="w-64 h-64 lg:w-72 lg:h-72 text-blue-500/25 dark:text-blue-500/20"
            viewBox="0 0 240 240"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="bracketGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#2563EB" stopOpacity="0.4" />
              </linearGradient>
              <linearGradient id="slashGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#93C5FD" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#1D4ED8" stopOpacity="0.35" />
              </linearGradient>
            </defs>
            {/* Ambient background wave curves */}
            <path
              d="M-20 190 C 60 120, 140 240, 260 100"
              stroke="#3B82F6"
              strokeWidth="2"
              strokeOpacity="0.25"
              fill="none"
            />
            <path
              d="M10 210 C 90 140, 160 250, 280 120"
              stroke="#60A5FA"
              strokeWidth="1.5"
              strokeOpacity="0.18"
              fill="none"
            />
            {/* Stylized < / > symbol matching reference design */}
            <path
              d="M75 80 L35 120 L75 160"
              stroke="url(#bracketGradient)"
              strokeWidth="16"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M138 72 L102 168"
              stroke="url(#slashGradient)"
              strokeWidth="16"
              strokeLinecap="round"
            />
            <path
              d="M165 80 L205 120 L165 160"
              stroke="url(#bracketGradient)"
              strokeWidth="16"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Hero Left Content */}
        <div className="relative z-10 max-w-xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200 dark:bg-[#131d36] dark:text-blue-300 dark:border-blue-800/40">
            <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
            <span>Developer Productivity Hub</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            All your daily developer utilities,{' '}
            <span className="text-blue-500 block">in one place.</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-normal leading-relaxed">
            Format, validate, inspect, and generate with ease.
          </p>

          <div className="pt-2">
            <Link
              to="/tools"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-sm shadow-blue-900/30 transition-all hover:translate-y-[-1px]"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>Browse All Tools</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Available Core Utilities Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
              <LayoutGrid className="w-5 h-5 text-blue-500 shrink-0" />
              <span>Available Core Utilities</span>
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Production-ready tools executing entirely within your browser.
            </p>
          </div>
          <Link
            to="/tools"
            className="text-xs font-semibold text-blue-500 hover:text-blue-400 flex items-center gap-1 transition-colors"
          >
            <span>View All Tools</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 3-column Responsive Grid on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {coreTools.map((tool) => {
            const isFav = favorites.includes(tool.id);
            const conf = CORE_TOOL_CONFIG[tool.id] || {
              shortDesc: tool.description,
              icon: <FileCode2 className="w-5 h-5" />,
              badgeClass: 'bg-primary/10 text-primary border-primary/20',
            };

            return (
              <div
                key={tool.id}
                className="group relative rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:border-blue-500/50 hover:bg-surface-elevated/40 flex flex-col justify-between min-h-[148px]"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3.5 min-w-0">
                      {/* Icon badge */}
                      <div
                        className={cn(
                          'w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border transition-transform duration-200 group-hover:scale-105',
                          conf.badgeClass
                        )}
                      >
                        {conf.icon}
                      </div>

                      {/* Tool name & description */}
                      <div className="min-w-0">
                        <Link
                          to={tool.route}
                          className="text-sm font-semibold text-foreground hover:text-blue-500 transition-colors block truncate"
                        >
                          {tool.name}
                        </Link>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                          {conf.shortDesc}
                        </p>
                      </div>
                    </div>

                    {/* Star favorite toggle */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleFavorite(tool.id);
                      }}
                      className="text-muted-foreground hover:text-amber-400 p-1 rounded-md transition-colors shrink-0"
                      title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                      aria-label={isFav ? `Remove ${tool.name} from favorites` : `Add ${tool.name} to favorites`}
                    >
                      <Star
                        className={cn(
                          'w-4 h-4 transition-colors',
                          isFav
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-muted-foreground hover:text-amber-400'
                        )}
                      />
                    </button>
                  </div>
                </div>

                {/* Bottom row: Available Now status & Launch link */}
                <div className="flex items-center justify-between pt-4 mt-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-800/40">
                    Available Now
                  </span>

                  <Link
                    to={tool.route}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-500 hover:text-blue-400 group-hover:gap-1.5 transition-all"
                  >
                    <span>Launch</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Secondary Information: Starred Tools, Recent, and Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Starred Tools */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>Starred Tools</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Quick access shortcuts for your most frequent development utilities.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            {favoriteToolList.length === 0 ? (
              <div className="text-center py-7 text-xs text-muted-foreground border border-dashed border-border rounded-lg">
                No starred tools yet. Click the star icon on any tool card to pin it here.
              </div>
            ) : (
              <div className="divide-y divide-border/60">
                {favoriteToolList.map((tool) => (
                  <div
                    key={tool.id}
                    className="flex items-center justify-between py-2.5 text-xs hover:bg-surface-elevated/50 px-2 rounded-md transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Link
                        to={tool.route}
                        className="font-medium text-foreground hover:text-blue-500 transition-colors"
                      >
                        {tool.name}
                      </Link>
                      <span className="text-[10px] text-muted-foreground">({tool.category})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="success" className="text-[10px]">Ready</Badge>
                      <Link to={tool.route} className="text-blue-500 hover:underline text-xs">
                        Open
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Categories Overview */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-500" />
              <span>Browse by Category</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Explore the entire technical tool catalogue organized by domain.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 gap-2">
              {TOOL_CATEGORIES.map((cat) => {
                const count = TOOL_REGISTRY.filter((t) => t.category === cat).length;
                return (
                  <Link
                    key={cat}
                    to={`/tools?category=${encodeURIComponent(cat)}`}
                    className="flex items-center justify-between p-2.5 rounded-lg border border-border bg-surface-elevated/40 hover:bg-surface-elevated hover:border-blue-500/40 text-xs transition-colors"
                  >
                    <span className="font-medium text-foreground">{cat}</span>
                    <span className="text-[11px] font-mono text-muted-foreground">
                      {count}
                    </span>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent tools if any */}
      {recentToolList.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <History className="w-4 h-4 text-blue-500" />
              <span>Recently Used Tools</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Tools you opened recently in this browser session.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {recentToolList.slice(0, 6).map((tool) => (
                <Link
                  key={tool.id}
                  to={tool.route}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-border bg-surface-elevated/40 hover:bg-surface-elevated hover:border-blue-500/40 text-xs transition-colors"
                >
                  <span className="font-medium text-foreground">{tool.name}</span>
                  <span className="text-blue-500 text-xs font-semibold flex items-center gap-1">
                    Open <ArrowRight className="w-3 h-3" />
                  </span>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Keyboard Shortcuts Hint Bar */}
      <div className="rounded-xl border border-border bg-surface-elevated p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-blue-500 shrink-0" />
          <span className="font-medium text-foreground">ProTip:</span>
          <span>Press keyboard shortcuts to navigate and execute instantly.</span>
        </div>
        <div className="flex items-center gap-3 font-mono text-[11px]">
          <span className="inline-flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-surface border border-border">Ctrl</kbd>+
            <kbd className="px-1.5 py-0.5 rounded bg-surface border border-border">K</kbd>
            <span className="ml-1 text-foreground">Command Bar</span>
          </span>
          <span className="inline-flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-surface border border-border">Esc</kbd>
            <span className="ml-1 text-foreground">Dismiss</span>
          </span>
        </div>
      </div>
    </div>
  );
};