import React, { useEffect, useRef, useState } from 'react';
import QRCodeStyling from 'qr-code-styling';
import {
  Download,
  FileText,
  FileCode,
  Sparkles,
  Layout,
  QrCode,
  ShieldCheck,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react';
import { BrandingConfig } from '../../types/businessBranding';
import { QrCustomization, QrType } from '../../types/qr';
import { buildQrCodeOptions } from '../../lib/export/exportQr';
import {
  downloadPromotionalCardPng,
  downloadPromotionalCardPdf,
} from '../../lib/export/exportPromotionalCard';
import { analyzeQrContrast } from '../../lib/qr/contrastCheck';
import { useToast } from '../ui/Toast';

import { ScanVerificationGuide } from '../ui/ScanVerificationGuide';

interface PromotionalCardPreviewProps {
  branding: BrandingConfig;
  qrPayload: string;
  qrType: QrType;
  customization: QrCustomization;
  onOpenPremiumServices?: () => void;
}

export const PromotionalCardPreview: React.FC<PromotionalCardPreviewProps> = ({
  branding,
  qrPayload,
  customization,
  onOpenPremiumServices,
}) => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'card' | 'qr'>('card');
  const [downloading, setDownloading] = useState(false);

  const qrRef = useRef<HTMLDivElement>(null);
  const qrInstanceRef = useRef<QRCodeStyling | null>(null);

  // Optical scan contrast analysis
  const contrast = analyzeQrContrast(
    branding.primaryColor || customization.foregroundColor,
    '#ffffff',
    false
  );

  // Render QR Code in isolated container
  useEffect(() => {
    if (!qrRef.current) return;

    const dataToEncode = qrPayload.trim() || 'https://qrstudio.app';
    const options = buildQrCodeOptions(
      dataToEncode,
      {
        ...customization,
        foregroundColor: branding.primaryColor || customization.foregroundColor,
        cornerSquareColor: branding.primaryColor || customization.cornerSquareColor,
        cornerDotColor: branding.primaryColor || customization.cornerDotColor,
        logoUrl: branding.logoUrl || customization.logoUrl,
      },
      260,
      260
    );

    if (!qrInstanceRef.current) {
      qrRef.current.innerHTML = '';
      const qrCode = new QRCodeStyling(options);
      qrCode.append(qrRef.current);
      qrInstanceRef.current = qrCode;
    } else {
      qrInstanceRef.current.update(options);
    }
  }, [qrPayload, customization, branding]);

  // Export Promotional Card PNG
  const handleDownloadCardPng = async () => {
    try {
      setDownloading(true);
      await downloadPromotionalCardPng(branding, qrPayload, customization);
      showToast('Downloaded High-Res Promotional Card PNG (1200x1600px)', 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to export promotional card image', 'error');
    } finally {
      setDownloading(false);
    }
  };

  // Export Promotional Card PDF
  const handleDownloadCardPdf = async () => {
    try {
      setDownloading(true);
      await downloadPromotionalCardPdf(branding, qrPayload, customization);
      showToast('Downloaded Print-Ready Promotional Card PDF', 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to export promotional card PDF', 'error');
    } finally {
      setDownloading(false);
    }
  };

  // Export standalone QR PNG
  const handleDownloadQrPng = async () => {
    if (!qrInstanceRef.current) return;
    try {
      setDownloading(true);
      await qrInstanceRef.current.download({ extension: 'png', name: `qr-${branding.businessName || 'code'}` });
      showToast('Downloaded Branded QR Code PNG', 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to download QR image', 'error');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs sticky top-24 space-y-4">
      {/* Header with View Tabs */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
            Live Output Preview
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time tabletop card & scannable QR rendering
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab('card')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === 'card'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Layout className="w-3.5 h-3.5" />
            <span>Promo Card</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('qr')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === 'qr'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>QR Only</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: PROMOTIONAL CARD PREVIEW (Tabletop stand card) */}
      {activeTab === 'card' && (
        <div className="relative rounded-2xl p-6 bg-slate-50 dark:bg-slate-950/60 border border-slate-200/90 dark:border-slate-800 flex flex-col items-center justify-center">
          {/* Card Mockup Shell (Scaled for preview) */}
          <div
            className="w-full max-w-[320px] rounded-2xl bg-white text-slate-900 p-5 shadow-lg border border-slate-200 flex flex-col items-center text-center space-y-3 relative overflow-hidden transition-all"
            style={{
              borderTop: `6px solid ${branding.primaryColor || '#4338ca'}`,
            }}
          >
            {/* Category Badge */}
            <span
              className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
              style={{
                backgroundColor: branding.secondaryColor || '#e0e7ff',
                color: branding.primaryColor || '#4338ca',
              }}
            >
              {branding.badgeText || 'Contactless Dining'}
            </span>

            {/* Logo */}
            {branding.logoUrl && (
              <img
                src={branding.logoUrl}
                alt="Brand logo"
                className="w-10 h-10 rounded-lg object-contain bg-slate-50 border border-slate-100 p-0.5"
              />
            )}

            {/* Business Name */}
            <h3 className="font-extrabold text-slate-900 text-base leading-tight">
              {branding.businessName || 'Your Business Name'}
            </h3>

            {/* Headline */}
            <h4
              className="font-bold text-sm leading-tight"
              style={{ color: branding.primaryColor || '#4338ca' }}
            >
              {branding.heading || 'Scan with Camera'}
            </h4>

            {/* Subheading */}
            <p className="text-[11px] text-slate-500 leading-snug px-2">
              {branding.subheading || 'Point your smartphone camera to connect'}
            </p>

            {/* Embedded QR Code container */}
            <div className="p-3 bg-white rounded-xl shadow-xs border border-slate-100 my-1">
              <div
                ref={qrRef}
                className="w-[180px] h-[180px] flex items-center justify-center overflow-hidden"
              />
            </div>

            {/* CTA Note */}
            <span className="text-[10px] font-semibold text-slate-800 block">
              {branding.callToAction || 'Point camera to scan · No app required'}
            </span>

            {/* Watermark / Footer note */}
            <span className="text-[9px] text-slate-400 block pt-1 border-t border-slate-100 w-full">
              Free Static QR Code • Created with QR Studio
            </span>
          </div>

          {/* Contrast status */}
          <div className="mt-4 flex items-center gap-1.5 text-xs">
            {contrast.isReliable ? (
              <span className="text-emerald-700 dark:text-emerald-400 flex items-center gap-1 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                High Scannability ({contrast.ratio}:1 contrast)
              </span>
            ) : (
              <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1 font-medium">
                <AlertTriangle className="w-3.5 h-3.5" />
                Poor Contrast ({contrast.ratio}:1)
              </span>
            )}
          </div>
        </div>
      )}

      {/* VIEW 2: ISOLATED QR CODE PREVIEW */}
      {activeTab === 'qr' && (
        <div className="relative rounded-2xl p-6 bg-slate-50 dark:bg-slate-950/60 border border-slate-200/90 dark:border-slate-800 flex flex-col items-center justify-center">
          <div
            ref={activeTab === 'qr' ? qrRef : null}
            className="w-[260px] h-[260px] flex items-center justify-center bg-white p-4 rounded-2xl shadow-sm border border-slate-200/80"
          />
          <div className="mt-4 text-xs font-mono text-slate-500">
            Rendered with primary brand color & embedded logo
          </div>
        </div>
      )}

      {/* Download Action Buttons */}
      <div className="space-y-2.5 pt-1">
        {activeTab === 'card' ? (
          <>
            <button
              type="button"
              onClick={handleDownloadCardPng}
              disabled={downloading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-semibold text-xs shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>Download Promotional Card (High-Res PNG)</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadCardPdf}
              disabled={downloading}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
            >
              <FileText className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              <span>Download Printable PDF (A4 Stand Layout)</span>
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={handleDownloadQrPng}
            disabled={downloading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-semibold text-xs shadow-xs transition-all cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>Download Branded QR Code (PNG)</span>
          </button>
        )}
      </div>

      {/* Practical Scan-Testing Instructions Guide */}
      <ScanVerificationGuide />

      {/* Optional Custom Design Services Banner */}
      <div className="p-3.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 flex items-start gap-2.5 text-xs">
        <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-semibold text-slate-900 dark:text-white block">
            Need Custom Hand-Crafted Artwork?
          </span>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
            Get personalized multi-page menus, laminated table stands, or vector acrylic signage designs starting at Rs. 800.
          </p>
          {onOpenPremiumServices && (
            <button
              type="button"
              onClick={onOpenPremiumServices}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer pt-0.5"
            >
              <span>View Design Packages</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};


