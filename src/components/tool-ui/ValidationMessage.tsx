import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ValidationMessageProps {
  isValid: boolean | null;
  message?: string;
  className?: string;
}

export const ValidationMessage: React.FC<ValidationMessageProps> = ({
  isValid,
  message,
  className,
}) => {
  if (isValid === null) return null;

  return (
    <div
      className={cn(
        'flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium border transition-colors',
        isValid
          ? 'bg-success/10 text-success border-success/20'
          : 'bg-destructive/10 text-destructive border-destructive/20',
        className
      )}
    >
      {isValid ? (
        <CheckCircle2 className="w-4 h-4 shrink-0" />
      ) : (
        <AlertCircle className="w-4 h-4 shrink-0" />
      )}
      <span className="truncate">{message || (isValid ? 'Valid syntax' : 'Invalid syntax')}</span>
    </div>
  );
};

interface ErrorPanelProps {
  error: string | null;
  line?: number;
  column?: number;
  className?: string;
}

export const ErrorPanel: React.FC<ErrorPanelProps> = ({
  error,
  line,
  column,
  className,
}) => {
  if (!error) return null;

  return (
    <div
      className={cn(
        'rounded-md border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive flex flex-col gap-1',
        className
      )}
    >
      <div className="flex items-center gap-1.5 font-semibold">
        <AlertCircle className="w-4 h-4 shrink-0" />
        <span>Parsing / Validation Error</span>
        {line !== undefined && (
          <span className="ml-auto font-mono text-[11px] bg-destructive/20 px-1.5 py-0.5 rounded">
            Line {line}{column !== undefined ? `:${column}` : ''}
          </span>
        )}
      </div>
      <p className="font-mono text-destructive/90 break-words whitespace-pre-wrap pl-5">{error}</p>
    </div>
  );
};
