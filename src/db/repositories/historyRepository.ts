import { db, DbHistoryItem } from '../database';
import { settingsRepository } from './settingsRepository';

// Tools where input/output payloads must never be stored in history
const SENSITIVE_TOOLS = new Set([
  'jwt-decoder',
  'password-generator',
  'hash-generator',
  'hmac-generator',
  'api-client',
]);

export const historyRepository = {
  async getAll(): Promise<DbHistoryItem[]> {
    return db.history.orderBy('createdAt').reverse().toArray();
  },

  async record(
    toolId: string,
    operation: string,
    metadata?: Record<string, string | number | boolean>
  ): Promise<void> {
    const settings = await settingsRepository.getSettings();
    if (!settings.historyEnabled) return;

    // Filter metadata to prevent sensitive leaks
    const sanitizedMetadata: Record<string, string | number | boolean> = {};
    if (metadata && !SENSITIVE_TOOLS.has(toolId)) {
      for (const [key, val] of Object.entries(metadata)) {
        // Exclude keys that sound like secrets
        if (!/secret|key|token|auth|bearer|pass|credential/i.test(key)) {
          sanitizedMetadata[key] = val;
        }
      }
    }

    const item: DbHistoryItem = {
      id: crypto.randomUUID(),
      toolId,
      operation,
      createdAt: Date.now(),
      metadata: Object.keys(sanitizedMetadata).length > 0 ? sanitizedMetadata : undefined,
    };

    await db.history.add(item);
    await this.pruneOldEntries(settings.historyRetentionDays);
  },

  async delete(id: string): Promise<void> {
    await db.history.delete(id);
  },

  async clearAll(): Promise<void> {
    await db.history.clear();
  },

  async pruneOldEntries(retentionDays: number): Promise<void> {
    if (retentionDays <= 0) return;
    const cutoff = Date.now() - retentionDays * 24 * 60 * 60 * 1000;
    await db.history.where('createdAt').below(cutoff).delete();
  },
};
