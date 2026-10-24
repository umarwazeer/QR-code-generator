import React, { useEffect, useRef, useState } from 'react';
import QRCodeStyling from 'qr-code-styling';
import { Heart, Sparkles, Eye, Check } from 'lucide-react';
import { QrTemplate } from '../../types/template';
import { buildQrCodeOptions } from '../../lib/export/exportQr';
import { isTemplateFavorite, toggleFavoriteTemplate } from '../../lib/storage/templateFavorites';

interface TemplatePreviewCardProps {
  template: QrTemplate;
  onApply: (template: QrTemplate) => void;
  onInspect: (template: QrTemplate) => void;
  isApplied?: boolean;
}

export const TemplatePreviewCard: React.FC<TemplatePreviewCardProps> = ({
  template,
  onApply,
  onInspect,
  isApplied = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [favorite, setFavorite] = useState<boolean>(() => isTemplateFavorite(template.id));
  const [appliedAnim, setAppliedAnim] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = '';

    const sampleUrl = 'https://qr-studio-umar.vercel.app';
    const options = buildQrCodeOptions(sampleUrl, template.customization, 180, 180);
    const qrCode = new QRCodeStyling(options);
    qrCode.append(containerRef.current);
  }, [template]);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newStatus = toggleFavoriteTemplate(template.id);
    setFavorite(newStatus);
  };

  const handleApplyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAppliedAnim(true);
    onApply(template);
    setTimeout(() => setAppliedAnim(false), 1200);
  };

  return (
    <div className="group relative flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 hover:border-indigo-500/80 dark:hover:border-indigo-500/80 shadow-xs hover:shadow-lg transition-all duration-300 overflow-hidden">
      {/* Top Bar with Badges & Favorite Button */}
      <div className="flex items-center justify-between p-3.5 pb-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-semibold tracking-wide uppercase px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/50">
            {template.category}
          </span>
          {template.isPopular && (
            <span className="text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/20">
              Popular
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleToggleFavorite}
          aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            favorite
              ? 'text-rose-500 bg-rose-50 dark:bg-rose-950/40'
              : 'text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Heart className={`w-4 h-4 ${favorite ? 'fill-rose-500' : ''}`} />
        </button>
      </div>

      {/* Preview Container with Framed / Unframed Canvas */}
      <div
        onClick={() => onInspect(template)}
        className="relative mx-3.5 p-4 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-transform group-hover:scale-[1.01]"
        style={{
          backgroundColor: template.customization.transparentBackground
            ? '#f8fafc'
            : template.customization.backgroundColor || '#ffffff',
          minHeight: '210px',
        }}
      >
        {/* Frame Top Header */}
        {template.customization.frameStyle === 'top-badge' && template.customization.frameLabel && (
          <div
            className="px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider mb-2 shadow-2xs"
            style={{
              backgroundColor:
                template.customization.frameColor || template.customization.foregroundColor || '#0f172a',
              color: template.customization.frameTextColor || '#ffffff',
            }}
          >
            {template.customization.frameLabel}
          </div>
        )}

        {/* Real QR Canvas Container */}
        <div
          ref={containerRef}
          className="flex items-center justify-center drop-shadow-2xs"
          style={{ width: '180px', height: '180px' }}
        />

        {/* Frame Bottom Banner or Scan-Me Pill */}
        {template.customization.frameStyle === 'scan-me' && template.customization.frameLabel && (
          <div
            className="mt-2.5 px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-2xs"
            style={{
              backgroundColor:
                template.customization.frameColor || template.customization.foregroundColor || '#0f172a',
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
              className="mt-2 w-full py-1 px-2 text-center rounded-md text-[10px] font-bold uppercase tracking-wider shadow-2xs"
              style={{
                backgroundColor:
                  template.customization.frameColor || template.customization.foregroundColor || '#0f172a',
                color: template.customization.frameTextColor || '#ffffff',
              }}
            >
              {template.customization.frameLabel}
            </div>
          )}

        {/* Hover Inspect Indicator */}
        <div className="absolute inset-0 bg-slate-900/5 dark:bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center pointer-events-none">
          <span className="px-3 py-1.5 rounded-lg bg-white/95 dark:bg-slate-900/95 text-xs font-medium text-slate-800 dark:text-slate-200 shadow-md flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-indigo-600" />
            <span>Click to Inspect</span>
          </span>
        </div>
      </div>

      {/* Info & Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {template.name}
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            {template.description}
          </p>

          <div className="mt-2.5 flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
            <span className="truncate">
              <strong className="text-slate-700 dark:text-slate-300 font-medium">Best for:</strong>{' '}
              {template.recommendedFor}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
          <button
            type="button"
            onClick={handleApplyClick}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs ${
              appliedAnim || isApplied
                ? 'bg-emerald-600 text-white'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow'
            }`}
          >
            {appliedAnim || isApplied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Applied</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Apply Template</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => onInspect(template)}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
            title="Inspect technical specifications"
            aria-label="Inspect technical specifications"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
