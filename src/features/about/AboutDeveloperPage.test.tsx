import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AboutDeveloperPage } from './AboutDeveloperPage';

describe('AboutDeveloperPage', () => {
  it('renders developer identity, headline, and profile image', () => {
    render(
      <MemoryRouter>
        <AboutDeveloperPage />
      </MemoryRouter>
    );

    // Identity & Title
    expect(screen.getByRole('heading', { level: 1, name: /Akitha Chanupama/i })).toBeInTheDocument();
    expect(screen.getByText(/Mobile App Developer & Associate Software Engineer/i)).toBeInTheDocument();
    expect(screen.getByText(/Fentons Information Technology/i)).toBeInTheDocument();
    expect(screen.getByText(/Colombo, Sri Lanka/i)).toBeInTheDocument();

    // Image
    const profileImg = screen.getByAltText('Akitha Chanupama') as HTMLImageElement;
    expect(profileImg).toBeInTheDocument();
    expect(profileImg.getAttribute('src')).toBe('/images/akitha_grad1.jpg');

    // Metrics
    expect(screen.getByText('100+')).toBeInTheDocument();
    expect(screen.getByText('Projects')).toBeInTheDocument();
  });

  it('renders featured portfolio projects and tech stack categories', () => {
    render(
      <MemoryRouter>
        <AboutDeveloperPage />
      </MemoryRouter>
    );

    // Featured Projects
    expect(screen.getByText('DevVault')).toBeInTheDocument();
    expect(screen.getByText('TraceMap')).toBeInTheDocument();
    expect(screen.getByText('OmniConvert')).toBeInTheDocument();
    expect(screen.getByText('Scam Radar')).toBeInTheDocument();
    expect(screen.getByText('AI Resume Analyser')).toBeInTheDocument();

    // Technical Capabilities
    expect(screen.getByText('Mobile & Cross-Platform')).toBeInTheDocument();
    expect(screen.getByText('Frontend Engineering')).toBeInTheDocument();
    expect(screen.getByText('Backend & Cloud Systems')).toBeInTheDocument();
    expect(screen.getByText('Architecture & Craftsmanship')).toBeInTheDocument();
  });
});

