import { db, DbSnippet } from '../database';

export const snippetRepository = {
  async getAll(): Promise<DbSnippet[]> {
    return db.snippets.orderBy('updatedAt').reverse().toArray();
  },

  async getById(id: string): Promise<DbSnippet | undefined> {
    return db.snippets.get(id);
  },

  async create(data: Omit<DbSnippet, 'id' | 'createdAt' | 'updatedAt'>): Promise<DbSnippet> {
    const now = Date.now();
    const snippet: DbSnippet = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    await db.snippets.add(snippet);
    return snippet;
  },

  async update(id: string, updates: Partial<Omit<DbSnippet, 'id' | 'createdAt'>>): Promise<void> {
    await db.snippets.update(id, {
      ...updates,
      updatedAt: Date.now(),
    });
  },

  async toggleFavorite(id: string): Promise<boolean> {
    const snippet = await db.snippets.get(id);
    if (!snippet) return false;
    const next = !snippet.isFavorite;
    await db.snippets.update(id, { isFavorite: next, updatedAt: Date.now() });
    return next;
  },

  async delete(id: string): Promise<void> {
    await db.snippets.delete(id);
  },

  async search(query: string, language?: string, collectionId?: string, onlyFavorites?: boolean): Promise<DbSnippet[]> {
    let collection = db.snippets.orderBy('updatedAt').reverse();

    let results = await collection.toArray();

    if (query.trim()) {
      const q = query.toLowerCase();
      results = results.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          (s.description && s.description.toLowerCase().includes(q)) ||
          s.content.toLowerCase().includes(q) ||
          s.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (language && language !== 'all') {
      results = results.filter((s) => s.language.toLowerCase() === language.toLowerCase());
    }

    if (collectionId && collectionId !== 'all') {
      results = results.filter((s) => s.collectionId === collectionId);
    }

    if (onlyFavorites) {
      results = results.filter((s) => s.isFavorite);
    }

    return results;
  },
};
