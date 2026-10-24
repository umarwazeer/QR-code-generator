/**
 * Automated test suite for QR payload generation, escaping, and contrast calculations.
 */

import {
  escapeWifiString,
  buildWifiPayload,
  buildVCardPayload,
  buildEmailPayload,
  buildPhonePayload,
  buildSmsPayload,
  buildWhatsAppPayload,
  buildLocationPayload,
  buildEventPayload,
  buildSocialPayload,
  formatUrl,
} from '../src/lib/qr/payloadBuilders';
import { analyzeQrContrast } from '../src/lib/qr/contrastCheck';
import { sanitizeFilename } from '../src/lib/export/exportQr';

function assert(condition: boolean, msg: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${msg}`);
    process.exit(1);
  } else {
    console.log(`✅ PASSED: ${msg}`);
  }
}

console.log('--- RUNNING QR STUDIO TEST SUITE ---');

// 1. URL formatting
assert(
  formatUrl('example.com') === 'https://example.com',
  'Prepend https to naked domains'
);
assert(
  formatUrl('http://my-site.org/page?q=1') === 'http://my-site.org/page?q=1',
  'Preserve existing http protocols'
);

// 2. Wi-Fi escaping and formatting
const wifiPayload = buildWifiPayload({
  ssid: 'My;Special:SSID\\Name',
  password: 'P@ss;word:with"special',
  security: 'WPA',
  hidden: true,
});
assert(
  wifiPayload.includes('S:My\\;Special\\:SSID\\\\Name;'),
  'Wi-Fi SSID special characters escaped correctly'
);
assert(
  wifiPayload.includes('P:P@ss\\;word\\:with\\"special;'),
  'Wi-Fi password special characters escaped correctly'
);
assert(wifiPayload.includes('H:true;;'), 'Wi-Fi hidden flag rendered correctly');

// 3. vCard 3.0 formatting
const vcard = buildVCardPayload({
  firstName: 'Jane',
  lastName: 'Doe',
  organization: 'Tech Innovations; Inc.',
  jobTitle: 'VP, Engineering',
  phone: '+1 415-555-0100',
  email: 'jane@example.com',
  website: 'https://example.com',
  city: 'San Francisco',
  country: 'USA',
});
assert(vcard.startsWith('BEGIN:VCARD\nVERSION:3.0'), 'vCard has valid header');
assert(vcard.includes('N:Doe;Jane;;;'), 'vCard has formatted N field');
assert(vcard.includes('FN:Jane Doe'), 'vCard has formatted FN field');
assert(vcard.includes('ORG:Tech Innovations\\; Inc.'), 'vCard escapes semicolons in org');
assert(vcard.includes('TITLE:VP\\, Engineering'), 'vCard escapes commas in title');
assert(vcard.includes('TEL;TYPE=CELL:+1 415-555-0100'), 'vCard phone is correct');
assert(vcard.endsWith('END:VCARD'), 'vCard has valid footer');

// 4. Email mailto: payload
const emailPayload = buildEmailPayload({
  email: 'test@example.com',
  subject: 'Hello World & Greetings',
  body: 'This is a test message.',
});
assert(
  emailPayload ===
    'mailto:test@example.com?subject=Hello%20World%20%26%20Greetings&body=This%20is%20a%20test%20message.',
  'Email payload correctly encodes URI parameters'
);

// 5. Phone payload
const phonePayload = buildPhonePayload('+1 (555) 019-2834');
assert(phonePayload === 'tel:+15550192834', 'Phone payload strips extraneous formatting');

// 6. SMS payload
const smsPayload = buildSmsPayload({
  phone: '+1 555-0123',
  message: 'RSVP YES',
});
assert(smsPayload === 'smsto:+15550123:RSVP YES', 'SMS payload formatted properly');

// 7. WhatsApp payload
const waPayload = buildWhatsAppPayload({
  phone: '+1 (415) 555-2671',
  message: 'Hello!',
});
assert(
  waPayload === 'https://wa.me/14155552671?text=Hello!',
  'WhatsApp payload uses wa.me format with country code and query'
);

// 8. Location payload
const locMaps = buildLocationPayload({
  latitude: '37.7749',
  longitude: '-122.4194',
  format: 'maps',
});
assert(
  locMaps === 'https://maps.google.com/?q=37.7749,-122.4194',
  'Location Google Maps link is correct'
);
const locGeo = buildLocationPayload({
  latitude: '37.7749',
  longitude: '-122.4194',
  format: 'geo',
});
assert(locGeo === 'geo:37.7749,-122.4194', 'Location geo: URI is correct');

// 9. Event iCalendar payload
const eventPayload = buildEventPayload({
  title: 'Keynote 2026',
  startDateTime: '2026-12-01T10:00',
  endDateTime: '2026-12-01T12:00',
  location: 'Hall A, Center',
  description: 'Annual gathering.',
  allDay: false,
});
assert(eventPayload.startsWith('BEGIN:VCALENDAR'), 'Event starts with VCALENDAR');
assert(eventPayload.includes('BEGIN:VEVENT'), 'Event contains VEVENT');
assert(eventPayload.includes('SUMMARY:Keynote 2026'), 'Event contains summary');
assert(eventPayload.includes('DTSTART:20261201T'), 'Event formatted DTSTART in UTC format');
assert(eventPayload.includes('LOCATION:Hall A\\, Center'), 'Event escaped commas in location');
assert(eventPayload.endsWith('END:VCALENDAR'), 'Event closes with END:VCALENDAR');

// 10. Social Media URLs
assert(
  buildSocialPayload({ platform: 'instagram', handleOrUrl: '@designpro' }) ===
    'https://instagram.com/designpro',
  'Instagram handle formatted correctly'
);
assert(
  buildSocialPayload({ platform: 'github', handleOrUrl: 'myorg' }) ===
    'https://github.com/myorg',
  'GitHub handle formatted correctly'
);
assert(
  buildSocialPayload({ platform: 'linkedin', handleOrUrl: 'in/janesmith' }) ===
    'https://linkedin.com/in/in/janesmith',
  'LinkedIn handle formatted correctly'
);

// 11. Contrast analysis
const highContrast = analyzeQrContrast('#000000', '#ffffff', false);
assert(highContrast.isReliable === true, 'Black on white is reliable');
assert(highContrast.ratio > 15, 'Black on white has high contrast ratio');

const lowContrast = analyzeQrContrast('#999999', '#888888', false);
assert(lowContrast.isReliable === false, 'Gray on slightly darker gray is flagged unreliable');
assert(lowContrast.warning !== undefined, 'Low contrast produces helpful warning');

const inverted = analyzeQrContrast('#ffffff', '#000000', false);
assert(inverted.isInverted === true, 'Inverted color scheme is detected');

// 12. Filename sanitization
assert(
  sanitizeFilename('My Wi-Fi Network! (Office #1)') === 'my-wi-fi-network-office-1',
  'Filename sanitization cleans special characters and spaces'
);

// 13. QR Template Library Verification
import { QR_TEMPLATES, getTemplateById, getTemplatesByCategory } from '../src/data/qrTemplates';
import { TEMPLATE_CATEGORIES } from '../src/types/template';

assert(QR_TEMPLATES.length >= 24, `Template library contains >= 24 templates (found ${QR_TEMPLATES.length})`);

const templateIds = new Set<string>();
for (const tpl of QR_TEMPLATES) {
  assert(!templateIds.has(tpl.id), `Template ID '${tpl.id}' is globally unique`);
  templateIds.add(tpl.id);
  assert(tpl.name.trim().length > 0, `Template ${tpl.id} has valid name`);
  assert(tpl.description.trim().length > 0, `Template ${tpl.id} has description`);
  assert(!!tpl.customization.foregroundColor, `Template ${tpl.id} has foregroundColor`);
  assert(!!tpl.customization.dotType, `Template ${tpl.id} has valid dotType`);
  assert(!!tpl.customization.cornerSquareType, `Template ${tpl.id} has cornerSquareType`);
  assert(!!tpl.customization.cornerDotType, `Template ${tpl.id} has cornerDotType`);
}
assert(templateIds.size === QR_TEMPLATES.length, 'All template IDs are unique');

// Test category filtering
for (const cat of TEMPLATE_CATEGORIES) {
  if (cat.id === 'all') continue;
  const filtered = getTemplatesByCategory(cat.id);
  assert(filtered.length > 0, `Category '${cat.id}' has at least one template (found ${filtered.length})`);
}

// Test ID lookup
const classicTpl = getTemplateById('classic-noir');
assert(classicTpl !== undefined && classicTpl.name.includes('Classic'), 'getTemplateById finds classic-noir');

// 14. QR History Storage & Privacy Safeguards Verification
if (typeof globalThis.localStorage === 'undefined') {
  const store = new Map<string, string>();
  globalThis.localStorage = {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => store.set(key, String(value)),
    removeItem: (key: string) => store.delete(key),
    clear: () => store.clear(),
    key: (index: number) => Array.from(store.keys())[index] ?? null,
    get length() {
      return store.size;
    },
  } as Storage;
}

import {
  saveHistoryEntry,
  getHistory,
  deleteHistoryEntry,
  clearAllHistory,
  getHistorySettings,
  updateHistorySettings,
  generatePayloadSummary,
  exportHistoryJson,
  getHistoryStats,
} from '../src/lib/history/historyStorage';
import { DEFAULT_CUSTOMIZATION } from '../src/lib/qr/presets';

// Clear previous history
clearAllHistory();
updateHistorySettings({ enabled: true, maxItems: 50 });

// Test summary generator
const urlSummary = generatePayloadSummary('url', { url: 'https://example.com/menu' }, 'https://example.com/menu');
assert(urlSummary.includes('example.com'), 'URL summary extracts domain correctly');

const wifiSummary = generatePayloadSummary('wifi', { ssid: 'GuestCafe', security: 'WPA' }, 'WIFI:S:GuestCafe;');
assert(wifiSummary.includes('GuestCafe'), 'Wi-Fi summary includes network SSID');
assert(wifiSummary.includes('Password protected'), 'Wi-Fi summary notes password protection');

// Test saving standard entry
const savedUrl = saveHistoryEntry({
  title: 'My Website',
  type: 'url',
  rawPayload: 'https://qr-studio-umar.vercel.app',
  customization: DEFAULT_CUSTOMIZATION,
  formData: { url: 'https://qr-studio-umar.vercel.app' },
  templateId: 'corporate-blue',
  templateName: 'Executive Corporate Blue',
});
assert(savedUrl.success === true, 'Standard URL QR successfully saved');
assert(savedUrl.entry?.version === 2, 'History record has schema version 2');
assert(savedUrl.entry?.templateId === 'corporate-blue', 'History record stores templateId');

// Test Wi-Fi password masking
const savedWifi = saveHistoryEntry({
  title: 'Office Wi-Fi',
  type: 'wifi',
  rawPayload: 'WIFI:S:OfficeNet;T:WPA;P:SuperSecret123;;',
  customization: DEFAULT_CUSTOMIZATION,
  formData: { ssid: 'OfficeNet', password: 'SuperSecret123', security: 'WPA' },
});
assert(savedWifi.success === true, 'Wi-Fi QR successfully saved');
assert(savedWifi.entry?.formData.password === '••••••••', 'Wi-Fi password in formData is securely masked');
assert(savedWifi.entry?.isSensitive === true, 'Wi-Fi QR is tagged as isSensitive');

// Test retrieval
const currentHistory = getHistory();
assert(currentHistory.length === 2, 'History retrieval returns 2 saved records');

// Test single record deletion
const idToDelete = savedUrl.entry!.id;
const deleteRes = deleteHistoryEntry(idToDelete);
assert(deleteRes === true, 'deleteHistoryEntry returns true');
assert(getHistory().length === 1, 'History length decreased to 1 after deletion');

// Test export JSON
const backupJson = exportHistoryJson();
assert(backupJson.includes('QR Studio'), 'Export backup JSON contains QR Studio header');
assert(backupJson.includes('Office Wi-Fi'), 'Export backup JSON contains saved entries');

// Test stats calculation
const stats = getHistoryStats();
assert(stats.count === 1, 'Stats reports correct count');
assert(stats.sensitiveCount === 1, 'Stats reports correct sensitive Wi-Fi count');

// Test retention limit enforcement
for (let i = 0; i < 55; i++) {
  saveHistoryEntry({
    title: `Bulk QR #${i}`,
    type: 'text',
    rawPayload: `Text payload #${i}_${Math.random()}`,
    customization: DEFAULT_CUSTOMIZATION,
    formData: { text: `Bulk text ${i}` },
  });
}
const prunedHistory = getHistory();
assert(prunedHistory.length <= 50, `Retention limit enforced: expected <= 50 items, found ${prunedHistory.length}`);

// Test clear all
clearAllHistory();
assert(getHistory().length === 0, 'clearAllHistory successfully wipes records');

console.log('\n🎉 ALL 14 TEST SUITES PASSED CLEANLY!');
