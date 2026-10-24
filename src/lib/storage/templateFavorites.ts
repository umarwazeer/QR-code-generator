/**
 * Local storage manager for QR Studio Template favorites and recently applied templates.
 * Includes defensive fallback handling for privacy mode and restricted iframe environments.
 */

const FAVORITES_STORAGE_KEY = 'qr_studio_template_favorites_v1';
const RECENTS_STORAGE_KEY = 'qr_studio_template_recents_v1';
const MAX_RECENTS = 8;

export function getFavoriteTemplateIds(): string[] {
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function isTemplateFavorite(id: string): boolean {
  const favorites = getFavoriteTemplateIds();
  return favorites.includes(id);
}

export function toggleFavoriteTemplate(id: string): boolean {
  try {
    const favorites = getFavoriteTemplateIds();
    const index = favorites.indexOf(id);
    let isNowFavorite = false;

    if (index >= 0) {
      favorites.splice(index, 1);
      isNowFavorite = false;
    } else {
      favorites.unshift(id);
      isNowFavorite = true;
    }

    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    return isNowFavorite;
  } catch {
    return false;
  }
}

export function getRecentTemplateIds(): string[] {
  try {
    const raw = localStorage.getItem(RECENTS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function recordRecentTemplate(id: string): void {
  try {
    const recents = getRecentTemplateIds().filter((existingId) => existingId !== id);
    recents.unshift(id);
    if (recents.length > MAX_RECENTS) {
      recents.length = MAX_RECENTS;
    }
    localStorage.setItem(RECENTS_STORAGE_KEY, JSON.stringify(recents));
  } catch {
    // Graceful degradation when localStorage is unavailable
  }
}
