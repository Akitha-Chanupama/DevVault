import { db, DbSnippet, DbCollection, DbSettings } from '../database';
import { settingsRepository } from './settingsRepository';

export interface DevVaultBackupData {
  format: 'devvault-backup';
  version: 1;
  exportedAt: string;
  snippets: DbSnippet[];
  collections: DbCollection[];
  favorites: string[];
  settings: Partial<DbSettings>;
}

export interface BackupValidationResult {
  isValid: boolean;
  data?: DevVaultBackupData;
  error?: string;
  summary?: {
    snippetCount: number;
    collectionCount: number;
    favoriteCount: number;
  };
}

export const backupRepository = {
  async exportBackup(favorites: string[]): Promise<string> {
    const snippets = await db.snippets.toArray();
    const collections = await db.collections.toArray();
    const settings = await settingsRepository.getSettings();

    const backup: DevVaultBackupData = {
      format: 'devvault-backup',
      version: 1,
      exportedAt: new Date().toISOString(),
      snippets,
      collections,
      favorites,
      settings: {
        theme: settings.theme,
        historyEnabled: settings.historyEnabled,
        historyRetentionDays: settings.historyRetentionDays,
        defaultIndentation: settings.defaultIndentation,
        editorFontSize: settings.editorFontSize,
        editorWordWrap: settings.editorWordWrap,
      },
    };

    return JSON.stringify(backup, null, 2);
  },

  validateBackupFile(rawJson: string): BackupValidationResult {
    try {
      if (!rawJson.trim()) {
        return { isValid: false, error: 'Backup file is empty.' };
      }

      const parsed = JSON.parse(rawJson);

      if (parsed.format !== 'devvault-backup') {
        return {
          isValid: false,
          error: 'Invalid backup format. File is missing "format": "devvault-backup".',
        };
      }

      if (parsed.version !== 1) {
        return {
          isValid: false,
          error: `Unsupported backup version ${parsed.version}. Expected version 1.`,
        };
      }

      if (!Array.isArray(parsed.snippets) || !Array.isArray(parsed.collections)) {
        return {
          isValid: false,
          error: 'Corrupt backup: "snippets" and "collections" must be arrays.',
        };
      }

      return {
        isValid: true,
        data: parsed as DevVaultBackupData,
        summary: {
          snippetCount: parsed.snippets.length,
          collectionCount: parsed.collections.length,
          favoriteCount: Array.isArray(parsed.favorites) ? parsed.favorites.length : 0,
        },
      };
    } catch (err) {
      return {
        isValid: false,
        error: `Failed to parse backup JSON: ${(err as Error).message}`,
      };
    }
  },

  async restoreBackup(backup: DevVaultBackupData, mode: 'merge' | 'replace'): Promise<void> {
    await db.transaction('rw', db.snippets, db.collections, db.settings, async () => {
      if (mode === 'replace') {
        await db.snippets.clear();
        await db.collections.clear();
      }

      // Upsert collections
      for (const col of backup.collections) {
        await db.collections.put(col);
      }

      // Upsert snippets
      for (const snip of backup.snippets) {
        await db.snippets.put(snip);
      }

      // Update settings if provided
      if (backup.settings) {
        await settingsRepository.updateSettings(backup.settings);
      }
    });
  },
};
