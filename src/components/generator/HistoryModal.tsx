import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  X,
  History,
  Trash2,
  Edit2,
  Check,
  RotateCcw,
  Shield,
  Clock,
  ExternalLink,
} from 'lucide-react';
import {
  getHistory,
  deleteHistoryEntry,
  renameHistoryEntry,
  clearAllHistory,
  isHistoryEnabled,
  setHistoryEnabled,
} from '../../lib/history/historyStorage';
import { QrHistoryEntry } from '../../types/qr';
import { useToast } from '../ui/Toast';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadEntry: (entry: QrHistoryEntry) => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  onLoadEntry,
}) => {
  const { showToast } = useToast();
  const [entries, setEntries] = useState<QrHistoryEntry[]>([]);
  const [enabled, setEnabled] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState<string>('');
  const [confirmClearAll, setConfirmClearAll] = useState<boolean>(false);

  const loadData = () => {
    setEnabled(isHistoryEnabled());
    setEntries(getHistory());
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
      setConfirmClearAll(false);
      setEditingId(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleToggleEnabled = (newVal: boolean) => {
    setHistoryEnabled(newVal);
    setEnabled(newVal);
    setEntries(getHistory());
    showToast(
      newVal
        ? 'Local history enabled (saved only in this browser)'
        : 'History disabled and cleared',
      'info'
    );
  };

  const handleDelete = (id: string) => {
    deleteHistoryEntry(id);
    setEntries((prev) => prev.filter((item) => item.id !== id));
    showToast('Removed entry from history', 'info');
  };

  const handleStartRename = (entry: QrHistoryEntry) => {
    setEditingId(entry.id);
    setEditTitle(entry.title);
  };

  const handleSaveRename = (id: string) => {
    renameHistoryEntry(id, editTitle);
    setEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, title: editTitle } : e))
    );
    setEditingId(null);
    showToast('Renamed entry', 'success');
  };

  const handleClearAll = () => {
    clearAllHistory();
    setEntries([]);
    setConfirmClearAll(false);
    showToast('All local history cleared', 'info');
  };

  const formatDate = (timestamp: number) => {
    const d = new Date(timestamp);
    return d.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-xl w-full p-5 sm:p-6 shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white font-semibold">
            <History className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>Recent QR History</span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/history"
              onClick={onClose}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-medium mr-1"
            >
              <span>Full Page</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Privacy setting banner */}
        <div className="mt-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
            <Shield className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>
              Save codes locally on this device. (Passwords are automatically masked).
            </span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => handleToggleEnabled(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>

        {/* List of history */}
        <div className="flex-1 overflow-y-auto my-3 divide-y divide-slate-100 dark:divide-slate-800/80 pr-1">
          {!enabled ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              <p>Local history is currently turned off.</p>
              <button
                type="button"
                onClick={() => handleToggleEnabled(true)}
                className="mt-2 text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
              >
                Turn on local history
              </button>
            </div>
          ) : entries.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              No QR codes saved yet. Create and download or bookmark a code to see it here.
            </div>
          ) : (
            entries.map((entry) => (
              <div
                key={entry.id}
                className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 px-2 rounded-xl transition-colors"
              >
                <div className="flex-1 min-w-0">
                  {editingId === entry.id ? (
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="px-2 py-1 text-xs rounded border border-indigo-500 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => handleSaveRename(entry.id)}
                        className="p-1 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950 rounded"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-xs text-slate-900 dark:text-white truncate">
                        {entry.title}
                      </span>
                      <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                        {entry.type}
                      </span>
                      {entry.templateName && (
                        <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold truncate max-w-[120px]">
                          {entry.templateName}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5 truncate">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDate(entry.timestamp)}
                    </span>
                    <span>·</span>
                    <span className="font-mono truncate max-w-[200px]">
                      {entry.summary || entry.rawPayload}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      onLoadEntry(entry);
                      onClose();
                      showToast(`Loaded "${entry.title}" into editor`, 'success');
                    }}
                    className="p-1.5 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded-lg text-xs font-medium flex items-center gap-1"
                    title="Load into generator"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Load</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleStartRename(entry)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg"
                    title="Rename entry"
                    aria-label="Rename entry"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(entry.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg"
                    title="Delete entry"
                    aria-label="Delete entry"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer with Clear All */}
        {enabled && entries.length > 0 && (
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            {confirmClearAll ? (
              <div className="flex items-center gap-2">
                <span className="text-rose-600 dark:text-rose-400 font-medium">Clear all {entries.length} items?</span>
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="px-2 py-1 bg-rose-600 text-white rounded font-medium"
                >
                  Yes, Clear
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmClearAll(false)}
                  className="px-2 py-1 text-slate-500 hover:underline"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmClearAll(true)}
                className="text-slate-500 hover:text-rose-600 transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All History</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 rounded-xl font-medium"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
