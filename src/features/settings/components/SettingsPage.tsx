import React, { useState, useEffect } from 'react';
import {
  Download,
  Upload,
  Sun,
  Moon,
  Laptop,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useThemeStore } from '@/stores/themeStore';
import { useWorkspaceStore } from '@/stores/workspaceStore';
import { settingsRepository } from '@/db/repositories/settingsRepository';
import { backupRepository, BackupValidationResult } from '@/db/repositories/backupRepository';
import { DbSettings } from '@/db/database';
import { toast } from 'sonner';

export const SettingsPage: React.FC = () => {
  const { theme, setTheme } = useThemeStore();
  const { favorites } = useWorkspaceStore();

  const [settings, setSettings] = useState<DbSettings>({
    id: 'current',
    theme: 'system',
    historyEnabled: true,
    historyRetentionDays: 30,
    defaultIndentation: 2,
    editorFontSize: 13,
    editorWordWrap: true,
  });

  const [importPreview, setImportPreview] = useState<BackupValidationResult | null>(null);
  const [importMode, setImportMode] = useState<'merge' | 'replace'>('merge');

  useEffect(() => {
    settingsRepository.getSettings().then((s) => {
      setSettings(s);
    });
  }, []);

  const handleUpdate = async (updates: Partial<DbSettings>) => {
    const updated = await settingsRepository.updateSettings(updates);
    setSettings(updated);
    if (updates.theme) {
      setTheme(updates.theme);
    }
    toast.success('Settings saved');
  };

  const handleExportBackup = async () => {
    try {
      const json = await backupRepository.exportBackup(favorites);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `devvault-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Workspace backup exported successfully');
    } catch {
      toast.error('Failed to export backup');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const validation = backupRepository.validateBackupFile(content);
      setImportPreview(validation);
      if (!validation.isValid) {
        toast.error(validation.error || 'Invalid backup file');
      } else {
        toast.info('Backup file verified. Review details before applying.');
      }
    };
    reader.readAsText(file);
  };

  const handleApplyRestore = async () => {
    if (!importPreview?.data) return;

    try {
      await backupRepository.restoreBackup(importPreview.data, importMode);
      toast.success(`Backup restored successfully in "${importMode}" mode`);
      setImportPreview(null);
      // Refresh local settings
      const s = await settingsRepository.getSettings();
      setSettings(s);
      setTheme(s.theme);
    } catch (err) {
      toast.error(`Restore failed: ${(err as Error).message}`);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-150">
      {/* Header */}
      <div className="border-b border-border pb-5">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          Workspace Settings
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Configure application preferences, editor defaults, history retention, and offline backups.
        </p>
      </div>

      {/* Theme Settings */}
      <Card className="bg-surface">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Appearance & Theme</CardTitle>
          <CardDescription className="text-xs">
            Choose your preferred color theme. System mode synchronizes with your OS appearance.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-3 gap-3 max-w-md">
            <button
              onClick={() => handleUpdate({ theme: 'light' })}
              className={`flex flex-col items-center justify-center p-3 rounded-lg border text-xs font-semibold gap-2 transition-all ${
                theme === 'light'
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-surface-elevated/40 text-muted-foreground hover:text-foreground'
              }`}
            >
              <Sun className="w-4 h-4" />
              <span>Light</span>
            </button>

            <button
              onClick={() => handleUpdate({ theme: 'dark' })}
              className={`flex flex-col items-center justify-center p-3 rounded-lg border text-xs font-semibold gap-2 transition-all ${
                theme === 'dark'
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-surface-elevated/40 text-muted-foreground hover:text-foreground'
              }`}
            >
              <Moon className="w-4 h-4" />
              <span>Dark</span>
            </button>

            <button
              onClick={() => handleUpdate({ theme: 'system' })}
              className={`flex flex-col items-center justify-center p-3 rounded-lg border text-xs font-semibold gap-2 transition-all ${
                theme === 'system'
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-surface-elevated/40 text-muted-foreground hover:text-foreground'
              }`}
            >
              <Laptop className="w-4 h-4" />
              <span>System</span>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Code Editor Defaults */}
      <Card className="bg-surface">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Editor Preferences</CardTitle>
          <CardDescription className="text-xs">
            Default configurations applied to Monaco code editors throughout tools.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">
                Default Indentation
              </label>
              <select
                value={settings.defaultIndentation}
                onChange={(e) =>
                  handleUpdate({ defaultIndentation: parseInt(e.target.value, 10) as 2 | 4 })
                }
                className="w-full h-9 rounded-md border border-border bg-surface-elevated px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value={2}>2 Spaces</option>
                <option value={4}>4 Spaces</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">
                Font Size (px)
              </label>
              <Input
                type="number"
                min={11}
                max={20}
                value={settings.editorFontSize}
                onChange={(e) =>
                  handleUpdate({ editorFontSize: parseInt(e.target.value, 10) || 13 })
                }
                className="h-9 text-xs"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer text-xs text-foreground">
            <input
              type="checkbox"
              checked={settings.editorWordWrap}
              onChange={(e) => handleUpdate({ editorWordWrap: e.target.checked })}
              className="rounded border-border text-primary focus:ring-primary h-4 w-4"
            />
            <span>Enable Word Wrap by default in editors</span>
          </label>
        </CardContent>
      </Card>

      {/* History and Retention */}
      <Card className="bg-surface">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Privacy & Activity Retention</CardTitle>
          <CardDescription className="text-xs">
            Manage local operational event recording and automatic lifecycle retention.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0 space-y-4">
          <label className="flex items-center gap-2 cursor-pointer text-xs text-foreground">
            <input
              type="checkbox"
              checked={settings.historyEnabled}
              onChange={(e) => handleUpdate({ historyEnabled: e.target.checked })}
              className="rounded border-border text-primary focus:ring-primary h-4 w-4"
            />
            <span>Record operational history locally (never records secrets or payloads)</span>
          </label>

          <div className="max-w-xs">
            <label className="text-xs font-semibold text-foreground block mb-1">
              Retention Window (Days)
            </label>
            <Input
              type="number"
              min={1}
              max={365}
              value={settings.historyRetentionDays}
              onChange={(e) =>
                handleUpdate({ historyRetentionDays: parseInt(e.target.value, 10) || 30 })
              }
              className="h-9 text-xs"
            />
            <span className="text-[11px] text-muted-foreground mt-1 block">
              Records older than this window are automatically purged.
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Backup and Restore (Section 18) */}
      <Card className="bg-surface">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Workspace Backup & Restore</CardTitle>
          <CardDescription className="text-xs">
            Export all snippets, collections, favorites, and settings as a JSON file, or restore from a backup.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <Button onClick={handleExportBackup} size="sm" className="gap-1.5 text-xs">
              <Download className="w-3.5 h-3.5" />
              <span>Export Workspace Backup</span>
            </Button>

            <label className="cursor-pointer">
              <input
                type="file"
                accept=".json,application/json"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button variant="outline" size="sm" asChild className="gap-1.5 text-xs cursor-pointer">
                <span>
                  <Upload className="w-3.5 h-3.5" />
                  <span>Choose Backup to Restore</span>
                </span>
              </Button>
            </label>
          </div>

          {/* Import Preview dialog / box */}
          {importPreview && (
            <div className="p-4 rounded-lg border border-border bg-surface-elevated space-y-3">
              <div className="flex items-center gap-2">
                {importPreview.isValid ? (
                  <CheckCircle2 className="w-4 h-4 text-success" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-destructive" />
                )}
                <span className="font-semibold text-xs text-foreground">
                  {importPreview.isValid ? 'Valid Backup File' : 'Invalid Backup File'}
                </span>
              </div>

              {importPreview.isValid && importPreview.summary && (
                <div className="text-xs space-y-2 text-muted-foreground">
                  <div className="grid grid-cols-3 gap-2 p-2 rounded bg-surface border border-border text-center">
                    <div>
                      <span className="font-bold text-foreground block">
                        {importPreview.summary.snippetCount}
                      </span>
                      <span className="text-[10px]">Snippets</span>
                    </div>
                    <div>
                      <span className="font-bold text-foreground block">
                        {importPreview.summary.collectionCount}
                      </span>
                      <span className="text-[10px]">Collections</span>
                    </div>
                    <div>
                      <span className="font-bold text-foreground block">
                        {importPreview.summary.favoriteCount}
                      </span>
                      <span className="text-[10px]">Favorites</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 pt-1">
                    <span className="text-foreground font-medium">Restore Mode:</span>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="mode"
                        checked={importMode === 'merge'}
                        onChange={() => setImportMode('merge')}
                        className="text-primary focus:ring-primary"
                      />
                      <span>Merge (Keep existing)</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="mode"
                        checked={importMode === 'replace'}
                        onChange={() => setImportMode('replace')}
                        className="text-primary focus:ring-primary"
                      />
                      <span>Replace (Overwrite)</span>
                    </label>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <Button size="sm" onClick={handleApplyRestore} className="text-xs">
                      Confirm & Restore
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setImportPreview(null)}
                      className="text-xs"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {!importPreview.isValid && (
                <p className="text-xs text-destructive font-mono">{importPreview.error}</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
