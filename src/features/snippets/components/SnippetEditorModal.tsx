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
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 dark:bg-black/75 backdrop-blur-sm p-3 sm:p-4 md:p-6 flex justify-center items-start sm:items-center animate-in fade-in duration-150"
    >
      <div
        className="relative w-full max-w-3xl my-auto rounded-2xl border border-slate-200 dark:border-[#263247] bg-white dark:bg-[#0c1324] shadow-2xl shadow-blue-950/20 dark:shadow-black/95 ring-1 ring-slate-900/5 dark:ring-white/10 flex flex-col max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-3.5rem)] overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Fixed & Pinned */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-200/80 dark:border-[#263247] bg-slate-50 dark:bg-[#192338] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-sm text-slate-900 dark:text-foreground block">
                {initialSnippet ? 'Edit Code Snippet' : 'New Code Snippet'}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-muted-foreground block">
                Save reusable code snippets locally with syntax highlighting
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 dark:text-muted-foreground dark:hover:text-foreground p-1.5 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-800/80 transition-colors cursor-pointer"
            title="Close"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body - Scrollable Container with min-h-0 */}
        <form onSubmit={handleSubmit} id="snippet-form" className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1 min-h-0 [scrollbar-width:thin] scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-200 block mb-1.5">
                Snippet Title *
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Fetch API Helper with Timeout"
                required
                className="text-xs bg-slate-50/80 dark:bg-[#192338] border-slate-200 dark:border-[#263247] text-slate-900 dark:text-foreground placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:ring-1.5 focus-visible:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-200 block mb-1.5">
                Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full h-9 rounded-md border border-slate-200 dark:border-[#263247] bg-slate-50/80 dark:bg-[#192338] px-3 text-xs text-slate-900 dark:text-foreground focus:outline-none focus:ring-1.5 focus:ring-blue-500 cursor-pointer"
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
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-200 block mb-1.5">
              Short Description (optional)
            </label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Robust wrapper around fetch with retry logic"
              className="text-xs bg-slate-50/80 dark:bg-[#192338] border-slate-200 dark:border-[#263247] text-slate-900 dark:text-foreground placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:ring-1.5 focus-visible:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-200 block mb-1.5">
                Collection
              </label>
              <select
                value={collectionId}
                onChange={(e) => setCollectionId(e.target.value)}
                className="w-full h-9 rounded-md border border-slate-200 dark:border-[#263247] bg-slate-50/80 dark:bg-[#192338] px-3 text-xs text-slate-900 dark:text-foreground focus:outline-none focus:ring-1.5 focus:ring-blue-500 cursor-pointer"
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
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-200 block mb-1.5">
                Tags (comma separated)
              </label>
              <Input
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="api, fetch, async, utility"
                className="text-xs bg-slate-50/80 dark:bg-[#192338] border-slate-200 dark:border-[#263247] text-slate-900 dark:text-foreground placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:ring-1.5 focus-visible:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-200 block mb-1.5">
              Snippet Code *
            </label>
            <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-[#263247]">
              <CodeEditor
                value={content}
                onChange={(val) => setContent(val)}
                language={language === 'shell' ? 'bash' : language}
                height="220px"
              />
            </div>
          </div>
        </form>

        {/* Footer Actions - Pinned at bottom */}
        <div className="flex items-center justify-end gap-2.5 px-5 sm:px-6 py-3.5 border-t border-slate-200/80 dark:border-[#263247] bg-slate-50/80 dark:bg-[#141B2A] shrink-0">
          <Button type="button" variant="outline" size="sm" onClick={onClose} className="cursor-pointer">
            Cancel
          </Button>
          <Button
            type="submit"
            form="snippet-form"
            size="sm"
            disabled={isSubmitting}
            className="gap-1.5 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white shadow-xs shadow-blue-600/30"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{initialSnippet ? 'Update Snippet' : 'Save Snippet'}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

