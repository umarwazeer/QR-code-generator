import { QrHistoryEntry, QrType, QrCustomization } from '../../types/qr';

const HISTORY_KEY = 'qr_studio_history_v1';
const HISTORY_ENABLED_KEY = 'qr_studio_history_enabled';

export function isHistoryEnabled(): boolean {
  try {
    const val = localStorage.getItem(HISTORY_ENABLED_KEY);
    return val === 'true';
  } catch {
    return false;
  }
}

export function setHistoryEnabled(enabled: boolean): void {
  try {
    localStorage.setItem(HISTORY_ENABLED_KEY, enabled ? 'true' : 'false');
    if (!enabled) {
      // If user explicitly disables, clear history as well
      localStorage.removeItem(HISTORY_KEY);
    }
  } catch (err) {
    console.error('Failed to update history setting', err);
  }
}

export function getHistory(): QrHistoryEntry[] {
  if (!isHistoryEnabled()) return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as QrHistoryEntry[];
  } catch (err) {
    console.error('Failed to load history', err);
    return [];
  }
}

export function saveHistoryEntry(entry: {
  title: string;
  type: QrType;
  rawPayload: string;
  customization: QrCustomization;
  formData: Record<string, unknown>;
}): QrHistoryEntry | null {
  if (!isHistoryEnabled()) return null;

  try {
    const current = getHistory();

    // Sanitization: If Wi-Fi, mask password in stored history formData
    const sanitizedFormData = { ...entry.formData };
    if (entry.type === 'wifi' && sanitizedFormData.password) {
      sanitizedFormData.password = '••••••••';
    }

    const newEntry: QrHistoryEntry = {
      id: `qr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      title: entry.title.trim() || `${entry.type.toUpperCase()} QR`,
      type: entry.type,
      rawPayload: entry.rawPayload,
      timestamp: Date.now(),
      customization: entry.customization,
      formData: sanitizedFormData,
    };

    // Keep up to 25 recent items
    const updated = [newEntry, ...current.slice(0, 24)];
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    return newEntry;
  } catch (err) {
    console.error('Failed to save history entry', err);
    return null;
  }
}

export function renameHistoryEntry(id: string, newTitle: string): boolean {
  try {
    const current = getHistory();
    const index = current.findIndex((item) => item.id === id);
    if (index === -1) return false;

    current[index].title = newTitle.trim() || current[index].title;
    localStorage.setItem(HISTORY_KEY, JSON.stringify(current));
    return true;
  } catch (err) {
    console.error('Failed to rename history entry', err);
    return false;
  }
}

export function deleteHistoryEntry(id: string): boolean {
  try {
    const current = getHistory();
    const updated = current.filter((item) => item.id !== id);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    return true;
  } catch (err) {
    console.error('Failed to delete history entry', err);
    return false;
  }
}

export function clearAllHistory(): boolean {
  try {
    localStorage.removeItem(HISTORY_KEY);
    return true;
  } catch (err) {
    console.error('Failed to clear history', err);
    return false;
  }
}
