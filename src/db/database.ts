import Dexie, { Table } from 'dexie';

export interface DbSnippet {
  id: string;
  title: string;
  description?: string;
  language: string;
  content: string;
  tags: string[];
  collectionId?: string;
  isFavorite: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface DbCollection {
  id: string;
  name: string;
  description?: string;
  createdAt: number;
  updatedAt: number;
}

export interface DbHistoryItem {
  id: string;
  toolId: string;
  operation: string;
  createdAt: number;
  metadata?: Record<string, string | number | boolean>;
}

export interface DbSettings {
  id: string; // 'current'
  theme: 'dark' | 'light' | 'system';
  historyEnabled: boolean;
  historyRetentionDays: number;
  defaultIndentation: 2 | 4;
  editorFontSize: number;
  editorWordWrap: boolean;
}

export class DevVaultDatabase extends Dexie {
  snippets!: Table<DbSnippet, string>;
  collections!: Table<DbCollection, string>;
  history!: Table<DbHistoryItem, string>;
  settings!: Table<DbSettings, string>;

  constructor() {
    super('DevVaultDB');

    // Schema definition Version 1
    this.version(1).stores({
      snippets: 'id, title, language, collectionId, isFavorite, createdAt, updatedAt, *tags',
      collections: 'id, name, createdAt, updatedAt',
      history: 'id, toolId, operation, createdAt',
      settings: 'id',
    });
  }
}

export const db = new DevVaultDatabase();
