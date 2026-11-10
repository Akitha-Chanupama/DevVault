import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SnippetEditorModal } from './SnippetEditorModal';

// Mock CodeEditor since Monaco / complex editors can fail in JSDOM
vi.mock('@/components/editor/CodeEditor', () => ({
  CodeEditor: ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
    <textarea
      data-testid="mock-code-editor"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}));

describe('SnippetEditorModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onSave: vi.fn(),
    collections: [
      { id: 'col-1', name: 'Frontend Utils', createdAt: 0, updatedAt: 0 },
    ],
  };

  it('renders modal dialog in body portal when isOpen is true', () => {
    render(<SnippetEditorModal {...defaultProps} />);

    expect(screen.getByText('New Code Snippet')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g. Fetch API Helper with Timeout')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save snippet/i })).toBeInTheDocument();
  });

  it('does not render when isOpen is false', () => {
    render(<SnippetEditorModal {...defaultProps} isOpen={false} />);

    expect(screen.queryByText('New Code Snippet')).not.toBeInTheDocument();
  });

  it('triggers onClose when close button is clicked', () => {
    const handleClose = vi.fn();
    render(<SnippetEditorModal {...defaultProps} onClose={handleClose} />);

    const closeBtn = screen.getByLabelText('Close modal');
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('triggers onClose when Escape key is pressed', () => {
    const handleClose = vi.fn();
    render(<SnippetEditorModal {...defaultProps} onClose={handleClose} />);

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('submits form with valid title and content', async () => {
    const handleSave = vi.fn().mockResolvedValue(undefined);
    const handleClose = vi.fn();

    render(
      <SnippetEditorModal
        {...defaultProps}
        onSave={handleSave}
        onClose={handleClose}
      />
    );

    const titleInput = screen.getByPlaceholderText('e.g. Fetch API Helper with Timeout');
    const editor = screen.getByTestId('mock-code-editor');
    const saveBtn = screen.getByRole('button', { name: /save snippet/i });

    fireEvent.change(titleInput, { target: { value: 'My Helper Function' } });
    fireEvent.change(editor, { target: { value: 'const add = (a, b) => a + b;' } });

    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(handleSave).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'My Helper Function',
          content: 'const add = (a, b) => a + b;',
        })
      );
      expect(handleClose).toHaveBeenCalled();
    });
  });
});
