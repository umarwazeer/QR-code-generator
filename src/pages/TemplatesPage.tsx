import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Search,
  SlidersHorizontal,
  Sparkles,
  LayoutTemplate,
  Heart,
  X,
  ArrowUpDown,
  Building2,
  UtensilsCrossed,
  ShoppingBag,
  User,
  Share2,
  Wifi,
  Calendar,
  Minimize2,
  Palette,
  CheckCircle2,
} from 'lucide-react';
import { QR_TEMPLATES } from '../data/qrTemplates';
import {
  QrTemplate,
  TEMPLATE_CATEGORIES,
  TEMPLATE_STYLES,
  TemplateCategory,
  TemplateStyle,
  TemplateSortOption,
} from '../types/template';
import { TemplatePreviewCard } from '../components/templates/TemplatePreviewCard';
import { TemplateDetailModal } from '../components/templates/TemplateDetailModal';
import {
  getFavoriteTemplateIds,
  recordRecentTemplate,
} from '../lib/storage/templateFavorites';
import { useToast } from '../components/ui/Toast';

export const TemplatesPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { showToast } = useToast();

  // Search & Filter State
  const initialCategory = (searchParams.get('category') as TemplateCategory) || 'all';
  const initialStyle = (searchParams.get('style') as TemplateStyle) || 'all';
  const initialSearch = searchParams.get('q') || '';
  const initialSort = (searchParams.get('sort') as TemplateSortOption) || 'recommended';

  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState<TemplateCategory>(initialCategory);
  const [styleFilter, setStyleFilter] = useState<TemplateStyle>(initialStyle);
  const [sortOption, setSortOption] = useState<TemplateSortOption>(initialSort);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [inspectedTemplate, setInspectedTemplate] = useState<QrTemplate | null>(null);

  // Sync title and SEO
  useEffect(() => {
    document.title = 'QR Code Templates Library – 28+ Ready-Made Designs | QR Studio';
    window.scrollTo(0, 0);
  }, []);

  // Update query params as filters change
  const handleCategorySelect = (newCat: TemplateCategory) => {
    setCategory(newCat);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (newCat === 'all') next.delete('category');
      else next.set('category', newCat);
      return next;
    });
  };

  const handleStyleSelect = (newStyle: TemplateStyle) => {
    setStyleFilter(newStyle);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (newStyle === 'all') next.delete('style');
      else next.set('style', newStyle);
      return next;
    });
  };

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (!val.trim()) next.delete('q');
      else next.set('q', val.trim());
      return next;
    });
  };

  // Favorites tracking
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  useEffect(() => {
    setFavoriteIds(getFavoriteTemplateIds());
  }, []);

  // Category counts
  const categoryCounts = useMemo(() => {
    const map: Record<string, number> = { all: QR_TEMPLATES.length };
    QR_TEMPLATES.forEach((t) => {
      map[t.category] = (map[t.category] || 0) + 1;
    });
    return map;
  }, []);

  // Filter & Sort Logic
  const filteredTemplates = useMemo(() => {
    const result = QR_TEMPLATES.filter((tpl) => {
      // Favorites filter
      if (favoritesOnly && !favoriteIds.includes(tpl.id)) {
        return false;
      }
      // Category filter
      if (category !== 'all' && tpl.category !== category) {
        return false;
      }
      // Style filter
      if (styleFilter !== 'all' && tpl.styleTag !== styleFilter) {
        return false;
      }
      // Search query
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const matchesName = tpl.name.toLowerCase().includes(q);
        const matchesDesc = tpl.description.toLowerCase().includes(q);
        const matchesUse = tpl.recommendedFor.toLowerCase().includes(q);
        const matchesTags = tpl.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesName && !matchesDesc && !matchesUse && !matchesTags) {
          return false;
        }
      }
      return true;
    });

    // Sorting
    return result.sort((a, b) => {
      if (sortOption === 'name-asc') {
        return a.name.localeCompare(b.name);
      }
      if (sortOption === 'name-desc') {
        return b.name.localeCompare(a.name);
      }
      if (sortOption === 'popular') {
        return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0);
      }
      // Recommended: popular first, then high contrast
      if (a.isPopular && !b.isPopular) return -1;
      if (!a.isPopular && b.isPopular) return 1;
      return (b.contrastRatio || 10) - (a.contrastRatio || 10);
    });
  }, [category, styleFilter, search, sortOption, favoritesOnly, favoriteIds]);

  // Apply action
  const handleApplyTemplate = (tpl: QrTemplate) => {
    recordRecentTemplate(tpl.id);
    showToast(`Loaded ${tpl.name} template copy and colors`, 'info');
    navigate(`/generator?template=${tpl.id}`);
  };

  const handleClearFilters = () => {
    setSearch('');
    setCategory('all');
    setStyleFilter('all');
    setSortOption('recommended');
    setFavoritesOnly(false);
    setSearchParams(new URLSearchParams());
  };

  const hasActiveFilters =
    search.trim() !== '' ||
    category !== 'all' ||
    styleFilter !== 'all' ||
    favoritesOnly ||
    sortOption !== 'recommended';

  // Category Icon helper
  const renderCategoryIcon = (catId: TemplateCategory) => {
    switch (catId) {
      case 'business':
        return <Building2 className="w-3.5 h-3.5" />;
      case 'restaurant':
        return <UtensilsCrossed className="w-3.5 h-3.5" />;
      case 'retail':
        return <ShoppingBag className="w-3.5 h-3.5" />;
      case 'personal':
        return <User className="w-3.5 h-3.5" />;
      case 'social':
        return <Share2 className="w-3.5 h-3.5" />;
      case 'wifi':
        return <Wifi className="w-3.5 h-3.5" />;
      case 'events':
        return <Calendar className="w-3.5 h-3.5" />;
      case 'minimal':
        return <Minimize2 className="w-3.5 h-3.5" />;
      case 'creative':
        return <Palette className="w-3.5 h-3.5" />;
      default:
        return <LayoutTemplate className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 transition-colors">
      {/* Hero Header */}
      <section className="relative border-b border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/40 backdrop-blur-md pt-10 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-3 border border-indigo-200/60 dark:border-indigo-800/60">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ready-Made Design Library</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              QR Code Template Library
            </h1>
            <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
              28+ professionally engineered, high-contrast QR designs across 10 business categories.
              Click any template to apply its styling directly to your custom QR payload with zero data loss.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-6 text-xs text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                28 Genuinely Distinct Designs
              </span>
              <span className="text-slate-300 dark:text-slate-700">·</span>
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                10 Industry Categories
              </span>
              <span className="text-slate-300 dark:text-slate-700">·</span>
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                100% Free & No Expirations
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Controls Bar: Search, Style Filter, Sort, Favorites */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search 28+ templates (e.g. coffee, restaurant, gradient)..."
              className="w-full pl-10 pr-9 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 shadow-2xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
            />
            {search && (
              <button
                type="button"
                onClick={() => handleSearchChange('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Secondary Filters: Style, Sort, Favorites */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Style Selector */}
            <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 shadow-2xs">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={styleFilter}
                onChange={(e) => handleStyleSelect(e.target.value as TemplateStyle)}
                className="bg-transparent text-xs font-medium text-slate-700 dark:text-slate-300 outline-none cursor-pointer pr-2"
                aria-label="Filter by visual style"
              >
                {TEMPLATE_STYLES.map((style) => (
                  <option key={style.id} value={style.id} className="dark:bg-slate-900">
                    {style.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 shadow-2xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as TemplateSortOption)}
                className="bg-transparent text-xs font-medium text-slate-700 dark:text-slate-300 outline-none cursor-pointer pr-2"
                aria-label="Sort templates"
              >
                <option value="recommended" className="dark:bg-slate-900">Recommended</option>
                <option value="popular" className="dark:bg-slate-900">Most Popular</option>
                <option value="name-asc" className="dark:bg-slate-900">Name: A to Z</option>
                <option value="name-desc" className="dark:bg-slate-900">Name: Z to A</option>
              </select>
            </div>

            {/* Favorites Toggle */}
            <button
              type="button"
              onClick={() => setFavoritesOnly(!favoritesOnly)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-colors cursor-pointer shadow-2xs ${
                favoritesOnly
                  ? 'bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${favoritesOnly ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
              <span>Favorites</span>
              {favoriteIds.length > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  {favoriteIds.length}
                </span>
              )}
            </button>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium px-2 py-1 cursor-pointer"
              >
                Reset filters
              </button>
            )}
          </div>
        </div>

        {/* Category Tabs Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-6 scrollbar-none">
          {TEMPLATE_CATEGORIES.map((cat) => {
            const count = categoryCounts[cat.id] || 0;
            const isSelected = category === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategorySelect(cat.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border shadow-2xs shrink-0 ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {renderCategoryIcon(cat.id)}
                <span>{cat.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between pb-4">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Showing <strong className="text-slate-900 dark:text-white">{filteredTemplates.length}</strong>{' '}
            templates
            {category !== 'all' && (
              <> in <strong className="text-slate-900 dark:text-white">{category}</strong></>
            )}
            {search && <> matching &quot;{search}&quot;</>}
          </p>
        </div>

        {/* Templates Grid */}
        {filteredTemplates.length === 0 ? (
          <div className="py-20 text-center rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center mb-3">
              <LayoutTemplate className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              No matching QR templates found
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Try adjusting your search keywords, clearing your style filters, or exploring all categories.
            </p>
            <button
              type="button"
              onClick={handleClearFilters}
              className="mt-4 px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors cursor-pointer"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTemplates.map((template) => (
              <TemplatePreviewCard
                key={template.id}
                template={template}
                onApply={handleApplyTemplate}
                onInspect={(tpl) => setInspectedTemplate(tpl)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Inspect Detail Modal */}
      {inspectedTemplate && (
        <TemplateDetailModal
          template={inspectedTemplate}
          onClose={() => setInspectedTemplate(null)}
          onApply={handleApplyTemplate}
        />
      )}
    </div>
  );
};
