import React from 'react';
import { LucideIcon, HelpCircle, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  action,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center p-8 border border-dashed border-border rounded-lg bg-surface/50 text-muted-foreground',
        className
      )}
    >
      {Icon && (
        <div className="w-10 h-10 rounded-full bg-surface-elevated border border-border flex items-center justify-center mb-3 text-muted-foreground">
          <Icon className="w-5 h-5" />
        </div>
      )}
      <h4 className="text-sm font-semibold text-foreground mb-1">{title}</h4>
      <p className="text-xs text-muted-foreground max-w-sm mb-4">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};

interface ToolHelpPanelProps {
  title?: string;
  description?: string;
  features?: string[];
  tips?: string[];
  className?: string;
}

export const ToolHelpPanel: React.FC<ToolHelpPanelProps> = ({
  title = 'How to use this tool',
  description,
  features,
  tips,
  className,
}) => {
  return (
    <div
      className={cn(
        'rounded-lg border border-border bg-surface p-4 text-xs space-y-3',
        className
      )}
    >
      <div className="flex items-center gap-1.5 font-semibold text-foreground">
        <HelpCircle className="w-4 h-4 text-primary" />
        <span>{title}</span>
      </div>

      {description && <p className="text-muted-foreground leading-relaxed">{description}</p>}

      {features && features.length > 0 && (
        <div className="space-y-1.5">
          <span className="font-medium text-foreground">Capabilities:</span>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            {features.map((feature, i) => (
              <li key={i}>{feature}</li>
            ))}
          </ul>
        </div>
      )}

      {tips && tips.length > 0 && (
        <div className="pt-2 border-t border-border/60">
          <div className="flex items-center gap-1.5 font-medium text-foreground mb-1.5">
            <Lightbulb className="w-3.5 h-3.5 text-warning" />
            <span>Tips:</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            {tips.map((tip, i) => (
              <li key={i}>{tip}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
