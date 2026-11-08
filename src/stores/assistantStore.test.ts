import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAssistantStore } from './assistantStore';

describe('useAssistantStore', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    useAssistantStore.getState().resetConversation();
    useAssistantStore.getState().closeAssistant();
  });

  it('toggles open and closed state', () => {
    expect(useAssistantStore.getState().isOpen).toBe(false);

    useAssistantStore.getState().openAssistant();
    expect(useAssistantStore.getState().isOpen).toBe(true);

    useAssistantStore.getState().closeAssistant();
    expect(useAssistantStore.getState().isOpen).toBe(false);

    useAssistantStore.getState().toggleAssistant();
    expect(useAssistantStore.getState().isOpen).toBe(true);
  });

  it('minimizes and expands assistant modal', () => {
    useAssistantStore.getState().openAssistant();
    expect(useAssistantStore.getState().isMinimized).toBe(false);

    useAssistantStore.getState().setMinimized(true);
    expect(useAssistantStore.getState().isMinimized).toBe(true);

    useAssistantStore.getState().toggleMinimized();
    expect(useAssistantStore.getState().isMinimized).toBe(false);
  });

  it('asks an FAQ by id and simulates bot response', () => {
    useAssistantStore.getState().askFaq('what-is-devvault');

    // Immediately appends user message and sets typing
    const stateWithUserMsg = useAssistantStore.getState();
    expect(stateWithUserMsg.messages.some((m) => m.sender === 'user')).toBe(true);
    expect(stateWithUserMsg.isTyping).toBe(true);

    // Fast forward timer for typing delay
    vi.advanceTimersByTime(400);

    const finalState = useAssistantStore.getState();
    expect(finalState.isTyping).toBe(false);
    const lastBotMsg = finalState.messages[finalState.messages.length - 1];
    expect(lastBotMsg.sender).toBe('bot');
    expect(lastBotMsg.text).toContain('DevVault is an offline-capable');
    expect(lastBotMsg.actionLink).toBe('/tools');
  });

  it('handles custom queries with keyword matching', () => {
    useAssistantStore.getState().askCustomQuery('jwt token verify');

    vi.advanceTimersByTime(400);

    const finalState = useAssistantStore.getState();
    const lastBotMsg = finalState.messages[finalState.messages.length - 1];
    expect(lastBotMsg.sender).toBe('bot');
    expect(lastBotMsg.text.toLowerCase()).toContain('jwt');
  });

  it('resets conversation to initial welcome message', () => {
    useAssistantStore.getState().askFaq('privacy-local-first');
    vi.advanceTimersByTime(400);
    expect(useAssistantStore.getState().messages.length).toBeGreaterThan(1);

    useAssistantStore.getState().resetConversation();
    const state = useAssistantStore.getState();
    expect(state.messages.length).toBe(1);
    expect(state.messages[0].sender).toBe('bot');
    expect(state.messages[0].text).toContain("Hello! I'm DevBot");
  });
});

