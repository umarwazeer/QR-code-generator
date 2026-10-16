import React from 'react';
import { ShieldCheck, Lock, EyeOff, HardDrive } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
          Privacy Policy
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Last revised: October 2026 · Effective immediately
        </p>
      </div>

      <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs sm:text-sm text-emerald-900 dark:text-emerald-300 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold block mb-0.5">Privacy By Architecture</span>
          <p className="text-emerald-800 dark:text-emerald-400 text-xs leading-relaxed">
            QR Studio runs entirely within your web browser. Your inputs (including Wi-Fi network passwords, personal contact numbers, and private messages) are never transmitted to our servers or stored on remote databases.
          </p>
        </div>
      </div>

      <div className="space-y-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            1. Information Processed Locally
          </h2>
          <p>
            When you enter data to create a QR code—whether a URL, plain text, Wi-Fi configuration, vCard, email address, SMS text, or geographic coordinates—this data is processed in client-side memory using JavaScript. The mathematical matrix and image rendering (PNG, SVG, PDF) are assembled directly on your device.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            2. Local Browser Storage (Recent History)
          </h2>
          <p>
            QR Studio includes an optional "Recent Codes" feature to let you reload codes into the editor. This feature uses standard browser <code className="font-mono text-xs px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800">localStorage</code>:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs">
            <li>History is stored solely in your personal browser and is never uploaded anywhere.</li>
            <li>For Wi-Fi networks, passwords are automatically masked before saving to history.</li>
            <li>You can disable this feature or clear your entire history with one click at any time.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <EyeOff className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            3. Third-Party Analytics and Tracking
          </h2>
          <p>
            We do not sell your personal data, employ tracking pixels, or inject advertising cookies into your browser. If you upload a custom logo image, that image is converted into an in-memory data URL and is never stored on our servers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            4. Static QR Code Scans
          </h2>
          <p>
            Because we generate pure static QR codes, scans of your codes do not ping our servers. The user's camera app opens the destination or executes the payload directly without connecting to QR Studio.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            5. Contact and Inquiries
          </h2>
          <p>
            For questions about this privacy statement or our open client-side architecture, contact us at <a href="mailto:privacy@qrstudio.app" className="text-indigo-600 dark:text-indigo-400 hover:underline">privacy@qrstudio.app</a>.
          </p>
        </section>
      </div>
    </div>
  );
};
