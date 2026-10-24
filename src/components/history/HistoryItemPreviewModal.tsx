import React, { useEffect, useRef, useState } from 'react';
import QRCodeStyling from 'qr-code-styling';
import {
  X,
  Download,
  Copy,
  RotateCcw,
  Shield,
  FileCode,
  FileText,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react';
import { QrHistoryEntry } from '../../types/qr';
import { buildQrCodeOptions, downloadPng, downloadSvg, downloadPdf, sanitizeFilename } from '../../lib/export/exportQr';
import { useToast } from '../ui/Toast';

interface HistoryItemPreviewModalProps {
  entry: QrHistoryEntry | null;
  onClose: () => void;
  onEdit: (entry: QrHistoryEntry) => void;
}

export const HistoryItemPreviewModal: React.FC<HistoryItemPreviewModalProps> = ({
  entry,
  onClose,
  onEdit,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { showToast } = useToast();
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!entry || !containerRef.current) return;
    containerRef.current.innerHTML = '';

    const options = buildQrCodeOptions(entry.rawPayload, entry.customization, 260, 260);
    const qrCode = new QRCodeStyling(options);
    qrCode.append(containerRef.current);
  }, [entry]);

  if (!entry) return null;

  const sanitizedName = sanitizeFilename(entry.title || `${entry.type}-qr`, 'qr-code');

  const handleCopyPayload = async () => {
    try {
      await navigator.clipboard.writeText(entry.rawPayload);
      showToast('Payload copied to clipboard!', 'success');
    } catch {
      showToast('Failed to copy payload', 'error');
    }
  };

  const handleDownloadPng = async () => {
    try {
      setDownloading(true);
      await downloadPng(entry.rawPayload, entry.customization, sanitizedName, 1024);
      showToast(`Downloaded ${sanitizedName}.png`, 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to export PNG', 'error');
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadSvg = async () => {
    try {
      setDownloading(true);
      await downloadSvg(entry.rawPayload, entry.customization, sanitizedName);
      showToast(`Downloaded ${sanitizedName}.svg`, 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to export SVG', 'error');
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadPdf = async () => {
    try {
      setDownloading(true);
      await downloadPdf(entry.rawPayload, entry.customization, sanitizedName, entry.title, entry.summary);
      showToast(`Downloaded ${sanitizedName}.pdf`, 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to export PDF', 'error');
    } finally {
      setDownloading(false);
    }
  };

  const formattedDate = new Date(entry.timestamp).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-xs font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60 shrink-0">
              {entry.type}
            </span>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">
              {entry.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Visual QR Container */}
          <div
            className="p-6 rounded-2xl flex flex-col items-center justify-center border border-slate-200/90 dark:border-slate-800 shadow-inner"
            style={{
              backgroundColor: entry.customization.transparentBackground
                ? '#f8fafc'
                : entry.customization.backgroundColor || '#ffffff',
            }}
          >
            {entry.customization.frameStyle === 'top-badge' && entry.customization.frameLabel && (
              <div
                className="px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider mb-3 shadow-xs"
                style={{
                  backgroundColor:
                    entry.customization.frameColor || entry.customization.foregroundColor || '#0f172a',
                  color: entry.customization.frameTextColor || '#ffffff',
                }}
              >
                {entry.customization.frameLabel}
              </div>
            )}

            <div ref={containerRef} className="flex items-center justify-center" />

            {entry.customization.frameStyle === 'scan-me' && entry.customization.frameLabel && (
              <div
                className="mt-3.5 px-5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-xs"
                style={{
                  backgroundColor:
                    entry.customization.frameColor || entry.customization.foregroundColor || '#0f172a',
                  color: entry.customization.frameTextColor || '#ffffff',
                }}
              >
                {entry.customization.frameLabel}
              </div>
            )}

            {(entry.customization.frameStyle === 'bottom-bar' ||
              entry.customization.frameStyle === 'card-border') &&
              entry.customization.frameLabel && (
                <div
                  className="mt-3 w-full py-1.5 px-3 rounded-lg text-center text-xs font-bold uppercase tracking-wider shadow-xs"
                  style={{
                    backgroundColor:
                      entry.customization.frameColor || entry.customization.foregroundColor || '#0f172a',
                    color: entry.customization.frameTextColor || '#ffffff',
                  }}
                >
                  {entry.customization.frameLabel}
                </div>
              )}
          </div>

          {/* Details & Metadata */}
          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Created:</span>
                </span>
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  {formattedDate}
                </span>
              </div>

              {entry.templateName && (
                <div className="flex items-center justify-between text-slate-500 pt-1 border-t border-slate-200/60 dark:border-slate-800">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Applied Template:</span>
                  </span>
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                    {entry.templateName}
                  </span>
                </div>
              )}

              {entry.summary && (
                <div className="pt-1 border-t border-slate-200/60 dark:border-slate-800">
                  <span className="text-slate-500 block mb-0.5">Content Summary:</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200 block break-words">
                    {entry.summary}
                  </span>
                </div>
              )}
            </div>

            {/* Raw Payload Block with Copy */}
            <div className="p-3 rounded-xl bg-slate-100/70 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Encoded Payload
                </span>
                <button
                  type="button"
                  onClick={handleCopyPayload}
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-medium cursor-pointer"
                >
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </button>
              </div>
              <p className="font-mono text-xs text-slate-700 dark:text-slate-300 break-all line-clamp-3 select-all">
                {entry.rawPayload}
              </p>
            </div>

            {entry.isSensitive && (
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
                <Shield className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Sensitive Wi-Fi Record:</strong> This entry is stored privately only in this browser and contains network credentials required to produce the QR code.
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={downloading}
              onClick={handleDownloadPng}
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-indigo-600" />
              <span>PNG</span>
            </button>
            <button
              type="button"
              disabled={downloading}
              onClick={handleDownloadSvg}
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <FileCode className="w-3.5 h-3.5 text-blue-600" />
              <span>SVG</span>
            </button>
            <button
              type="button"
              disabled={downloading}
              onClick={handleDownloadPdf}
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5 text-rose-600" />
              <span>PDF</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                onEdit(entry);
                onClose();
              }}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs hover:shadow transition-all cursor-pointer flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Edit & Regenerate</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
