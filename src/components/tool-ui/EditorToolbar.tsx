import React from 'react';
import { cn } from '@/lib/utils';

interface EditorToolbarProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  title,
  subtitle,
  children,
  actions,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-between gap-2 px-3 py-2 border-b border-border bg-surface-elevated text-xs rounded-t-lg',
        className
      )}
    >
      <div className="flex items-center gap-2">
        <span className="font-semibold text-foreground">{title}</span>
        {subtitle && <span className="text-muted-foreground">{subtitle}</span>}
        {children}
      </div>
      {actions && <div className="flex items-center gap-1.5">{actions}</div>}
    </div>
  );
};

