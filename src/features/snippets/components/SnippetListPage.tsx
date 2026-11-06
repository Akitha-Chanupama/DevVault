import React, { useState, useEffect } from 'react';
import {
  Code2,
  Plus,
  Search,
  Star,
  Trash2,
  Edit2,
  FolderPlus,
  Folder,
  Tag,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CopyButton } from '@/components/tool-ui/CopyButton';
import { SnippetEditorModal } from './SnippetEditorModal';
import { snippetRepository } from '@/db/repositories/snippetRepository';
import { collectionRepository } from '@/db/repositories/collectionRepository';
import { DbSnippet, DbCollection } from '@/db/database';
import { toast } from 'sonner';

export const SnippetListPage: React.FC = () => {
  const [snippets, setSnippets] = useState<DbSnippet[]>([]);
  const [collections, setCollections] = useState<DbCollection[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [selectedCollectionId, setSelectedCollectionId] = useState('all');
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingSnippet, setEditingSnippet] = useState<DbSnippet | null>(null);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [isAddingCollection, setIsAddingCollection] = useState(false);

  const loadData = async () => {
    const snips = await snippetRepository.search(
      searchQuery,
      selectedLanguage,
      selectedCollectionId,
      onlyFavorites
    );
    setSnippets(snips);
    const cols = await collectionRepository.getAll();
    setCollections(cols);
  };

  useEffect(() => {
    loadData();
  }, [searchQuery, selectedLanguage, selectedCollectionId, onlyFavorites]);

  const handleSaveSnippet = async (data: {
    title: string;
    description?: string;
    language: string;
    content: string;
    tags: string[];
    collectionId?: string;
  }) => {
    if (editingSnippet) {
      await snippetRepository.update(editingSnippet.id, data);
      toast.success('Snippet updated');
    } else {
      await snippetRepository.create({
        ...data,
        isFavorite: false,
      });
      toast.success('Snippet created');
    }
    await loadData();
  };

  const handleDeleteSnippet = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      await snippetRepository.delete(id);
      toast.success('Snippet deleted');
      await loadData();
    }
  };

  const handleToggleFavorite = async (id: string) => {
    await snippetRepository.toggleFavorite(id);
    await loadData();
  };

  const handleCreateCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollectionName.trim()) return;
    await collectionRepository.create(newCollectionName.trim());
    setNewCollectionName('');
    setIsAddingCollection(false);
    toast.success('Collection created');
    await loadData();
  };

  const handleDeleteCollection = async (id: string, name: string) => {
    if (window.confirm(`Delete collection "${name}"? Snippets within will not be deleted.`)) {
      await collectionRepository.delete(id);
      if (selectedCollectionId === id) setSelectedCollectionId('all');
      toast.success('Collection deleted');
      await loadData();
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Snippet Manager
            </h1>
            <Badge variant="success">Local IndexedDB</Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Store, tag, organize, and copy frequently used code snippets directly in your browser.
          </p>
        </div>

        <Button
          onClick={() => {
            setEditingSnippet(null);
            setModalOpen(true);
          }}
          className="gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Snippet</span>
        </Button>
      </div>

      {/* Main Grid: Collections Sidebar + Snippets Content */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Left Collections Pane */}
        <div className="space-y-4">
          <Card className="p-3 bg-surface space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-foreground px-1">
              <span>Collections</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsAddingCollection(!isAddingCollection)}
                className="h-6 w-6 p-0"
                title="Add Collection"
              >
                <FolderPlus className="w-3.5 h-3.5" />
              </Button>
            </div>

            {isAddingCollection && (
              <form onSubmit={handleCreateCollection} className="flex gap-1.5 pt-1">
                <Input
                  value={newCollectionName}
                  onChange={(e) => setNewCollectionName(e.target.value)}
                  placeholder="Collection name"
                  className="h-7 text-xs"
                  autoFocus
                />
                <Button type="submit" size="sm" className="h-7 px-2 text-xs">
                  Save
                </Button>
              </form>
            )}

            <div className="space-y-0.5 pt-1">
              <button
                onClick={() => setSelectedCollectionId('all')}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  selectedCollectionId === 'all'
                    ? 'bg-primary/10 text-primary font-semibold'
                    : 'text-muted-foreground hover:bg-surface-elevated hover:text-foreground'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Folder className="w-3.5 h-3.5" />
                  <span>All Snippets</span>
                </div>
              </button>

              {collections.map((col) => (
                <div
                  key={col.id}
                  className={`group flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    selectedCollectionId === col.id
                      ? 'bg-primary/10 text-primary font-semibold'
                      : 'text-muted-foreground hover:bg-surface-elevated hover:text-foreground'
                  }`}
                >
                  <button
                    onClick={() => setSelectedCollectionId(col.id)}
                    className="flex-1 text-left truncate flex items-center gap-2"
                  >
                    <Folder className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{col.name}</span>
                  </button>
                  <button
                    onClick={() => handleDeleteCollection(col.id, col.name)}
                    className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive p-0.5 transition-opacity"
                    title="Delete collection"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Filters */}
          <Card className="p-3 bg-surface space-y-1">
            <button
              onClick={() => setOnlyFavorites(!onlyFavorites)}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                onlyFavorites
                  ? 'bg-warning/10 text-warning font-semibold'
                  : 'text-muted-foreground hover:bg-surface-elevated hover:text-foreground'
              }`}
            >
              <div className="flex items-center gap-2">
                <Star
                  className={`w-3.5 h-3.5 ${
                    onlyFavorites ? 'fill-warning text-warning' : 'text-muted-foreground'
                  }`}
                />
                <span>Starred Only</span>
              </div>
            </button>
          </Card>
        </div>

        {/* Right Snippets List Area */}
        <div className="md:col-span-3 space-y-4">
          {/* Search & Language Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-surface p-3 rounded-lg border border-border">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search snippets by title, content, or tag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-md border border-border bg-surface-elevated text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="h-8 rounded-md border border-border bg-surface-elevated px-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="all">All Languages</option>
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
              <option value="json">JSON</option>
              <option value="python">Python</option>
              <option value="sql">SQL</option>
              <option value="html">HTML</option>
              <option value="css">CSS</option>
              <option value="shell">Shell</option>
            </select>
          </div>

          {/* Snippet Cards List */}
          {snippets.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 rounded-xl border border-dashed border-border bg-surface text-center">
              <Code2 className="w-10 h-10 text-muted-foreground/60 mb-3" />
              <h3 className="text-sm font-semibold text-foreground">No snippets found</h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                Create reusable snippets to keep your boilerplate, queries, and scripts handy.
              </p>
              <Button
                size="sm"
                onClick={() => {
                  setEditingSnippet(null);
                  setModalOpen(true);
                }}
                className="mt-4 gap-1.5 text-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create First Snippet</span>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {snippets.map((snip) => (
                <Card
                  key={snip.id}
                  className="bg-surface border-border hover:border-primary/40 transition-colors overflow-hidden"
                >
                  <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between gap-2 border-b border-border/50 bg-surface-elevated/40">
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-sm font-bold">{snip.title}</CardTitle>
                        <Badge variant="secondary" className="font-mono text-[10px] uppercase">
                          {snip.language}
                        </Badge>
                      </div>
                      {snip.description && (
                        <p className="text-xs text-muted-foreground mt-0.5">{snip.description}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleToggleFavorite(snip.id)}
                        className="text-muted-foreground hover:text-warning p-1"
                        title="Star snippet"
                      >
                        <Star
                          className={`w-3.5 h-3.5 ${
                            snip.isFavorite ? 'fill-warning text-warning' : ''
                          }`}
                        />
                      </button>
                      <CopyButton content={snip.content} label="Copy" className="h-7 text-xs" />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditingSnippet(snip);
                          setModalOpen(true);
                        }}
                        className="h-7 w-7 text-muted-foreground hover:text-foreground"
                        title="Edit snippet"
                      >
                        <Edit2 className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteSnippet(snip.id, snip.title)}
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        title="Delete snippet"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardHeader>

                  <CardContent className="p-4 pt-3 space-y-3">
                    <pre className="p-3 rounded-md bg-surface-elevated border border-border text-xs font-mono text-foreground overflow-x-auto max-h-48 scrollbar-thin">
                      <code>{snip.content}</code>
                    </pre>

                    <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted-foreground pt-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {snip.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-surface-elevated border border-border text-[10px]"
                          >
                            <Tag className="w-2.5 h-2.5 text-muted-foreground/60" />
                            <span>{tag}</span>
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-1 text-[10px]">
                        <Clock className="w-3 h-3" />
                        <span>Updated {new Date(snip.updatedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Editor Modal */}
      <SnippetEditorModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveSnippet}
        initialSnippet={editingSnippet}
        collections={collections}
      />
    </div>
  );
};

export default SnippetListPage;
