import { describe, it, expect } from 'vitest';
import { formatHtml } from './htmlFormatter';

describe('htmlFormatter logic', () => {
  it('formats unindented HTML markup with consistent indentation', async () => {
    const raw = '<div class="container"><h1>Title</h1><p>Paragraph content</p></div>';
    const result = await formatHtml(raw, { tabWidth: 2 });

    expect(result.success).toBe(true);
    expect(result.formattedHtml).toContain('<div class="container">');
    expect(result.formattedHtml).toContain('  <h1>Title</h1>');
    expect(result.formattedHtml).toContain('</div>');
  });

  it('handles empty input gracefully', async () => {
    const result = await formatHtml('');
    expect(result.success).toBe(true);
    expect(result.formattedHtml).toBe('');
  });

  it('handles malformed HTML with descriptive error or fallback', async () => {
    const malformed = '<<div invalid<>';
    const result = await formatHtml(malformed);
    // Prettier handles or reports error cleanly
    expect(typeof result.formattedHtml).toBe('string');
  });
});
