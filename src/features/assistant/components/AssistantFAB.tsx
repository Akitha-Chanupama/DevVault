import React from 'react';
import { useAssistantStore } from '@/stores/assistantStore';
import { cn } from '@/lib/utils';

export const AssistantFAB: React.FC = () => {
  const { isOpen, toggleAssistant } = useAssistantStore();

  return (
    <div className="fixed bottom-2 right-2 sm:bottom-3 sm:right-4 z-40 select-none">
      <button
        type="button"
        onClick={toggleAssistant}
        aria-label={isOpen ? 'Close DevVault Assistant' : 'Open DevVault Assistant'}
        title={isOpen ? 'Close Assistant (Esc)' : 'DevBot — Instant Assistant & FAQs'}
        className={cn(
          'group relative flex items-center justify-center cursor-pointer transition-all duration-300 ease-out focus-visible:outline-none',
          'hover:-translate-y-1.5 active:translate-y-0',
          isOpen ? 'scale-95 opacity-80 hover:opacity-100' : 'opacity-100'
        )}
      >
        {/* 3D Robot Image - At least twice the size (180px height) */}
        <div className="w-[110px] h-[146px] sm:w-[136px] sm:h-[180px] flex items-center justify-center">
          <img
            src="/images/robo.png"
            alt="DevBot Assistant"
            className={cn(
              'w-full h-full object-contain pointer-events-none select-none transition-all duration-300',
              'drop-shadow-[0_12px_24px_rgba(0,0,0,0.35)] dark:drop-shadow-[0_16px_32px_rgba(0,0,0,0.7)]',
              'group-hover:scale-105 group-hover:drop-shadow-[0_18px_38px_rgba(59,130,246,0.5)]',
              'active:scale-95'
            )}
            loading="lazy"
          />
        </div>

        {/* Floating Tooltip Callout on Desktop when closed */}
        {!isOpen && (
          <span className="hidden lg:group-hover:flex absolute right-32 sm:right-36 top-1/2 -translate-y-1/2 px-3.5 py-2 rounded-xl bg-slate-900/95 dark:bg-slate-800/95 text-white text-xs font-semibold shadow-2xl border border-white/10 whitespace-nowrap items-center gap-2 backdrop-blur-md animate-in fade-in slide-in-from-right-3 duration-150 pointer-events-none">
            <span>Ask DevBot</span>
            <span className="text-[10px] text-blue-300 bg-blue-500/20 px-1.5 py-0.5 rounded-md font-mono">FAQ</span>
          </span>
        )}
      </button>
    </div>
  );
};
