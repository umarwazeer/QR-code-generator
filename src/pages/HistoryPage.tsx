import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  History,
  Search,
  Filter,
  Trash2,
  Edit2,
  Check,
  RotateCcw,
  Download,
  Eye,
  Shield,
  Clock,
  Sparkles,
  ArrowUpDown,
  X,
  FileDown,
  Settings,
  AlertTriangle,
  QrCode,
  HardDrive,
  Info,
} from 'lucide-react';
import { QrHistoryEntry, QrType } from '../types/qr';
import {
  getHistory,
  deleteHistoryEntry,
  renameHistoryEntry,
  clearAllHistory,
  getHistorySettings,
  updateHistorySettings,
  getHistoryStats,
  exportHistoryJson,
} from '../lib/history/historyStorage';
import { downloadPng, sanitizeFilename } from '../lib/export/exportQr';
import { HistoryItemPreviewModal } from '../components/history/HistoryItemPreviewModal';
import { useToast } from '../components/ui/Toast';

export const HistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [entries, setEntries] = useState<QrHistoryEntry[]>([]);
  const [settings, setSettings] = useState(getHistorySettings());
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  // Modals & confirmation dialogs
  const [previewEntry, setPreviewEntry] = useState<QrHistoryEntry | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState<string>('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showSettingsDrawer, setShowSettingsDrawer] = useState(false);

  // SEO & noindex for private user data
  useEffect(() => {
    document.title = 'Private QR Code History – QR Studio';
    window.scrollTo(0, 0);

    // Add temporary noindex meta tag for privacy
    let metaTag = document.querySelector('meta[name="robots"]');
    let addedMeta = false;
    if (!metaTag) {
      metaTag = document.createElement('meta');
      metaTag.setAttribute('name', 'robots');
      document.head.appendChild(metaTag);
      addedMeta = true;
    }
    const prevRobots = metaTag.getAttribute('content');
    metaTag.setAttribute('content', 'noindex, nofollow');

    return () => {
      if (addedMeta && metaTag?.parentNode) {
        metaTag.parentNode.removeChild(metaTag);
      } else if (metaTag && prevRobots) {
        metaTag.setAttribute('content', prevRobots);
      }
    };
  }, []);

  const refreshData = () => {
    setEntries(getHistory());
    setSettings(getHistorySettings());
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Filtered & sorted entries
  const filteredEntries = useMemo(() => {
    const result = entries.filter((item) => {
      if (typeFilter !== 'all' && item.type !== typeFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesType = item.type.toLowerCase().includes(q);
        const matchesPayload = item.rawPayload.toLowerCase().includes(q);
        const matchesSummary = item.summary?.toLowerCase().includes(q);
        const matchesTemplate = item.templateName?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesType && !matchesPayload && !matchesSummary && !matchesTemplate) {
          return false;
        }
      }
      return true;
    });

    return result.sort((a, b) => {
      return sortOrder === 'newest' ? b.timestamp - a.timestamp : a.timestamp - b.timestamp;
    });
  }, [entries, search, typeFilter, sortOrder]);

  // Type count mapping
  const typeCounts = useMemo(() => {
    const map: Record<string, number> = { all: entries.length };
    entries.forEach((e) => {
      map[e.type] = (map[e.type] || 0) + 1;
    });
    return map;
  }, [entries]);

  // Rename action
  const handleSaveRename = (id: string) => {
    if (!editTitle.trim()) {
      setEditingId(null);
      return;
    }
    renameHistoryEntry(id, editTitle);
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, title: editTitle.trim() } : e)));
    setEditingId(null);
    showToast('Renamed record', 'success');
  };

  // Delete single action
  const handleConfirmDelete = (id: string) => {
    deleteHistoryEntry(id);
    setEntries((prev) => prev.filter((e) => e.id !== id));
    setDeleteConfirmId(null);
    showToast('Removed record from local history', 'info');
  };

  // Clear all action
  const handleConfirmClearAll = () => {
    clearAllHistory();
    setEntries([]);
    setShowClearConfirm(false);
    showToast('All local QR history cleared', 'info');
  };

  // Quick download PNG
  const handleQuickDownloadPng = async (entry: QrHistoryEntry) => {
    try {
      const sanitized = sanitizeFilename(entry.title || `${entry.type}-qr`, 'qr-code');
      await downloadPng(entry.rawPayload, entry.customization, sanitized, 1024);
      showToast(`Downloaded ${sanitized}.png`, 'success');
    } catch {
      showToast('Failed to export image', 'error');
    }
  };

  // Export JSON backup
  const handleExportBackup = () => {
    try {
      const json = exportHistoryJson();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `qr-studio-history-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 2000);
      showToast('Exported history backup JSON', 'success');
    } catch {
      showToast('Failed to export backup', 'error');
    }
  };

  const stats = useMemo(() => getHistoryStats(), [entries, settings]);

  const qrTypesList: { id: string; label: string }[] = [
    { id: 'all', label: 'All Types' },
    { id: 'url', label: 'Website URL' },
    { id: 'wifi', label: 'Wi-Fi' },
    { id: 'vcard', label: 'vCard' },
    { id: 'email', label: 'Email' },
    { id: 'phone', label: 'Phone' },
    { id: 'sms', label: 'SMS' },
    { id: 'whatsapp', label: 'WhatsApp' },
    { id: 'location', label: 'Location' },
    { id: 'event', label: 'Event' },
    { id: 'social', label: 'Social' },
    { id: 'text', label: 'Plain Text' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 transition-colors">
      {/* Header Banner */}
      <section className="relative border-b border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/40 backdrop-blur-md pt-10 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-3 border border-indigo-200/60 dark:border-indigo-800/60">
                <Shield className="w-3.5 h-3.5 text-emerald-500" />
                <span>100% Client-Side Private History</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                Recently Generated QR Codes
              </h1>
              <p className="mt-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
                Revisit, preview, re-download, or restore previously generated QR codes. Everything is stored
                strictly inside this browser with zero external server transmission.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2.5 flex-wrap shrink-0">
              <button
                type="button"
                onClick={() => setShowSettingsDrawer(true)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
              >
                <Settings className="w-4 h-4 text-slate-500" />
                <span>Storage Settings</span>
              </button>

              <button
                type="button"
                onClick={handleExportBackup}
                disabled={entries.length === 0}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
              >
                <FileDown className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Export JSON</span>
              </button>

              <Link
                to="/generator"
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-all flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Create New QR</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Controls Toolbar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search history by title, URL, template, or payload..."
              className="w-full pl-10 pr-9 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 shadow-2xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Secondary Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Filter by Type */}
            <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 shadow-2xs">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="bg-transparent text-xs font-medium text-slate-700 dark:text-slate-300 outline-none cursor-pointer pr-2"
                aria-label="Filter by QR type"
              >
                {qrTypesList.map((t) => (
                  <option key={t.id} value={t.id} className="dark:bg-slate-900">
                    {t.label} ({typeCounts[t.id] || 0})
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Order */}
            <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 shadow-2xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
                className="bg-transparent text-xs font-medium text-slate-700 dark:text-slate-300 outline-none cursor-pointer pr-2"
                aria-label="Sort order"
              >
                <option value="newest" className="dark:bg-slate-900">Newest First</option>
                <option value="oldest" className="dark:bg-slate-900">Oldest First</option>
              </select>
            </div>

            {/* Clear All Trigger */}
            {entries.length > 0 && (
              <button
                type="button"
                onClick={() => setShowClearConfirm(true)}
                className="px-3 py-2 rounded-xl text-xs font-medium border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear All ({entries.length})</span>
                <span className="sm:hidden">Clear</span>
              </button>
            )}
          </div>
        </div>

        {/* Master History Status Banner */}
        {!settings.enabled && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-800 dark:text-amber-300 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Local history tracking is paused.</strong> New codes you generate will not be saved until you re-enable tracking.
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                updateHistorySettings({ enabled: true });
                setSettings((s) => ({ ...s, enabled: true }));
                showToast('History tracking enabled', 'success');
              }}
              className="px-3 py-1 rounded-lg bg-amber-600 text-white font-semibold text-xs shrink-0 cursor-pointer"
            >
              Turn On
            </button>
          </div>
        )}

        {/* Entries Content */}
        {entries.length === 0 ? (
          /* Empty State */
          <div className="py-24 text-center rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 p-6">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center mb-4 shadow-xs">
              <History className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              No QR Codes Saved Yet
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-1.5 leading-relaxed">
              When you download or bookmark codes in the QR Generator, they will automatically be preserved
              here in your browser for quick re-exporting and editing.
            </p>
            <div className="mt-6 flex justify-center">
              <Link
                to="/generator"
                className="px-5 py-2.5 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Create Your First QR Code</span>
              </Link>
            </div>
          </div>
        ) : filteredEntries.length === 0 ? (
          /* Search / Filter Zero Results */
          <div className="py-20 text-center rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 p-6">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              No history records match your search & filter criteria.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setTypeFilter('all');
              }}
              className="mt-3 text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline cursor-pointer"
            >
              Reset search & filters
            </button>
          </div>
        ) : (
          /* Records List Table / Cards */
          <div className="space-y-3">
            {filteredEntries.map((item) => {
              const isDeleting = deleteConfirmId === item.id;
              const isEditing = editingId === item.id;
              const formattedDate = new Date(item.timestamp).toLocaleString(undefined, {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-400/80 dark:hover:border-indigo-500/80 shadow-2xs hover:shadow-sm transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  {/* Left: QR Thumbnail & Details */}
                  <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
                    {/* Small Color Swatch Avatar */}
                    <div
                      className="w-12 h-12 rounded-xl border border-slate-200 dark:border-slate-800 shrink-0 flex items-center justify-center shadow-xs cursor-pointer group"
                      onClick={() => setPreviewEntry(item)}
                      title="Click to view QR preview"
                      style={{
                        backgroundColor: item.customization.transparentBackground
                          ? '#ffffff'
                          : item.customization.backgroundColor || '#ffffff',
                      }}
                    >
                      <div
                        className="w-6 h-6 rounded-md flex items-center justify-center text-white"
                        style={{
                          backgroundColor: item.customization.foregroundColor || '#0f172a',
                        }}
                      >
                        <QrCode className="w-3.5 h-3.5 opacity-90" />
                      </div>
                    </div>

                    {/* Metadata details */}
                    <div className="min-w-0 flex-1">
                      {isEditing ? (
                        <div className="flex items-center gap-2 max-w-sm">
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSaveRename(item.id)}
                            className="w-full px-2 py-1 text-xs font-semibold rounded-lg border border-indigo-500 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={() => handleSaveRename(item.id)}
                            className="p-1 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950 cursor-pointer"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3
                            className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate cursor-pointer hover:text-indigo-600 transition-colors"
                            onClick={() => setPreviewEntry(item)}
                          >
                            {item.title}
                          </h3>
                          <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                            {item.type}
                          </span>
                          {item.templateName && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-800/50">
                              {item.templateName}
                            </span>
                          )}
                          {item.isSensitive && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border border-amber-200/50">
                              Wi-Fi (Protected)
                            </span>
                          )}
                        </div>
                      )}

                      {/* Summary & Date */}
                      <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1 text-[11px]">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{formattedDate}</span>
                        </span>
                        <span>·</span>
                        <span className="truncate max-w-xs sm:max-w-md font-medium text-slate-700 dark:text-slate-300">
                          {item.summary || item.rawPayload}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-1.5 shrink-0 self-end md:self-center">
                    {/* Inspect */}
                    <button
                      type="button"
                      onClick={() => setPreviewEntry(item)}
                      className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Inspect & preview"
                      aria-label="Inspect & preview"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {/* Quick PNG download */}
                    <button
                      type="button"
                      onClick={() => handleQuickDownloadPng(item)}
                      className="p-2 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Download PNG"
                      aria-label="Download PNG"
                    >
                      <Download className="w-4 h-4" />
                    </button>

                    {/* Edit title */}
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(item.id);
                        setEditTitle(item.title);
                      }}
                      className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Rename record"
                      aria-label="Rename record"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    {/* Delete action with confirmation */}
                    {isDeleting ? (
                      <div className="flex items-center gap-1 bg-rose-50 dark:bg-rose-950/60 p-1 rounded-xl border border-rose-200 dark:border-rose-900">
                        <button
                          type="button"
                          onClick={() => handleConfirmDelete(item.id)}
                          className="px-2 py-1 text-[11px] font-bold bg-rose-600 text-white rounded-lg cursor-pointer"
                        >
                          Delete
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(null)}
                          className="px-1.5 py-1 text-[11px] text-slate-600 dark:text-slate-300 hover:underline cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(item.id)}
                        className="p-2 text-slate-400 hover:text-rose-500 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                        title="Delete record"
                        aria-label="Delete record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}

                    {/* Edit & Regenerate in Editor */}
                    <button
                      type="button"
                      onClick={() => navigate(`/generator?loadHistory=${item.id}`)}
                      className="ml-1 px-3 py-1.5 text-xs font-semibold rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/70 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Edit & Regenerate</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Item Preview Modal */}
      {previewEntry && (
        <HistoryItemPreviewModal
          entry={previewEntry}
          onClose={() => setPreviewEntry(null)}
          onEdit={(entry) => navigate(`/generator?loadHistory=${entry.id}`)}
        />
      )}

      {/* Clear All Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 mx-auto flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-center text-slate-900 dark:text-white">
              Clear All Saved QR History?
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-2 leading-relaxed">
              This will permanently delete all {entries.length} stored records from this browser. This action
              cannot be undone.
            </p>

            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmClearAll}
                className="flex-1 px-4 py-2 text-xs font-semibold rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-xs cursor-pointer"
              >
                Yes, Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings & Privacy Drawer */}
      {showSettingsDrawer && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                    History & Privacy Settings
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Control how records are stored in this browser
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowSettingsDrawer(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {/* Storage Summary */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <HardDrive className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Saved Records:</span>
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {stats.count} / {stats.maxItems} max
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Estimated Browser Storage:</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">
                    {(stats.estimatedBytes / 1024).toFixed(1)} KB
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Protected Wi-Fi Records:</span>
                  <span className="font-medium text-amber-600">
                    {stats.sensitiveCount} records
                  </span>
                </div>
              </div>

              {/* Master Switch */}
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-900 dark:text-white block">
                      Enable Local History
                    </label>
                    <p className="text-[11px] text-slate-500">
                      Temporarily pause or activate QR history recording
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.enabled}
                    onChange={(e) => {
                      const updated = updateHistorySettings({ enabled: e.target.checked });
                      setSettings(updated);
                    }}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-900 dark:text-white block">
                      Auto-Save on Download
                    </label>
                    <p className="text-[11px] text-slate-500">
                      Save to history automatically when you export PNG, SVG, or PDF
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.autoSaveOnDownload}
                    onChange={(e) => {
                      const updated = updateHistorySettings({ autoSaveOnDownload: e.target.checked });
                      setSettings(updated);
                    }}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-900 dark:text-white block">
                      Exclude Sensitive Wi-Fi Auto-Save
                    </label>
                    <p className="text-[11px] text-slate-500">
                      Skip automatic history saving for Wi-Fi codes with network credentials
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.excludeSensitivePayloads}
                    onChange={(e) => {
                      const updated = updateHistorySettings({ excludeSensitivePayloads: e.target.checked });
                      setSettings(updated);
                    }}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                </div>

                {/* Retention Limit */}
                <div>
                  <label className="text-xs font-semibold text-slate-900 dark:text-white block mb-1">
                    Maximum Stored Records
                  </label>
                  <p className="text-[11px] text-slate-500 mb-2">
                    Oldest records are automatically pruned when this threshold is reached.
                  </p>
                  <select
                    value={settings.maxItems}
                    onChange={(e) => {
                      const updated = updateHistorySettings({ maxItems: parseInt(e.target.value) });
                      setSettings(updated);
                    }}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                  >
                    <option value={25}>25 records</option>
                    <option value={50}>50 records (Recommended)</option>
                    <option value={100}>100 records</option>
                  </select>
                </div>
              </div>

              {/* Privacy Notice */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 space-y-1.5 leading-relaxed">
                <span className="font-semibold text-slate-700 dark:text-slate-300 block flex items-center gap-1">
                  <Info className="w-3.5 h-3.5 text-indigo-500" />
                  Privacy Guarantee
                </span>
                <p>
                  QR Studio uses your browser&apos;s local storage. Your generated codes, links, contacts, and Wi-Fi
                  credentials never leave this device.
                </p>
                <p>
                  If you clear your browser site data or cookies, local history will be removed. Use the &quot;Export JSON&quot; button anytime to download a backup.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex justify-end">
              <button
                type="button"
                onClick={() => setShowSettingsDrawer(false)}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
