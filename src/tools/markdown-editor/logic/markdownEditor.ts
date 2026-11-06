import { MarkdownStats } from '../types';

export function calculateMarkdownStats(text: string): MarkdownStats {
  const characters = text.length;
  const lines = text ? text.split(/\r?\n/).length : 0;
  const words = text.trim() ? text.trim().split(/\s+/).filter(Boolean).length : 0;
  // Average reading speed: 200 words per minute
  const readingTimeMinutes = Math.max(1, Math.ceil(words / 200));

  return {
    characters,
    words,
    lines,
    readingTimeMinutes: words > 0 ? readingTimeMinutes : 0,
  };
}
