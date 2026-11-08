import React from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ClearButtonProps {
  onClear: () => void;
  disabled?: boolean;
  label?: string;
  className?: string;
}

export const ClearButton: React.FC<ClearButtonProps> = ({
  onClear,
  disabled = false,
  label = 'Clear',
  className,
}) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClear}
      disabled={disabled}
      className={cn('gap-1.5 whitespace-nowrap', className)}
      title="Clear input"
    >
      <Trash2 className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
      <span>{label}</span>
    </Button>
  );
};
