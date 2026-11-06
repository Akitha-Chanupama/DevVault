export type CaseType =
  | 'UPPERCASE'
  | 'lowercase'
  | 'Title Case'
  | 'Sentence case'
  | 'camelCase'
  | 'PascalCase'
  | 'snake_case'
  | 'kebab-case'
  | 'CONSTANT_CASE';

export interface CaseConversionItem {
  type: CaseType;
  description: string;
  value: string;
}

