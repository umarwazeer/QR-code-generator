import { QrHistoryEntry, QrType, QrCustomization } from '../../types/qr';

export const CURRENT_SCHEMA_VERSION = 2;
const HISTORY_KEY_V2 = 'qr_studio_history_v2';
const HISTORY_KEY_V1 = 'qr_studio_history_v1';
const HISTORY_SETTINGS_KEY = 'qr_studio_history_settings_v1';
const DEFAULT_RETENTION_LIMIT = 50;

export interface HistorySettings {
  enabled: boolean;
  autoSaveOnDownload: boolean;
  excludeSensitivePayloads: boolean; // e.g. exclude Wi-Fi auto-saving
  maxItems: number;
}

export const DEFAULT_HISTORY_SETTINGS: HistorySettings = {
  enabled: true,
  autoSaveOnDownload: true,
  excludeSensitivePayloads: false,
  maxItems: DEFAULT_RETENTION_LIMIT,
};

/**
 * Builds a privacy-conscious content summary without exposing sensitive credentials
 */
export function generatePayloadSummary(
  type: QrType,
  formData: Record<string, unknown>,
  rawPayload: string
): string {
  try {
    switch (type) {
      case 'url': {
        const urlStr = String(formData.url || rawPayload || '');
        try {
          const parsed = new URL(urlStr.startsWith('http') ? urlStr : `https://${urlStr}`);
          return parsed.hostname + (parsed.pathname !== '/' ? parsed.pathname : '');
        } catch {
          return urlStr.replace(/^https?:\/\//i, '').slice(0, 40);
        }
      }
      case 'wifi': {
        const ssid = String(formData.ssid || 'Wi-Fi Network');
        const sec = String(formData.security || 'WPA');
        return `Network: ${ssid} (${sec}, Password protected)`;
      }
      case 'vcard': {
        const first = String(formData.firstName || '');
        const last = String(formData.lastName || '');
        const org = String(formData.organization || '');
        const name = `${first} ${last}`.trim() || 'Contact Card';
        return org ? `${name} • ${org}` : name;
      }
      case 'email': {
        const email = String(formData.email || '');
        const subject = String(formData.subject || '');
        return subject ? `${email} ("${subject.slice(0, 25)}")` : email || 'Email message';
      }
      case 'phone': {
        return `Call ${String(formData.phone || rawPayload).replace(/^tel:/i, '')}`;
      }
      case 'sms': {
        const phone = String(formData.phone || '');
        return `SMS to ${phone || 'recipient'}`;
      }
      case 'whatsapp': {
        const phone = String(formData.phone || '');
        return `WhatsApp to +${phone.replace(/[^0-9]/g, '')}`;
      }
      case 'location': {
        const lat = String(formData.latitude || '');
        const lng = String(formData.longitude || '');
        return lat && lng ? `GPS Coordinates: ${lat}, ${lng}` : 'Map Location';
      }
      case 'event': {
        const title = String(formData.title || 'Calendar Event');
        const dt = String(formData.startDateTime || '');
        return dt ? `${title} (${dt.replace('T', ' ')})` : title;
      }
      case 'social': {
        const platform = String(formData.platform || 'Social');
        const handle = String(formData.handleOrUrl || '').replace(/^@/, '');
        return `${platform.toUpperCase()}: @${handle}`;
      }
      case 'custom':
      case 'text':
      default: {
        const preview = (String(formData.text || formData.custom || rawPayload) || '').trim();
        return preview.length > 50 ? `${preview.slice(0, 50)}…` : preview || 'Text content';
      }
    }
  } catch {
    return `${type.toUpperCase()} QR`;
  }
}

/**
 * Retrieves history settings safely
 */
export function getHistorySettings(): HistorySettings {
  try {
    const raw = localStorage.getItem(HISTORY_SETTINGS_KEY);
    if (!raw) return { ...DEFAULT_HISTORY_SETTINGS };
    const parsed = JSON.parse(raw);
    return {
      enabled: typeof parsed.enabled === 'boolean' ? parsed.enabled : DEFAULT_HISTORY_SETTINGS.enabled,
      autoSaveOnDownload:
        typeof parsed.autoSaveOnDownload === 'boolean'
          ? parsed.autoSaveOnDownload
          : DEFAULT_HISTORY_SETTINGS.autoSaveOnDownload,
      excludeSensitivePayloads:
        typeof parsed.excludeSensitivePayloads === 'boolean'
          ? parsed.excludeSensitivePayloads
          : DEFAULT_HISTORY_SETTINGS.excludeSensitivePayloads,
      maxItems:
        typeof parsed.maxItems === 'number' && parsed.maxItems > 0 && parsed.maxItems <= 200
          ? parsed.maxItems
          : DEFAULT_HISTORY_SETTINGS.maxItems,
    };
  } catch {
    return { ...DEFAULT_HISTORY_SETTINGS };
  }
}

/**
 * Updates history settings safely
 */
export function updateHistorySettings(partial: Partial<HistorySettings>): HistorySettings {
  try {
    const current = getHistorySettings();
    const updated: HistorySettings = { ...current, ...partial };
    localStorage.setItem(HISTORY_SETTINGS_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.warn('Failed to update history settings', err);
    return getHistorySettings();
  }
}

/**
 * Check if history saving is globally active
 */
export function isHistoryEnabled(): boolean {
  return getHistorySettings().enabled;
}

/**
 * Toggle history master switch
 */
export function setHistoryEnabled(enabled: boolean): void {
  updateHistorySettings({ enabled });
  if (!enabled) {
    // Note: Do not automatically wipe existing history when simply toggling pause,
    // but users can explicitly wipe via clearAllHistory().
  }
}

/**
 * Validates whether a raw record satisfies minimal QrHistoryEntry schema requirements
 */
function isValidHistoryRecord(item: unknown): item is QrHistoryEntry {
  if (!item || typeof item !== 'object') return false;
  const candidate = item as Record<string, unknown>;
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.type === 'string' &&
    typeof candidate.rawPayload === 'string' &&
    typeof candidate.timestamp === 'number' &&
    typeof candidate.customization === 'object' &&
    candidate.customization !== null
  );
}

/**
 * Migrates V1 history records if V2 is not yet initialized
 */
function migrateV1IfPresent(): QrHistoryEntry[] {
  try {
    const v1Raw = localStorage.getItem(HISTORY_KEY_V1);
    if (!v1Raw) return [];
    const parsed = JSON.parse(v1Raw);
    if (!Array.isArray(parsed)) return [];

    const migrated: QrHistoryEntry[] = [];
    for (const item of parsed) {
      if (isValidHistoryRecord(item)) {
        migrated.push({
          ...item,
          version: CURRENT_SCHEMA_VERSION,
          summary: generatePayloadSummary(
            item.type,
            item.formData || {},
            item.rawPayload
          ),
          isSensitive: item.type === 'wifi',
        });
      }
    }

    if (migrated.length > 0) {
      localStorage.setItem(HISTORY_KEY_V2, JSON.stringify(migrated));
    }
    // Clean up old key
    localStorage.removeItem(HISTORY_KEY_V1);
    return migrated;
  } catch (err) {
    console.warn('History V1 migration skipped:', err);
    return [];
  }
}

/**
 * Retrieves complete history list, sorted newest-first, with validation and fault-tolerance
 */
export function getHistory(): QrHistoryEntry[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY_V2);
    if (!raw) {
      return migrateV1IfPresent();
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    const validated: QrHistoryEntry[] = [];
    for (const item of parsed) {
      if (isValidHistoryRecord(item)) {
        validated.push({
          ...item,
          version: item.version || CURRENT_SCHEMA_VERSION,
          summary: item.summary || generatePayloadSummary(item.type, item.formData || {}, item.rawPayload),
          isSensitive: typeof item.isSensitive === 'boolean' ? item.isSensitive : item.type === 'wifi',
        });
      }
    }
    return validated;
  } catch (err) {
    console.warn('Failed to parse QR history from storage', err);
    return [];
  }
}

export interface SaveHistoryOptions {
  title: string;
  type: QrType;
  rawPayload: string;
  customization: QrCustomization;
  formData: Record<string, unknown>;
  templateId?: string;
  templateName?: string;
  isExplicit?: boolean; // True if user explicitly clicked "Save to History"
}

export interface SaveHistoryResult {
  success: boolean;
  entry?: QrHistoryEntry;
  error?: string;
}

/**
 * Saves a new QR entry to local browser storage with privacy sanitization and deduplication
 */
export function saveHistoryEntry(options: SaveHistoryOptions): SaveHistoryResult {
  const settings = getHistorySettings();
  if (!settings.enabled) {
    return { success: false, error: 'History tracking is currently disabled in settings.' };
  }

  // Check sensitive payload policy
  const isWifi = options.type === 'wifi';
  if (isWifi && settings.excludeSensitivePayloads && !options.isExplicit) {
    return {
      success: false,
      error: 'Wi-Fi credentials auto-save skipped due to privacy exclusion setting.',
    };
  }

  if (!options.rawPayload || !options.rawPayload.trim()) {
    return { success: false, error: 'Cannot save empty QR payload.' };
  }

  try {
    const current = getHistory();

    // Deduplication: Avoid saving identical QR if created within last 10 seconds
    const tenSecondsAgo = Date.now() - 10000;
    const existingIndex = current.findIndex(
      (item) =>
        item.rawPayload === options.rawPayload &&
        item.type === options.type &&
        item.timestamp > tenSecondsAgo
    );

    if (existingIndex >= 0) {
      // Just refresh the timestamp and update title if provided
      current[existingIndex].timestamp = Date.now();
      if (options.title && options.title !== `${options.type.toUpperCase()} QR`) {
        current[existingIndex].title = options.title.trim();
      }
      try {
        localStorage.setItem(HISTORY_KEY_V2, JSON.stringify(current));
        return { success: true, entry: current[existingIndex] };
      } catch {
        // Continue to fallback
      }
    }

    // Sanitize formData: Mask Wi-Fi passwords in formData representation
    const sanitizedFormData = { ...options.formData };
    if (isWifi && sanitizedFormData.password) {
      sanitizedFormData.password = '••••••••';
    }

    const summary = generatePayloadSummary(options.type, sanitizedFormData, options.rawPayload);

    const newRecord: QrHistoryEntry = {
      id: `qr_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      version: CURRENT_SCHEMA_VERSION,
      title: options.title?.trim() || `${options.type.toUpperCase()} QR`,
      type: options.type,
      rawPayload: options.rawPayload,
      timestamp: Date.now(),
      customization: options.customization,
      formData: sanitizedFormData,
      templateId: options.templateId,
      templateName: options.templateName,
      summary,
      isSensitive: isWifi,
    };

    // Apply retention limit
    const limit = settings.maxItems || DEFAULT_RETENTION_LIMIT;
    let updatedList = [newRecord, ...current].slice(0, limit);

    // Save with quota-exceeded fallback retry
    let saved = false;
    let attempts = 0;
    while (!saved && attempts < 3) {
      attempts++;
      try {
        localStorage.setItem(HISTORY_KEY_V2, JSON.stringify(updatedList));
        saved = true;
      } catch (storageErr) {
        // If quota exceeded, prune the oldest 5 items and retry
        console.warn('Storage quota warning, pruning oldest records...', storageErr);
        if (updatedList.length > 5) {
          updatedList = updatedList.slice(0, updatedList.length - 5);
        } else {
          break;
        }
      }
    }

    if (!saved) {
      return { success: false, error: 'Local storage is full or restricted by browser.' };
    }

    return { success: true, entry: newRecord };
  } catch (err) {
    console.error('Failed to save QR history record:', err);
    return { success: false, error: 'An unexpected storage error occurred.' };
  }
}

/**
 * Renames an existing record
 */
export function renameHistoryEntry(id: string, newTitle: string): boolean {
  try {
    const current = getHistory();
    const index = current.findIndex((item) => item.id === id);
    if (index === -1) return false;

    current[index].title = newTitle.trim() || current[index].title;
    localStorage.setItem(HISTORY_KEY_V2, JSON.stringify(current));
    return true;
  } catch (err) {
    console.error('Failed to rename history record:', err);
    return false;
  }
}

/**
 * Deletes a single record
 */
export function deleteHistoryEntry(id: string): boolean {
  try {
    const current = getHistory();
    const updated = current.filter((item) => item.id !== id);
    localStorage.setItem(HISTORY_KEY_V2, JSON.stringify(updated));
    return true;
  } catch (err) {
    console.error('Failed to delete history record:', err);
    return false;
  }
}

/**
 * Clears all history records safely
 */
export function clearAllHistory(): boolean {
  try {
    localStorage.removeItem(HISTORY_KEY_V2);
    localStorage.removeItem(HISTORY_KEY_V1);
    return true;
  } catch (err) {
    console.error('Failed to clear history records:', err);
    return false;
  }
}

/**
 * Exports history to a JSON backup string for download
 */
export function exportHistoryJson(): string {
  const records = getHistory();
  return JSON.stringify(
    {
      app: 'QR Studio',
      website: 'https://qr-studio-umar.vercel.app',
      exportedAt: new Date().toISOString(),
      schemaVersion: CURRENT_SCHEMA_VERSION,
      recordCount: records.length,
      records,
    },
    null,
    2
  );
}

/**
 * Calculates current storage consumption metrics
 */
export function getHistoryStats(): {
  count: number;
  maxItems: number;
  estimatedBytes: number;
  sensitiveCount: number;
} {
  const records = getHistory();
  const settings = getHistorySettings();
  let estimatedBytes = 0;
  let sensitiveCount = 0;

  try {
    const raw = localStorage.getItem(HISTORY_KEY_V2) || '';
    estimatedBytes = new Blob([raw]).size;
  } catch {
    estimatedBytes = JSON.stringify(records).length;
  }

  for (const r of records) {
    if (r.isSensitive) sensitiveCount++;
  }

  return {
    count: records.length,
    maxItems: settings.maxItems,
    estimatedBytes,
    sensitiveCount,
  };
}
