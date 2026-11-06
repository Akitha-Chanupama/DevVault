import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { KeyboardShortcutsModal } from './KeyboardShortcutsModal';

describe('KeyboardShortcutsModal', () => {
  it('renders shortcuts dialog when isOpen is true', () => {
    const handleClose = vi.fn();
    render(<KeyboardShortcutsModal isOpen={true} onClose={handleClose} />);

    expect(screen.getByText('Keyboard Shortcuts')).toBeInTheDocument();
    expect(screen.getByText(/Open global command palette and search/i)).toBeInTheDocument();
  });

  it('does not render when isOpen is false', () => {
    const handleClose = vi.fn();
    render(<KeyboardShortcutsModal isOpen={false} onClose={handleClose} />);

    expect(screen.queryByText('Keyboard Shortcuts')).not.toBeInTheDocument();
  });

  it('triggers onClose when close button is clicked', () => {
    const handleClose = vi.fn();
    render(<KeyboardShortcutsModal isOpen={true} onClose={handleClose} />);

    const closeBtn = screen.getByLabelText('Close shortcuts modal');
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});

