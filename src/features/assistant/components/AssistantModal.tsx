import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  X,
  RotateCcw,
  Send,
  Search,
  ArrowUpRight,
  HelpCircle,
  Minimize2,
  Maximize2,
  ChevronRight,
} from 'lucide-react';
import { useAssistantStore } from '@/stores/assistantStore';
import { FAQ_CATEGORIES, FAQ_KNOWLEDGE_BASE } from '../data/faqKnowledge';
import { AssistantAvatar } from './AssistantAvatar';
import { cn } from '@/lib/utils';

export const AssistantModal: React.FC = () => {
  const {
    isOpen,
    isMinimized,
    activeCategory,
    searchQuery,
    isTyping,
    messages,
    closeAssistant,
    toggleMinimized,
    setActiveCategory,
    setSearchQuery,
    askFaq,
    askCustomQuery,
    resetConversation,
  } = useAssistantStore();

  const [inputVal, setInputVal] = useState('');
  const [showFaqDrawer, setShowFaqDrawer] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (isOpen && !isMinimized && typeof messagesEndRef.current?.scrollIntoView === 'function') {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen, isMinimized]);

  // Focus input on open
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, isMinimized]);

  // Handle escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeAssistant();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeAssistant]);

  if (!isOpen) return null;

  // Filtered FAQ questions based on category and search
  const filteredFaqs = FAQ_KNOWLEDGE_BASE.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch =
      !searchQuery ||
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.keywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    askCustomQuery(inputVal);
    setInputVal('');
    setShowFaqDrawer(false);
  };

  const handleSelectFaq = (faqId: string) => {
    askFaq(faqId);
    setShowFaqDrawer(false);
  };

  return (
    <div
      className={cn(
        'fixed z-50 transition-all duration-300 ease-out select-none flex flex-col',
        'bottom-22 right-4 sm:right-6',
        'w-[calc(100vw-2rem)] sm:w-[420px]',
        isMinimized ? 'h-16' : 'h-[580px] max-h-[82vh]',
        'bg-surface/95 dark:bg-[#141B2A]/95 backdrop-blur-2xl',
        'border border-border/80 dark:border-border/60',
        'rounded-3xl shadow-2xl shadow-blue-900/10 dark:shadow-black/60',
        'animate-in fade-in zoom-in-95 duration-200'
      )}
      role="dialog"
      aria-labelledby="assistant-title"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-border/60 shrink-0 bg-surface/50 dark:bg-surface-elevated/40 rounded-t-3xl">
        <div className="flex items-center gap-3 min-w-0">
          <AssistantAvatar size="md" showOnlineDot={true} />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 id="assistant-title" className="font-bold text-sm tracking-tight text-foreground truncate">
                DevBot
              </h3>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/20 font-medium">
                Assistant
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground truncate flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              100% Offline • 29 Utilities
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={resetConversation}
            title="Restart conversation"
            aria-label="Restart conversation"
            className="p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-surface-elevated transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={toggleMinimized}
            title={isMinimized ? 'Expand' : 'Minimize'}
            aria-label={isMinimized ? 'Expand' : 'Minimize'}
            className="p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-surface-elevated transition-colors cursor-pointer"
          >
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={closeAssistant}
            title="Close Assistant (Esc)"
            aria-label="Close Assistant"
            className="p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-surface-elevated transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Main Content Area */}
          <div className="flex-1 min-h-0 flex flex-col relative overflow-hidden">
            {/* Messages Scroll View */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 [scrollbar-width:thin]">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    'flex flex-col gap-1.5 text-xs animate-in fade-in duration-150',
                    msg.sender === 'user' ? 'items-end' : 'items-start'
                  )}
                >
                  {msg.sender === 'bot' ? (
                    <div className="flex items-start gap-2.5 max-w-[92%]">
                      <AssistantAvatar size="sm" showOnlineDot={false} className="mt-0.5" />
                      <div className="space-y-2">
                        <div className="p-3 rounded-2xl rounded-tl-xs bg-surface-elevated/70 dark:bg-surface-elevated/50 border border-border/70 text-foreground text-xs leading-relaxed shadow-xs whitespace-pre-line">
                          {msg.text}
                        </div>

                        {/* Optional Action Button Link */}
                        {msg.actionLink && (
                          <div>
                            <Link
                              to={msg.actionLink}
                              onClick={closeAssistant}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[11px] shadow-sm shadow-blue-600/20 transition-all hover:gap-2"
                            >
                              <span>{msg.actionLabel || 'Open Tool'}</span>
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        )}

                        {/* Suggested Follow-up Question Chips */}
                        {msg.suggestedQuestions && msg.suggestedQuestions.length > 0 && (
                          <div className="pt-1 flex flex-wrap gap-1.5">
                            {msg.suggestedQuestions.map((relatedId) => {
                              const relatedFaq = FAQ_KNOWLEDGE_BASE.find((f) => f.id === relatedId);
                              if (!relatedFaq) return null;
                              return (
                                <button
                                  key={relatedId}
                                  type="button"
                                  onClick={() => handleSelectFaq(relatedId)}
                                  className="text-[11px] px-2.5 py-1 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-500/20 font-medium transition-colors text-left flex items-center gap-1 cursor-pointer"
                                >
                                  <span>{relatedFaq.question}</span>
                                  <ChevronRight className="w-3 h-3 shrink-0 opacity-70" />
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="max-w-[85%] p-3 rounded-2xl rounded-tr-xs bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium text-xs leading-relaxed shadow-sm shadow-blue-600/20">
                      {msg.text}
                    </div>
                  )}
                </div>
              ))}

              {/* Bot Typing Indicator */}
              {isTyping && (
                <div className="flex items-center gap-2.5 text-xs">
                  <AssistantAvatar size="sm" showOnlineDot={false} />
                  <div className="flex items-center gap-1 px-3 py-2.5 rounded-2xl rounded-tl-xs bg-surface-elevated/80 border border-border/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick FAQ Question Drawer / Browser Overlay */}
            {showFaqDrawer && (
              <div className="absolute inset-0 bg-surface/98 dark:bg-[#141B2A]/98 backdrop-blur-xl z-20 flex flex-col p-4 animate-in fade-in slide-in-from-bottom-4 duration-200">
                <div className="flex items-center justify-between pb-3 border-b border-border/70">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-blue-500" />
                    <h4 className="text-xs font-bold text-foreground">Frequently Asked Questions</h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowFaqDrawer(false)}
                    className="p-1 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Search Bar in Drawer */}
                <div className="relative my-2.5">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search FAQs & tools..."
                    className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-surface-elevated/60 border border-border/80 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* Category Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-2 [scrollbar-width:none]">
                  {FAQ_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setActiveCategory(cat.id)}
                      className={cn(
                        'text-[10px] font-semibold px-2.5 py-1 rounded-lg shrink-0 transition-colors cursor-pointer',
                        activeCategory === cat.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-surface-elevated text-muted-foreground hover:text-foreground border border-border/60'
                      )}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* FAQ Questions List */}
                <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 [scrollbar-width:thin] mt-1">
                  {filteredFaqs.length > 0 ? (
                    filteredFaqs.map((faq) => (
                      <button
                        key={faq.id}
                        type="button"
                        onClick={() => handleSelectFaq(faq.id)}
                        className="w-full text-left p-2.5 rounded-xl border border-border/60 bg-surface-elevated/30 hover:bg-blue-500/10 hover:border-blue-500/30 text-foreground transition-all group cursor-pointer flex items-center justify-between gap-2"
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-semibold group-hover:text-blue-500 transition-colors">
                            {faq.question}
                          </p>
                          <span className="text-[10px] text-muted-foreground">{faq.categoryLabel}</span>
                        </div>
                        <ChevronRight className="w-4 h-4 shrink-0 text-muted-foreground group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
                      </button>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground text-xs">
                      No matching questions found. Type below to ask DevBot directly!
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Quick FAQ Toggle Pill bar */}
          <div className="px-3 py-1.5 border-t border-border/50 bg-surface/30 flex items-center justify-between text-[11px] shrink-0">
            <button
              type="button"
              onClick={() => setShowFaqDrawer((prev) => !prev)}
              className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 hover:underline font-semibold cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{showFaqDrawer ? 'Back to Chat' : 'Browse FAQ Topics'}</span>
            </button>

            <span className="text-[10px] text-muted-foreground font-mono">Press Esc to close</span>
          </div>

          {/* Footer Input Bar */}
          <form
            onSubmit={handleSubmit}
            className="p-3 border-t border-border/60 bg-surface/80 dark:bg-surface-elevated/50 rounded-b-3xl shrink-0 flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Ask a question about DevVault..."
              className="flex-1 bg-surface-elevated/70 dark:bg-[#141B2A] border border-border/80 px-3.5 py-2 rounded-xl text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1.5 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={!inputVal.trim()}
              title="Send message"
              aria-label="Send message"
              className={cn(
                'p-2 rounded-xl font-semibold transition-all cursor-pointer flex items-center justify-center shrink-0',
                inputVal.trim()
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs shadow-blue-600/30 active:scale-95'
                  : 'bg-surface-elevated text-muted-foreground opacity-50 cursor-not-allowed'
              )}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </>
      )}
    </div>
  );
};
