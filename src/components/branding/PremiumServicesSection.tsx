import React from 'react';
import { Check, Clock, Sparkles, MessageCircle, Mail, HelpCircle, ShieldAlert } from 'lucide-react';
import { PREMIUM_PACKAGES } from '../../lib/branding/categoryTemplates';
import { PremiumPackage } from '../../types/businessBranding';

interface PremiumServicesSectionProps {
  onSelectPackage?: (pkg: PremiumPackage) => void;
}

export const PremiumServicesSection: React.FC<PremiumServicesSectionProps> = ({
  onSelectPackage,
}) => {
  const configuredNumber = (import.meta.env.VITE_WHATSAPP_NUMBER || '').replace(/[^0-9]/g, '');

  const getWhatsAppUrl = (pkg: PremiumPackage) => {
    const text = encodeURIComponent(
      `Hello Umar! I would like to order the "${pkg.title}" (Rs. ${pkg.pricePkr}) for my business from QR Studio. Here are my details:`
    );
    return configuredNumber
      ? `https://wa.me/${configuredNumber}?text=${text}`
      : `https://wa.me/?text=${text}`;
  };

  const handleOrderEmail = (pkg: PremiumPackage) => {
    if (onSelectPackage) {
      onSelectPackage(pkg);
    }
    const contactElem = document.getElementById('contact');
    if (contactElem) {
      contactElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="services" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Section Header */}
      <div className="text-center space-y-3 mb-12">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Professional Custom Design Services</span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Need Bespoke, High-End Print Materials?
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-2xl mx-auto leading-relaxed">
          While our free generator creates instant tabletop cards, our design studio crafts customized, agency-grade marketing collateral tailored specifically to your brand guidelines.
        </p>
      </div>

      {/* 3 Premium Package Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {PREMIUM_PACKAGES.map((pkg) => {
          const isFeatured = pkg.id === 'menu-package';
          return (
            <div
              key={pkg.id}
              className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all relative ${
                isFeatured
                  ? 'bg-gradient-to-b from-indigo-50/70 via-white to-white dark:from-indigo-950/40 dark:via-slate-900 dark:to-slate-900 border-2 border-indigo-500 shadow-lg ring-1 ring-indigo-500/20'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs'
              }`}
            >
              {/* Badge */}
              {pkg.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-indigo-600 text-white text-[11px] font-bold tracking-wide uppercase shadow-sm">
                  {pkg.badge}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {pkg.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {pkg.summary}
                  </p>
                </div>

                {/* Price Display */}
                <div className="flex items-baseline gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                    Rs. {pkg.pricePkr.toLocaleString()}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    / one-time fee
                  </span>
                </div>

                {/* Turnaround Time */}
                <div className="flex items-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  <Clock className="w-3.5 h-3.5 shrink-0" />
                  <span>Turnaround: 24–48 hours</span>
                </div>

                {/* Ideal For */}
                <div className="text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/80 text-slate-600 dark:text-slate-300">
                  <span className="font-semibold block text-slate-800 dark:text-slate-200 mb-0.5">
                    Best suited for:
                  </span>
                  {pkg.idealFor}
                </div>

                {/* Deliverables List */}
                <div className="space-y-2.5 pt-2">
                  <span className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider block">
                    What's Included:
                  </span>
                  <ul className="space-y-2">
                    {pkg.deliverables.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300"
                      >
                        <div className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <a
                  href={getWhatsAppUrl(pkg)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isFeatured
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                      : 'bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white'
                  }`}
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Order via WhatsApp</span>
                </a>

                <button
                  type="button"
                  onClick={() => handleOrderEmail(pkg)}
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Inquire via Email Form</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Disclaimers & Print Shop Guidance */}
      <div className="mt-12 p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 max-w-4xl mx-auto space-y-3">
        <div className="flex items-center gap-2 text-slate-900 dark:text-white font-semibold text-xs uppercase tracking-wider">
          <ShieldAlert className="w-4 h-4 text-amber-500" />
          <span>Professional Service Disclaimer & Production Notes</span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          <strong>Digital Deliverables Only:</strong> Premium design packages provide high-resolution, print-ready vector PDF, SVG, and raster PNG artwork files with crop marks and bleeds. Physical acrylic stands, plastic card holders, paper printing, and lamination are produced by your local commercial print vendor. We provide exact printer specifications so your local print shop can output flawless physical results.
        </p>
      </div>
    </section>
  );
};
