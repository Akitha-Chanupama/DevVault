import React, { useState, useEffect } from 'react';
import {
  History,
  Trash2,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { historyRepository } from '@/db/repositories/historyRepository';
import { settingsRepository } from '@/db/repositories/settingsRepository';
import { DbHistoryItem, DbSettings } from '@/db/database';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

export const HistoryPage: React.FC = () => {
  const [items, setItems] = useState<DbHistoryItem[]>([]);
  const [settings, setSettings] = useState<DbSettings | null>(null);

  const loadData = async () => {
    const list = await historyRepository.getAll();
    setItems(list);
    const s = await settingsRepository.getSettings();
    setSettings(s);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDeleteItem = async (id: string) => {
    await historyRepository.delete(id);
    setItems(items.filter((item) => item.id !== id));
    toast.success('History entry removed');
  };

  const handleClearAll = async () => {
    if (window.confirm('Clear all operation history? This action cannot be undone.')) {
      await historyRepository.clearAll();
      setItems([]);
      toast.success('All history cleared');
    }
  };

  const handleToggleHistory = async () => {
    if (!settings) return;
    const next = !settings.historyEnabled;
    const updated = await settingsRepository.updateSettings({ historyEnabled: next });
    setSettings(updated);
    toast.success(`Tool history ${next ? 'enabled' : 'disabled'}`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Tool Activity History
            </h1>
            {settings?.historyEnabled ? (
              <Badge variant="success">Active</Badge>
            ) : (
              <Badge variant="secondary">Paused</Badge>
            )}
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Audit log of local tool executions. Sensitive payloads, tokens, and passwords are never recorded.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleToggleHistory}
            className="text-xs h-8"
          >
            {settings?.historyEnabled ? 'Pause History' : 'Enable History'}
          </Button>

          <Button
            variant="destructive"
            size="sm"
            onClick={handleClearAll}
            disabled={items.length === 0}
            className="text-xs h-8 gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All</span>
          </Button>
        </div>
      </div>

      {/* Privacy Notice Banner */}
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-xs text-muted-foreground flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
        <span>
          Privacy Policy: History records only event timestamps and metadata. JWT tokens, secrets, encryption keys, and raw payloads are strictly excluded.
        </span>
      </div>

      {/* History Items List */}
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 rounded-xl border border-dashed border-border bg-surface text-center">
          <History className="w-10 h-10 text-muted-foreground/60 mb-3" />
          <h3 className="text-sm font-semibold text-foreground">No history records</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm">
            Operations performed in DevVault will appear here as non-sensitive timeline events.
          </p>
        </div>
      ) : (
        <Card className="bg-surface divide-y divide-border/60">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-surface-elevated/40 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-xs text-foreground font-mono">
                    {item.toolId}
                  </span>
                  <Badge variant="secondary" className="text-[10px]">
                    {item.operation}
                  </Badge>
                </div>

                {item.metadata && (
                  <div className="flex items-center gap-2 text-[11px] font-mono text-muted-foreground flex-wrap">
                    {Object.entries(item.metadata).map(([k, v]) => (
                      <span key={k} className="bg-surface-elevated px-1.5 py-0.5 rounded border border-border">
                        {k}: {String(v)}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center">
                <span className="text-[11px] font-mono text-muted-foreground">
                  {new Date(item.createdAt).toLocaleString()}
                </span>
                <Link
                  to={`/tools/${item.toolId}`}
                  className="text-xs text-primary hover:underline font-medium"
                >
                  Launch
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteItem(item.id)}
                  className="h-7 w-7 text-muted-foreground hover:text-destructive"
                  title="Delete entry"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
};

export default HistoryPage;
