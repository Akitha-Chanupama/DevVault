import React, { useState, useEffect } from 'react';
import {
  Clock,
  Play,
  Pause,
  Calendar,
  Globe,
} from 'lucide-react';
import { ToolPageHeader } from '@/components/tool-ui/ToolPageHeader';
import { CopyButton } from '@/components/tool-ui/CopyButton';
import { ClearButton } from '@/components/tool-ui/ClearButton';
import { ErrorPanel } from '@/components/tool-ui/ValidationMessage';
import { ToolHelpPanel } from '@/components/tool-ui/EmptyState';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { parseTimestampInput } from '../logic/timestampConverter';
import { TimestampDetails } from '../types';

export const TimestampConverterPage: React.FC = () => {
  const [currentEpoch, setCurrentEpoch] = useState<number>(() => Math.floor(Date.now() / 1000));
  const [isLive, setIsLive] = useState<boolean>(true);

  const [inputVal, setInputVal] = useState<string>(() => String(Math.floor(Date.now() / 1000)));
  const [details, setDetails] = useState<TimestampDetails>(() =>
    parseTimestampInput(Math.floor(Date.now() / 1000))
  );

  // Live epoch clock ticker
  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      setCurrentEpoch(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [isLive]);

  const handleInputChange = (val: string) => {
    setInputVal(val);
    setDetails(parseTimestampInput(val));
  };

  const handleApplyPreset = (epochSec: number) => {
    handleInputChange(String(epochSec));
  };

  const handleSetToNow = () => {
    const now = Math.floor(Date.now() / 1000);
    handleInputChange(String(now));
  };

  const handleSetToStartOfDay = () => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    handleInputChange(String(Math.floor(d.getTime() / 1000)));
  };

  const handleSetToEndOfDay = () => {
    const d = new Date();
    d.setHours(23, 59, 59, 999);
    handleInputChange(String(Math.floor(d.getTime() / 1000)));
  };

  return (
    <div className="space-y-6">
      <ToolPageHeader
        toolId="timestamp-converter"
        title="Unix Timestamp Converter"
        description="Convert Unix epoch timestamps to human-readable UTC and local time, or convert dates back to Unix timestamps."
        category="Time & Date"
        privacyMode="browser-only"
      />

      {/* Live Current Epoch Clock Card */}
      <Card className="p-4 bg-surface border-primary/20 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Current Unix Epoch
            </div>
            <div className="text-xl sm:text-2xl font-mono font-bold text-foreground">
              {currentEpoch}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsLive(!isLive)}
            className="text-xs h-8 gap-1.5"
            title={isLive ? 'Pause clock' : 'Resume clock'}
          >
            {isLive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-success" />}
            <span>{isLive ? 'Pause' : 'Resume'}</span>
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleApplyPreset(currentEpoch)}
            className="text-xs h-8"
          >
            Load Into Converter
          </Button>
          <CopyButton content={String(currentEpoch)} label="Copy" />
        </div>
      </Card>

      {/* Main Conversion Input Card */}
      <Card className="p-5 bg-surface space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <label className="text-xs font-semibold text-foreground">
            Timestamp or ISO Date String
          </label>
          {/* Quick Presets */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleSetToNow}
              className="text-[11px] h-7 px-2"
            >
              Now
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleSetToStartOfDay}
              className="text-[11px] h-7 px-2"
            >
              Start of Today
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleSetToEndOfDay}
              className="text-[11px] h-7 px-2"
            >
              End of Today
            </Button>
            <ClearButton onClear={() => handleInputChange('')} disabled={!inputVal} />
          </div>
        </div>

        <Input
          value={inputVal}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder="e.g. 1700000000 or 2024-05-15T12:00:00Z..."
          className="font-mono text-sm"
        />

        {!details.isValid && details.error && (
          <ErrorPanel error={details.error} />
        )}
      </Card>

      {/* Conversion Output Details */}
      {details.isValid && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* UTC Representation */}
          <Card className="p-4 bg-surface space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-primary" />
                <span>UTC (Coordinated Universal Time)</span>
              </span>
              <CopyButton content={details.utcIsoString} label="Copy ISO" />
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="p-2.5 rounded bg-surface-elevated border border-border">
                <span className="text-[10px] text-muted-foreground block font-sans">Standard ISO 8601</span>
                <span className="text-foreground">{details.utcIsoString}</span>
              </div>
              <div className="p-2.5 rounded bg-surface-elevated border border-border">
                <span className="text-[10px] text-muted-foreground block font-sans">RFC 2822 / GMT Format</span>
                <span className="text-foreground">{details.utcDateString}</span>
              </div>
            </div>
          </Card>

          {/* Local Representation */}
          <Card className="p-4 bg-surface space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-secondary" />
                <span>Local Time ({details.timezoneName})</span>
              </span>
              <CopyButton content={details.localDateString} label="Copy Local" />
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="p-2.5 rounded bg-surface-elevated border border-border">
                <span className="text-[10px] text-muted-foreground block font-sans">Local Date & Time</span>
                <span className="text-foreground">{details.localDateString}</span>
              </div>
              <div className="p-2.5 rounded bg-surface-elevated border border-border">
                <span className="text-[10px] text-muted-foreground block font-sans">Relative Distance</span>
                <span className="text-primary font-bold font-sans capitalize">{details.relativeTime}</span>
              </div>
            </div>
          </Card>

          {/* Seconds & Milliseconds Summary */}
          <Card className="p-4 bg-surface col-span-1 md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-surface-elevated border border-border">
              <div>
                <span className="text-[11px] text-muted-foreground block">Epoch Seconds</span>
                <span className="font-mono text-base font-bold text-foreground">{details.seconds}</span>
              </div>
              <CopyButton content={String(details.seconds)} />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-surface-elevated border border-border">
              <div>
                <span className="text-[11px] text-muted-foreground block">Epoch Milliseconds</span>
                <span className="font-mono text-base font-bold text-foreground">{details.milliseconds}</span>
              </div>
              <CopyButton content={String(details.milliseconds)} />
            </div>
          </Card>
        </div>
      )}

      <ToolHelpPanel
        title="About Unix Time"
        description="Unix time counts the number of seconds that have elapsed since the Unix epoch: 00:00:00 UTC on 1 January 1970."
        features={[
          'Auto-detects seconds (10 digits) vs. milliseconds (13 digits).',
          'Translates human ISO 8601 strings, RFC strings, and date representations back into numeric epoch values.',
          'Computes relative temporal distance (e.g., 2 hours ago, in 3 days) dynamically.',
          'Timezone-aware: renders both international UTC format and your device locale time.',
        ]}
      />
    </div>
  );
};

export default TimestampConverterPage;
