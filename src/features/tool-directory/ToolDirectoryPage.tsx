import React, { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Search,
  Star,
  ArrowRight,
  CheckCircle2,
  Clock,
  Layers,
} from 'lucide-react';
import { TOOL_REGISTRY, TOOL_CATEGORIES } from '@/tools/registry';
import { useWorkspaceStore } from '@/stores/workspaceStore';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const ToolDirectoryPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get('category') || 'All';
  const filterParam = searchParams.get('filter');

  const [selectedStatus, setSelectedStatus] = useState<'all' | 'available' | 'planned'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { favorites, toggleFavorite } = useWorkspaceStore();

  const handleCategoryChange = (cat: string) => {
    const next = new URLSearchParams(searchParams);
    if (cat === 'All') {
      next.delete('category');
    } else {
      next.set('category', cat);
    }
    setSearchParams(next);
  };

  const filteredTools = useMemo(() => {
    return TOOL_REGISTRY.filter((tool) => {
      // Category filter
      if (selectedCategory !== 'All' && tool.category !== selectedCategory) {
        return false;
      }
      // Favorites filter
      if (filterParam === 'favorites' && !favorites.includes(tool.id)) {
        return false;
      }
      // Status filter
      if (selectedStatus !== 'all' && tool.status !== selectedStatus) {
        return false;
      }
      // Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          tool.name.toLowerCase().includes(q) ||
          tool.description.toLowerCase().includes(q) ||
          tool.category.toLowerCase().includes(q) ||
          tool.keywords.some((k) => k.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [selectedCategory, filterParam, favorites, selectedStatus, searchQuery]);

  return (
    <div className="space-y-8 animate-in fade-in duration-150">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          {filterParam === 'favorites' ? 'Favorite Tools' : 'All Developer Tools'}
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-2xl">
          {filterParam === 'favorites'
            ? 'Quick access to all your starred developer utilities.'
            : 'Browse the full directory of local browser utilities. Filter by category, release status, or search keywords.'}
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between bg-surface p-4 rounded-xl border border-border shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Filter tools by keyword (e.g. json, jwt, hash)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-border bg-surface-elevated text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Status filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <Button
            variant={selectedStatus === 'all' ? 'default' : 'secondary'}
            size="sm"
            onClick={() => setSelectedStatus('all')}
            className="text-xs h-8"
          >
            All ({TOOL_REGISTRY.length})
          </Button>
          <Button
            variant={selectedStatus === 'available' ? 'default' : 'secondary'}
            size="sm"
            onClick={() => setSelectedStatus('available')}
            className="text-xs h-8"
          >
            Ready ({TOOL_REGISTRY.filter((t) => t.status === 'available').length})
          </Button>
          <Button
            variant={selectedStatus === 'planned' ? 'default' : 'secondary'}
            size="sm"
            onClick={() => setSelectedStatus('planned')}
            className="text-xs h-8"
          >
            Planned ({TOOL_REGISTRY.filter((t) => t.status === 'planned').length})
          </Button>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => handleCategoryChange('All')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
            selectedCategory === 'All'
              ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
              : 'bg-surface-elevated border border-border text-muted-foreground hover:text-foreground'
          }`}
        >
          All Categories
        </button>
        {TOOL_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                : 'bg-surface-elevated border border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Tool Cards Grid */}
      {filteredTools.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 rounded-xl border border-dashed border-border bg-surface text-center">
          <Layers className="w-10 h-10 text-muted-foreground/60 mb-3" />
          <h3 className="text-sm font-semibold text-foreground">No matching tools found</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm">
            Try adjusting your search query or switching categories.
          </p>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setSearchQuery('');
              setSelectedStatus('all');
              setSearchParams({});
            }}
            className="mt-4"
          >
            Reset Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTools.map((tool) => {
            const isFav = favorites.includes(tool.id);
            const isAvailable = tool.status === 'available';

            return (
              <Card
                key={tool.id}
                className={`group flex flex-col justify-between transition-all ${
                  isAvailable
                    ? 'hover:border-primary/50 hover:shadow-md'
                    : 'opacity-85 border-border/80'
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-surface-elevated border border-border text-muted-foreground">
                        {tool.category}
                      </span>
                      {tool.priority && (
                        <span className="text-[10px] font-mono text-muted-foreground">
                          {tool.priority}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        toggleFavorite(tool.id);
                      }}
                      className="text-muted-foreground hover:text-warning p-1"
                      title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      <Star
                        className={`w-4 h-4 ${
                          isFav ? 'fill-warning text-warning' : ''
                        }`}
                      />
                    </button>
                  </div>

                  <CardTitle className="text-base font-semibold mt-2">{tool.name}</CardTitle>
                  <CardDescription className="text-sm text-muted-foreground line-clamp-2 mt-1">
                    {tool.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-0 flex items-center justify-between border-t border-border/60 py-3 bg-surface-elevated/20">
                  {isAvailable ? (
                    <Badge variant="success" className="text-xs">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                      Available
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-xs">
                      <Clock className="w-3.5 h-3.5 mr-1 text-muted-foreground" />
                      Planned
                    </Badge>
                  )}

                  {isAvailable ? (
                    <Link
                      to={tool.route}
                      className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                    >
                      <span>Open Tool</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  ) : (
                    <span className="text-xs text-muted-foreground/70 italic">
                      Roadmap Item
                    </span>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
