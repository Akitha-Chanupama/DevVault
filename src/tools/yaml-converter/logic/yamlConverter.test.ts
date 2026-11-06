import { describe, it, expect } from 'vitest';
import { jsonToYaml, yamlToJson } from './yamlConverter';

describe('yamlConverter logic', () => {
  it('converts JSON to standard YAML', () => {
    const json = JSON.stringify({ name: 'DevVault', version: 1, tags: ['tool', 'dev'] });
    const result = jsonToYaml(json);
    expect(result.success).toBe(true);
    expect(result.output).toContain('name: DevVault');
    expect(result.output).toContain('tags:\n  - tool\n  - dev');
  });

  it('converts YAML to formatted JSON', () => {
    const yaml = `
service:
  name: api-gateway
  port: 8080
`;
    const result = yamlToJson(yaml);
    expect(result.success).toBe(true);
    const parsed = JSON.parse(result.output);
    expect(parsed.service.name).toBe('api-gateway');
    expect(parsed.service.port).toBe(8080);
  });

  it('reports error on invalid inputs', () => {
    expect(jsonToYaml('{ bad json }').success).toBe(false);
  });
});
