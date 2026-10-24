import React, { useEffect, useRef, useState } from 'react';
import QRCodeStyling from 'qr-code-styling';
import { X, Sparkles, Check, Copy, ShieldCheck, Heart, Layers, Sliders, Palette, Tag } from 'lucide-react';
import { QrTemplate } from '../../types/template';
import { buildQrCodeOptions } from '../../lib/export/exportQr';
import { analyzeQrContrast } from '../../lib/qr/contrastCheck';
import { isTemplateFavorite, toggleFavoriteTemplate } from '../../lib/storage/templateFavorites';
import { useToast } from '../ui/Toast';

interface TemplateDetailModalProps {
  template: QrTemplate | null;
  onClose: () => void;
  onApply: (template: QrTemplate) => void;
}

export const TemplateDetailModal: React.FC<TemplateDetailModalProps> = ({
  template,
  onClose,
  onApply,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { showToast } = useToast();
  const [favorite, setFavorite] = useState(false);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  useEffect(() => {
    if (!template) return;
    setFavorite(isTemplateFavorite(template.id));

    if (!containerRef.current) return;
    containerRef.current.innerHTML = '';

    const sampleUrl = 'https://qr-studio-umar.vercel.app';
    const options = buildQrCodeOptions(sampleUrl, template.customization, 260, 260);
    const qrCode = new QRCodeStyling(options);
    qrCode.append(containerRef.current);
  }, [template]);

  if (!template) return null;

  const contrast = analyzeQrContrast(
    template.customization.foregroundColor,
    template.customization.backgroundColor,
    template.customization.transparentBackground
  );

  const handleCopyColor = (hex: string, label: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    showToast(`Copied ${label} (${hex}) to clipboard!`, 'info');
    setTimeout(() => setCopiedHex(null), 1500);
  };

  const handleToggleFav = () => {
    const updated = toggleFavoriteTemplate(template.id);
    setFavorite(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60">
              {template.category}
            </span>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              {template.name}
            </h2>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleToggleFav}
              className={`p-2 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer ${
                favorite
                  ? 'text-rose-500 bg-rose-50 dark:bg-rose-950/40'
                  : 'text-slate-500 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title={favorite ? 'Remove favorite' : 'Save as favorite'}
            >
              <Heart className={`w-4 h-4 ${favorite ? 'fill-rose-500' : ''}`} />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Live Visual Preview Frame */}
            <div
              className="p-6 rounded-2xl flex flex-col items-center justify-center border border-slate-200/90 dark:border-slate-800 shadow-inner"
              style={{
                backgroundColor: template.customization.transparentBackground
                  ? '#f8fafc'
                  : template.customization.backgroundColor || '#ffffff',
              }}
            >
              {template.customization.frameStyle === 'top-badge' && template.customization.frameLabel && (
                <div
                  className="px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider mb-3 shadow-xs"
                  style={{
                    backgroundColor:
                      template.customization.frameColor ||
                      template.customization.foregroundColor ||
                      '#0f172a',
                    color: template.customization.frameTextColor || '#ffffff',
                  }}
                >
                  {template.customization.frameLabel}
                </div>
              )}

              <div ref={containerRef} className="flex items-center justify-center" />

              {template.customization.frameStyle === 'scan-me' && template.customization.frameLabel && (
                <div
                  className="mt-3.5 px-5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-xs"
                  style={{
                    backgroundColor:
                      template.customization.frameColor ||
                      template.customization.foregroundColor ||
                      '#0f172a',
                    color: template.customization.frameTextColor || '#ffffff',
                  }}
                >
                  {template.customization.frameLabel}
                </div>
              )}

              {(template.customization.frameStyle === 'bottom-bar' ||
                template.customization.frameStyle === 'card-border') &&
                template.customization.frameLabel && (
                  <div
                    className="mt-3 w-full py-1.5 px-3 rounded-lg text-center text-xs font-bold uppercase tracking-wider shadow-xs"
                    style={{
                      backgroundColor:
                        template.customization.frameColor ||
                        template.customization.foregroundColor ||
                        '#0f172a',
                      color: template.customization.frameTextColor || '#ffffff',
                    }}
                  >
                    {template.customization.frameLabel}
                  </div>
                )}
            </div>

            {/* Overview & Key Recommendations */}
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                  Design Overview
                </h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {template.description}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200/80 dark:border-slate-800 space-y-2">
                <div className="text-xs">
                  <strong className="text-slate-900 dark:text-white font-medium">Recommended Use:</strong>
                  <span className="text-slate-600 dark:text-slate-400 block mt-0.5">
                    {template.recommendedFor}
                  </span>
                </div>
                <div className="text-xs">
                  <strong className="text-slate-900 dark:text-white font-medium">Optimal QR Format:</strong>
                  <span className="text-indigo-600 dark:text-indigo-400 font-semibold block mt-0.5 uppercase tracking-wide">
                    {template.suggestedType}
                  </span>
                </div>
              </div>

              {/* Optical Contrast Scannability */}
              <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-800 dark:text-emerald-300">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  <strong>Scannability:</strong> {contrast.ratio}:1 contrast ratio ({contrast.isReliable ? 'Optimal for all mobile devices' : 'Use with high ambient light'})
                </span>
              </div>
            </div>
          </div>

          {/* Color Breakdown Palette */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-indigo-500" />
              <span>Color Palette & Hex Values (Click to Copy)</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { label: 'Foreground', hex: template.customization.foregroundColor },
                {
                  label: 'Background',
                  hex: template.customization.transparentBackground
                    ? 'transparent'
                    : template.customization.backgroundColor,
                },
                { label: 'Corner Frame', hex: template.customization.cornerSquareColor },
                { label: 'Corner Center', hex: template.customization.cornerDotColor },
              ].map((c) => (
                <button
                  key={c.label}
                  type="button"
                  onClick={() => handleCopyColor(c.hex, c.label)}
                  className="flex items-center justify-between p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-400 text-left transition-colors cursor-pointer bg-slate-50/60 dark:bg-slate-950/40"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-4 h-4 rounded-full border border-black/15 shrink-0"
                      style={{ backgroundColor: c.hex === 'transparent' ? '#ffffff' : c.hex }}
                    />
                    <div className="min-w-0">
                      <span className="text-[10px] text-slate-500 block truncate">{c.label}</span>
                      <span className="text-xs font-mono font-medium text-slate-900 dark:text-white truncate block">
                        {c.hex}
                      </span>
                    </div>
                  </div>
                  {copiedHex === c.hex ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 ml-1" />
                  ) : (
                    <Copy className="w-3 h-3 text-slate-400 shrink-0 ml-1" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Technical Specifications */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-indigo-500" />
              <span>Technical Engine Specifications</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200/70 dark:border-slate-800">
                <span className="text-[10px] text-slate-500 block uppercase">Dot Shape</span>
                <span className="font-semibold text-slate-900 dark:text-white capitalize mt-0.5 block">
                  {template.customization.dotType}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200/70 dark:border-slate-800">
                <span className="text-[10px] text-slate-500 block uppercase">Corner Eye</span>
                <span className="font-semibold text-slate-900 dark:text-white capitalize mt-0.5 block">
                  {template.customization.cornerSquareType}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200/70 dark:border-slate-800">
                <span className="text-[10px] text-slate-500 block uppercase">Error Recovery</span>
                <span className="font-semibold text-slate-900 dark:text-white mt-0.5 block">
                  Level {template.customization.errorCorrectionLevel} (
                  {template.customization.errorCorrectionLevel === 'H'
                    ? '30%'
                    : template.customization.errorCorrectionLevel === 'Q'
                    ? '25%'
                    : '15%'}
                  )
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200/70 dark:border-slate-800">
                <span className="text-[10px] text-slate-500 block uppercase">Frame CTA</span>
                <span className="font-semibold text-slate-900 dark:text-white mt-0.5 block truncate">
                  {template.customization.frameStyle !== 'none'
                    ? template.customization.frameLabel || 'Framed'
                    : 'None (Raw QR)'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-950/40">
          <p className="text-xs text-slate-500 hidden sm:block">
            Applies visual styling only • Preserves your active QR link or text data
          </p>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                onApply(template);
                onClose();
              }}
              className="flex-1 sm:flex-none px-5 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:shadow transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Apply to Generator</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
