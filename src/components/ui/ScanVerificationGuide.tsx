import React, { useState } from 'react';
import { Smartphone, CheckCircle2, ChevronDown, ChevronUp, Sun, Ruler, ExternalLink } from 'lucide-react';

export const ScanVerificationGuide: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-2xs">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left font-semibold text-xs text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>Before You Print: Practical Scan-Testing Instructions</span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
        )}
      </button>

      {isOpen && (
        <div className="p-4 pt-1 border-t border-slate-100 dark:border-slate-800 space-y-3 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          <p className="text-[11px] text-slate-500">
            Ensure 100% scanning success on your customer's phones before printing bulk materials:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-white">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>1. Test on 2 Different Devices</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Scan using both an iPhone (Apple Camera app) and an Android device (Google Lens / default camera) to confirm broad compatibility.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-white">
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span>2. Test Realistic Lighting</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Test in the real environment where the card or poster will sit (e.g. ambient restaurant lighting, avoiding intense glass/acrylic glare).
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-white">
                <Ruler className="w-3.5 h-3.5 text-blue-500" />
                <span>3. Test Scanning Distance</span>
              </div>
              <p className="text-[11px] text-slate-500">
                The golden scanning ratio is 10:1. A 3-inch (7.5cm) QR code should be comfortably scannable from up to 30 inches away.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-white">
                <ExternalLink className="w-3.5 h-3.5 text-indigo-500" />
                <span>4. Verify Real Destination</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Verify the link actually loads, the Wi-Fi connects without password errors, or the vCard contact details save with full accuracy.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
