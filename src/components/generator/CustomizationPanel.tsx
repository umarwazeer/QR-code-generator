import React, { useRef, useState } from 'react';
import {
  Palette,
  Shapes,
  Image as ImageIcon,
  Sliders,
  ShieldAlert,
  Trash2,
  Upload,
  Tag,
  LayoutTemplate,
  Sparkles,
} from 'lucide-react';
import {
  QrCustomization,
  DotType,
  CornerSquareType,
  CornerDotType,
  ErrorCorrectionLevel,
  FrameStyle,
} from '../../types/qr';
import { COLOR_PRESETS } from '../../lib/qr/presets';
import { analyzeQrContrast } from '../../lib/qr/contrastCheck';

interface CustomizationPanelProps {
  customization: QrCustomization;
  onChange: (updated: QrCustomization) => void;
  onOpenTemplates?: () => void;
}

export const CustomizationPanel: React.FC<CustomizationPanelProps> = ({
  customization,
  onChange,
  onOpenTemplates,
}) => {
  const [activeTab, setActiveTab] = React.useState<
    'colors' | 'shape' | 'corners' | 'frames' | 'logo' | 'specs'
  >('colors');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const update = <K extends keyof QrCustomization>(key: K, value: QrCustomization[K]) => {
    onChange({ ...customization, [key]: value });
  };

  const handleApplyPreset = (preset: (typeof COLOR_PRESETS)[0]) => {
    onChange({
      ...customization,
      foregroundColor: preset.foreground,
      backgroundColor: preset.background,
      transparentBackground: false,
      cornerSquareColor: preset.cornerSquareColor || preset.foreground,
      cornerDotColor: preset.cornerDotColor || preset.foreground,
      gradient: {
        ...customization.gradient,
        enabled: false,
      },
    });
  };

  const [logoError, setLogoError] = useState<string | null>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLogoError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate MIME type
    const validTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      setLogoError('Please upload a valid image file (PNG, JPG, WebP, or SVG).');
      return;
    }

    // Validate size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setLogoError('Logo file size must be under 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      onChange({
        ...customization,
        logoUrl: result,
        // Auto-elevate error correction to Q or H when logo is attached for reliable scanning
        errorCorrectionLevel:
          customization.errorCorrectionLevel === 'L' || customization.errorCorrectionLevel === 'M'
            ? 'Q'
            : customization.errorCorrectionLevel,
      });
    };
    reader.onerror = () => {
      setLogoError('Failed to read image file. Please try another image.');
    };
    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    onChange({ ...customization, logoUrl: undefined });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Optical contrast check
  const contrast = analyzeQrContrast(
    customization.foregroundColor,
    customization.backgroundColor,
    customization.transparentBackground
  );

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800/80">
        <div>
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
            Styling & Customization
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Tailor colors, shapes, logo emblem, and scanner tolerance
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/70 rounded-xl mb-5 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('colors')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'colors'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>Colors</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('shape')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'shape'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Shapes className="w-3.5 h-3.5" />
          <span>Pattern</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('corners')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'corners'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Corners</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('frames')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'frames'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Tag className="w-3.5 h-3.5" />
          <span>Frames & CTA</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('logo')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'logo'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Logo</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('specs')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'specs'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Tolerance & Margin</span>
        </button>
      </div>

      {/* TAB 1: COLORS */}
      {activeTab === 'colors' && (
        <div className="space-y-5">
          {/* Quick Template Library Banner */}
          {onOpenTemplates && (
            <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40 border border-indigo-200/70 dark:border-indigo-800/60">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <LayoutTemplate className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>QR Template Library</span>
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-600 text-white">28 Designs</span>
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Explore curated layouts across 10 industries
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onOpenTemplates}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors cursor-pointer flex items-center gap-1 shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Browse</span>
              </button>
            </div>
          )}

          {/* Presets */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                Curated Designer Palettes
              </label>
              {onOpenTemplates && (
                <button
                  type="button"
                  onClick={onOpenTemplates}
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium cursor-pointer"
                >
                  View All Templates →
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {COLOR_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  className="flex items-center gap-2 p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-400 text-left transition-colors cursor-pointer bg-slate-50/50 dark:bg-slate-950/40"
                >
                  <div
                    className="w-5 h-5 rounded-full border border-black/10 shrink-0"
                    style={{ backgroundColor: preset.foreground }}
                  />
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">
                    {preset.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Foreground & Background */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Foreground Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={customization.foregroundColor}
                  onChange={(e) => update('foregroundColor', e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer border border-slate-200 dark:border-slate-700 p-0.5 bg-white dark:bg-slate-900"
                />
                <input
                  type="text"
                  value={customization.foregroundColor}
                  onChange={(e) => update('foregroundColor', e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono uppercase rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Background Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  disabled={customization.transparentBackground}
                  value={customization.backgroundColor}
                  onChange={(e) => update('backgroundColor', e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer border border-slate-200 dark:border-slate-700 p-0.5 bg-white dark:bg-slate-900 disabled:opacity-40"
                />
                <input
                  type="text"
                  disabled={customization.transparentBackground}
                  value={customization.backgroundColor}
                  onChange={(e) => update('backgroundColor', e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono uppercase rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white disabled:opacity-40"
                />
              </div>
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="transparent-bg"
                  checked={customization.transparentBackground}
                  onChange={(e) => update('transparentBackground', e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                />
                <label htmlFor="transparent-bg" className="text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
                  Transparent background (PNG/SVG)
                </label>
              </div>
            </div>
          </div>

          {/* Gradients */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-xs font-semibold text-slate-900 dark:text-white">
                  Gradient Fill
                </span>
                <p className="text-xs text-slate-500">Apply a multi-color transition to dots</p>
              </div>
              <input
                type="checkbox"
                checked={customization.gradient.enabled}
                onChange={(e) =>
                  update('gradient', {
                    ...customization.gradient,
                    enabled: e.target.checked,
                  })
                }
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
              />
            </div>

            {customization.gradient.enabled && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Start Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={customization.gradient.color1}
                      onChange={(e) =>
                        update('gradient', { ...customization.gradient, color1: e.target.value })
                      }
                      className="w-8 h-8 rounded cursor-pointer"
                    />
                    <span className="text-xs font-mono">{customization.gradient.color1}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                    End Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={customization.gradient.color2}
                      onChange={(e) =>
                        update('gradient', { ...customization.gradient, color2: e.target.value })
                      }
                      className="w-8 h-8 rounded cursor-pointer"
                    />
                    <span className="text-xs font-mono">{customization.gradient.color2}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Angle ({customization.gradient.rotation}°)
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={360}
                    step={15}
                    value={customization.gradient.rotation}
                    onChange={(e) =>
                      update('gradient', {
                        ...customization.gradient,
                        rotation: parseInt(e.target.value),
                      })
                    }
                    className="w-full accent-indigo-600"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Contrast notification */}
          {contrast.warning && (
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-300">
              <span className="font-semibold block mb-0.5">Scan Reliability Notice:</span>
              {contrast.warning}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PATTERN / DOT SHAPES */}
      {activeTab === 'shape' && (
        <div className="space-y-4">
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
            QR Dot Body Shape
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {(
              [
                { id: 'square', label: 'Classic Square' },
                { id: 'rounded', label: 'Rounded Edge' },
                { id: 'dots', label: 'Circular Dots' },
                { id: 'classy', label: 'Classy Diamond' },
                { id: 'classy-rounded', label: 'Classy Smooth' },
                { id: 'extra-rounded', label: 'Extra Rounded' },
              ] as { id: DotType; label: string }[]
            ).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => update('dotType', item.id)}
                className={`p-3 text-left rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                  customization.dotType === item.id
                    ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: CORNERS */}
      {activeTab === 'corners' && (
        <div className="space-y-5">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
              Corner Eye (Square) Shape
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {(
                [
                  { id: 'square', label: 'Square' },
                  { id: 'extra-rounded', label: 'Rounded' },
                  { id: 'dot', label: 'Circle' },
                ] as { id: CornerSquareType; label: string }[]
              ).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => update('cornerSquareType', item.id)}
                  className={`p-2.5 text-center rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                    customization.cornerSquareType === item.id
                      ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
              Corner Eye (Center Dot) Shape
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {(
                [
                  { id: 'square', label: 'Square Dot' },
                  { id: 'dot', label: 'Circle Dot' },
                ] as { id: CornerDotType; label: string }[]
              ).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => update('cornerDotType', item.id)}
                  className={`p-2.5 text-center rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                    customization.cornerDotType === item.id
                      ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Corner Specific Colors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Corner Outer Frame Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={customization.cornerSquareColor}
                  onChange={(e) => update('cornerSquareColor', e.target.value)}
                  className="w-9 h-9 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={customization.cornerSquareColor}
                  onChange={(e) => update('cornerSquareColor', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs font-mono uppercase rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Corner Center Dot Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={customization.cornerDotColor}
                  onChange={(e) => update('cornerDotColor', e.target.value)}
                  className="w-9 h-9 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={customization.cornerDotColor}
                  onChange={(e) => update('cornerDotColor', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs font-mono uppercase rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: FRAMES & CTA */}
      {activeTab === 'frames' && (
        <div className="space-y-5">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Frame & Call-to-Action Style
            </label>
            <p className="text-xs text-slate-500 mb-3">
              Wrap your QR code in a branded banner or pill to boost scan conversion rates.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {(
                [
                  { id: 'none', label: 'No Frame', desc: 'Raw QR code only' },
                  { id: 'scan-me', label: 'Scan-Me Pill', desc: 'Centered pill badge at bottom' },
                  { id: 'bottom-bar', label: 'Bottom Banner', desc: 'Full-width banner bar' },
                  { id: 'top-badge', label: 'Top Header', desc: 'Title header badge' },
                  { id: 'card-border', label: 'Card Border', desc: 'Framed outline card' },
                ] as { id: FrameStyle; label: string; desc: string }[]
              ).map((style) => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => update('frameStyle', style.id)}
                  className={`p-3 text-left rounded-xl border text-xs transition-all cursor-pointer ${
                    (customization.frameStyle || 'none') === style.id
                      ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  <span className="font-semibold block">{style.label}</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">{style.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {customization.frameStyle && customization.frameStyle !== 'none' && (
            <div className="space-y-4 pt-3 border-t border-slate-100 dark:border-slate-800">
              {/* Call-to-action text presets */}
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Frame Label / Call-to-Action Text
                </label>
                <input
                  type="text"
                  maxLength={30}
                  value={customization.frameLabel || ''}
                  onChange={(e) => update('frameLabel', e.target.value)}
                  placeholder="e.g. SCAN ME, VIEW MENU"
                  className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white mb-2"
                />
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'SCAN ME',
                    'SCAN TO VIEW MENU',
                    'CONNECT TO WI-FI',
                    'VISIT OUR WEBSITE',
                    'FOLLOW US',
                  ].map((presetLabel) => (
                    <button
                      key={presetLabel}
                      type="button"
                      onClick={() => update('frameLabel', presetLabel)}
                      className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                    >
                      {presetLabel}
                    </button>
                  ))}
                </div>
              </div>

              {/* Frame Colors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Frame Background Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={customization.frameColor || customization.foregroundColor || '#0f172a'}
                      onChange={(e) => update('frameColor', e.target.value)}
                      className="w-9 h-9 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={customization.frameColor || customization.foregroundColor || '#0f172a'}
                      onChange={(e) => update('frameColor', e.target.value)}
                      className="w-full px-3 py-1.5 text-xs font-mono uppercase rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Frame Text Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={customization.frameTextColor || '#ffffff'}
                      onChange={(e) => update('frameTextColor', e.target.value)}
                      className="w-9 h-9 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={customization.frameTextColor || '#ffffff'}
                      onChange={(e) => update('frameTextColor', e.target.value)}
                      className="w-full px-3 py-1.5 text-xs font-mono uppercase rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: LOGO */}
      {activeTab === 'logo' && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Center Brand Logo
            </label>
            <p className="text-xs text-slate-500 mb-3">
              Embed your logo or badge directly in the center of the QR code.
            </p>

            <input
              type="file"
              ref={fileInputRef}
              accept="image/png, image/jpeg, image/webp"
              onChange={handleLogoUpload}
              className="hidden"
            />

            {customization.logoUrl ? (
              <div className="flex items-center gap-4 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
                <img
                  src={customization.logoUrl}
                  alt="Custom QR Logo Preview"
                  className="w-14 h-14 rounded-lg object-contain bg-white border border-slate-200 dark:border-slate-700 p-1"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-medium text-slate-900 dark:text-white block truncate">
                    Logo attached
                  </span>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400">
                    Auto-set to High Error Correction
                  </span>
                </div>
                <button
                  type="button"
                  onClick={removeLogo}
                  className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                  title="Remove logo"
                  aria-label="Remove logo"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-slate-50/50 dark:bg-slate-950/30"
              >
                <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center mb-2">
                  <Upload className="w-5 h-5" />
                </div>
                <span className="text-xs font-medium text-slate-900 dark:text-white block">
                  Click to upload logo
                </span>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  PNG, JPG, or WebP up to 2MB (Square works best)
                </span>
              </div>
            )}

            {logoError && (
              <div className="mt-2.5 p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300">
                {logoError}
              </div>
            )}
          </div>

          {customization.logoUrl && (
            <div className="space-y-3 pt-2">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    Logo Scale Ratio ({Math.round(customization.logoSize * 100)}%)
                  </span>
                  <span className="text-slate-500">Max recommended: 35%</span>
                </div>
                <input
                  type="range"
                  min={0.15}
                  max={0.35}
                  step={0.02}
                  value={customization.logoSize}
                  onChange={(e) => update('logoSize', parseFloat(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    Logo Padding Margin ({customization.logoMargin}px)
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={15}
                  step={1}
                  value={customization.logoMargin}
                  onChange={(e) => update('logoMargin', parseInt(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: SPECS / MARGIN & TOLERANCE */}
      {activeTab === 'specs' && (
        <div className="space-y-5">
          {/* Error correction */}
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Error Correction Level
            </label>
            <p className="text-xs text-slate-500 mb-2.5">
              Higher recovery levels allow the QR to be scanned even if smudged, damaged, or partially covered by a logo.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(
                [
                  { level: 'L', name: 'Low (7%)', desc: 'Minimal data density' },
                  { level: 'M', name: 'Medium (15%)', desc: 'Standard default' },
                  { level: 'Q', name: 'Quartile (25%)', desc: 'Better durability' },
                  { level: 'H', name: 'High (30%)', desc: 'Best with logos' },
                ] as { level: ErrorCorrectionLevel; name: string; desc: string }[]
              ).map((item) => (
                <button
                  key={item.level}
                  type="button"
                  onClick={() => update('errorCorrectionLevel', item.level)}
                  className={`p-2.5 text-left rounded-xl border text-xs transition-all cursor-pointer ${
                    customization.errorCorrectionLevel === item.level
                      ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className="font-semibold block">{item.name}</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">{item.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Margin / Quiet zone */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="font-medium text-slate-700 dark:text-slate-300">
                Quiet Zone / Border Margin ({customization.margin}px)
              </span>
              <span className="text-slate-500">Standard: 10px</span>
            </div>
            <input
              type="range"
              min={0}
              max={40}
              step={2}
              value={customization.margin}
              onChange={(e) => update('margin', parseInt(e.target.value))}
              className="w-full accent-indigo-600"
            />
            <p className="mt-1 text-[11px] text-slate-500">
              A quiet zone ensures optical contrast when placed against dark or patterned surfaces.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
