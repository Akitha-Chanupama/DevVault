import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
      className={className}
      title="Copy to clipboard"
    >
      {copied ? (
        <Check className="w-3.5 h-3.5 mr-1.5 text-success" />
      ) : (
        <Copy className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
      )}
      <span>{copied ? 'Copied' : label}</span>
    </Button>
  );
};
