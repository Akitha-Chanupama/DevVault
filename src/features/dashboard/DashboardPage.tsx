import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  ArrowRight,
  Star,
  Shield,
  Zap,
  FileCode2,
  Layers,
  Terminal,
  History,
} from 'lucide-react';
import { TOOL_REGISTRY, TOOL_CATEGORIES } from '@/tools/registry';
import { useWorkspaceStore } from '@/stores/workspaceStore';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const DashboardPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { favorites, recentTools, toggleFavorite } = useWorkspaceStore();

  const availableTools = TOOL_REGISTRY.filter((t) => t.status === 'available');
  const favoriteToolList = TOOL_REGISTRY.filter((t) => favorites.includes(t.id));
  const recentToolList = recentTools
    .map((rt) => TOOL_REGISTRY.find((t) => t.id === rt.id))
    .filter((t): t is typeof TOOL_REGISTRY[0] => Boolean(t));

  const filteredSearchTools = searchQuery.trim()
    ? TOOL_REGISTRY.filter((t) => {
        const q = searchQuery.toLowerCase();
        return (
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          t.keywords.some((k) => k.toLowerCase().includes(q))
        );
      }).slice(0, 6)
    : [];

  return (
    <div className="space-y-10 animate-in fade-in duration-150">
      {/* Hero Section */}
      <div className="relative rounded-2xl border border-border bg-gradient-to-br from-surface via-surface to-surface-elevated p-6 sm:p-10 shadow-sm overflow-hidden">
        <div className="max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
            <Shield className="w-3.5 h-3.5" />
            <span>Local-First & Privacy-Focused Developer Hub</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            All your daily developer utilities,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              zero data leaving your machine.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Format JSON, inspect JWTs, test API calls, generate identifiers, and diff code with
            consistent, keyboard-accessible tools engineered directly for your browser.
          </p>

          {/* Quick Hero Search Input */}
          <div className="pt-2 relative max-w-lg">
            <div className="relative flex items-center">
              <Search className="absolute left-3.5 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search tools by name, utility, or keywords (e.g., json, jwt, uuid)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-surface text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
              />
            </div>

            {/* Quick search instant preview */}
            {filteredSearchTools.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 z-20 rounded-lg border border-border bg-surface shadow-xl p-2 space-y-1">
                {filteredSearchTools.map((tool) => (
                  <Link
                    key={tool.id}
                    to={tool.route}
                    className="flex items-center justify-between p-2 rounded-md hover:bg-surface-elevated text-xs transition-colors"
                  >
                    <div className="flex items-center gap-2 font-medium text-foreground">
                      <span>{tool.name}</span>
                      <span className="text-muted-foreground font-normal text-[11px]">
                        ({tool.category})
                      </span>
                    </div>
                    {tool.status === 'available' ? (
                      <Badge variant="success">Ready</Badge>
                    ) : (
                      <Badge variant="secondary">Planned</Badge>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Primary Highlights: Ready to use tools */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              <span>Available Core Utilities</span>
            </h2>
            <p className="text-xs text-muted-foreground">
              Production-ready tools executing entirely within your local browser runtime.
            </p>
          </div>
          <Link
            to="/tools"
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
          >
            <span>View All Tools</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableTools.map((tool) => {
            const isFav = favorites.includes(tool.id);
            return (
              <Card
                key={tool.id}
                className="group hover:border-primary/50 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <FileCode2 className="w-5 h-5" />
                      </div>
                      <div>
                        <CardTitle className="text-sm font-semibold">{tool.name}</CardTitle>
                        <span className="text-[11px] font-medium text-muted-foreground">
                          {tool.category}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        toggleFavorite(tool.id);
                      }}
                      className="text-muted-foreground hover:text-warning p-1"
                      title={isFav ? 'Remove favorite' : 'Add favorite'}
                    >
                      <Star
                        className={`w-4 h-4 ${
                          isFav ? 'fill-warning text-warning' : ''
                        }`}
                      />
                    </button>
                  </div>
                  <CardDescription className="text-xs line-clamp-2 mt-2">
                    {tool.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0 flex items-center justify-between border-t border-border/60 mt-2 py-3 bg-surface-elevated/30">
                  <Badge variant="success">Available Now</Badge>
                  <Link
                    to={tool.route}
                    className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                  >
                    <span>Launch</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Favorites & Recent Utilities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Favorites section */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Star className="w-4 h-4 text-warning fill-warning" />
              <span>Starred Tools</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Quick access shortcuts for your most frequent development workflows.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            {favoriteToolList.length === 0 ? (
              <div className="text-center py-8 text-xs text-muted-foreground border border-dashed border-border rounded-md">
                No starred tools yet. Click the star icon on any tool to pin it here.
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
                        className="font-medium text-foreground hover:text-primary transition-colors"
                      >
                        {tool.name}
                      </Link>
                      <span className="text-[10px] text-muted-foreground">({tool.category})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {tool.status === 'available' ? (
                        <Badge variant="success" className="text-[10px]">Ready</Badge>
                      ) : (
                        <Badge variant="secondary" className="text-[10px]">Planned</Badge>
                      )}
                      <Link to={tool.route} className="text-primary hover:underline text-xs">
                        Open
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent tools if any */}
        {recentToolList.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <History className="w-4 h-4 text-primary" />
                <span>Recently Used Tools</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Tools you opened recently in this browser session.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="divide-y divide-border/60">
                {recentToolList.map((tool) => (
                  <div
                    key={tool.id}
                    className="flex items-center justify-between py-2.5 text-xs hover:bg-surface-elevated/50 px-2 rounded-md transition-colors"
                  >
                    <span className="font-medium text-foreground">{tool.name}</span>
                    <Link to={tool.route} className="text-primary hover:underline text-xs">
                      Open
                    </Link>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Categories Overview */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Layers className="w-4 h-4 text-secondary" />
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
                    className="flex items-center justify-between p-2.5 rounded-lg border border-border bg-surface-elevated/40 hover:bg-surface-elevated hover:border-primary/40 text-xs transition-colors"
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

      {/* Keyboard Shortcuts Bar */}
      <div className="rounded-xl border border-border bg-surface-elevated p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-primary" />
          <span className="font-medium text-foreground">ProTip:</span>
          <span>Use keyboard shortcuts to navigate faster.</span>
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
