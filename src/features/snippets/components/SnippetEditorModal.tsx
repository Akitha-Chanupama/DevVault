import React, { useState, useEffect } from 'react';
import { X, Save, Code2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CodeEditor } from '@/components/editor/CodeEditor';
import { DbSnippet, DbCollection } from '@/db/database';
import { toast } from 'sonner';

interface SnippetEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    title: string;
    description?: string;
    language: string;
    content: string;
    tags: string[];
    collectionId?: string;
  }) => Promise<void>;
  initialSnippet?: DbSnippet | null;
  collections: DbCollection[];
}

const SUPPORTED_LANGUAGES = [
  'javascript',
  'typescript',
  'json',
  'html',
  'css',
  'sql',
  'python',
  'shell',
  'markdown',
  'plaintext',
];

export const SnippetEditorModal: React.FC<SnippetEditorModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialSnippet,
  collections,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [content, setContent] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [collectionId, setCollectionId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialSnippet) {
      setTitle(initialSnippet.title);
      setDescription(initialSnippet.description || '');
      setLanguage(initialSnippet.language);
      setContent(initialSnippet.content);
      setTagsInput(initialSnippet.tags.join(', '));
      setCollectionId(initialSnippet.collectionId || '');
    } else {
      setTitle('');
      setDescription('');
      setLanguage('javascript');
      setContent('');
      setTagsInput('');
      setCollectionId('');
    }
  }, [initialSnippet, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Please enter a snippet title');
      return;
    }
    if (!content.trim()) {
      toast.error('Snippet content cannot be empty');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    try {
      setIsSubmitting(true);
      await onSave({
        title: title.trim(),
        description: description.trim() || undefined,
        language,
        content,
        tags,
        collectionId: collectionId || undefined,
      });
      onClose();
    } catch {
      toast.error('Failed to save snippet');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-100">
      <div
        className="relative w-full max-w-3xl rounded-xl border border-border bg-surface shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border bg-surface-elevated">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-primary" />
            <span className="font-bold text-sm text-foreground">
              {initialSnippet ? 'Edit Code Snippet' : 'New Code Snippet'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground p-1 rounded-md"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">
                Snippet Title *
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Fetch API Helper with Timeout"
                required
                className="text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">
                Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full h-9 rounded-md border border-border bg-surface px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">
              Short Description (optional)
            </label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Robust wrapper around fetch with retry logic"
              className="text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">
                Collection
              </label>
              <select
                value={collectionId}
                onChange={(e) => setCollectionId(e.target.value)}
                className="w-full h-9 rounded-md border border-border bg-surface px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">No Collection</option>
                {collections.map((col) => (
                  <option key={col.id} value={col.id}>
                    {col.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">
                Tags (comma separated)
              </label>
              <Input
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="api, fetch, async, utility"
                className="text-xs"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">
              Snippet Code *
            </label>
            <CodeEditor
              value={content}
              onChange={(val) => setContent(val)}
              language={language === 'shell' ? 'bash' : language}
              height="280px"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={isSubmitting} className="gap-1.5">
              <Save className="w-3.5 h-3.5" />
              <span>{initialSnippet ? 'Update Snippet' : 'Save Snippet'}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
