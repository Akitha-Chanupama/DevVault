import React from 'react';
import { Sparkles, X } from 'lucide-react';
import { useAssistantStore } from '@/stores/assistantStore';
import { cn } from '@/lib/utils';

export const AssistantFAB: React.FC = () => {
  const { isOpen, toggleAssistant } = useAssistantStore();

  return (
    <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 select-none">
      <button
        type="button"
        onClick={toggleAssistant}
        aria-label={isOpen ? 'Close DevVault Assistant' : 'Open DevVault Assistant'}
        title={isOpen ? 'Close Assistant (Esc)' : 'DevBot — Instant Assistant & FAQs'}
        className={cn(
          'group relative flex items-center justify-center cursor-pointer transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
          isOpen
            ? 'w-12 h-12 rounded-full bg-slate-800 text-slate-100 hover:bg-slate-700 shadow-xl border border-slate-700'
            : 'w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-500 text-white shadow-xl shadow-blue-600/30 hover:shadow-blue-600/50 hover:scale-105 active:scale-95 border border-white/20'
        )}
      >
        {isOpen ? (
          <X className="w-5 h-5 text-slate-200 transition-transform duration-200 group-hover:rotate-90" />
        ) : (
          <>
            {/* 3D Robot Thumbnail */}
            <div className="w-12 h-12 flex items-center justify-center overflow-hidden">
              <img
                src="/images/robo.png"
                alt="DevBot"
                className="w-full h-full object-contain p-0.5 transform scale-110 group-hover:scale-125 transition-transform duration-300 drop-shadow-md select-none pointer-events-none"
              />
            </div>

            {/* Glowing active online badge */}
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 ring-2 ring-background items-center justify-center">
                <Sparkles className="w-2.5 h-2.5 text-white" />
              </span>
            </span>

            {/* Floating Tooltip Callout on Desktop */}
            <span className="hidden lg:group-hover:flex absolute right-16 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl bg-slate-900/90 dark:bg-slate-800/95 text-white text-xs font-semibold shadow-xl border border-white/10 whitespace-nowrap items-center gap-1.5 backdrop-blur-md animate-in fade-in slide-in-from-right-2 duration-150 pointer-events-none">
              <span>Ask DevBot</span>
              <span className="text-[10px] text-blue-300 bg-blue-500/20 px-1.5 py-0.5 rounded-md font-mono">FAQ</span>
            </span>
          </>
        )}
      </button>
    </div>
  );
};
