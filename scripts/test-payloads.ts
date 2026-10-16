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

console.log('\n🎉 ALL 12 TEST SUITES PASSED CLEANLY!');
