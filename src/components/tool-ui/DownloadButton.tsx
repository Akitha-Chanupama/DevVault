import React from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface DownloadButtonProps {
  content: string;
  filename: string;
  mimeType?: string;
  label?: string;
  className?: string;
}

export const DownloadButton: React.FC<DownloadButtonProps> = ({
  content,
  filename,
  mimeType = 'text/plain',
  label = 'Download',
  className,
}) => {
  const handleDownload = () => {
    if (!content) {
      toast.error('Nothing to download');
      return;
    }
    try {
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success(`Downloaded ${filename}`);
    } catch {
      toast.error('Failed to initiate download');
    }
  };

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={handleDownload}
      className={cn('gap-1.5 whitespace-nowrap', className)}
      title="Download file"
    >
      <Download className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
      <span>{label}</span>
    </Button>
  );
};
