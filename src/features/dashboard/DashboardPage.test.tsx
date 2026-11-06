import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { DashboardPage } from './DashboardPage';

describe('DashboardPage', () => {
  it('renders hero headline, available utilities, and category sections', () => {
    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/All your daily developer utilities/i)).toBeInTheDocument();
    expect(screen.getByText('Available Core Utilities')).toBeInTheDocument();
    expect(screen.getByText('Starred Tools')).toBeInTheDocument();
    expect(screen.getByText('Browse by Category')).toBeInTheDocument();
  });
});
