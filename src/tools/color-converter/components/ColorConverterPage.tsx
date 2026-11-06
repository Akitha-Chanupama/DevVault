import React, { useState } from 'react';
import { Check, X, ShieldCheck, AlertCircle } from 'lucide-react';
import { ToolPageHeader } from '@/components/tool-ui/ToolPageHeader';
import { CopyButton } from '@/components/tool-ui/CopyButton';
import { ToolHelpPanel } from '@/components/tool-ui/EmptyState';
import { RgbColor } from '../types';
import {
  parseHexToRgb,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  calculateContrastRatio,
  getColorDetails,
} from '../logic/colorConverter';

export const ColorConverterPage: React.FC = () => {
  const [currentColor, setCurrentColor] = useState<RgbColor>({ r: 59, g: 130, b: 246 }); // #3b82f6
  const [hexInput, setHexInput] = useState<string>('#3b82f6');
  const [bgRgb, setBgRgb] = useState<RgbColor>({ r: 255, g: 255, b: 255 });
  const [bgHex, setBgHex] = useState<string>('#ffffff');

  const details = getColorDetails(currentColor);
  const contrast = calculateContrastRatio(currentColor, bgRgb);

  const handleHexChange = (val: string) => {
    setHexInput(val);
    const parsed = parseHexToRgb(val);
    if (parsed) {
      setCurrentColor(parsed);
    }
  };

  const handleRgbChange = (channel: keyof RgbColor, val: number) => {
    const updated = { ...currentColor, [channel]: Math.max(0, Math.min(255, val)) };
    setCurrentColor(updated);
    setHexInput(rgbToHex(updated));
  };

  const handleHslChange = (channel: 'h' | 's' | 'l', val: number) => {
    const currentHsl = rgbToHsl(currentColor);
    const updatedHsl = {
      ...currentHsl,
      [channel]: channel === 'h' ? Math.max(0, Math.min(360, val)) : Math.max(0, Math.min(100, val)),
    };
    const newRgb = hslToRgb(updatedHsl);
    setCurrentColor(newRgb);
    setHexInput(rgbToHex(newRgb));
  };

  const handleBgHexChange = (val: string) => {
    setBgHex(val);
    const parsed = parseHexToRgb(val);
    if (parsed) {
      setBgRgb(parsed);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <ToolPageHeader
        toolId="color-converter"
        title="Color Converter & WCAG Contrast Checker"
        description="Convert seamlessly between HEX, RGB, and HSL formats with real-time WCAG 2.2 accessibility validation."
        category="Web Development"
        privacyMode="browser-only"
      />

      {/* Main Color Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Color Controls */}
        <div className="lg:col-span-7 bg-card border rounded-lg p-5 shadow-sm space-y-6">
          {/* Visual Swatch & Native Color Picker */}
          <div className="flex items-center gap-4 p-4 rounded-lg border bg-muted/20">
            <input
              type="color"
              value={details.hex}
              onChange={(e) => handleHexChange(e.target.value)}
              className="w-16 h-16 rounded-lg cursor-pointer border shadow-sm p-0 bg-transparent shrink-0"
            />
            <div className="flex-1">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                Primary Selection
              </span>
              <div className="text-2xl font-bold font-mono text-foreground mt-0.5">
                {details.hex.toUpperCase()}
              </div>
              <div className="text-xs text-muted-foreground font-mono mt-0.5">
                Luminance: {details.luminance}
              </div>
            </div>
          </div>

          {/* Formats Inputs */}
          <div className="space-y-4">
            {/* HEX */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="font-semibold text-muted-foreground uppercase">HEX Code</span>
                <CopyButton content={details.hex} />
              </div>
              <input
                type="text"
                value={hexInput}
                onChange={(e) => handleHexChange(e.target.value)}
                placeholder="#000000"
                className="w-full h-9 px-3 font-mono text-xs bg-background border rounded-md uppercase focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* RGB Channels */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="font-semibold text-muted-foreground uppercase">RGB Channels</span>
                <CopyButton content={details.rgbString} />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] text-muted-foreground block mb-0.5">R (0-255)</label>
                  <input
                    type="number"
                    min={0}
                    max={255}
                    value={currentColor.r}
                    onChange={(e) => handleRgbChange('r', Number(e.target.value))}
                    className="w-full h-8 px-2 font-mono text-xs bg-background border rounded-md"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-muted-foreground block mb-0.5">G (0-255)</label>
                  <input
                    type="number"
                    min={0}
                    max={255}
                    value={currentColor.g}
                    onChange={(e) => handleRgbChange('g', Number(e.target.value))}
                    className="w-full h-8 px-2 font-mono text-xs bg-background border rounded-md"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-muted-foreground block mb-0.5">B (0-255)</label>
                  <input
                    type="number"
                    min={0}
                    max={255}
                    value={currentColor.b}
                    onChange={(e) => handleRgbChange('b', Number(e.target.value))}
                    className="w-full h-8 px-2 font-mono text-xs bg-background border rounded-md"
                  />
                </div>
              </div>
            </div>

            {/* HSL Channels */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="font-semibold text-muted-foreground uppercase">HSL Channels</span>
                <CopyButton content={details.hslString} />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] text-muted-foreground block mb-0.5">Hue (0-360°)</label>
                  <input
                    type="number"
                    min={0}
                    max={360}
                    value={details.hsl.h}
                    onChange={(e) => handleHslChange('h', Number(e.target.value))}
                    className="w-full h-8 px-2 font-mono text-xs bg-background border rounded-md"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-muted-foreground block mb-0.5">Sat (0-100%)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={details.hsl.s}
                    onChange={(e) => handleHslChange('s', Number(e.target.value))}
                    className="w-full h-8 px-2 font-mono text-xs bg-background border rounded-md"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-muted-foreground block mb-0.5">Light (0-100%)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={details.hsl.l}
                    onChange={(e) => handleHslChange('l', Number(e.target.value))}
                    className="w-full h-8 px-2 font-mono text-xs bg-background border rounded-md"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* WCAG Contrast Validator */}
        <div className="lg:col-span-5 bg-card border rounded-lg p-5 shadow-sm space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <span className="text-sm font-semibold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-primary" /> WCAG 2.2 Contrast
              </span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-muted">
                {contrast.scoreText}
              </span>
            </div>

            {/* Background color picker */}
            <div className="mb-4">
              <label className="text-xs text-muted-foreground block mb-1">Compare Against Background:</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={bgHex}
                  onChange={(e) => handleBgHexChange(e.target.value)}
                  className="w-8 h-8 rounded border cursor-pointer p-0 bg-transparent shrink-0"
                />
                <input
                  type="text"
                  value={bgHex}
                  onChange={(e) => handleBgHexChange(e.target.value)}
                  className="flex-1 h-8 px-2 font-mono text-xs bg-background border rounded-md uppercase"
                />
                <button
                  type="button"
                  onClick={() => handleBgHexChange('#ffffff')}
                  className="px-2 py-1 text-xs border rounded bg-muted/40 hover:bg-muted"
                >
                  White
                </button>
                <button
                  type="button"
                  onClick={() => handleBgHexChange('#0f172a')}
                  className="px-2 py-1 text-xs border rounded bg-muted/40 hover:bg-muted"
                >
                  Dark
                </button>
              </div>
            </div>

            {/* Live Contrast Preview Box */}
            <div
              className="p-4 rounded-lg border mb-5 transition-colors text-center"
              style={{
                backgroundColor: bgHex,
                color: details.hex,
              }}
            >
              <p className="text-lg font-bold">The quick brown fox jumps</p>
              <p className="text-xs mt-1">Normal 14px body copy preview text</p>
            </div>

            {/* WCAG Criteria Status Cards */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2.5 rounded border bg-muted/20 flex items-center justify-between">
                <span>AA Normal (≥4.5)</span>
                {contrast.aaNormal ? (
                  <span className="text-emerald-500 font-bold flex items-center gap-0.5">
                    <Check className="w-3.5 h-3.5" /> Pass
                  </span>
                ) : (
                  <span className="text-rose-500 font-bold flex items-center gap-0.5">
                    <X className="w-3.5 h-3.5" /> Fail
                  </span>
                )}
              </div>

              <div className="p-2.5 rounded border bg-muted/20 flex items-center justify-between">
                <span>AA Large (≥3.0)</span>
                {contrast.aaLarge ? (
                  <span className="text-emerald-500 font-bold flex items-center gap-0.5">
                    <Check className="w-3.5 h-3.5" /> Pass
                  </span>
                ) : (
                  <span className="text-rose-500 font-bold flex items-center gap-0.5">
                    <X className="w-3.5 h-3.5" /> Fail
                  </span>
                )}
              </div>

              <div className="p-2.5 rounded border bg-muted/20 flex items-center justify-between">
                <span>AAA Normal (≥7.0)</span>
                {contrast.aaaNormal ? (
                  <span className="text-emerald-500 font-bold flex items-center gap-0.5">
                    <Check className="w-3.5 h-3.5" /> Pass
                  </span>
                ) : (
                  <span className="text-rose-500 font-bold flex items-center gap-0.5">
                    <X className="w-3.5 h-3.5" /> Fail
                  </span>
                )}
              </div>

              <div className="p-2.5 rounded border bg-muted/20 flex items-center justify-between">
                <span>AAA Large (≥4.5)</span>
                {contrast.aaaLarge ? (
                  <span className="text-emerald-500 font-bold flex items-center gap-0.5">
                    <Check className="w-3.5 h-3.5" /> Pass
                  </span>
                ) : (
                  <span className="text-rose-500 font-bold flex items-center gap-0.5">
                    <X className="w-3.5 h-3.5" /> Fail
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="text-[11px] text-muted-foreground flex items-center gap-1.5 pt-2 border-t">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>WCAG 2.2 Level AA requires at least 4.5:1 for regular text and 3:1 for large text (18pt+ or bold 14pt+).</span>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <ToolHelpPanel
          title="Color Converter & Contrast Checker"
          description="Color transformations and accessibility audit following standard W3C contrast ratio guidelines."
          tips={[
            'Convert design tokens from Figma HEX to CSS RGB/HSL variables',
            'Verify text and button foreground colors comply with WCAG 2.2 AA and AAA criteria',
            'Inspect relative luminance across light and dark theme background surfaces',
          ]}
        />
      </div>
    </div>
  );
};

export default ColorConverterPage;
