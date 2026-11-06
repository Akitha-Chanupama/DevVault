import { describe, it, expect } from 'vitest';
import { calculateMarkdownStats } from './markdownEditor';

describe('markdownEditor logic', () => {
  it('accurately computes character, word, line, and reading time stats', () => {
    const text = `# Title
This is a sample document for testing DevVault's markdown editor.
It spans multiple lines.`;

    const stats = calculateMarkdownStats(text);
    expect(stats.lines).toBe(3);
    expect(stats.words).toBe(16);
    expect(stats.characters).toBe(text.length);
    expect(stats.readingTimeMinutes).toBe(1);
  });

  it('handles empty input gracefully', () => {
    const stats = calculateMarkdownStats('');
    expect(stats.lines).toBe(0);
    expect(stats.words).toBe(0);
    expect(stats.characters).toBe(0);
    expect(stats.readingTimeMinutes).toBe(0);
  });
});
