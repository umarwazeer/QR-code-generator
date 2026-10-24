import React, { useEffect, useRef, useState } from 'react';
import QRCodeStyling from 'qr-code-styling';
import {
  Download,
  Copy,
  Printer,
  FileCode,
  FileText,
  AlertTriangle,
  BookmarkPlus,
  Share2,
} from 'lucide-react';
import { QrCustomization, QrType } from '../../types/qr';
import { buildQrCodeOptions, downloadPng, downloadSvg, downloadPdf, sanitizeFilename } from '../../lib/export/exportQr';
import { analyzeQrContrast } from '../../lib/qr/contrastCheck';
import { useToast } from '../ui/Toast';
import { saveHistoryEntry, isHistoryEnabled } from '../../lib/history/historyStorage';
import { ScanVerificationGuide } from '../ui/ScanVerificationGuide';

interface QrPreviewProps {
  payload: string;
  type: QrType;
  customization: QrCustomization;
  titleHint?: string;
  formData: Record<string, unknown>;
  onOpenPrintTemplates?: () => void;
  templateId?: string;
  templateName?: string;
}

export const QrPreview: React.FC<QrPreviewProps> = ({
  payload,
  type,
  customization,
  titleHint,
  formData,
  onOpenPrintTemplates,
  templateId,
  templateName,
}) => {
  const { showToast } = useToast();
  const containerRef = useRef<HTMLDivElement>(null);
  const qrCodeInstanceRef = useRef<QRCodeStyling | null>(null);

  const [pngResolution, setPngResolution] = useState<number>(1024);
  const [downloading, setDownloading] = useState<boolean>(false);
  const [showPdfModal, setShowPdfModal] = useState<boolean>(false);
  const [pdfTitle, setPdfTitle] = useState<string>('QR Code');
  const [pdfNote, setPdfNote] = useState<string>('');

  const displayTitle = titleHint?.trim() || `${type.toUpperCase()} QR`;
  const sanitizedName = sanitizeFilename(displayTitle, 'qr-studio-code');

  // Contrast analysis
  const contrast = analyzeQrContrast(
    customization.foregroundColor,
    customization.backgroundColor,
    customization.transparentBackground
  );

  // Initialize and update QRCodeStyling
  useEffect(() => {
    if (!containerRef.current) return;

    const dataToEncode = payload.trim() || 'https://qrstudio.app';
    const options = buildQrCodeOptions(dataToEncode, customization, 300, 300);

    if (!qrCodeInstanceRef.current) {
      containerRef.current.innerHTML = '';
      const qrCode = new QRCodeStyling(options);
      qrCode.append(containerRef.current);
      qrCodeInstanceRef.current = qrCode;
    } else {
      qrCodeInstanceRef.current.update(options);
    }
  }, [payload, customization]);

  // Handle PNG Download
  const handleDownloadPng = async () => {
    if (!payload.trim()) {
      showToast('Please enter QR content before downloading', 'error');
      return;
    }
    try {
      setDownloading(true);
      await downloadPng(payload, customization, sanitizedName, pngResolution);
      showToast(`Downloaded ${sanitizedName}.png (${pngResolution}px)`, 'success');

      // Auto-save to history if enabled
      if (isHistoryEnabled()) {
        saveHistoryEntry({
          title: displayTitle,
          type,
          rawPayload: payload,
          customization,
          formData,
          templateId,
          templateName,
        });
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to export PNG', 'error');
    } finally {
      setDownloading(false);
    }
  };

  // Handle SVG Download
  const handleDownloadSvg = async () => {
    if (!payload.trim()) {
      showToast('Please enter QR content before downloading', 'error');
      return;
    }
    try {
      setDownloading(true);
      await downloadSvg(payload, customization, sanitizedName);
      showToast(`Downloaded ${sanitizedName}.svg (Vector)`, 'success');

      if (isHistoryEnabled()) {
        saveHistoryEntry({
          title: displayTitle,
          type,
          rawPayload: payload,
          customization,
          formData,
          templateId,
          templateName,
        });
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to export SVG', 'error');
    } finally {
      setDownloading(false);
    }
  };

  // Handle PDF Export
  const handleConfirmDownloadPdf = async () => {
    if (!payload.trim()) {
      showToast('Please enter QR content before downloading', 'error');
      return;
    }
    try {
      setDownloading(true);
      await downloadPdf(payload, customization, sanitizedName, pdfTitle, pdfNote);
      setShowPdfModal(false);
      showToast(`Downloaded ${sanitizedName}.pdf`, 'success');

      if (isHistoryEnabled()) {
        saveHistoryEntry({
          title: pdfTitle || displayTitle,
          type,
          rawPayload: payload,
          customization,
          formData,
          templateId,
          templateName,
        });
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to export PDF', 'error');
    } finally {
      setDownloading(false);
    }
  };

  // Copy raw payload
  const handleCopyPayload = async () => {
    if (!payload.trim()) {
      showToast('No content to copy', 'error');
      return;
    }
    try {
      await navigator.clipboard.writeText(payload);
      showToast('QR payload copied to clipboard!', 'success');
    } catch {
      showToast('Failed to copy to clipboard', 'error');
    }
  };

  // Save explicitly to history
  const handleSaveToHistory = () => {
    if (!payload.trim()) {
      showToast('Enter content to save', 'error');
      return;
    }
    const result = saveHistoryEntry({
      title: displayTitle,
      type,
      rawPayload: payload,
      customization,
      formData,
      templateId,
      templateName,
      isExplicit: true,
    });
    if (result.success) {
      showToast('Saved to local history', 'success');
    } else {
      showToast(result.error || 'Failed to save to history', 'error');
    }
  };

  // Print
  const handlePrint = () => {
    window.print();
  };

  const hasContent = !!payload.trim();

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs sticky top-24">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800/80">
        <div>
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
            Live Preview
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real standards-compliant vector & raster rendering
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleCopyPayload}
            className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            title="Copy raw encoded payload"
            aria-label="Copy raw encoded payload"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleSaveToHistory}
            className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            title="Save to local browser history"
            aria-label="Save to local history"
          >
            <BookmarkPlus className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            title="Print QR code"
            aria-label="Print QR code"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* QR Code Canvas Frame */}
      <div className="relative flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 min-h-[340px]">
        {!hasContent && (
          <div className="absolute top-3 left-3 bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-[11px] font-medium px-2.5 py-1 rounded-md">
            Showing demo preview
          </div>
        )}

        {/* Framed or Standard Wrapper */}
        <div
          className={`flex flex-col items-center justify-center transition-all ${
            customization.frameStyle && customization.frameStyle !== 'none'
              ? 'p-4 rounded-2xl shadow-sm border'
              : ''
          }`}
          style={{
            backgroundColor:
              customization.frameStyle && customization.frameStyle !== 'none' && !customization.transparentBackground
                ? customization.backgroundColor || '#ffffff'
                : undefined,
            borderColor:
              customization.frameStyle === 'card-border'
                ? customization.frameColor || customization.foregroundColor || '#0f172a'
                : 'transparent',
            borderWidth: customization.frameStyle === 'card-border' ? '3px' : '0px',
          }}
        >
          {/* Top Badge */}
          {customization.frameStyle === 'top-badge' && customization.frameLabel && (
            <div
              className="px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider mb-3 shadow-xs"
              style={{
                backgroundColor: customization.frameColor || customization.foregroundColor || '#0f172a',
                color: customization.frameTextColor || '#ffffff',
              }}
            >
              {customization.frameLabel}
            </div>
          )}

          <div
            ref={containerRef}
            className="flex items-center justify-center max-w-full overflow-hidden transition-all duration-200"
            style={{
              maxWidth: '300px',
              maxHeight: '300px',
            }}
          />

          {/* Bottom Bar or Scan-Me Pill */}
          {customization.frameStyle === 'scan-me' && customization.frameLabel && (
            <div
              className="mt-3.5 px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest shadow-xs flex items-center gap-1.5"
              style={{
                backgroundColor: customization.frameColor || customization.foregroundColor || '#0f172a',
                color: customization.frameTextColor || '#ffffff',
              }}
            >
              <span>{customization.frameLabel}</span>
            </div>
          )}

          {(customization.frameStyle === 'bottom-bar' || customization.frameStyle === 'card-border') &&
            customization.frameLabel && (
              <div
                className="mt-3 w-full py-1.5 px-3 rounded-lg text-center text-xs font-bold uppercase tracking-wider shadow-xs"
                style={{
                  backgroundColor: customization.frameColor || customization.foregroundColor || '#0f172a',
                  color: customization.frameTextColor || '#ffffff',
                }}
              >
                {customization.frameLabel}
              </div>
            )}
        </div>

        {/* Scan Status Indicator */}
        <div className="mt-4 flex items-center justify-center gap-2 text-xs">
          {contrast.isReliable ? (
            <span className="text-emerald-700 dark:text-emerald-400 flex items-center gap-1 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
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

      {/* Download Actions */}
      <div className="mt-5 space-y-3">
        {/* PNG resolution selector & download */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
            <span className="font-medium">PNG Resolution</span>
            <div className="flex items-center gap-1">
              {[512, 1024, 2048].map((res) => (
                <button
                  key={res}
                  type="button"
                  onClick={() => setPngResolution(res)}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors cursor-pointer ${
                    pngResolution === res
                      ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-semibold'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {res}px
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={handleDownloadPng}
            disabled={downloading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-medium text-sm shadow-sm transition-all cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>Download PNG ({pngResolution} × {pngResolution})</span>
          </button>
        </div>

        {/* Vector SVG & Print-Ready PDF */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={handleDownloadSvg}
            disabled={downloading}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
          >
            <FileCode className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Vector SVG</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setPdfTitle(displayTitle);
              setShowPdfModal(true);
            }}
            disabled={downloading}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
          >
            <FileText className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
            <span>Print PDF</span>
          </button>
        </div>

        {/* Quick link to Print Templates section */}
        {onOpenPrintTemplates && (
          <button
            type="button"
            onClick={onOpenPrintTemplates}
            className="w-full flex items-center justify-between p-2.5 rounded-xl border border-indigo-100 dark:border-indigo-900/60 bg-indigo-50/50 dark:bg-indigo-950/30 hover:bg-indigo-100/60 dark:hover:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 transition-colors cursor-pointer text-left text-xs"
          >
            <div className="flex items-center gap-2">
              <Printer className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <div>
                <span className="font-semibold block">Print Templates</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Export as Business Card, A4 Flyer, or Tent Card
                </span>
              </div>
            </div>
            <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
              Open &rarr;
            </span>
          </button>
        )}
      </div>

      {/* Practical Scan-Testing Instructions Guide */}
      <div className="pt-1">
        <ScanVerificationGuide />
      </div>

      {/* Payload preview snippet */}
      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
          <span>Encoded Content:</span>
          <button
            type="button"
            onClick={handleCopyPayload}
            className="text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
          >
            <Copy className="w-3 h-3" />
            Copy
          </button>
        </div>
        <p className="font-mono text-[11px] text-slate-600 dark:text-slate-400 break-all bg-slate-50 dark:bg-slate-950 p-2 rounded-lg max-h-16 overflow-y-auto">
          {payload.trim() || 'https://qrstudio.app'}
        </p>
      </div>

      {/* PDF Export Modal */}
      {showPdfModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 shadow-xl animate-in zoom-in-95 duration-150">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">
              Export Printable PDF
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Generates an A4 portrait layout with your QR code, headline, and instructions.
            </p>

            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Document Title / Heading
                </label>
                <input
                  type="text"
                  value={pdfTitle}
                  onChange={(e) => setPdfTitle(e.target.value)}
                  placeholder="e.g. Scan for Free Guest Wi-Fi"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Supporting Instructions (Optional)
                </label>
                <textarea
                  rows={2}
                  value={pdfNote}
                  onChange={(e) => setPdfNote(e.target.value)}
                  placeholder="e.g. Point your camera at the code to connect automatically."
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowPdfModal(false)}
                className="px-4 py-2 text-xs font-medium rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDownloadPdf}
                disabled={downloading}
                className="px-4 py-2 text-xs font-medium rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs"
              >
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
