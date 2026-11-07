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
  Code,
  Send,
  FileText,
  Sparkles,
  Code2,
  Globe,
  Clock,
} from 'lucide-react';
import { TOOL_REGISTRY, TOOL_CATEGORIES } from '@/tools/registry';
import { useWorkspaceStore } from '@/stores/workspaceStore';
import { cn } from '@/lib/utils';
import bannerDark from '@/assets/images/banner_dark.png';
import bannerLight from '@/assets/images/banner_light.png';

// Core 6 utilities featured in reference screenshot
const CORE_TOOL_CONFIG: Record<
  string,
  { shortDesc: string; icon: React.ReactNode; badgeClass: string }
> = {
  'json-formatter': {
    shortDesc: 'Format, validate, and beautify JSON data.',
    icon: <span className="font-mono font-bold text-lg leading-none text-blue-600 dark:text-blue-400">{`{}`}</span>,
    badgeClass: 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/25',
  },
  'jwt-decoder': {
    shortDesc: 'Decode and inspect JWT tokens.',
    icon: <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
    badgeClass: 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/25',
  },
  'sql-formatter': {
    shortDesc: 'Format and beautify SQL queries.',
    icon: <Database className="w-5 h-5 text-purple-600 dark:text-purple-400" />,
    badgeClass: 'bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/25',
  },
  'url-parser': {
    shortDesc: 'Parse and analyze URLs.',
    icon: <Link2 className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />,
    badgeClass: 'bg-cyan-50 text-cyan-600 border-cyan-200 dark:bg-cyan-500/10 dark:text-cyan-400 dark:border-cyan-500/25',
  },
  'hash-generator': {
    shortDesc: 'Generate cryptographic hashes.',
    icon: <Hash className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
    badgeClass: 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/25',
  },
  'password-generator': {
    shortDesc: 'Create strong and secure passwords.',
    icon: <KeyRound className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
    badgeClass: 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/25',
  },
};

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'JSON & Data': <Code className="w-4 h-4" />,
  'API & HTTP': <Send className="w-4 h-4" />,
  'Security': <Shield className="w-4 h-4" />,
  'Text & Code': <FileText className="w-4 h-4" />,
  'Generators': <Sparkles className="w-4 h-4" />,
  'Web Development': <Code2 className="w-4 h-4" />,
  'Database': <Database className="w-4 h-4" />,
  'Network': <Globe className="w-4 h-4" />,
  'Time & Date': <Clock className="w-4 h-4" />,
};

const CORE_TOOL_IDS = [
  'json-formatter',
  'jwt-decoder',
  'sql-formatter',
  'url-parser',
  'hash-generator',
  'password-generator',
];

const getToolDisplay = (tool: (typeof TOOL_REGISTRY)[0]) => {
  const conf = CORE_TOOL_CONFIG[tool.id];
  if (conf) return conf;

  return {
    shortDesc: tool.description,
    icon: <FileCode2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
    badgeClass: 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/25',
  };
};

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
    <div className="space-y-9 animate-in fade-in duration-150">
      {/* Hero Section with polished borders and backgrounds for both light and dark */}
      <div className="relative rounded-2xl border border-blue-200/90 dark:border-[#263247] overflow-hidden p-6 sm:p-10 lg:p-12 shadow-xs bg-blue-50/30 dark:bg-[#090D16]">
        {/* Banner Background Images: Dark & Light */}
        <picture className="absolute inset-0 w-full h-full pointer-events-none select-none">
          <img
            src={bannerDark}
            alt=""
            aria-hidden="true"
            className="hidden dark:block w-full h-full object-cover object-right"
          />
          <img
            src={bannerLight}
            alt=""
            aria-hidden="true"
            className="block dark:hidden w-full h-full object-cover object-right"
          />
        </picture>

        {/* Hero Left Content */}
        <div className="relative z-10 max-w-xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/90 text-blue-700 border border-blue-200 dark:bg-[#131d36] dark:text-blue-300 dark:border-blue-800/40 shadow-xs backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
            <span>Developer Productivity Hub</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            All your daily developer utilities,{' '}
            <span className="text-blue-600 dark:text-blue-500 block">in one place.</span>
          </h1>

          <p className="text-base text-slate-600 dark:text-slate-400 font-normal leading-relaxed">
            Format, validate, inspect, and generate with ease.
          </p>

          <div className="pt-2">
            <Link
              to="/tools"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/20 dark:shadow-blue-900/30 transition-all hover:translate-y-[-1px]"
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
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-foreground flex items-center gap-2.5">
              <LayoutGrid className="w-5 h-5 text-blue-600 dark:text-blue-500 shrink-0" />
              <span>Available Core Utilities</span>
            </h2>
            <p className="text-sm text-slate-500 dark:text-muted-foreground mt-0.5">
              Production-ready tools executing entirely within your browser.
            </p>
          </div>
          <Link
            to="/tools"
            className="text-sm font-semibold text-blue-600 dark:text-blue-500 hover:text-blue-500 dark:hover:text-blue-400 flex items-center gap-1 transition-colors"
          >
            <span>View All Tools</span>
            <ArrowRight className="w-4 h-4" />
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
                className="group relative rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:border-blue-400 dark:hover:border-blue-500/50 hover:bg-blue-50/50 dark:hover:bg-[#162035] flex flex-col justify-between min-h-[154px] shadow-xs hover:shadow-md"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3.5 min-w-0">
                      {/* Icon badge */}
                      <div
                        className={cn(
                          'w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border transition-transform duration-200 group-hover:scale-105',
                          conf.badgeClass
                        )}
                      >
                        {conf.icon}
                      </div>

                      {/* Tool name & description */}
                      <div className="min-w-0">
                        <Link
                          to={tool.route}
                          className="text-base font-semibold text-slate-900 dark:text-foreground hover:text-blue-600 dark:hover:text-blue-500 transition-colors block truncate"
                        >
                          {tool.name}
                        </Link>
                        <p className="text-sm text-slate-600 dark:text-muted-foreground mt-0.5 line-clamp-1 leading-snug">
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
                      className="text-slate-400 hover:text-amber-500 dark:text-muted-foreground dark:hover:text-amber-400 p-1 rounded-md transition-colors shrink-0"
                      title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                      aria-label={isFav ? `Remove ${tool.name} from favorites` : `Add ${tool.name} to favorites`}
                    >
                      <Star
                        className={cn(
                          'w-4.5 h-4.5 transition-colors',
                          isFav
                            ? 'fill-amber-400 text-amber-500'
                            : 'text-slate-400 dark:text-muted-foreground hover:text-amber-500'
                        )}
                      />
                    </button>
                  </div>
                </div>

                {/* Bottom row: Available Now status & Launch link */}
                <div className="flex items-center justify-between pt-4 mt-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-800/40">
                    Available Now
                  </span>

                  <Link
                    to={tool.route}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 dark:text-blue-500 hover:text-blue-500 dark:hover:text-blue-400 group-hover:gap-1.5 transition-all"
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

      {/* Below Area: Starred Tools & Browse by Category */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Starred Tools */}
        <div className="rounded-xl border border-border bg-card p-5 space-y-4 shadow-xs">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/25 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <Star className="w-5 h-5 fill-amber-400 text-amber-500" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-foreground">Starred Tools</h3>
                <p className="text-sm text-slate-500 dark:text-muted-foreground mt-0.5">
                  Quick access shortcuts for your most frequent development utilities.
                </p>
              </div>
            </div>
            {favoriteToolList.length > 0 && (
              <span className="text-xs font-mono font-medium text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 px-2.5 py-0.5 rounded-full">
                {favoriteToolList.length}
              </span>
            )}
          </div>

          <div>
            {favoriteToolList.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border bg-surface-elevated/30 p-8 text-center flex flex-col items-center justify-center gap-2">
                <div className="w-9 h-9 rounded-full bg-surface border border-border flex items-center justify-center text-muted-foreground">
                  <Star className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-sm font-semibold text-slate-800 dark:text-foreground">No starred tools yet</p>
                  <p className="text-xs text-slate-500 dark:text-muted-foreground max-w-xs">
                    Click the star icon on any utility card above to pin it here for instant access.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-2.5">
                {favoriteToolList.map((tool) => {
                  const display = getToolDisplay(tool);
                  return (
                    <div
                      key={tool.id}
                      className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-slate-50 dark:bg-[#121826] hover:bg-blue-50/80 dark:hover:bg-[#192338] hover:border-blue-400 dark:hover:border-blue-500/40 transition-all group shadow-2xs"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={cn(
                            'w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border text-sm',
                            display.badgeClass
                          )}
                        >
                          {display.icon}
                        </div>
                        <div className="min-w-0">
                          <Link
                            to={tool.route}
                            className="text-sm font-semibold text-slate-900 dark:text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-500 transition-colors block truncate"
                          >
                            {tool.name}
                          </Link>
                          <span className="text-xs text-slate-500 dark:text-muted-foreground font-mono">
                            {tool.category}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 shrink-0">
                        <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-800/40">
                          Ready
                        </span>
                        <Link
                          to={tool.route}
                          className="text-sm font-semibold text-blue-600 dark:text-blue-500 hover:text-blue-500 dark:hover:text-blue-400 inline-flex items-center gap-1 transition-colors ml-1"
                        >
                          <span>Open</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Browse by Category */}
        <div className="rounded-xl border border-border bg-card p-5 space-y-4 shadow-xs">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/25 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-foreground">Browse by Category</h3>
                <p className="text-sm text-slate-500 dark:text-muted-foreground mt-0.5">
                  Explore all tools organized across technical development domains.
                </p>
              </div>
            </div>
            <Link
              to="/tools"
              className="text-sm font-semibold text-blue-600 dark:text-blue-500 hover:text-blue-500 dark:hover:text-blue-400 flex items-center gap-1 transition-colors shrink-0"
            >
              <span>All ({TOOL_REGISTRY.length})</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {TOOL_CATEGORIES.map((catName) => {
              const count = TOOL_REGISTRY.filter((t) => t.category === catName).length;
              const icon = CATEGORY_ICONS[catName] || <FileCode2 className="w-4 h-4" />;
              return (
                <Link
                  key={catName}
                  to={`/tools?category=${encodeURIComponent(catName)}`}
                  className="flex items-center justify-between p-3 rounded-xl border border-border bg-slate-50 dark:bg-[#121826] hover:bg-blue-50/80 dark:hover:bg-[#192338] hover:border-blue-400 dark:hover:border-blue-500/40 group transition-all shadow-2xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-surface border border-border flex items-center justify-center text-muted-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:border-blue-300 dark:group-hover:border-blue-500/30 transition-colors shrink-0">
                      {icon}
                    </div>
                    <span className="text-sm font-semibold text-slate-800 dark:text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-500 transition-colors truncate">
                      {catName}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-medium text-slate-600 dark:text-muted-foreground bg-surface px-2 py-0.5 rounded-full border border-border group-hover:border-blue-300 dark:group-hover:border-blue-500/30 transition-colors shrink-0">
                    {count}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recently Used Tools (if any) */}
      {recentToolList.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-5 space-y-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/25 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-foreground">Recently Used Tools</h3>
              <p className="text-sm text-slate-500 dark:text-muted-foreground mt-0.5">
                Utilities launched in your active session.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {recentToolList.slice(0, 6).map((tool) => {
              const display = getToolDisplay(tool);
              return (
                <div
                  key={tool.id}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-slate-50 dark:bg-[#121826] hover:bg-blue-50/80 dark:hover:bg-[#192338] hover:border-blue-400 dark:hover:border-blue-500/40 transition-all group shadow-2xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={cn(
                        'w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border text-sm',
                        display.badgeClass
                      )}
                    >
                      {display.icon}
                    </div>
                    <div className="min-w-0">
                      <Link
                        to={tool.route}
                        className="text-sm font-semibold text-slate-900 dark:text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-500 transition-colors block truncate"
                      >
                        {tool.name}
                      </Link>
                      <span className="text-xs text-slate-500 dark:text-muted-foreground font-mono">
                        {tool.category}
                      </span>
                    </div>
                  </div>

                  <Link
                    to={tool.route}
                    className="text-sm font-semibold text-blue-600 dark:text-blue-500 hover:text-blue-500 dark:hover:text-blue-400 inline-flex items-center gap-1 transition-colors shrink-0 ml-1"
                  >
                    <span>Launch</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Developer ProTip / Shortcuts Hint Bar */}
      <div className="rounded-xl border border-border bg-card p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/25 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Terminal className="w-4.5 h-4.5" />
          </div>
          <div className="text-sm">
            <span className="font-semibold text-slate-900 dark:text-foreground mr-1.5">ProTip:</span>
            <span className="text-slate-500 dark:text-muted-foreground">
              Press keyboard shortcuts to navigate, search, and run utilities instantly.
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3 font-mono text-xs shrink-0">
          <span className="inline-flex items-center gap-1">
            <kbd className="px-2 py-0.5 rounded-md bg-surface-elevated border border-border text-foreground font-semibold shadow-2xs">Ctrl</kbd>+
            <kbd className="px-2 py-0.5 rounded-md bg-surface-elevated border border-border text-foreground font-semibold shadow-2xs">K</kbd>
            <span className="ml-1 text-slate-500 dark:text-muted-foreground">Command Bar</span>
          </span>
          <span className="inline-flex items-center gap-1">
            <kbd className="px-2 py-0.5 rounded-md bg-surface-elevated border border-border text-foreground font-semibold shadow-2xs">Esc</kbd>
            <span className="ml-1 text-slate-500 dark:text-muted-foreground">Dismiss</span>
          </span>
        </div>
      </div>
    </div>
  );
};