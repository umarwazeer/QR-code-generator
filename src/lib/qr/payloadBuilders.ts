import {
  WifiFormData,
  VCardFormData,
  EmailFormData,
  SmsFormData,
  WhatsAppFormData,
  LocationFormData,
  EventFormData,
  SocialFormData,
} from '../../types/qr';

/**
 * Escapes characters for Wi-Fi payloads: \ ; , : "
 */
export function escapeWifiString(str: string): string {
  return str.replace(/([\\;,:"'])/g, '\\$1');
}

/**
 * Builds a standard Wi-Fi configuration QR payload
 */
export function buildWifiPayload(data: WifiFormData): string {
  const ssid = escapeWifiString(data.ssid || '');
  const authType = data.security || 'WPA';
  const password = data.password ? escapeWifiString(data.password) : '';
  const hidden = data.hidden ? 'true' : 'false';

  let payload = `WIFI:T:${authType};S:${ssid};`;
  if (authType !== 'nopass' && password) {
    payload += `P:${password};`;
  }
  if (data.hidden) {
    payload += `H:${hidden};`;
  }
  payload += ';';
  return payload;
}

/**
 * Escapes text for vCard 3.0 fields
 */
function escapeVCard(str: string): string {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

/**
 * Builds a standards-compliant vCard 3.0 payload
 */
export function buildVCardPayload(data: VCardFormData): string {
  const lines: string[] = ['BEGIN:VCARD', 'VERSION:3.0'];

  const fn = [data.firstName, data.lastName].filter(Boolean).join(' ');
  lines.push(`N:${escapeVCard(data.lastName || '')};${escapeVCard(data.firstName || '')};;;`);
  lines.push(`FN:${escapeVCard(fn || 'Contact')}`);

  if (data.organization) {
    lines.push(`ORG:${escapeVCard(data.organization)}`);
  }
  if (data.jobTitle) {
    lines.push(`TITLE:${escapeVCard(data.jobTitle)}`);
  }
  if (data.phone) {
    lines.push(`TEL;TYPE=CELL:${data.phone.trim()}`);
  }
  if (data.email) {
    lines.push(`EMAIL:${data.email.trim()}`);
  }
  if (data.website) {
    lines.push(`URL:${data.website.trim()}`);
  }

  const hasAddress = data.street || data.city || data.state || data.zip || data.country;
  if (hasAddress) {
    lines.push(
      `ADR:;;${escapeVCard(data.street || '')};${escapeVCard(data.city || '')};${escapeVCard(
        data.state || ''
      )};${escapeVCard(data.zip || '')};${escapeVCard(data.country || '')}`
    );
  }

  if (data.notes) {
    lines.push(`NOTE:${escapeVCard(data.notes)}`);
  }

  lines.push('END:VCARD');
  return lines.join('\n');
}

/**
 * Builds mailto: link
 */
export function buildEmailPayload(data: EmailFormData): string {
  const email = data.email.trim();
  const params: string[] = [];
  if (data.subject) {
    params.push(`subject=${encodeURIComponent(data.subject)}`);
  }
  if (data.body) {
    params.push(`body=${encodeURIComponent(data.body)}`);
  }
  const query = params.length > 0 ? `?${params.join('&')}` : '';
  return `mailto:${email}${query}`;
}

/**
 * Builds tel: link
 */
export function buildPhonePayload(phone: string): string {
  const cleaned = phone.replace(/[^0-9+]/g, '');
  return `tel:${cleaned}`;
}

/**
 * Builds standard SMS payload
 */
export function buildSmsPayload(data: SmsFormData): string {
  const phone = data.phone.replace(/[^0-9+]/g, '');
  if (data.message) {
    return `smsto:${phone}:${data.message}`;
  }
  return `smsto:${phone}`;
}

/**
 * Builds WhatsApp chat URL
 */
export function buildWhatsAppPayload(data: WhatsAppFormData): string {
  const digitsOnly = data.phone.replace(/[^0-9]/g, '');
  const encodedMsg = data.message ? `?text=${encodeURIComponent(data.message)}` : '';
  return `https://wa.me/${digitsOnly}${encodedMsg}`;
}

/**
 * Builds Location geo URI or Google Maps link
 */
export function buildLocationPayload(data: LocationFormData): string {
  const lat = parseFloat(data.latitude);
  const lng = parseFloat(data.longitude);
  if (isNaN(lat) || isNaN(lng)) {
    return '';
  }
  if (data.format === 'maps') {
    return `https://maps.google.com/?q=${lat},${lng}`;
  }
  return `geo:${lat},${lng}`;
}

/**
 * Converts datetime string (YYYY-MM-DDTHH:mm) to iCal format (YYYYMMDDTHHmmssZ)
 */
function toICalDate(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '';
  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
  return `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}T${pad(
    date.getUTCHours()
  )}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}Z`;
}

/**
 * Builds iCalendar event payload
 */
export function buildEventPayload(data: EventFormData): string {
  const start = toICalDate(data.startDateTime);
  const end = toICalDate(data.endDateTime);

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//QR Studio//Event//EN',
    'BEGIN:VEVENT',
    `SUMMARY:${(data.title || 'Event').replace(/([\\;,])/g, '\\$1')}`,
  ];

  if (start) {
    lines.push(`DTSTART:${start}`);
  }
  if (end) {
    lines.push(`DTEND:${end}`);
  }
  if (data.location) {
    lines.push(`LOCATION:${data.location.replace(/([\\;,])/g, '\\$1')}`);
  }
  if (data.description) {
    lines.push(`DESCRIPTION:${data.description.replace(/([\\;,])/g, '\\$1').replace(/\n/g, '\\n')}`);
  }

  lines.push('END:VEVENT', 'END:VCALENDAR');
  return lines.join('\n');
}

/**
 * Builds social media profile URL
 */
export function buildSocialPayload(data: SocialFormData): string {
  let val = data.handleOrUrl.trim();
  if (val.startsWith('http://') || val.startsWith('https://')) {
    return val;
  }
  val = val.replace(/^@/, '');

  switch (data.platform) {
    case 'instagram':
      return `https://instagram.com/${val}`;
    case 'linkedin':
      return `https://linkedin.com/in/${val}`;
    case 'x':
      return `https://x.com/${val}`;
    case 'youtube':
      return `https://youtube.com/@${val}`;
    case 'tiktok':
      return `https://tiktok.com/@${val}`;
    case 'facebook':
      return `https://facebook.com/${val}`;
    case 'github':
      return `https://github.com/${val}`;
    default:
      return `https://${val}`;
  }
}

/**
 * Formats a general URL, ensuring safe protocol
 */
export function formatUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
}
