import { db, DbSettings } from '../database';

const DEFAULT_SETTINGS: DbSettings = {
  id: 'current',
  theme: 'system',
  historyEnabled: true,
  historyRetentionDays: 30,
  defaultIndentation: 2,
  editorFontSize: 13,
  editorWordWrap: true,
};

export const settingsRepository = {
  async getSettings(): Promise<DbSettings> {
    const existing = await db.settings.get('current');
    if (!existing) {
      await db.settings.put(DEFAULT_SETTINGS);
      return DEFAULT_SETTINGS;
    }
    return existing;
  },

  async updateSettings(updates: Partial<Omit<DbSettings, 'id'>>): Promise<DbSettings> {
    const current = await this.getSettings();
    const next: DbSettings = {
      ...current,
      ...updates,
      id: 'current',
    };
    await db.settings.put(next);
    return next;
  },
};
