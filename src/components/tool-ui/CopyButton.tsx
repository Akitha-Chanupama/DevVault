import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface CopyButtonProps {
  content: string;
  label?: string;
  className?: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({
  content,
  label = 'Copy',
  className,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!content) {
      toast.error('Nothing to copy');
      return;
    }
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      toast.success('Copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy to clipboard');
    }
  };

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={handleCopy}
      className={cn('gap-1.5 whitespace-nowrap', className)}
      title="Copy to clipboard"
    >
      {copied ? (
        <Check className="w-3.5 h-3.5 text-success shrink-0" />
      ) : (
        <Copy className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
      )}
      <span>{copied ? 'Copied' : label}</span>
    </Button>
  );
};
