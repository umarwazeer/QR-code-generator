import React from 'react';
import { X, Check, Clock, MessageCircle, Sparkles, ShieldAlert } from 'lucide-react';
import { PREMIUM_PACKAGES } from '../../lib/branding/categoryTemplates';
import { PremiumPackage } from '../../types/businessBranding';

interface PremiumServicesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectForEmail?: (pkg: PremiumPackage) => void;
}

export const PremiumServicesModal: React.FC<PremiumServicesModalProps> = ({
  isOpen,
  onClose,
  onSelectForEmail,
}) => {
  if (!isOpen) return null;

  const configuredNumber = (import.meta.env.VITE_WHATSAPP_NUMBER || '').replace(/[^0-9]/g, '');

  const getWhatsAppUrl = (pkg: PremiumPackage) => {
    const text = encodeURIComponent(
      `Hello Umar! I would like to order the "${pkg.title}" (Rs. ${pkg.pricePkr}) for my business from QR Studio. Here are my details:`
    );
    return configuredNumber
      ? `https://wa.me/${configuredNumber}?text=${text}`
      : `https://wa.me/?text=${text}`;
  };

  const handleInquireEmail = (pkg: PremiumPackage) => {
    onClose();
    if (onSelectForEmail) {
      onSelectForEmail(pkg);
    }
    const elem = document.getElementById('contact');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-150 p-6 sm:p-8 space-y-6 my-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Optional Custom Design Services</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Professional Print & Tabletop Branding Packages
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Hand-crafted artwork tailored to your venue or brand guidelines. Delivered in 24–48 hours.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PREMIUM_PACKAGES.map((pkg) => (
            <div
              key={pkg.id}
              className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {pkg.badge && (
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                    {pkg.badge}
                  </span>
                )}
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    {pkg.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {pkg.summary}
                  </p>
                </div>

                <div className="flex items-baseline gap-1.5 pt-1">
                  <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
                    Rs. {pkg.pricePkr.toLocaleString()}
                  </span>
                  <span className="text-[11px] text-slate-400">/ one-time</span>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                  <Clock className="w-3 h-3" />
                  <span>24–48 hours turnaround</span>
                </div>

                <ul className="space-y-1.5 pt-2 border-t border-slate-200/60 dark:border-slate-800">
                  {pkg.deliverables.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-[11px] text-slate-600 dark:text-slate-300">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800 space-y-2">
                <a
                  href={getWhatsAppUrl(pkg)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Order via WhatsApp</span>
                </a>
                <button
                  type="button"
                  onClick={() => handleInquireEmail(pkg)}
                  className="w-full py-1.5 px-3 text-[11px] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-center cursor-pointer"
                >
                  Or Inquire via Email Form
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/60 text-[11px] text-slate-500 dark:text-slate-400 flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <span>
            <strong>Production Note:</strong> Design packages include digital vector PDF and high-res print files with standard crop marks and bleeds. Physical acrylic stands and printing materials are produced at your local print shop.
          </span>
        </div>
      </div>
    </div>
  );
};
