import React, { useRef, useState } from 'react';
import {
  Utensils,
  ShoppingBag,
  User,
  Sparkles,
  Hotel,
  Briefcase,
  Upload,
  Trash2,
  RotateCcw,
  Palette,
} from 'lucide-react';
import { BusinessCategory, BrandingConfig } from '../../types/businessBranding';
import { BUSINESS_CATEGORIES } from '../../lib/branding/categoryTemplates';

interface BusinessBrandingPanelProps {
  branding: BrandingConfig;
  onChange: (updated: BrandingConfig) => void;
  onSelectCategory: (category: BusinessCategory) => void;
}

const CATEGORY_ICONS: Record<BusinessCategory, React.ComponentType<{ className?: string }>> = {
  restaurant: Utensils,
  retail: ShoppingBag,
  freelancer: User,
  salon: Sparkles,
  hotel: Hotel,
  other: Briefcase,
};

export const BusinessBrandingPanel: React.FC<BusinessBrandingPanelProps> = ({
  branding,
  onChange,
  onSelectCategory,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [logoError, setLogoError] = useState<string | null>(null);

  const updateField = (field: keyof BrandingConfig, value: string) => {
    onChange({ ...branding, [field]: value });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLogoError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate MIME type
    const validTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      setLogoError('Please upload a valid image file (PNG, JPG, WebP, or SVG).');
      return;
    }

    // Validate size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setLogoError('Logo file size must be under 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      onChange({ ...branding, logoUrl: reader.result as string });
    };
    reader.onerror = () => {
      setLogoError('Failed to read image file. Please try another image.');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setLogoError(null);
    onChange({ ...branding, logoUrl: undefined });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleResetToCategoryTemplate = () => {
    const currentTpl = BUSINESS_CATEGORIES.find((c) => c.id === branding.category);
    if (!currentTpl) return;
    onChange({
      ...branding,
      heading: currentTpl.defaultHeading,
      subheading: currentTpl.defaultSubheading,
      badgeText: currentTpl.defaultBadge,
      callToAction: currentTpl.defaultCallToAction,
      primaryColor: currentTpl.defaultPrimaryColor,
      secondaryColor: currentTpl.defaultSecondaryColor,
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
            Business Identity & Category
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Choose your sector and tailor your branded promotional tabletop card
          </p>
        </div>

        <button
          type="button"
          onClick={handleResetToCategoryTemplate}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Reset to category default copy and colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset Defaults</span>
        </button>
      </div>

      {/* 6 Business Category Selection Grid */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Business Category
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {BUSINESS_CATEGORIES.map((cat) => {
            const Icon = CATEGORY_ICONS[cat.id];
            const isSelected = branding.category === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                className={`p-3 text-left rounded-xl border text-xs font-medium transition-all cursor-pointer flex items-center gap-2.5 ${
                  isSelected
                    ? 'bg-indigo-50/90 dark:bg-indigo-950/60 border-indigo-500 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500/20 shadow-xs'
                    : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div
                  className={`p-1.5 rounded-lg shrink-0 ${
                    isSelected
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <span className="block font-semibold truncate">{cat.name}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Brand Text Inputs */}
      <div className="space-y-4 pt-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Business Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Copper Kettle Cafe"
              value={branding.businessName}
              onChange={(e) => updateField('businessName', e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Category Badge Text
            </label>
            <input
              type="text"
              placeholder="e.g. Contactless Dining"
              value={branding.badgeText}
              onChange={(e) => updateField('badgeText', e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Card Main Action Headline
          </label>
          <input
            type="text"
            placeholder="e.g. Scan to View Our Menu"
            value={branding.heading}
            onChange={(e) => updateField('heading', e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Promotional Subheading / Special Offer
          </label>
          <input
            type="text"
            placeholder="e.g. Browse chef specials, beverages & enjoy 10% off lunch sets"
            value={branding.subheading}
            onChange={(e) => updateField('subheading', e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Footer Instruction / CTA
          </label>
          <input
            type="text"
            placeholder="e.g. Point camera to scan · No app required"
            value={branding.callToAction}
            onChange={(e) => updateField('callToAction', e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Brand Colors */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
          <Palette className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>Brand Color Harmony</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
              Primary Brand Color (QR & Accents)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={branding.primaryColor}
                onChange={(e) => updateField('primaryColor', e.target.value)}
                className="w-9 h-9 rounded-lg cursor-pointer border border-slate-200 dark:border-slate-700 p-0.5 bg-white dark:bg-slate-900"
              />
              <input
                type="text"
                value={branding.primaryColor}
                onChange={(e) => updateField('primaryColor', e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono uppercase rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
              Secondary Accent Color (Badge & Tint)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={branding.secondaryColor}
                onChange={(e) => updateField('secondaryColor', e.target.value)}
                className="w-9 h-9 rounded-lg cursor-pointer border border-slate-200 dark:border-slate-700 p-0.5 bg-white dark:bg-slate-900"
              />
              <input
                type="text"
                value={branding.secondaryColor}
                onChange={(e) => updateField('secondaryColor', e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono uppercase rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Brand Logo Upload */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
        <label className="block text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
          Company / Brand Logo
        </label>

        <input
          type="file"
          ref={fileInputRef}
          accept="image/png, image/jpeg, image/webp"
          onChange={handleLogoUpload}
          className="hidden"
        />

        {branding.logoUrl ? (
          <div className="flex items-center gap-4 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
            <img
              src={branding.logoUrl}
              alt="Uploaded brand logo"
              className="w-14 h-14 rounded-lg object-contain bg-white border border-slate-200 dark:border-slate-700 p-1"
            />
            <div className="flex-1 min-w-0">
              <span className="text-xs font-semibold text-slate-900 dark:text-white block truncate">
                Brand Logo Attached
              </span>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400">
                Rendered on both Promotional Card and QR Center
              </span>
            </div>
            <button
              type="button"
              onClick={handleRemoveLogo}
              className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
              title="Remove Logo"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 rounded-2xl p-5 text-center cursor-pointer transition-colors bg-slate-50/50 dark:bg-slate-950/30"
          >
            <div className="w-9 h-9 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center mb-1.5">
              <Upload className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-slate-900 dark:text-white block">
              Upload Business Logo (Optional)
            </span>
            <span className="text-[11px] text-slate-500 block mt-0.5">
              PNG, JPG, or WebP under 2MB (Square works best)
            </span>
          </div>
        )}

        {logoError && (
          <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300">
            {logoError}
          </div>
        )}
      </div>
    </div>
  );
};
