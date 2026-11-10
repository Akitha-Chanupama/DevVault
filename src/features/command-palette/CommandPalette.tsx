import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight, ShieldCheck, Star } from 'lucide-react';
import { useWorkspaceStore } from '@/stores/workspaceStore';
import { TOOL_REGISTRY } from '@/tools/registry';
import { Badge } from '@/components/ui/badge';

export const CommandPalette: React.FC = () => {
  const { commandPaletteOpen, setCommandPaletteOpen, favorites } = useWorkspaceStore();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const navigate = useNavigate();

  // Listen for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      } else if (e.key === 'Escape' && commandPaletteOpen) {
        setCommandPaletteOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [commandPaletteOpen, setCommandPaletteOpen]);

  // Focus input when opened
  useEffect(() => {
    if (commandPaletteOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [commandPaletteOpen]);

  // Keep selected item scrolled into view if needed
  useEffect(() => {
    itemRefs.current[selectedIndex]?.scrollIntoView({
      block: 'nearest',
    });
  }, [selectedIndex]);

  if (!commandPaletteOpen) return null;

  const filteredTools = TOOL_REGISTRY.filter((tool) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      tool.name.toLowerCase().includes(q) ||
      tool.description.toLowerCase().includes(q) ||
      tool.category.toLowerCase().includes(q) ||
      tool.keywords.some((k) => k.toLowerCase().includes(q))
    );
  }).slice(0, 16);

  const handleSelect = (route: string) => {
    setCommandPaletteOpen(false);
    navigate(route);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredTools.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredTools.length) % Math.max(1, filteredTools.length));
    } else if (e.key === 'Enter' && filteredTools[selectedIndex]) {
      e.preventDefault();
      handleSelect(filteredTools[selectedIndex].route);
    }
  };

  return (
    <div
      onClick={() => setCommandPaletteOpen(false)}
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-20 px-4 bg-slate-900/50 dark:bg-black/75 backdrop-blur-md animate-in fade-in duration-150"
    >
      <div
        className="relative w-full max-w-2xl rounded-2xl border border-slate-200 dark:border-[#263247] bg-white dark:bg-[#0c1324] shadow-2xl shadow-blue-950/20 dark:shadow-black/95 ring-1 ring-slate-900/5 dark:ring-white/10 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-5 sm:px-6 py-4 border-b border-slate-200/80 dark:border-[#263247] bg-slate-50/50 dark:bg-[#0c1324]">
          <Search className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a tool name, category, or keyword..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent px-3.5 text-sm sm:text-base text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none"
          />

          <div className="flex items-center gap-2 shrink-0">
            {query ? (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setSelectedIndex(0);
                  inputRef.current?.focus();
                }}
                className="text-slate-400 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Clear search"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-slate-100 dark:bg-[#192338] border border-slate-200 dark:border-[#263247] text-slate-500 dark:text-slate-400">
                ESC
              </kbd>
            )}

            <button
              type="button"
              onClick={() => setCommandPaletteOpen(false)}
              className="text-slate-400 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Close palette"
              aria-label="Close command palette"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Results List */}
        <div className="max-h-[min(65vh,520px)] overflow-y-auto p-3 space-y-1.5 [scrollbar-width:thin] scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
          {filteredTools.length === 0 ? (
            <div className="py-12 px-6 text-center text-xs text-slate-500 dark:text-slate-400">
              <p className="font-semibold text-slate-700 dark:text-slate-300 text-sm mb-1">
                No matching tools found
              </p>
              <p>No offline utilities matched "{query}". Try checking another keyword or category.</p>
            </div>
          ) : (
            filteredTools.map((tool, idx) => {
              const isSelected = idx === selectedIndex;
              const isFav = favorites.includes(tool.id);

              return (
                <div
                  key={tool.id}
                  ref={(el) => {
                    itemRefs.current[idx] = el;
                  }}
                  onClick={() => handleSelect(tool.route)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-blue-600 text-white font-medium shadow-sm shadow-blue-600/30'
                      : 'text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#162138]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {isFav ? (
                      <Star
                        className={`w-4 h-4 shrink-0 ${
                          isSelected ? 'fill-white text-white' : 'fill-amber-400 text-amber-500'
                        }`}
                      />
                    ) : (
                      <span
                        className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                          isSelected ? 'bg-white' : 'bg-slate-300 dark:bg-slate-600'
                        }`}
                      />
                    )}

                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="font-semibold text-sm shrink-0">{tool.name}</span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-md shrink-0 transition-colors ${
                          isSelected
                            ? 'bg-blue-500/40 text-blue-100 border border-blue-400/30 font-semibold'
                            : 'bg-slate-100 dark:bg-[#192338] text-slate-500 dark:text-slate-400 border border-slate-200/80 dark:border-[#263247]'
                        }`}
                      >
                        {tool.category}
                      </span>
                      <span
                        className={`hidden sm:inline-block text-xs truncate flex-1 min-w-0 ${
                          isSelected ? 'text-blue-100' : 'text-slate-400 dark:text-slate-500'
                        }`}
                      >
                        {tool.description}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0 ml-3">
                    {tool.status === 'available' ? (
                      <Badge
                        variant="success"
                        className={
                          isSelected
                            ? 'bg-white/20 text-white border-transparent text-[11px]'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200/80 font-semibold dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-500/30 text-[11px]'
                        }
                      >
                        Ready
                      </Badge>
                    ) : (
                      <Badge
                        variant="secondary"
                        className={
                          isSelected
                            ? 'bg-white/10 text-white border-transparent text-[11px]'
                            : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700 text-[11px]'
                        }
                      >
                        Planned
                      </Badge>
                    )}
                    <ArrowRight
                      className={`w-3.5 h-3.5 transition-transform ${
                        isSelected
                          ? 'text-white translate-x-0.5'
                          : 'text-slate-400 dark:text-slate-500 group-hover:translate-x-0.5'
                      }`}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts info */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 border-t border-slate-200/80 dark:border-[#263247] bg-slate-50 dark:bg-[#080d19] text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-3.5">
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-200/70 dark:bg-[#192338] text-[10px] font-mono border border-slate-300/70 dark:border-[#263247] text-slate-600 dark:text-slate-300">
                ↑↓
              </kbd>
              <span className="text-[11px]">navigate</span>
            </span>
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-200/70 dark:bg-[#192338] text-[10px] font-mono border border-slate-300/70 dark:border-[#263247] text-slate-600 dark:text-slate-300">
                ↵
              </kbd>
              <span className="text-[11px]">select</span>
            </span>
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-200/70 dark:bg-[#192338] text-[10px] font-mono border border-slate-300/70 dark:border-[#263247] text-slate-600 dark:text-slate-300">
                esc
              </kbd>
              <span className="text-[11px]">close</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="font-medium text-slate-600 dark:text-slate-300">100% Offline • Local Execution</span>
          </div>
        </div>
      </div>
    </div>
  );
};