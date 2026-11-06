import React, { useState } from 'react';
import { Calendar, Clock, CheckCircle2 } from 'lucide-react';
import { ToolPageHeader } from '@/components/tool-ui/ToolPageHeader';
import { CopyButton } from '@/components/tool-ui/CopyButton';
import { ErrorPanel } from '@/components/tool-ui/ValidationMessage';
import { ToolHelpPanel } from '@/components/tool-ui/EmptyState';
import { evaluateCronExpression, CRON_PRESETS } from '../logic/cronHelper';

export const CronHelperPage: React.FC = () => {
  const [expression, setExpression] = useState<string>('0 9 * * 1-5');

  const result = evaluateCronExpression(expression, 6);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <ToolPageHeader
        toolId="cron-helper"
        title="Cron Expression Parser & Schedule Explainer"
        description="Translate cron syntax into clear human language and predict upcoming execution occurrences in real time."
        category="Time & Date"
        privacyMode="browser-only"
      />

      {/* Main Expression Input & Explanation Banner */}
      <div className="bg-card border rounded-lg p-5 mb-6 shadow-sm space-y-4">
        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
            Cron Expression (5-field syntax)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={expression}
              onChange={(e) => setExpression(e.target.value)}
              placeholder="e.g. */15 * * * *"
              className="flex-1 h-11 px-4 font-mono text-base font-semibold bg-background border rounded-md focus:outline-none focus:ring-1 focus:ring-primary tracking-wider"
            />
            <CopyButton content={expression} label="Copy Cron" />
          </div>
        </div>

        {/* Breakdown of Fields */}
        <div className="grid grid-cols-5 gap-2 pt-2 border-t text-center font-mono">
          <div className="p-2 bg-muted/40 rounded border">
            <div className="text-[10px] text-muted-foreground uppercase font-sans">Minute</div>
            <div className="text-sm font-bold text-primary mt-0.5">{result.fields.minute}</div>
            <div className="text-[10px] text-muted-foreground font-sans">0-59</div>
          </div>
          <div className="p-2 bg-muted/40 rounded border">
            <div className="text-[10px] text-muted-foreground uppercase font-sans">Hour</div>
            <div className="text-sm font-bold text-primary mt-0.5">{result.fields.hour}</div>
            <div className="text-[10px] text-muted-foreground font-sans">0-23</div>
          </div>
          <div className="p-2 bg-muted/40 rounded border">
            <div className="text-[10px] text-muted-foreground uppercase font-sans">Day of Month</div>
            <div className="text-sm font-bold text-primary mt-0.5">{result.fields.dayOfMonth}</div>
            <div className="text-[10px] text-muted-foreground font-sans">1-31</div>
          </div>
          <div className="p-2 bg-muted/40 rounded border">
            <div className="text-[10px] text-muted-foreground uppercase font-sans">Month</div>
            <div className="text-sm font-bold text-primary mt-0.5">{result.fields.month}</div>
            <div className="text-[10px] text-muted-foreground font-sans">1-12</div>
          </div>
          <div className="p-2 bg-muted/40 rounded border">
            <div className="text-[10px] text-muted-foreground uppercase font-sans">Day of Week</div>
            <div className="text-sm font-bold text-primary mt-0.5">{result.fields.dayOfWeek}</div>
            <div className="text-[10px] text-muted-foreground font-sans">0-6 (Sun-Sat)</div>
          </div>
        </div>

        {/* Human Translation */}
        {result.isValid && (
          <div className="p-4 bg-primary/10 border border-primary/20 rounded-md flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <span className="text-xs uppercase font-bold text-primary tracking-wider block">Human Translation</span>
              <p className="text-base font-semibold text-foreground mt-0.5">{result.explanation}</p>
            </div>
          </div>
        )}

        {result.error && (
          <div>
            <ErrorPanel error={result.error} />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Next Scheduled Executions */}
        <div className="lg:col-span-7 bg-card border rounded-lg p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-semibold flex items-center gap-2 border-b pb-3">
            <Clock className="w-4 h-4 text-primary" /> Next 6 Scheduled Executions
          </h3>

          {result.nextDates.length === 0 ? (
            <div className="p-8 text-center text-xs text-muted-foreground">
              Provide a valid cron expression to calculate future dates.
            </div>
          ) : (
            <div className="space-y-2">
              {result.nextDates.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-muted/30 border rounded-md flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="font-semibold text-foreground flex items-center gap-2">
                      <span className="text-[10px] px-1.5 py-0.2 rounded font-mono bg-primary/15 text-primary">
                        #{idx + 1}
                      </span>
                      <span>{item.local}</span>
                    </div>
                    <div className="text-muted-foreground font-mono text-[11px]">
                      UTC: {item.utc}
                    </div>
                  </div>

                  <span className="text-xs font-mono font-medium text-primary px-2.5 py-1 bg-background border rounded-md">
                    {item.relative}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Presets Library */}
        <div className="lg:col-span-5 bg-card border rounded-lg p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-semibold flex items-center gap-2 border-b pb-3">
            <Calendar className="w-4 h-4 text-primary" /> Common Presets
          </h3>

          <div className="space-y-2 overflow-y-auto max-h-[380px] pr-1">
            {CRON_PRESETS.map((preset) => (
              <button
                key={preset.expression}
                type="button"
                onClick={() => setExpression(preset.expression)}
                className={`w-full p-2.5 rounded-md border text-left transition-colors flex items-center justify-between ${
                  expression === preset.expression
                    ? 'bg-primary/10 border-primary text-foreground'
                    : 'bg-muted/20 hover:bg-muted/40 border-border/50 text-foreground'
                }`}
              >
                <div>
                  <div className="font-semibold text-xs">{preset.label}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">{preset.description}</div>
                </div>
                <code className="text-xs font-mono font-bold px-2 py-1 bg-background border rounded text-primary">
                  {preset.expression}
                </code>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <ToolHelpPanel
          title="Cron Expression Parser"
          description="Build, test, and understand cron schedules for background workers, crontab files, and serverless timers."
          tips={[
            'Generate schedules for daily backups: 0 2 * * * (At 02:00 AM)',
            'Configure business-hours recurring tasks: 0 9-17 * * 1-5',
            'Schedule intervals like every 15 minutes: */15 * * * *',
          ]}
        />
      </div>
    </div>
  );
};

export default CronHelperPage;
