import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Cpu,
  Layers,
  Sparkles,
  ArrowRight,
  Printer,
  CheckCircle2,
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Page Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-medium">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Independent & Privacy-First</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          About QR Studio
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
          QR Studio was created by <strong className="text-slate-900 dark:text-white font-semibold">Umar Wazir</strong> to provide a modern, reliable, and completely private QR code suite engineered for modern business users, agencies, and creators. We eliminate paywalls, recurring subscriptions, expiration surprises, and deceptive redirect links.
        </p>
      </div>

      {/* Core Principles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">
            100% Client-Side
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            All encoding, rendering, and file exports happen directly in your browser. Sensitive payloads like Wi-Fi passwords never touch our servers.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">
            Permanent Codes
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            We generate genuine static QR codes. Because there is no intermediary redirect service, your codes will work for decades without breaking.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">
            Production Quality
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Download true vector SVGs for print shops or razor-sharp 2048px PNGs with custom quiet zones and error correction.
          </p>
        </div>
      </div>

      {/* Static vs Dynamic Explanation */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Why Static QR Codes Matter
        </h2>
        <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            Many commercial QR generator websites create <strong className="text-slate-900 dark:text-white">dynamic QR codes</strong> by default. While dynamic codes allow changing the destination link later, they route every single scan through a proprietary redirect URL. If that service shuts down or demands a monthly subscription, all your printed marketing materials immediately stop working.
          </p>
          <p>
            In contrast, <strong className="text-slate-900 dark:text-white">QR Studio produces pure static QR codes</strong>. When someone scans a QR code you generated here, their phone camera directly reads the data you typed in. There is no middleman, no tracking pixel, and no ongoing cost.
          </p>
        </div>
      </div>

      {/* Printing & Best Practices */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Printer className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <span>Best Practices for Printing QR Codes</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
            <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              Maintain High Contrast
            </div>
            <p className="text-slate-500">
              Always ensure sufficient contrast between dark dots and a light background. Avoid dark-on-dark or low-saturation combinations.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
            <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              Keep the Quiet Zone Intact
            </div>
            <p className="text-slate-500">
              The margin around the QR code helps phone cameras locate the matrix boundaries. Avoid cropping tightly against the outer dots.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
            <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              Use Vector SVG for Large Format
            </div>
            <p className="text-slate-500">
              When printing posters, vehicle wraps, or signage, use SVG to ensure vector clarity at any scale without pixelation.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
            <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              Test Physical Print Samples
            </div>
            <p className="text-slate-500">
              Before committing to large commercial print runs, always test a sample print under both bright and dim lighting with multiple phone models.
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="pt-4 text-center">
        <Link
          to="/generator"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm shadow-sm transition-all"
        >
          <span>Open the QR Generator</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
