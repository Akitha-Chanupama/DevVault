import { describe, it, expect } from 'vitest';
import { formatSqlQuery } from './sqlFormatter';

describe('sqlFormatter logic', () => {
  it('formats unindented SQL query with uppercase keywords and indentation', () => {
    const raw = 'select id, name, email from users where active = 1 order by name asc';
    const result = formatSqlQuery(raw, { keywordCase: 'upper', tabWidth: 2 });

    expect(result.success).toBe(true);
    expect(result.formattedSql).toContain('SELECT');
    expect(result.formattedSql).toContain('FROM');
    expect(result.formattedSql).toContain('WHERE');
    expect(result.formattedSql).toContain('ORDER BY');
  });

  it('supports postgresql dialect features', () => {
    const raw = 'select jsonb_extract_path(metadata, \'profile\') from accounts';
    const result = formatSqlQuery(raw, { language: 'postgresql' });

    expect(result.success).toBe(true);
    expect(result.formattedSql).toContain('SELECT');
  });

  it('handles empty input gracefully', () => {
    const result = formatSqlQuery('');
    expect(result.success).toBe(true);
    expect(result.formattedSql).toBe('');
  });
});
