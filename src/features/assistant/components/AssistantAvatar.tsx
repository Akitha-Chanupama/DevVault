import React, { useState } from 'react';
import { Bot } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AssistantAvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showOnlineDot?: boolean;
  className?: string;
}

export const AssistantAvatar: React.FC<AssistantAvatarProps> = ({
  size = 'md',
  showOnlineDot = true,
  className,
}) => {
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
    xl: 'w-14 h-14',
  };

  const dotClasses = {
    sm: 'w-2 h-2 bottom-0 right-0',
    md: 'w-2.5 h-2.5 bottom-0 right-0',
    lg: 'w-3 h-3 bottom-0.5 right-0.5',
    xl: 'w-3.5 h-3.5 bottom-0.5 right-0.5',
  };

  return (
    <div className={cn('relative inline-flex items-center justify-center shrink-0', className)}>
      <div
        className={cn(
          'rounded-2xl overflow-hidden flex items-center justify-center transition-all',
          'bg-gradient-to-br from-blue-500/20 via-indigo-500/20 to-purple-500/20',
          'border border-blue-400/30 shadow-xs shadow-blue-500/10',
          sizeClasses[size]
        )}
      >
        {!imageError ? (
          <img
            src="/images/robo.png"
            alt="DevBot 3D Robot Assistant"
            onError={() => setImageError(true)}
            className="w-full h-full object-contain p-0.5 transform scale-110 drop-shadow-md select-none pointer-events-none"
            loading="lazy"
          />
        ) : (
          <Bot className="w-5 h-5 text-blue-500" />
        )}
      </div>

      {showOnlineDot && (
        <span
          className={cn(
            'absolute rounded-full bg-emerald-500 ring-2 ring-background ring-offset-0 animate-pulse',
            dotClasses[size]
          )}
          title="DevBot is active & offline-ready"
        />
      )}
    </div>
  );
};

