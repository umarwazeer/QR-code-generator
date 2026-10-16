import React from 'react';

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
          Terms of Use
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Last revised: October 2026 · Standard Website Terms
        </p>
      </div>

      <div className="space-y-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing and utilizing the QR Studio web application, you agree to comply with and be bound by these terms. If you disagree with any part of these terms, please do not use the application.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            2. Permitted Commercial and Personal Use
          </h2>
          <p>
            You are granted a worldwide, royalty-free license to generate QR codes using QR Studio and use the resulting PNG, SVG, and PDF files for personal, commercial, promotional, educational, or organizational purposes without attribution.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            3. User Responsibility & Acceptable Use
          </h2>
          <p>
            You are solely responsible for the content you choose to encode into QR codes. You agree not to generate QR codes that:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs">
            <li>Point to phishing websites, malware distribution sites, or fraudulent schemes.</li>
            <li>Infringe upon third-party trademarks, copyrights, or trade secrets.</li>
            <li>Promote illegal activities or harassment.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            4. Disclaimer of Print Warranties & Scan Reliability
          </h2>
          <p>
            QR Studio provides real-time optical contrast indicators and standards-compliant encoding. However, factors such as physical printing resolution, paper finish (e.g. glossy reflections), ambient lighting, custom logo coverage, and the optical sensitivity of various camera sensors affect real-world scannability.
          </p>
          <p className="font-semibold text-slate-800 dark:text-slate-200">
            You are strongly advised to perform physical test scans on sample prints prior to executing large-scale commercial print runs.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            5. Modifications to the Service
          </h2>
          <p>
            We reserve the right to modify or discontinue any aspect of the service without notice. Because generated static QR codes contain the encoded information independently of QR Studio, existing downloaded QR codes will continue to function.
          </p>
        </section>
      </div>
    </div>
  );
};
