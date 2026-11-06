import React, { useState, useEffect } from 'react';
import {
  RefreshCw,
  Sliders,
} from 'lucide-react';
import { ToolPageHeader } from '@/components/tool-ui/ToolPageHeader';
import { CopyButton } from '@/components/tool-ui/CopyButton';
import { ToolHelpPanel } from '@/components/tool-ui/EmptyState';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { generatePasswords } from '../logic/passwordGenerator';
import { PasswordOptions, GeneratedPasswordInfo } from '../types';
import { toast } from 'sonner';

export const PasswordGeneratorPage: React.FC = () => {
  const [options, setOptions] = useState<PasswordOptions>({
    length: 20,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
    excludeAmbiguous: true,
    count: 1,
  });

  const [passwords, setPasswords] = useState<GeneratedPasswordInfo[]>([]);

  const handleRegenerate = () => {
    try {
      const generated = generatePasswords(options);
      setPasswords(generated);
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  useEffect(() => {
    handleRegenerate();
  }, [options]);

  const primaryPassword = passwords[0];

  const getStrengthBadge = (level: string) => {
    switch (level) {
      case 'Very Strong':
        return <Badge variant="success">Very Strong</Badge>;
      case 'Strong':
        return <Badge variant="success">Strong</Badge>;
      case 'Good':
        return <Badge variant="warning">Good</Badge>;
      case 'Fair':
        return <Badge variant="warning">Fair</Badge>;
      default:
        return <Badge variant="destructive">Weak</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <ToolPageHeader
        toolId="password-generator"
        title="Password Generator"
        description="Generate cryptographically strong, high-entropy passwords and tokens using CSPRNG randomness."
        category="Security"
        privacyMode="browser-only"
      />

      {/* Main Primary Password Display Card */}
      {primaryPassword && (
        <Card className="p-6 bg-surface border-primary/30 shadow-md space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Generated Password
              </span>
              {getStrengthBadge(primaryPassword.strengthLevel)}
              <span className="text-xs font-mono text-muted-foreground">
                ~{primaryPassword.entropyBits} bits entropy
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRegenerate}
                className="text-xs h-8 gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Regenerate</span>
              </Button>
              <CopyButton content={primaryPassword.password} label="Copy Password" />
            </div>
          </div>

          <div className="p-4 rounded-lg bg-surface-elevated border border-border">
            <p className="font-mono text-base sm:text-xl font-bold tracking-wider text-foreground break-all select-all">
              {primaryPassword.password}
            </p>
          </div>
        </Card>
      )}

      {/* Controls & Configuration */}
      <Card className="bg-surface p-5 space-y-5">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Sliders className="w-4 h-4 text-primary" />
          <span>Password Options</span>
        </div>

        {/* Length Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-foreground">Password Length</span>
            <span className="font-mono font-bold text-primary text-sm">{options.length} characters</span>
          </div>
          <input
            type="range"
            min={8}
            max={64}
            value={options.length}
            onChange={(e) => setOptions({ ...options, length: parseInt(e.target.value, 10) })}
            className="w-full accent-primary h-2 bg-surface-elevated rounded-lg cursor-pointer"
          />
        </div>

        {/* Character Groups Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
          <label className="flex items-center gap-2 p-2.5 rounded-lg border border-border bg-surface-elevated/40 hover:bg-surface-elevated cursor-pointer transition-colors text-xs">
            <input
              type="checkbox"
              checked={options.uppercase}
              onChange={(e) => setOptions({ ...options, uppercase: e.target.checked })}
              className="rounded border-border text-primary focus:ring-primary h-4 w-4"
            />
            <div>
              <span className="font-semibold block text-foreground">Uppercase Letters</span>
              <span className="text-muted-foreground text-[11px]">A-Z</span>
            </div>
          </label>

          <label className="flex items-center gap-2 p-2.5 rounded-lg border border-border bg-surface-elevated/40 hover:bg-surface-elevated cursor-pointer transition-colors text-xs">
            <input
              type="checkbox"
              checked={options.lowercase}
              onChange={(e) => setOptions({ ...options, lowercase: e.target.checked })}
              className="rounded border-border text-primary focus:ring-primary h-4 w-4"
            />
            <div>
              <span className="font-semibold block text-foreground">Lowercase Letters</span>
              <span className="text-muted-foreground text-[11px]">a-z</span>
            </div>
          </label>

          <label className="flex items-center gap-2 p-2.5 rounded-lg border border-border bg-surface-elevated/40 hover:bg-surface-elevated cursor-pointer transition-colors text-xs">
            <input
              type="checkbox"
              checked={options.numbers}
              onChange={(e) => setOptions({ ...options, numbers: e.target.checked })}
              className="rounded border-border text-primary focus:ring-primary h-4 w-4"
            />
            <div>
              <span className="font-semibold block text-foreground">Numbers</span>
              <span className="text-muted-foreground text-[11px]">0-9</span>
            </div>
          </label>

          <label className="flex items-center gap-2 p-2.5 rounded-lg border border-border bg-surface-elevated/40 hover:bg-surface-elevated cursor-pointer transition-colors text-xs">
            <input
              type="checkbox"
              checked={options.symbols}
              onChange={(e) => setOptions({ ...options, symbols: e.target.checked })}
              className="rounded border-border text-primary focus:ring-primary h-4 w-4"
            />
            <div>
              <span className="font-semibold block text-foreground">Special Symbols</span>
              <span className="text-muted-foreground text-[11px]">!@#$%^&*...</span>
            </div>
          </label>

          <label className="flex items-center gap-2 p-2.5 rounded-lg border border-border bg-surface-elevated/40 hover:bg-surface-elevated cursor-pointer transition-colors text-xs sm:col-span-2">
            <input
              type="checkbox"
              checked={options.excludeAmbiguous}
              onChange={(e) => setOptions({ ...options, excludeAmbiguous: e.target.checked })}
              className="rounded border-border text-primary focus:ring-primary h-4 w-4"
            />
            <div>
              <span className="font-semibold block text-foreground">Exclude Ambiguous Characters</span>
              <span className="text-muted-foreground text-[11px]">Avoids 1, l, I, 0, O, o for easier manual entry</span>
            </div>
          </label>
        </div>

        {/* Bulk Generation Option */}
        <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="font-medium text-foreground">Generate Batch:</span>
            <select
              value={options.count}
              onChange={(e) => setOptions({ ...options, count: parseInt(e.target.value, 10) })}
              className="h-8 rounded-md border border-border bg-surface-elevated px-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="1">1 Password</option>
              <option value="5">5 Passwords</option>
              <option value="10">10 Passwords</option>
              <option value="20">20 Passwords</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Batch Results if count > 1 */}
      {passwords.length > 1 && (
        <Card className="p-4 bg-surface space-y-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-foreground">
              Generated Batch ({passwords.length})
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                await navigator.clipboard.writeText(passwords.map((p) => p.password).join('\n'));
                toast.success('All passwords copied to clipboard');
              }}
              className="text-xs h-7"
            >
              Copy All Batch
            </Button>
          </div>

          <div className="divide-y divide-border/60">
            {passwords.map((p, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between py-2 text-xs font-mono"
              >
                <span className="text-foreground truncate select-all">{p.password}</span>
                <CopyButton content={p.password} label="Copy" className="h-6 px-2 text-[11px]" />
              </div>
            ))}
          </div>
        </Card>
      )}

      <ToolHelpPanel
        title="About Secure Password Generation"
        description="DevVault generates passwords using the browser's cryptographic pseudo-random number generator (CSPRNG) via window.crypto.getRandomValues()."
        features={[
          'True Cryptographic Randomness: does not use Math.random(), preventing entropy predictability.',
          'Rejection sampling eliminates modulo bias across non-power-of-2 character sets.',
          'Shannon Entropy measurement indicates resistance against modern GPU brute-force attacks.',
          'Privacy guarantee: Passwords are created purely in transient memory and are never written to disk, database, or analytics.',
        ]}
      />
    </div>
  );
};

export default PasswordGeneratorPage;
