import React from 'react';
import { ShieldCheck, Cloud, Globe } from 'lucide-react';
import { PrivacyMode } from '@/types/tools';

interface PrivacyNoticeProps {
  mode: PrivacyMode;
  className?: string;
}

export const PrivacyNotice: React.FC<PrivacyNoticeProps> = ({ mode, className = '' }) => {
  if (mode === 'browser-only') {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap bg-success/10 text-success border border-success/20 ${className}`}>
        <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
        <span>Local Browser Only — Zero Server Transmission</span>
      </div>
    );
  }

  if (mode === 'external-request') {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap bg-warning/10 text-warning border border-warning/20 ${className}`}>
        <Globe className="w-3.5 h-3.5 shrink-0" />
        <span>External Request — Direct from Browser</span>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap bg-muted text-muted-foreground border border-border ${className}`}>
      <Cloud className="w-3.5 h-3.5 shrink-0" />
      <span>Server Assisted</span>
    </div>
  );
};
