import React from 'react';
import { Link } from 'react-router-dom';
import {
  QrCode,
  ShieldCheck,
  Cpu,
  Download,
  Building2,
  CheckCircle2,
  Sparkles,
  Printer,
  Heart,
} from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 text-sm">
      {/* Dedicated Business Users Showcase Section */}
      <div className="border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-8">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Building2 className="w-4 h-4" />
              <span>Built for Business & Commercial Use</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Why QR Studio is the Perfect Choice for Every Business User
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              Designed from the ground up for retailers, restaurants, agencies, event hosts, and corporate marketing teams who need reliable, high-volume, and brand-consistent QR codes without recurring costs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Pillar 1 */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-semibold">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
                No Expirations or Paywalls
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Traditional dynamic QR platforms deactivate codes after a 14-day trial unless you pay monthly fees. QR Studio codes are 100% static, meaning they will work on your packaging and signs forever.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-semibold">
                <Printer className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
                Commercial Print Quality
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Download true vector SVGs for limitless billboard scaling, 2048px ultra high-resolution PNGs for crisp product labels, and formatted A4 print PDFs ready for shop floors.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-semibold">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
                Custom Brand Integration
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Embed your company logo with smart error-recovery tolerance, match brand color hex codes, apply dual-tone gradients, and customize corner eye frames for distinctive recognition.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-2">
              <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center font-semibold">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
                Confidential & Private
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                All QR encoding happens strictly within your browser. Sensitive business data, guest Wi-Fi passwords, executive contact cards, and private links never get uploaded or logged.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5 text-slate-900 dark:text-white font-semibold text-lg">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                <QrCode className="w-4 h-4" />
              </div>
              <span>QR Studio</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed text-sm">
              The modern, private QR code studio. Generate custom, high-resolution QR codes for websites, Wi-Fi networks, contacts, events, and businesses directly in your browser.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-500 pt-1">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                100% Client-Side Privacy
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <Download className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                Vector SVG & 2048px PNG
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                Zero Tracking
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-3">
              Application
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/generator" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  QR Generator
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  About the Project
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Supported Types
                </Link>
              </li>
              <li>
                <Link to="/generator?type=wifi" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Wi-Fi QR Code
                </Link>
              </li>
              <li>
                <Link to="/generator?type=vcard" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Digital Business Card
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Privacy */}
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-3">
              Trust & Legal
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Terms of Use
                </Link>
              </li>
              <li>
                <span className="text-slate-500">Static Codes (No Expiration)</span>
              </li>
              <li>
                <a
                  href={import.meta.env.VITE_LINKEDIN_URL || 'https://www.linkedin.com/in/umarwazir'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  <span className="font-medium">Creator on LinkedIn</span>
                  <span aria-hidden="true">↗</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Attribution and Copyright */}
        <div className="mt-12 pt-8 border-t border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex flex-wrap items-center gap-2">
            <span>© {new Date().getFullYear()} QR Studio.</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-600 dark:text-slate-400">
              Created by{' '}
              <a
                href={import.meta.env.VITE_LINKEDIN_URL || 'https://www.linkedin.com/in/umarwazir'}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 underline underline-offset-2 transition-colors"
              >
                Umar Wazir
              </a>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="hover:underline">Privacy</Link>
            <span aria-hidden="true">·</span>
            <Link to="/terms" className="hover:underline">Terms</Link>
            <span aria-hidden="true">·</span>
            <Link to="/about" className="hover:underline">Security</Link>
            <span aria-hidden="true">·</span>
            <a
              href="#contact"
              className="hover:underline text-indigo-600 dark:text-indigo-400"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
