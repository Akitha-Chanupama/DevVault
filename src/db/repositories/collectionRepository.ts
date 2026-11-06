import { db, DbCollection } from '../database';

export const collectionRepository = {
  async getAll(): Promise<DbCollection[]> {
    return db.collections.orderBy('name').toArray();
  },

  async create(name: string, description?: string): Promise<DbCollection> {
    const now = Date.now();
    const collection: DbCollection = {
      id: crypto.randomUUID(),
      name: name.trim(),
      description: description?.trim(),
      createdAt: now,
      updatedAt: now,
    };
    await db.collections.add(collection);
    return collection;
  },

  async update(id: string, name: string, description?: string): Promise<void> {
    await db.collections.update(id, {
      name: name.trim(),
      description: description?.trim(),
      updatedAt: Date.now(),
    });
  },

  async delete(id: string): Promise<void> {
    await db.transaction('rw', db.snippets, db.collections, async () => {
      // Disassociate snippets
      await db.snippets.where('collectionId').equals(id).modify({ collectionId: undefined });
      await db.collections.delete(id);
    });
  },
};
