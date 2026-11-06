import { format } from 'sql-formatter';
import { SqlFormatOptions, SqlFormatResult } from '../types';

export const DEFAULT_SQL_OPTIONS: SqlFormatOptions = {
  language: 'sql',
  tabWidth: 2,
  useTabs: false,
  keywordCase: 'upper',
};

export function formatSqlQuery(sql: string, options: Partial<SqlFormatOptions> = {}): SqlFormatResult {
  const merged: SqlFormatOptions = { ...DEFAULT_SQL_OPTIONS, ...options };

  if (!sql.trim()) {
    return { success: true, formattedSql: '' };
  }

  try {
    const formatted = format(sql, {
      language: merged.language,
      tabWidth: merged.tabWidth,
      useTabs: merged.useTabs,
      keywordCase: merged.keywordCase,
    });

    return {
      success: true,
      formattedSql: formatted,
    };
  } catch (err) {
    return {
      success: false,
      formattedSql: sql,
      error: (err as Error).message,
    };
  }
}

