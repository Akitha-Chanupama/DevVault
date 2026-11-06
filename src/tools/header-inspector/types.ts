export type HeaderCategory = 'security' | 'caching' | 'cors' | 'content' | 'general';

export interface ParsedHeader {
  name: string;
  value: string;
  category: HeaderCategory;
  description?: string;
}

export interface SecurityAuditItem {
  header: string;
  status: 'passed' | 'warning' | 'missing';
  value?: string;
  recommendation: string;
}

export interface HeaderInspectionResult {
  headers: ParsedHeader[];
  rawCount: number;
  securityAudit: SecurityAuditItem[];
}
