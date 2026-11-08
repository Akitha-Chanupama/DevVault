import React from 'react';
import { useAssistantStore } from '@/stores/assistantStore';
import { cn } from '@/lib/utils';

export const AssistantFAB: React.FC = () => {
  const { isOpen, toggleAssistant } = useAssistantStore();

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 select-none">
      <button
        type="button"
        onClick={toggleAssistant}
        aria-label={isOpen ? 'Close DevVault Assistant' : 'Open DevVault Assistant'}
        title={isOpen ? 'Close Assistant (Esc)' : 'DevBot — Instant Assistant & FAQs'}
        className={cn(
          'group relative flex items-center justify-center cursor-pointer transition-all duration-300 ease-out focus-visible:outline-none',
          'hover:-translate-y-1 active:translate-y-0',
          isOpen ? 'scale-95 opacity-85 hover:opacity-100' : 'opacity-100'
        )}
      >
        {/* 3D Robot Image - Background-free, badge-free & enlarged */}
        <div className="w-[68px] h-[68px] sm:w-[78px] sm:h-[78px] flex items-center justify-center">
          <img
            src="/images/robo.png"
            alt="DevBot Assistant"
            className={cn(
              'w-full h-full object-contain pointer-events-none select-none transition-all duration-300',
              'drop-shadow-[0_8px_16px_rgba(0,0,0,0.3)] dark:drop-shadow-[0_10px_24px_rgba(0,0,0,0.6)]',
              'group-hover:scale-110 group-hover:drop-shadow-[0_12px_28px_rgba(59,130,246,0.45)]',
              'active:scale-95'
            )}
            loading="lazy"
          />
        </div>

        {/* Floating Tooltip Callout on Desktop when closed */}
        {!isOpen && (
          <span className="hidden lg:group-hover:flex absolute right-22 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl bg-slate-900/95 dark:bg-slate-800/95 text-white text-xs font-semibold shadow-xl border border-white/10 whitespace-nowrap items-center gap-1.5 backdrop-blur-md animate-in fade-in slide-in-from-right-2 duration-150 pointer-events-none">
            <span>Ask DevBot</span>
            <span className="text-[10px] text-blue-300 bg-blue-500/20 px-1.5 py-0.5 rounded-md font-mono">FAQ</span>
          </span>
        )}
      </button>
    </div>
  );
};
