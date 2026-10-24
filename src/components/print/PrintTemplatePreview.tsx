import React, { useEffect, useRef, useState } from 'react';
import QRCodeStyling from 'qr-code-styling';
import {
  Download,
  FileText,
  Printer,
  ShieldCheck,
  AlertTriangle,
  Scissors,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { PrintTemplateConfig, PRINT_TEMPLATE_PRESETS } from '../../types/printTemplate';
import { QrCustomization, QrType } from '../../types/qr';
import { buildQrCodeOptions } from '../../lib/export/exportQr';
import {
  downloadPrintTemplatePdf,
  downloadPrintTemplatePng,
} from '../../lib/export/exportPrintTemplate';
import { analyzeQrContrast } from '../../lib/qr/contrastCheck';
import { useToast } from '../ui/Toast';
import { ScanVerificationGuide } from '../ui/ScanVerificationGuide';

interface PrintTemplatePreviewProps {
  config: PrintTemplateConfig;
  qrPayload: string;
  qrType: QrType;
  customization: QrCustomization;
}

export const PrintTemplatePreview: React.FC<PrintTemplatePreviewProps> = ({
  config,
  qrPayload,
  customization,
}) => {
  const { showToast } = useToast();
  const [downloading, setDownloading] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);
  const qrInstanceRef = useRef<QRCodeStyling | null>(null);

  const preset = PRINT_TEMPLATE_PRESETS[config.templateType];

  // Contrast check
  const contrast = analyzeQrContrast(
    config.primaryColor || customization.foregroundColor,
    '#ffffff',
    false
  );

  // Render QR inside the mockup container
  useEffect(() => {
    if (!qrRef.current) return;

    const dataToEncode = qrPayload.trim() || 'https://qr-studio-umar.vercel.app';
    const qrSize = config.templateType === 'business-card' ? 140 : 180;

    const options = buildQrCodeOptions(
      dataToEncode,
      {
        ...customization,
        foregroundColor: config.primaryColor || customization.foregroundColor,
        cornerSquareColor: config.primaryColor || customization.cornerSquareColor,
        cornerDotColor: config.primaryColor || customization.cornerDotColor,
        logoUrl: config.logoUrl || customization.logoUrl,
      },
      qrSize,
      qrSize
    );

    if (!qrInstanceRef.current) {
      qrRef.current.innerHTML = '';
      const qrCode = new QRCodeStyling(options);
      qrCode.append(qrRef.current);
      qrInstanceRef.current = qrCode;
    } else {
      qrInstanceRef.current.update(options);
    }
  }, [qrPayload, customization, config.primaryColor, config.logoUrl, config.templateType]);

  // Export PDF
  const handleDownloadPdf = async () => {
    try {
      setDownloading(true);
      await downloadPrintTemplatePdf(config, qrPayload, customization);
      showToast(`Exported ${preset.name} PDF (Print-Ready)`, 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to generate print-ready PDF', 'error');
    } finally {
      setDownloading(false);
    }
  };

  // Export PNG
  const handleDownloadPng = async () => {
    try {
      setDownloading(true);
      await downloadPrintTemplatePng(config, qrPayload, customization);
      showToast(`Exported ${preset.name} High-Res PNG`, 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to export PNG', 'error');
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs sticky top-24 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
            Live Print Preview
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {preset.name} • {preset.dimensionsDescription}
          </p>
        </div>

        <button
          type="button"
          onClick={handlePrint}
          className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          title="Print directly via browser dialog"
          aria-label="Print template"
        >
          <Printer className="w-4 h-4" />
        </button>
      </div>

      {/* MOCKUP CONTAINER */}
      <div className="relative rounded-2xl p-6 bg-slate-50 dark:bg-slate-950/60 border border-slate-200/90 dark:border-slate-800 flex flex-col items-center justify-center overflow-hidden min-h-[420px]">
        {/* TEMPLATE 1: BUSINESS CARD (3.5" x 2" landscape card) */}
        {config.templateType === 'business-card' && (
          <div
            className="w-full max-w-[340px] aspect-[7/4] bg-white rounded-xl shadow-md border border-slate-200 flex overflow-hidden relative transition-all"
            style={{
              borderLeft: `8px solid ${config.primaryColor || '#4f46e5'}`,
            }}
          >
            {/* Cut guides indicator in preview if active */}
            {config.includeCutGuides && (
              <div className="absolute top-1.5 right-1.5 flex items-center gap-1 text-[9px] text-slate-400 font-mono">
                <Scissors className="w-3 h-3" />
                <span>Trim Marks</span>
              </div>
            )}

            {/* Left Content Column */}
            <div className="w-[58%] p-3.5 flex flex-col justify-between">
              <div>
                {config.logoUrl && (
                  <img
                    src={config.logoUrl}
                    alt="Logo"
                    className="w-6 h-6 object-contain rounded-sm mb-1.5"
                  />
                )}
                <h3 className="font-bold text-slate-900 text-xs sm:text-sm leading-tight truncate">
                  {config.businessName || 'Alex Morgan'}
                </h3>
                <p
                  className="text-[10px] font-semibold truncate mt-0.5"
                  style={{ color: config.primaryColor || '#4f46e5' }}
                >
                  {config.tagline || 'Principal Consultant'}
                </p>
              </div>

              <div className="space-y-1 text-[9px] text-slate-600 border-t border-slate-100 pt-2 font-sans">
                {config.contactPhone && <div className="truncate">📞 {config.contactPhone}</div>}
                {config.contactEmail && <div className="truncate">✉ {config.contactEmail}</div>}
                {config.contactWebsite && (
                  <div className="truncate font-mono">
                    🌐 {config.contactWebsite.replace(/^https?:\/\//, '')}
                  </div>
                )}
                {config.address && <div className="truncate">📍 {config.address}</div>}
              </div>
            </div>

            {/* Right Column: QR container */}
            <div className="w-[42%] bg-slate-50/80 border-l border-slate-100 p-2.5 flex flex-col items-center justify-center text-center">
              <div className="p-1 bg-white rounded-lg shadow-2xs border border-slate-200/80">
                <div
                  ref={qrRef}
                  className="w-[96px] h-[96px] flex items-center justify-center overflow-hidden"
                />
              </div>
              <span className="text-[9px] font-bold text-slate-800 mt-1.5 line-clamp-1">
                {config.ctaText || 'Scan to connect'}
              </span>
            </div>
          </div>
        )}

        {/* TEMPLATE 2: PROMOTIONAL FLYER (A4 portrait poster) */}
        {config.templateType === 'flyer' && (
          <div
            className="w-full max-w-[300px] aspect-[1/1.414] bg-white rounded-xl shadow-lg border border-slate-200 p-4 flex flex-col justify-between items-center text-center relative overflow-hidden transition-all"
            style={{
              borderTop: `6px solid ${config.primaryColor || '#059669'}`,
            }}
          >
            {/* Header */}
            <div className="space-y-1 w-full">
              {config.logoUrl && (
                <img
                  src={config.logoUrl}
                  alt="Logo"
                  className="w-7 h-7 object-contain rounded-md mx-auto mb-1"
                />
              )}
              <h3 className="font-extrabold text-slate-900 text-sm leading-tight">
                {config.businessName || 'Apex Studio & Fitness'}
              </h3>
              <p
                className="text-[10px] font-bold uppercase tracking-wider"
                style={{ color: config.primaryColor || '#059669' }}
              >
                {config.tagline || 'Special Announcement'}
              </p>
            </div>

            {/* Promo Headline Pill */}
            <div
              className="w-full py-1.5 px-2 rounded-lg text-[10px] font-extrabold leading-tight my-1 border"
              style={{
                backgroundColor: config.secondaryColor || '#ecfdf5',
                borderColor: config.primaryColor || '#059669',
                color: config.primaryColor || '#059669',
              }}
            >
              {config.headline || 'SCAN FOR 25% OFF'}
            </div>

            {/* Bullets */}
            {config.bodyText && (
              <div className="text-[9px] text-slate-600 text-left w-full px-1 space-y-0.5">
                {config.bodyText.split('\n').slice(0, 3).map((line, idx) => (
                  <div key={idx} className="truncate flex items-center gap-1">
                    <CheckCircle2
                      className="w-2.5 h-2.5 shrink-0"
                      style={{ color: config.primaryColor || '#059669' }}
                    />
                    <span>{line.replace(/^•\s*/, '')}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Center QR Container */}
            <div className="p-2 bg-white rounded-xl shadow-xs border border-slate-200 my-1">
              <div
                ref={qrRef}
                className="w-[120px] h-[120px] flex items-center justify-center overflow-hidden"
              />
            </div>

            {/* Call to action & footer */}
            <div className="space-y-0.5 w-full">
              <span className="text-[10px] font-bold text-slate-900 block">
                {config.ctaText || 'Point camera to scan'}
              </span>
              <p className="text-[8px] text-slate-500 font-mono truncate">
                {config.contactWebsite || 'qr-studio-umar.vercel.app'}
              </p>
            </div>
          </div>
        )}

        {/* TEMPLATE 3: TABLE TENT CARD (4" x 6" table display) */}
        {config.templateType === 'tent-card' && (
          <div
            className="w-full max-w-[280px] aspect-[2/3] bg-white rounded-xl shadow-lg border border-slate-200 p-4 flex flex-col justify-between items-center text-center relative overflow-hidden transition-all"
            style={{
              borderTop: `6px solid ${config.primaryColor || '#d97706'}`,
            }}
          >
            {/* Table Badge */}
            {config.tableNumber && (
              <span
                className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full"
                style={{
                  backgroundColor: config.secondaryColor || '#fef3c7',
                  color: config.primaryColor || '#d97706',
                }}
              >
                {config.tableNumber}
              </span>
            )}

            {/* Headline */}
            <div className="space-y-1 w-full mt-1">
              {config.logoUrl && (
                <img
                  src={config.logoUrl}
                  alt="Logo"
                  className="w-7 h-7 object-contain rounded-md mx-auto"
                />
              )}
              <h3 className="font-extrabold text-slate-900 text-sm leading-tight">
                {config.businessName || 'The Terrace Bistro'}
              </h3>
              <h4
                className="text-[11px] font-bold leading-tight"
                style={{ color: config.primaryColor || '#d97706' }}
              >
                {config.headline || 'Scan to View Menu'}
              </h4>
              <p className="text-[9px] text-slate-500 leading-tight px-1">
                {config.bodyText || 'Browse food & beverage options directly from your table'}
              </p>
            </div>

            {/* QR Container */}
            <div className="p-2 bg-white rounded-xl shadow-xs border border-slate-200 my-1">
              <div
                ref={qrRef}
                className="w-[125px] h-[125px] flex items-center justify-center overflow-hidden"
              />
            </div>

            {/* Bottom info */}
            <div className="space-y-1 w-full pt-1 border-t border-slate-100">
              <span className="text-[10px] font-semibold text-slate-800 block">
                {config.ctaText || 'Point camera to scan'}
              </span>
              {config.address && (
                <p className="text-[8px] text-amber-700 dark:text-amber-600 font-medium truncate">
                  {config.address}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Scannability contrast rating */}
        <div className="mt-4 flex items-center gap-1.5 text-xs">
          {contrast.isReliable ? (
            <span className="text-emerald-700 dark:text-emerald-400 flex items-center gap-1 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Scannable ({contrast.ratio}:1 contrast)
            </span>
          ) : (
            <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1 font-medium">
              <AlertTriangle className="w-3.5 h-3.5" />
              Low Contrast Warning ({contrast.ratio}:1)
            </span>
          )}
        </div>
      </div>

      {/* Export Action Buttons */}
      <div className="space-y-2 pt-1">
        <button
          type="button"
          onClick={handleDownloadPdf}
          disabled={downloading}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-semibold text-xs shadow-xs transition-all cursor-pointer disabled:opacity-50"
        >
          <FileText className="w-4 h-4" />
          <span>Download Formatted PDF ({preset.badge})</span>
        </button>

        <button
          type="button"
          onClick={handleDownloadPng}
          disabled={downloading}
          className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
        >
          <Download className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>Download High-Res PNG (300 DPI)</span>
        </button>
      </div>

      {/* Scan guide instructions */}
      <ScanVerificationGuide />

      {/* Professional print tip */}
      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
        <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>Professional Print Recommendations</span>
        </div>
        <p className="leading-relaxed">
          {config.templateType === 'business-card' &&
            'Print on 300-350 gsm heavy matte or silk cardstock. The included crop marks enable millimeter-precise trimming.'}
          {config.templateType === 'flyer' &&
            'Print on 130-170 gsm glossy or satin A4 paper. Suitable for retail windows, bulletin boards, and takeaway bags.'}
          {config.templateType === 'tent-card' &&
            'Print on 250-300 gsm cardstock and fold down the center, or slide directly into standard 4" × 6" acrylic tabletop stands.'}
        </p>
      </div>
    </div>
  );
};
