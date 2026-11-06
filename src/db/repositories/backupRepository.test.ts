import { describe, it, expect } from 'vitest';
import { backupRepository } from './backupRepository';

describe('backupRepository validation', () => {
  it('validates a correct DevVault backup payload', () => {
    const validJson = JSON.stringify({
      format: 'devvault-backup',
      version: 1,
      exportedAt: '2026-11-06T12:00:00Z',
      snippets: [
        {
          id: 'snip-1',
          title: 'Docker command',
          language: 'shell',
          content: 'docker compose up -d',
          tags: ['devops'],
          isFavorite: true,
          createdAt: 1700000000,
          updatedAt: 1700000000,
        },
      ],
      collections: [],
      favorites: ['json-formatter'],
      settings: { theme: 'dark' },
    });

    const result = backupRepository.validateBackupFile(validJson);
    expect(result.isValid).toBe(true);
    expect(result.summary?.snippetCount).toBe(1);
    expect(result.summary?.favoriteCount).toBe(1);
  });

  it('rejects payload with invalid format key', () => {
    const invalidJson = JSON.stringify({
      format: 'unknown-format',
      version: 1,
      snippets: [],
      collections: [],
    });

    const result = backupRepository.validateBackupFile(invalidJson);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('Invalid backup format');
  });

  it('rejects unsupported versions', () => {
    const invalidVersion = JSON.stringify({
      format: 'devvault-backup',
      version: 99,
      snippets: [],
      collections: [],
    });

    const result = backupRepository.validateBackupFile(invalidVersion);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('Unsupported backup version');
  });
});
