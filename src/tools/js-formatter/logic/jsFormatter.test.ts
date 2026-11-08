import { describe, it, expect } from 'vitest';
import { formatJs } from './jsFormatter';

describe('jsFormatter logic', () => {
  it('formats unindented JavaScript code with semicolons and single quotes', async () => {
    const raw = 'const x={a:1,b:2};function add(n){return x.a+n}';
    const result = await formatJs(raw, { dialect: 'javascript', tabWidth: 2, semi: true, singleQuote: true });

    expect(result.success).toBe(true);
    expect(result.output).toContain('const x = { a: 1, b: 2 };');
    expect(result.output).toContain('function add(n) {');
    expect(result.output).toContain('  return x.a + n;');
    expect(result.output).toContain('}');
  });

  it('formats TypeScript interfaces and type annotations', async () => {
    const raw = 'interface UserProfile{id:string;name:string;roles:Array<string>;isActive?:boolean;}const u:UserProfile={id:"1",name:"Akitha",roles:["admin"]};';
    const result = await formatJs(raw, { dialect: 'typescript', tabWidth: 2, semi: true });

    expect(result.success).toBe(true);
    expect(result.output).toContain('interface UserProfile {');
    expect(result.output).toContain('  id: string;');
    expect(result.output).toContain('  roles: Array<string>;');
    expect(result.output).toContain('const u: UserProfile = {');
  });

  it('respects formatting options (no semicolons, double quotes)', async () => {
    const raw = "const greeting = 'hello world';";
    const result = await formatJs(raw, { dialect: 'javascript', semi: false, singleQuote: false });

    expect(result.success).toBe(true);
    expect(result.output).toContain('const greeting = "hello world"');
    expect(result.output.trim().endsWith(';')).toBe(false);
  });

  it('handles empty input gracefully', async () => {
    const result = await formatJs('');
    expect(result.success).toBe(true);
    expect(result.output).toBe('');
  });

  it('returns graceful error on malformed JavaScript', async () => {
    const malformed = 'const x = { invalid syntax :::';
    const result = await formatJs(malformed, { dialect: 'javascript' });

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });
});
