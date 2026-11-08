import React, { useState, useEffect } from 'react';
import { Download, QrCode as QrIcon } from 'lucide-react';
import { ToolPageHeader } from '@/components/tool-ui/ToolPageHeader';
import { EditorToolbar } from '@/components/tool-ui/EditorToolbar';
import { ClearButton } from '@/components/tool-ui/ClearButton';
import { CopyButton } from '@/components/tool-ui/CopyButton';
import { ToolHelpPanel } from '@/components/tool-ui/EmptyState';
import { Button } from '@/components/ui/button';
import { QrErrorCorrectionLevel, QrCodeResult } from '../types';
import { generateQrCode, DEFAULT_QR_OPTIONS } from '../logic/qrGenerator';

export const QrGeneratorPage: React.FC = () => {
  const [text, setText] = useState<string>('https://github.com/developer/devvault');
  const [level, setLevel] = useState<QrErrorCorrectionLevel>('M');
  const [darkColor, setDarkColor] = useState<string>('#000000');
  const [lightColor, setLightColor] = useState<string>('#ffffff');
  const [margin, setMargin] = useState<number>(2);
  const [qrResult, setQrResult] = useState<QrCodeResult>({ svg: '', dataUrl: '' });

  useEffect(() => {
    let active = true;
    generateQrCode(text, {
      errorCorrectionLevel: level,
      darkColor,
      lightColor,
      margin,
      width: 320,
    }).then((res) => {
      if (active) setQrResult(res);
    });
    return () => {
      active = false;
    };
  }, [text, level, darkColor, lightColor, margin]);

  const downloadPng = () => {
    if (!qrResult.dataUrl) return;
    const a = document.createElement('a');
    a.href = qrResult.dataUrl;
    a.download = 'devvault-qrcode.png';
    a.click();
  };

  const downloadSvg = () => {
    if (!qrResult.svg) return;
    const blob = new Blob([qrResult.svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'devvault-qrcode.svg';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <ToolPageHeader
        toolId="qr-generator"
        title="QR Code Generator"
        description="Generate clean, scannable QR codes for links, text, Wi-Fi credentials, and tokens with vector SVG and PNG export."
        category="Generators"
        privacyMode="browser-only"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input & Options Form */}
        <div className="lg:col-span-7 bg-card border rounded-lg p-5 shadow-sm space-y-5 flex flex-col">
          <EditorToolbar
            title="Target Content / URL"
            actions={<ClearButton onClear={() => setText('')} disabled={!text} />}
          />

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter URL, text, phone number, or crypto address..."
            className="w-full h-32 p-3 font-mono text-xs bg-background border rounded-md resize-none focus:outline-none focus:ring-1 focus:ring-primary leading-relaxed"
          />

          {/* Configuration Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t">
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                Error Correction Level
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as QrErrorCorrectionLevel)}
                className="w-full h-9 px-3 bg-surface text-foreground border border-border rounded-md text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
              >
                <option value="L" className="bg-surface text-foreground">L - Low (~7% recovery)</option>
                <option value="M" className="bg-surface text-foreground">M - Medium (~15% recovery)</option>
                <option value="Q" className="bg-surface text-foreground">Q - Quartile (~25% recovery)</option>
                <option value="H" className="bg-surface text-foreground">H - High (~30% recovery)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                Quiet Zone Margin
              </label>
              <select
                value={margin}
                onChange={(e) => setMargin(Number(e.target.value))}
                className="w-full h-9 px-3 bg-surface text-foreground border border-border rounded-md text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
              >
                <option value={1} className="bg-surface text-foreground">1 module (compact)</option>
                <option value={2} className="bg-surface text-foreground">2 modules (standard)</option>
                <option value={4} className="bg-surface text-foreground">4 modules (strict compliance)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                Foreground Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={darkColor}
                  onChange={(e) => setDarkColor(e.target.value)}
                  className="w-8 h-8 rounded border cursor-pointer p-0 bg-transparent"
                />
                <input
                  type="text"
                  value={darkColor}
                  onChange={(e) => setDarkColor(e.target.value)}
                  className="flex-1 h-9 px-2.5 font-mono text-xs bg-background border rounded-md uppercase"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                Background Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={lightColor}
                  onChange={(e) => setLightColor(e.target.value)}
                  className="w-8 h-8 rounded border cursor-pointer p-0 bg-transparent"
                />
                <input
                  type="text"
                  value={lightColor}
                  onChange={(e) => setLightColor(e.target.value)}
                  className="flex-1 h-9 px-2.5 font-mono text-xs bg-background border rounded-md uppercase"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={() => {
                setDarkColor(DEFAULT_QR_OPTIONS.darkColor);
                setLightColor(DEFAULT_QR_OPTIONS.lightColor);
                setLevel(DEFAULT_QR_OPTIONS.errorCorrectionLevel);
                setMargin(DEFAULT_QR_OPTIONS.margin);
              }}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Reset to Defaults
            </button>
          </div>
        </div>

        {/* Live QR Preview & Downloads */}
        <div className="lg:col-span-5 bg-card border rounded-lg p-5 shadow-sm flex flex-col items-center justify-center text-center">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-4">
            Live Preview
          </span>

          <div className="p-4 bg-white rounded-xl shadow-md border inline-block mb-6">
            {qrResult.dataUrl ? (
              <img
                src={qrResult.dataUrl}
                alt="Generated QR Code"
                className="w-56 h-56 object-contain"
              />
            ) : (
              <div className="w-56 h-56 flex flex-col items-center justify-center text-muted-foreground text-xs">
                <QrIcon className="w-12 h-12 stroke-[1.2] opacity-30 mb-2" />
                Enter text or URL to preview
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 justify-center w-full max-w-xs">
            <Button
              variant="default"
              size="sm"
              onClick={downloadPng}
              disabled={!qrResult.dataUrl}
              className="flex-1 gap-1.5 whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5 shrink-0" />
              <span>Download PNG</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={downloadSvg}
              disabled={!qrResult.svg}
              className="flex-1 gap-1.5 whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5 shrink-0" />
              <span>Download SVG</span>
            </Button>
            <div className="w-full">
              <CopyButton content={qrResult.dataUrl} label="Copy Data URL" className="w-full justify-center" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <ToolHelpPanel
          title="QR Code Generator"
          description="Create high-resolution QR codes for websites, authentication tokens, and Wi-Fi networks."
          tips={[
            'Generate clean vector SVG QR codes for print media and documentation',
            'Use Level H error correction if overlaying a logo or custom artwork',
            'Download transparent PNG data URLs for direct embedding in HTML or CSS',
          ]}
        />
      </div>
    </div>
  );
};

export default QrGeneratorPage;
