export type DiffLineType = 'added' | 'removed' | 'unchanged';

export interface DiffLine {
  type: DiffLineType;
  value: string;
  originalLineNumber?: number;
  modifiedLineNumber?: number;
}

export interface DiffSummary {
  additions: number;
  deletions: number;
  unchanged: number;
  lines: DiffLine[];
}

export type DiffViewMode = 'split' | 'unified';
