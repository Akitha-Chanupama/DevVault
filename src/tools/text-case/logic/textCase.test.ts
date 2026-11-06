import { describe, it, expect } from 'vitest';
import { extractWords, convertToAllCases } from './textCase';

describe('textCase logic', () => {
  it('extracts words cleanly from various input formats', () => {
    expect(extractWords('hello world')).toEqual(['hello', 'world']);
    expect(extractWords('helloWorld')).toEqual(['hello', 'world']);
    expect(extractWords('HelloWorld')).toEqual(['hello', 'world']);
    expect(extractWords('hello_world')).toEqual(['hello', 'world']);
    expect(extractWords('hello-world')).toEqual(['hello', 'world']);
    expect(extractWords('HELLO_WORLD')).toEqual(['hello', 'world']);
    expect(extractWords('getHTTPResponseCode')).toEqual(['get', 'http', 'response', 'code']);
  });

  it('converts phrase to all 9 required case variants', () => {
    const cases = convertToAllCases('developer productivity platform');
    const map = new Map(cases.map((c) => [c.type, c.value]));

    expect(map.get('UPPERCASE')).toBe('DEVELOPER PRODUCTIVITY PLATFORM');
    expect(map.get('lowercase')).toBe('developer productivity platform');
    expect(map.get('camelCase')).toBe('developerProductivityPlatform');
    expect(map.get('PascalCase')).toBe('DeveloperProductivityPlatform');
    expect(map.get('snake_case')).toBe('developer_productivity_platform');
    expect(map.get('kebab-case')).toBe('developer-productivity-platform');
    expect(map.get('CONSTANT_CASE')).toBe('DEVELOPER_PRODUCTIVITY_PLATFORM');
    expect(map.get('Title Case')).toBe('Developer Productivity Platform');
    expect(map.get('Sentence case')).toBe('Developer productivity platform');
  });
});
