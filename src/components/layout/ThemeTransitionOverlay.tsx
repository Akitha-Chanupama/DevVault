import React, { useEffect, useState } from 'react';
import { Moon, Sun, Laptop, Sparkles } from 'lucide-react';
import { useThemeStore } from '@/stores/themeStore';
import { cn } from '@/lib/utils';

export const ThemeTransitionOverlay: React.FC = () => {
  const transition = useThemeStore((state) => state.transition);
  const dismissTransition = useThemeStore((state) => state.dismissTransition);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!transition) {
      setProgress(0);
      return;
    }

    if (transition.phase === 'entering') {
      const timer = setTimeout(() => setProgress(55), 30);
      return () => clearTimeout(timer);
    } else if (transition.phase === 'holding') {
      setProgress(85);
    } else if (transition.phase === 'leaving') {
      setProgress(100);
    }
  }, [transition]);

  if (!transition) return null;

  const isDarkTarget = transition.targetResolved === 'dark';
  const originX =
    transition.origin?.clientX ??
    (typeof window !== 'undefined' ? window.innerWidth / 2 : 500);
  const originY =
    transition.origin?.clientY ??
    (typeof window !== 'undefined' ? 32 : 32);

  const themeLabel =
    transition.targetTheme === 'dark'
      ? 'Dark Theme'
      : transition.targetTheme === 'light'
      ? 'Light Theme'
      : 'System Adaptive Theme';

  const actionText =
    transition.targetTheme === 'dark'
      ? 'Switching to Obsidian Dark'
      : transition.targetTheme === 'light'
      ? 'Switching to Pristine Light'
      : 'Aligning with System Theme';

  return (
    <div
      role="status"
      aria-live="polite"
      onClick={dismissTransition}
      className={cn(
        'fixed inset-0 z-[99999] pointer-events-none select-none flex items-center justify-center overflow-hidden transition-all duration-300 ease-out',
        transition.phase === 'entering' && 'opacity-100',
        transition.phase === 'holding' && 'opacity-100',
        transition.phase === 'leaving' && 'opacity-0 duration-450 ease-in-out'
      )}
    >
      {/* Primary Atmospheric Veil */}
      <div
        className={cn(
          'absolute inset-0 transition-opacity duration-300',
          isDarkTarget
            ? 'bg-[#090D16]/95 backdrop-blur-2xl'
            : 'bg-[#EEF4FB]/95 backdrop-blur-2xl'
        )}
      />

      {/* Atmospheric Radial Corona centered at click coordinates */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-500"
        style={{
          background: isDarkTarget
            ? `radial-gradient(circle 800px at ${originX}px ${originY}px, rgba(59, 130, 246, 0.28), rgba(15, 23, 42, 0.94) 65%, transparent 100%)`
            : `radial-gradient(circle 800px at ${originX}px ${originY}px, rgba(56, 189, 248, 0.32), rgba(226, 237, 249, 0.94) 65%, transparent 100%)`,
        }}
      />

      {/* Expanding Ripple Shockwave */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          left: originX,
          top: originY,
          width: 80,
          height: 80,
          marginLeft: -40,
          marginTop: -40,
          transform: transition.phase === 'entering' ? 'scale(32)' : 'scale(40)',
          background: isDarkTarget
            ? 'radial-gradient(circle, rgba(59, 130, 246, 0.25) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(245, 158, 11, 0.22) 0%, transparent 70%)',
          opacity: transition.phase === 'leaving' ? 0 : 0.85,
          transition: 'transform 850ms cubic-bezier(0.16, 1, 0.3, 1), opacity 450ms ease',
        }}
      />

      {/* Floating Glassmorphic HUD Badge */}
      <div
        className={cn(
          'relative z-10 flex flex-col items-center gap-4 px-8 py-7 rounded-3xl border shadow-2xl backdrop-blur-3xl transition-all duration-300 max-w-sm w-full mx-4',
          transition.phase === 'entering' && 'scale-100 opacity-100 translate-y-0 animate-in fade-in zoom-in-95 duration-250',
          transition.phase === 'holding' && 'scale-100 opacity-100 translate-y-0',
          transition.phase === 'leaving' && 'scale-105 opacity-0 -translate-y-2 duration-300',
          isDarkTarget
            ? 'bg-slate-900/90 border-blue-500/30 text-white shadow-[0_0_60px_rgba(59,130,246,0.3)]'
            : 'bg-white/95 border-blue-200/80 text-slate-900 shadow-[0_0_60px_rgba(37,99,235,0.2)]'
        )}
      >
        {/* Animated Theme Emblem */}
        <div className="relative">
          <div
            className={cn(
              'w-16 h-16 rounded-2xl flex items-center justify-center border shadow-inner relative transition-transform duration-500',
              isDarkTarget
                ? 'bg-blue-500/15 border-blue-400/40 text-blue-400 shadow-blue-500/20'
                : 'bg-amber-500/15 border-amber-400/40 text-amber-500 shadow-amber-500/20'
            )}
          >
            {transition.targetTheme === 'dark' ? (
              <>
                <Moon className="w-8 h-8 text-blue-400 animate-pulse drop-shadow-[0_0_12px_rgba(96,165,250,0.9)]" />
                <Sparkles className="w-4 h-4 text-cyan-300 absolute -top-1 -right-1 animate-bounce" />
              </>
            ) : transition.targetTheme === 'light' ? (
              <>
                <Sun className="w-8 h-8 text-amber-500 animate-[spin_10s_linear_infinite] drop-shadow-[0_0_14px_rgba(245,158,11,0.9)]" />
                <Sparkles className="w-4 h-4 text-amber-300 absolute -top-1 -right-1 animate-pulse" />
              </>
            ) : (
              <Laptop className="w-8 h-8 text-blue-400 animate-pulse drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
            )}
          </div>
        </div>

        {/* Informational Titles */}
        <div className="text-center space-y-1">
          <h3 className="text-lg font-bold tracking-tight">
            {actionText}
          </h3>
          <p
            className={cn(
              'text-xs font-medium flex items-center justify-center gap-1.5',
              isDarkTarget ? 'text-slate-400' : 'text-slate-500'
            )}
          >
            <span className="font-semibold text-blue-600 dark:text-blue-400">DevVault</span>
            <span>•</span>
            <span>{themeLabel}</span>
          </p>
        </div>

        {/* Futuristic Energy Fill Bar */}
        <div
          className={cn(
            'w-full h-1.5 rounded-full overflow-hidden mt-1',
            isDarkTarget ? 'bg-slate-800' : 'bg-slate-200'
          )}
        >
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-600 transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
