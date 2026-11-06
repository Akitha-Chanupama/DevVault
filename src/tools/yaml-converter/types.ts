export type YamlConvertDirection = 'json-to-yaml' | 'yaml-to-json';

export interface YamlConvertResult {
  success: boolean;
  output: string;
  error?: string;
}

