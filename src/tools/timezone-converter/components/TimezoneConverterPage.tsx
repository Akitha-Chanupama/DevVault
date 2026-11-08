import React, { useState, useEffect } from 'react';
import { Sun, Moon, Plus, Trash2, RotateCcw, Clock } from 'lucide-react';
import { ToolPageHeader } from '@/components/tool-ui/ToolPageHeader';
import { CopyButton } from '@/components/tool-ui/CopyButton';
import { ToolHelpPanel } from '@/components/tool-ui/EmptyState';
import { Button } from '@/components/ui/button';
import { TimezoneItem } from '../types';
import {
  DEFAULT_TIMEZONES,
  isValidIanaTimezone,
  formatTimezoneDate,
} from '../logic/timezoneConverter';

export const TimezoneConverterPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isLiveTicker, setIsLiveTicker] = useState<boolean>(true);
  const [baseTimezone, setBaseTimezone] = useState<string>(
    Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
  );
  const [zones, setZones] = useState<TimezoneItem[]>(DEFAULT_TIMEZONES);

  const [newZoneName, setNewZoneName] = useState<string>('');
  const [newZoneError, setNewZoneError] = useState<string>('');

  useEffect(() => {
    if (!isLiveTicker) return;
    const interval = setInterval(() => {
      setSelectedDate(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, [isLiveTicker]);

  const handleDateChange = (val: string) => {
    setIsLiveTicker(false);
    const d = new Date(val);
    if (!isNaN(d.getTime())) {
      setSelectedDate(d);
    }
  };

  const handleResetNow = () => {
    setSelectedDate(new Date());
    setIsLiveTicker(true);
  };

  const addTimezone = () => {
    const trimmed = newZoneName.trim();
    if (!trimmed) return;

    if (!isValidIanaTimezone(trimmed)) {
      setNewZoneError(`"${trimmed}" is not a recognized IANA timezone identifier.`);
      return;
    }

    const city = trimmed.split('/').pop()?.replace(/_/g, ' ') || trimmed;
    const newItem: TimezoneItem = {
      id: Math.random().toString(36).substring(7),
      name: trimmed,
      timeZone: trimmed,
      city,
    };

    setZones((prev) => [...prev, newItem]);
    setNewZoneName('');
    setNewZoneError('');
  };

  const removeTimezone = (id: string) => {
    setZones((prev) => prev.filter((z) => z.id !== id));
  };

  const convertedList = zones.map((z) => formatTimezoneDate(selectedDate, z, baseTimezone));
  const isoDateTimeString = selectedDate.toISOString().slice(0, 16);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <ToolPageHeader
        toolId="timezone-converter"
        title="World Time & Timezone Converter"
        description="Convert dates and times across global timezones with live clocks, daylight indicators, and UTC offsets."
        category="Time & Date"
        privacyMode="browser-only"
      />

      {/* Control Bar */}
      <div className="bg-card border rounded-lg p-5 mb-6 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Date / Time Input */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
              Select Time
            </label>
            <input
              type="datetime-local"
              value={isoDateTimeString}
              onChange={(e) => handleDateChange(e.target.value)}
              className="h-9 px-3 bg-background border rounded-md font-mono text-xs focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="self-end sm:self-auto sm:mt-5 flex items-center gap-2">
            <Button
              variant={isLiveTicker ? 'default' : 'outline'}
              size="sm"
              onClick={handleResetNow}
              className="h-9 text-xs gap-1.5 font-medium"
            >
              <Clock className="w-3.5 h-3.5" />
              {isLiveTicker ? 'Live Ticker Active' : 'Sync to Current Time'}
            </Button>
          </div>
        </div>

        {/* Base Comparison Zone */}
        <div>
          <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
            Reference / Base Timezone
          </label>
          <select
            value={baseTimezone}
            onChange={(e) => setBaseTimezone(e.target.value)}
            className="h-9 px-3 bg-surface text-foreground border border-border rounded-md font-medium text-xs focus:outline-none focus:ring-1 focus:ring-primary w-full md:w-64 cursor-pointer"
          >
            {zones.map((z) => (
              <option key={z.id} value={z.timeZone} className="bg-surface text-foreground">
                {z.city} ({z.timeZone})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Add Custom Timezone Input */}
      <div className="bg-card border rounded-lg p-4 mb-6 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={newZoneName}
            onChange={(e) => {
              setNewZoneName(e.target.value);
              setNewZoneError('');
            }}
            placeholder="Enter IANA timezone (e.g., Europe/Amsterdam, Asia/Dubai, Pacific/Auckland)..."
            className="flex-1 h-9 px-3 bg-background border rounded-md text-xs font-mono focus:outline-none focus:ring-1 focus:ring-primary"
            onKeyDown={(e) => {
              if (e.key === 'Enter') addTimezone();
            }}
          />
          <Button size="sm" onClick={addTimezone} className="h-9 text-xs gap-1.5 shrink-0">
            <Plus className="w-3.5 h-3.5" /> Add Timezone
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setZones(DEFAULT_TIMEZONES)}
            className="h-9 text-xs gap-1 shrink-0 text-muted-foreground"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Default Cities
          </Button>
        </div>
        {newZoneError && (
          <p className="text-xs text-rose-500 font-medium mt-2">{newZoneError}</p>
        )}
      </div>

      {/* Timezone Clocks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {convertedList.map((item) => (
          <div
            key={item.id}
            className={`p-4 rounded-lg border transition-all ${
              item.timeZone === baseTimezone
                ? 'bg-primary/5 border-primary shadow-xs'
                : 'bg-card border-border/70 hover:border-border'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                  {item.city}
                  {item.timeZone === baseTimezone && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-primary text-primary-foreground font-mono">
                      BASE
                    </span>
                  )}
                </h4>
                <div className="text-[11px] text-muted-foreground font-mono truncate max-w-[200px]">
                  {item.timeZone}
                </div>
              </div>

              <div className="flex items-center gap-1">
                {item.isDaytime ? (
                  <span title="Daytime (6 AM - 6 PM)">
                    <Sun className="w-4 h-4 text-amber-500" />
                  </span>
                ) : (
                  <span title="Nighttime">
                    <Moon className="w-4 h-4 text-indigo-400" />
                  </span>
                )}
                {zones.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTimezone(item.id)}
                    className="p-1 text-muted-foreground hover:text-destructive transition-colors ml-1"
                    title="Remove timezone"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            <div className="my-3">
              <div className="text-2xl font-bold font-mono tracking-tight text-foreground">
                {item.formattedTime}
              </div>
              <div className="text-xs text-muted-foreground font-medium mt-0.5">
                {item.formattedDate}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t text-[11px] font-mono text-muted-foreground">
              <span>{item.offsetString}</span>
              <span>
                {item.relativeHoursDiff === 0
                  ? 'Same time'
                  : item.relativeHoursDiff > 0
                  ? `+${item.relativeHoursDiff}h from base`
                  : `${item.relativeHoursDiff}h from base`}
              </span>
              <CopyButton content={`${item.city}: ${item.formattedTime} (${item.formattedDate})`} />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <ToolHelpPanel
          title="World Time & Timezone Converter"
          description="Coordinate remote meetings, compare distributed server logs, and plan cross-timezone deployments."
          tips={[
            'Calculate equivalent local times for distributed engineering standups',
            'Determine UTC offsets and daylight saving transitions across worldwide regions',
            'Inspect timestamps from server logs against client browser time',
          ]}
        />
      </div>
    </div>
  );
};

export default TimezoneConverterPage;
