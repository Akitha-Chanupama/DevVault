import type { SqlLanguage, KeywordCase } from 'sql-formatter';

export type SupportedSqlDialect = SqlLanguage;

export interface SqlFormatOptions {
  language: SupportedSqlDialect;
  tabWidth: number;
  useTabs: boolean;
  keywordCase: KeywordCase;
}

export interface SqlFormatResult {
  success: boolean;
  formattedSql: string;
  error?: string;
}
