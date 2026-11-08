import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AssistantFAB } from './AssistantFAB';
import { AssistantModal } from './AssistantModal';
import { useAssistantStore } from '@/stores/assistantStore';

describe('Assistant Widget Components', () => {
  beforeEach(() => {
    useAssistantStore.getState().resetConversation();
    useAssistantStore.getState().closeAssistant();
  });

  it('renders AssistantFAB and toggles modal open', () => {
    render(
      <MemoryRouter>
        <AssistantFAB />
        <AssistantModal />
      </MemoryRouter>
    );

    const fabButton = screen.getByRole('button', { name: /open devvault assistant/i });
    expect(fabButton).toBeDefined();

    // Modal initially closed
    expect(screen.queryByRole('dialog')).toBeNull();

    // Click FAB to open
    fireEvent.click(fabButton);

    // Dialog should now be open
    expect(screen.getByRole('dialog')).toBeDefined();
    expect(screen.getByText('DevBot')).toBeDefined();
    expect(screen.getByText(/100% Offline/i)).toBeDefined();
  });

  it('allows clicking quick FAQ questions', () => {
    useAssistantStore.getState().openAssistant();

    render(
      <MemoryRouter>
        <AssistantModal />
      </MemoryRouter>
    );

    expect(screen.getByRole('dialog')).toBeDefined();

    // Click "Browse FAQ Topics"
    const browseFaqBtn = screen.getByText('Browse FAQ Topics');
    fireEvent.click(browseFaqBtn);

    // Check that FAQs are rendered
    const faqElements = screen.getAllByText(/What is DevVault and what can it do\?/i);
    expect(faqElements.length).toBeGreaterThan(0);

    // Click the FAQ question
    fireEvent.click(faqElements[faqElements.length - 1]);

    // Drawer closes and message is submitted
    expect(screen.getAllByText(/What is DevVault and what can it do\?/i).length).toBeGreaterThan(0);
  });

  it('closes when close button is clicked', () => {
    useAssistantStore.getState().openAssistant();

    render(
      <MemoryRouter>
        <AssistantModal />
      </MemoryRouter>
    );

    const closeBtn = screen.getByRole('button', { name: /close assistant/i });
    fireEvent.click(closeBtn);

    expect(useAssistantStore.getState().isOpen).toBe(false);
  });
});
