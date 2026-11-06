import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ToolDirectoryPage } from './ToolDirectoryPage';

describe('ToolDirectoryPage', () => {
  it('renders all registered tools by default', () => {
    render(
      <MemoryRouter>
        <ToolDirectoryPage />
      </MemoryRouter>
    );

    expect(screen.getByText('All Developer Tools')).toBeInTheDocument();
    expect(screen.getByText('JSON Formatter')).toBeInTheDocument();
    expect(screen.getByText('JWT Decoder')).toBeInTheDocument();
  });

  it('filters tools based on search input', () => {
    render(
      <MemoryRouter>
        <ToolDirectoryPage />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText(/Filter tools by keyword/i);
    fireEvent.change(input, { target: { value: 'jwt' } });

    expect(screen.getByText('JWT Decoder')).toBeInTheDocument();
    expect(screen.queryByText('JSON Formatter')).not.toBeInTheDocument();
  });

  it('filters tools based on availability status', () => {
    render(
      <MemoryRouter>
        <ToolDirectoryPage />
      </MemoryRouter>
    );

    const readyButton = screen.getByRole('button', { name: /Ready \(\d+\)/i });
    fireEvent.click(readyButton);

    expect(screen.getByText('JSON Formatter')).toBeInTheDocument();
    expect(screen.queryByText('JWT Decoder')).not.toBeInTheDocument();
  });
});
