import { create } from 'zustand';
import { FAQ_KNOWLEDGE_BASE, FaqItem } from '@/features/assistant/data/faqKnowledge';

export interface AssistantMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: number;
  actionLink?: string;
  actionLabel?: string;
  suggestedQuestions?: string[];
}

interface AssistantState {
  isOpen: boolean;
  isMinimized: boolean;
  activeCategory: string;
  searchQuery: string;
  isTyping: boolean;
  messages: AssistantMessage[];

  // Actions
  openAssistant: () => void;
  closeAssistant: () => void;
  toggleAssistant: () => void;
  setMinimized: (minimized: boolean) => void;
  toggleMinimized: () => void;
  setActiveCategory: (category: string) => void;
  setSearchQuery: (query: string) => void;
  askFaq: (faqId: string) => void;
  askCustomQuery: (query: string) => void;
  resetConversation: () => void;
}

const INITIAL_GREETING: AssistantMessage = {
  id: 'msg-welcome',
  sender: 'bot',
  text: "Hello! I'm DevBot, your personal DevVault assistant. Ask me anything about our 29 offline developer tools, keyboard shortcuts, or privacy architecture!",
  timestamp: Date.now(),
  suggestedQuestions: [
    'what-is-devvault',
    'privacy-local-first',
    'code-formatters',
    'keyboard-shortcuts',
  ],
};

function findBestFaqMatch(query: string): FaqItem | null {
  const normalized = query.toLowerCase().trim();
  if (!normalized) return null;

  // 1. Direct question substring match
  const exact = FAQ_KNOWLEDGE_BASE.find((item) =>
    item.question.toLowerCase().includes(normalized) || normalized.includes(item.question.toLowerCase())
  );
  if (exact) return exact;

  // 2. Keyword score matching
  const words = normalized.split(/\s+/).filter((w) => w.length > 2);
  let bestItem: FaqItem | null = null;
  let highestScore = 0;

  for (const item of FAQ_KNOWLEDGE_BASE) {
    let score = 0;
    for (const word of words) {
      if (item.keywords.some((k) => k.toLowerCase().includes(word))) score += 3;
      if (item.question.toLowerCase().includes(word)) score += 2;
      if (item.answer.toLowerCase().includes(word)) score += 1;
    }

    if (score > highestScore && score >= 2) {
      highestScore = score;
      bestItem = item;
    }
  }

  return bestItem;
}

export const useAssistantStore = create<AssistantState>((set) => ({
  isOpen: false,
  isMinimized: false,
  activeCategory: 'all',
  searchQuery: '',
  isTyping: false,
  messages: [INITIAL_GREETING],

  openAssistant: () => set({ isOpen: true, isMinimized: false }),
  closeAssistant: () => set({ isOpen: false }),
  toggleAssistant: () =>
    set((state) => ({
      isOpen: !state.isOpen,
      isMinimized: false,
    })),

  setMinimized: (minimized: boolean) => set({ isMinimized: minimized }),
  toggleMinimized: () => set((state) => ({ isMinimized: !state.isMinimized })),

  setActiveCategory: (category: string) => set({ activeCategory: category }),
  setSearchQuery: (query: string) => set({ searchQuery: query }),

  askFaq: (faqId: string) => {
    const faq = FAQ_KNOWLEDGE_BASE.find((f) => f.id === faqId);
    if (!faq) return;

    const userMsg: AssistantMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: faq.question,
      timestamp: Date.now(),
    };

    set((state) => ({
      messages: [...state.messages, userMsg],
      isTyping: true,
      searchQuery: '',
    }));

    // Realistic typing delay
    setTimeout(() => {
      const botMsg: AssistantMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: faq.answer,
        timestamp: Date.now(),
        actionLink: faq.actionLink,
        actionLabel: faq.actionLabel,
        suggestedQuestions: faq.relatedIds,
      };

      set((state) => ({
        messages: [...state.messages, botMsg],
        isTyping: false,
      }));
    }, 320);
  },

  askCustomQuery: (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;

    const userMsg: AssistantMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: trimmed,
      timestamp: Date.now(),
    };

    set((state) => ({
      messages: [...state.messages, userMsg],
      isTyping: true,
      searchQuery: '',
    }));

    setTimeout(() => {
      const match = findBestFaqMatch(trimmed);

      let botMsg: AssistantMessage;
      if (match) {
        botMsg = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: match.answer,
          timestamp: Date.now(),
          actionLink: match.actionLink,
          actionLabel: match.actionLabel,
          suggestedQuestions: match.relatedIds,
        };
      } else {
        botMsg = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: `I couldn't find a direct answer for "${trimmed}", but you can search all 29 tools via the Command Palette (Ctrl+K) or explore the categories below:`,
          timestamp: Date.now(),
          actionLink: '/tools',
          actionLabel: 'Browse All 29 Tools',
          suggestedQuestions: [
            'what-is-devvault',
            'code-formatters',
            'privacy-local-first',
            'keyboard-shortcuts',
          ],
        };
      }

      set((state) => ({
        messages: [...state.messages, botMsg],
        isTyping: false,
      }));
    }, 380);
  },

  resetConversation: () => {
    set({
      messages: [{ ...INITIAL_GREETING, timestamp: Date.now() }],
      searchQuery: '',
      isTyping: false,
      isMinimized: false,
    });
  },
}));
