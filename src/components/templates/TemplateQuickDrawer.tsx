import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { X, Search, Sparkles, LayoutTemplate, ArrowRight, Heart } from 'lucide-react';
import { QR_TEMPLATES } from '../../data/qrTemplates';
import { QrTemplate, TEMPLATE_CATEGORIES, TemplateCategory } from '../../types/template';
import { getFavoriteTemplateIds } from '../../lib/storage/templateFavorites';

interface TemplateQuickDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: QrTemplate) => void;
  activeTemplateId?: string;
}

export const TemplateQuickDrawer: React.FC<TemplateQuickDrawerProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
  activeTemplateId,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory>('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const favoriteIds = useMemo(() => (isOpen ? getFavoriteTemplateIds() : []), [isOpen]);

  const filteredTemplates = useMemo(() => {
    return QR_TEMPLATES.filter((tpl) => {
      if (showFavoritesOnly && !favoriteIds.includes(tpl.id)) return false;
      if (selectedCategory !== 'all' && tpl.category !== selectedCategory) return false;
      if (search.trim()) {
        const query = search.toLowerCase();
        const matchesName = tpl.name.toLowerCase().includes(query);
        const matchesDesc = tpl.description.toLowerCase().includes(query);
        const matchesTags = tpl.tags.some((t) => t.toLowerCase().includes(query));
        if (!matchesName && !matchesDesc && !matchesTags) return false;
      }
      return true;
    });
  }, [search, selectedCategory, showFavoritesOnly, favoriteIds]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
              <LayoutTemplate className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                QR Design Templates
              </h3>
              <p className="text-[11px] text-slate-500">
                1-Click apply • Preserves your active QR link
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Category Filter */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800/80 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, style, or use case..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400"
            />
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              type="button"
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className={`px-2.5 py-1 text-[11px] font-medium rounded-lg shrink-0 flex items-center gap-1 transition-colors cursor-pointer ${
                showFavoritesOnly
                  ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400 border border-rose-200'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              <Heart className={`w-3 h-3 ${showFavoritesOnly ? 'fill-rose-500' : ''}`} />
              <span>Favorites</span>
            </button>

            {TEMPLATE_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setShowFavoritesOnly(false);
                }}
                className={`px-2.5 py-1 text-[11px] font-medium rounded-lg shrink-0 transition-colors cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat.id && !showFavoritesOnly
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat.shortLabel}
              </button>
            ))}
          </div>
        </div>

        {/* Template List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <p className="text-xs font-medium">No templates found</p>
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setSelectedCategory('all');
                  setShowFavoritesOnly(false);
                }}
                className="mt-2 text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline cursor-pointer"
              >
                Reset filters
              </button>
            </div>
          ) : (
            filteredTemplates.map((template) => {
              const isActive = activeTemplateId === template.id;
              return (
                <div
                  key={template.id}
                  onClick={() => {
                    onSelectTemplate(template);
                    onClose();
                  }}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isActive
                      ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40 ring-1 ring-indigo-500'
                      : 'border-slate-200/80 dark:border-slate-800 hover:border-indigo-400 bg-white dark:bg-slate-950/60'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Visual Color Preview Pill */}
                    <div
                      className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-800 shrink-0 flex items-center justify-center shadow-xs"
                      style={{
                        backgroundColor: template.customization.transparentBackground
                          ? '#ffffff'
                          : template.customization.backgroundColor || '#ffffff',
                      }}
                    >
                      <div
                        className="w-5 h-5 rounded-md"
                        style={{
                          backgroundColor: template.customization.foregroundColor,
                        }}
                      />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-xs text-slate-900 dark:text-white truncate">
                          {template.name}
                        </span>
                        {isActive && (
                          <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-950 px-1.5 py-0.2 rounded">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {template.recommendedFor}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="p-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-xs font-semibold shrink-0"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Link to Dedicated Library */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex items-center justify-between">
          <Link
            to="/templates"
            onClick={onClose}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1.5"
          >
            <span>Open Full Template Library (28+ Designs)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
