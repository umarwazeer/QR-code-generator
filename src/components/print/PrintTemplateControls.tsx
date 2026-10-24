import React, { useRef } from 'react';
import {
  CreditCard,
  FileSpreadsheet,
  Columns3,
  Upload,
  X,
  RotateCcw,
  Scissors,
  Palette,
  Sparkles,
} from 'lucide-react';
import {
  PrintTemplateConfig,
  PrintTemplateType,
  PRINT_TEMPLATE_PRESETS,
} from '../../types/printTemplate';

interface PrintTemplateControlsProps {
  config: PrintTemplateConfig;
  onChange: (updater: (prev: PrintTemplateConfig) => PrintTemplateConfig) => void;
  onSelectTemplate: (type: PrintTemplateType) => void;
  onResetDefaults: () => void;
}

const COLOR_PALETTES = [
  { name: 'Indigo', primary: '#4f46e5', secondary: '#e0e7ff' },
  { name: 'Emerald', primary: '#059669', secondary: '#d1fae5' },
  { name: 'Amber', primary: '#d97706', secondary: '#fef3c7' },
  { name: 'Rose', primary: '#e11d48', secondary: '#ffe4e6' },
  { name: 'Slate', primary: '#1e293b', secondary: '#f1f5f9' },
  { name: 'Sky', primary: '#0284c7', secondary: '#e0f2fe' },
];

export const PrintTemplateControls: React.FC<PrintTemplateControlsProps> = ({
  config,
  onChange,
  onSelectTemplate,
  onResetDefaults,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFieldChange = (field: keyof PrintTemplateConfig, value: unknown) => {
    onChange((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp'].includes(file.type)) {
      alert('Please upload a valid image file (PNG, JPG, SVG, WebP)');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('Logo file must be under 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      handleFieldChange('logoUrl', reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      {/* 1. Template Presets Selector */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
              1. Select Print Template
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Choose a standardized print layout formatted for physical production
            </p>
          </div>

          <button
            type="button"
            onClick={onResetDefaults}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Reset to template defaults"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
        </div>

        {/* 3 Layout Option Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Business Card */}
          <button
            type="button"
            onClick={() => onSelectTemplate('business-card')}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
              config.templateType === 'business-card'
                ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 ring-2 ring-indigo-600/20'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
            }`}
          >
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold text-sm text-slate-900 dark:text-white">Business Card</div>
                <div className="text-[11px] text-slate-500 font-mono mt-0.5">3.5" × 2" (88.9 × 50.8 mm)</div>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">
                Executive networking card with credentials, contacts, and framed QR code.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] font-medium text-indigo-600 dark:text-indigo-400">
              Wallet & Holder Ready
            </div>
          </button>

          {/* Promotional Flyer */}
          <button
            type="button"
            onClick={() => onSelectTemplate('flyer')}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
              config.templateType === 'flyer'
                ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 ring-2 ring-indigo-600/20'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
            }`}
          >
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <FileSpreadsheet className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold text-sm text-slate-900 dark:text-white">Promotional Flyer</div>
                <div className="text-[11px] text-slate-500 font-mono mt-0.5">A4 (210 × 297 mm)</div>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">
                High-visibility marketing sheet with bold header, highlight bullets, and scan CTA.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
              Storefront & Bulletin Print
            </div>
          </button>

          {/* Table Tent Card */}
          <button
            type="button"
            onClick={() => onSelectTemplate('tent-card')}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
              config.templateType === 'tent-card'
                ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 ring-2 ring-indigo-600/20'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
            }`}
          >
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Columns3 className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold text-sm text-slate-900 dark:text-white">Table Tent Card</div>
                <div className="text-[11px] text-slate-500 font-mono mt-0.5">4" × 6" (101.6 × 152.4 mm)</div>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">
                Stand-ready counter card with station/table number, menu prompt, and fold marks.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] font-medium text-amber-600 dark:text-amber-400">
              Tables, Cafes & Stands
            </div>
          </button>
        </div>
      </div>

      {/* 2. Color & Styling Customization */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
              2. Palette & Print Guides
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Customize accent branding and production trim guidelines
            </p>
          </div>
          <Palette className="w-4 h-4 text-slate-400" />
        </div>

        {/* Quick Swatches */}
        <div className="space-y-2">
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
            Brand Accent Color
          </label>
          <div className="flex flex-wrap items-center gap-2">
            {COLOR_PALETTES.map((pal) => (
              <button
                key={pal.name}
                type="button"
                onClick={() => {
                  onChange((prev) => ({
                    ...prev,
                    primaryColor: pal.primary,
                    secondaryColor: pal.secondary,
                  }));
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                  config.primaryColor.toLowerCase() === pal.primary.toLowerCase()
                    ? 'border-slate-900 dark:border-white bg-slate-50 dark:bg-slate-800 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <span
                  className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0"
                  style={{ backgroundColor: pal.primary }}
                />
                <span className="text-slate-800 dark:text-slate-200">{pal.name}</span>
              </button>
            ))}

            {/* Custom Color Input */}
            <div className="flex items-center gap-1.5 ml-1">
              <input
                type="color"
                value={config.primaryColor}
                onChange={(e) => handleFieldChange('primaryColor', e.target.value)}
                className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 p-0.5 bg-transparent cursor-pointer"
                title="Custom accent color"
              />
              <span className="font-mono text-xs text-slate-500">{config.primaryColor}</span>
            </div>
          </div>
        </div>

        {/* Crop & Fold Guides Toggle */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center">
              <Scissors className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-900 dark:text-white block">
                Include Cut & Crop Guides
              </span>
              <p className="text-[11px] text-slate-500 leading-snug">
                Renders corner marks on canvas and PDF for clean scissors or guillotine trimming
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config.includeCutGuides}
              onChange={(e) => handleFieldChange('includeCutGuides', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600" />
          </label>
        </div>

        {/* Brand Logo Upload */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
            Brand Logo (Optional)
          </label>
          <div className="flex items-center gap-3">
            {config.logoUrl ? (
              <div className="relative group">
                <img
                  src={config.logoUrl}
                  alt="Uploaded brand logo"
                  className="w-12 h-12 rounded-xl object-contain border border-slate-200 dark:border-slate-700 p-1 bg-white"
                />
                <button
                  type="button"
                  onClick={() => handleFieldChange('logoUrl', undefined)}
                  className="absolute -top-1.5 -right-1.5 p-1 bg-rose-500 hover:bg-rose-600 text-white rounded-full shadow-xs cursor-pointer"
                  title="Remove logo"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl border border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 text-slate-600 dark:text-slate-300 hover:bg-indigo-50/30 transition-colors cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Logo (PNG, JPG, SVG)</span>
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleLogoUpload}
            />
          </div>
        </div>
      </div>

      {/* 3. Text & Copy Content Fields */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
            3. Template Content & Copy
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Fill in the information to print alongside your generated QR code
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Business / Individual Name */}
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              {config.templateType === 'business-card' ? 'Full Name / Company' : 'Business / Brand Name'}
            </label>
            <input
              type="text"
              value={config.businessName}
              onChange={(e) => handleFieldChange('businessName', e.target.value)}
              placeholder="e.g. Alex Morgan / Apex Studio"
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Tagline / Title */}
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              {config.templateType === 'business-card' ? 'Job Title / Designation' : 'Tagline / Category'}
            </label>
            <input
              type="text"
              value={config.tagline}
              onChange={(e) => handleFieldChange('tagline', e.target.value)}
              placeholder="e.g. Design Consultant / Artisan Coffee"
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Tent Card Table / Station Number */}
        {config.templateType === 'tent-card' && (
          <div className="p-3 bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/60 rounded-xl space-y-1.5">
            <label className="block text-xs font-bold text-amber-900 dark:text-amber-300">
              Table / Counter Badge Identifier
            </label>
            <input
              type="text"
              value={config.tableNumber}
              onChange={(e) => handleFieldChange('tableNumber', e.target.value)}
              placeholder="e.g. TABLE 14 or RECEPTION or COUNTER 2"
              className="w-full px-3 py-2 text-sm rounded-lg border border-amber-300 dark:border-amber-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-mono font-semibold"
            />
            <p className="text-[11px] text-amber-800 dark:text-amber-400">
              Renders as a prominent station pill banner atop the table tent stand
            </p>
          </div>
        )}

        {/* Headline */}
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
            Main Action Headline
          </label>
          <input
            type="text"
            value={config.headline}
            onChange={(e) => handleFieldChange('headline', e.target.value)}
            placeholder="e.g. Scan to View Menu & Order / Connect With Me"
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Body Text / Highlight Bullets */}
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
            {config.templateType === 'flyer' ? 'Bullet Points / Promotion Highlights' : 'Supporting Subtext / Perks'}
          </label>
          <textarea
            rows={3}
            value={config.bodyText}
            onChange={(e) => handleFieldChange('bodyText', e.target.value)}
            placeholder="e.g. • Instant Mobile Access&#10;• Daily Specials & Discounts&#10;• Fast Contactless Ordering"
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Call to Action Note */}
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
            Call to Action Prompt (Printed Under QR)
          </label>
          <input
            type="text"
            value={config.ctaText}
            onChange={(e) => handleFieldChange('ctaText', e.target.value)}
            placeholder="e.g. Point smartphone camera at code • No app needed"
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Contact & Location Details */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <span className="text-xs font-semibold text-slate-900 dark:text-white block">
            Footer Contacts & Location
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={config.contactPhone}
                onChange={(e) => handleFieldChange('contactPhone', e.target.value)}
                placeholder="+1 (415) 555-0199"
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
                Email Address
              </label>
              <input
                type="text"
                value={config.contactEmail}
                onChange={(e) => handleFieldChange('contactEmail', e.target.value)}
                placeholder="contact@business.com"
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
                Website / Social URL
              </label>
              <input
                type="text"
                value={config.contactWebsite}
                onChange={(e) => handleFieldChange('contactWebsite', e.target.value)}
                placeholder="https://qr-studio-umar.vercel.app"
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
                Address or Wi-Fi Details
              </label>
              <input
                type="text"
                value={config.address}
                onChange={(e) => handleFieldChange('address', e.target.value)}
                placeholder="San Francisco, CA or Wi-Fi details"
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
