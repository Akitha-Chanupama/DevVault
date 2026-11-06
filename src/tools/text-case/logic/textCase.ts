import { CaseConversionItem } from '../types';

/**
 * Splits any string into lowercase words, recognizing camelCase, snake_case, kebab-case, and spaces
 */
export function extractWords(input: string): string[] {
  if (!input.trim()) return [];

  return (
    input
      // Insert space before uppercase letters in camelCase/PascalCase
      .replace(/([a-z\d])([A-Z])/g, '$1 $2')
      // Insert space before consecutive uppercase followed by lowercase (e.g. JSONParser -> JSON Parser)
      .replace(/([A-Z]+)([A-Z][a-z\d]+)/g, '$1 $2')
      // Replace symbols and non-alphanumeric with spaces
      .replace(/[^a-zA-Z\d]+/g, ' ')
      .trim()
      .split(/\s+/)
      .map((w) => w.toLowerCase())
  );
}

export function toCamelCase(words: string[]): string {
  if (words.length === 0) return '';
  return (
    words[0] +
    words
      .slice(1)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join('')
  );
}

export function toPascalCase(words: string[]): string {
  return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join('');
}

export function toSnakeCase(words: string[]): string {
  return words.join('_');
}

export function toKebabCase(words: string[]): string {
  return words.join('-');
}

export function toConstantCase(words: string[]): string {
  return words.map((w) => w.toUpperCase()).join('_');
}

export function toTitleCase(words: string[]): string {
  return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

export function toSentenceCase(words: string[]): string {
  if (words.length === 0) return '';
  const joined = words.join(' ');
  return joined.charAt(0).toUpperCase() + joined.slice(1);
}

export function convertToAllCases(input: string): CaseConversionItem[] {
  const words = extractWords(input);

  return [
    {
      type: 'UPPERCASE',
      description: 'All letters converted to capital uppercase.',
      value: input.toUpperCase(),
    },
    {
      type: 'lowercase',
      description: 'All letters converted to small lowercase.',
      value: input.toLowerCase(),
    },
    {
      type: 'camelCase',
      description: 'First word lowercase, subsequent words capitalized.',
      value: toCamelCase(words),
    },
    {
      type: 'PascalCase',
      description: 'First letter of every word capitalized without spaces.',
      value: toPascalCase(words),
    },
    {
      type: 'snake_case',
      description: 'Words separated by underscores in lowercase.',
      value: toSnakeCase(words),
    },
    {
      type: 'kebab-case',
      description: 'Words separated by hyphens / dashes in lowercase.',
      value: toKebabCase(words),
    },
    {
      type: 'CONSTANT_CASE',
      description: 'Uppercase letters separated by underscores.',
      value: toConstantCase(words),
    },
    {
      type: 'Title Case',
      description: 'First letter of each word capitalized with spaces.',
      value: toTitleCase(words),
    },
    {
      type: 'Sentence case',
      description: 'First letter of sentence capitalized.',
      value: toSentenceCase(words),
    },
  ];
}
