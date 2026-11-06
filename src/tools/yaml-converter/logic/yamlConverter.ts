import YAML from 'yaml';
import { YamlConvertResult } from '../types';

export function jsonToYaml(jsonStr: string): YamlConvertResult {
  const trimmed = jsonStr.trim();
  if (!trimmed) {
    return { success: true, output: '' };
  }

  try {
    const parsed = JSON.parse(trimmed);
    const output = YAML.stringify(parsed, { indent: 2 });
    return { success: true, output };
  } catch (err) {
    return {
      success: false,
      output: '',
      error: `Invalid JSON: ${(err as Error).message}`,
    };
  }
}

export function yamlToJson(yamlStr: string, indent = 2): YamlConvertResult {
  const trimmed = yamlStr.trim();
  if (!trimmed) {
    return { success: true, output: '' };
  }

  try {
    const parsed = YAML.parse(trimmed);
    const output = JSON.stringify(parsed, null, indent);
    return { success: true, output };
  } catch (err) {
    return {
      success: false,
      output: '',
      error: `Invalid YAML: ${(err as Error).message}`,
    };
  }
}
