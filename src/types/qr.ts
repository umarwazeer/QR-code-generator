export type QrType =
  | 'url'
  | 'text'
  | 'wifi'
  | 'vcard'
  | 'email'
  | 'phone'
  | 'sms'
  | 'whatsapp'
  | 'location'
  | 'event'
  | 'social'
  | 'custom';

export type DotType =
  | 'square'
  | 'dots'
  | 'rounded'
  | 'classy'
  | 'classy-rounded'
  | 'extra-rounded';

export type CornerSquareType = 'square' | 'dot' | 'extra-rounded';

export type CornerDotType = 'square' | 'dot';

export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export interface GradientOptions {
  enabled: boolean;
  type: 'linear' | 'radial';
  color1: string;
  color2: string;
  rotation: number; // in degrees
}

export interface QrCustomization {
  foregroundColor: string;
  backgroundColor: string;
  transparentBackground: boolean;
  gradient: GradientOptions;
  dotType: DotType;
  cornerSquareType: CornerSquareType;
  cornerDotType: CornerDotType;
  cornerSquareColor: string;
  cornerDotColor: string;
  errorCorrectionLevel: ErrorCorrectionLevel;
  margin: number;
  logoUrl?: string;
  logoSize: number; // 0.1 to 0.4
  logoMargin: number;
}

export interface WifiFormData {
  ssid: string;
  password?: string;
  security: 'WPA' | 'WEP' | 'nopass';
  hidden: boolean;
}

export interface VCardFormData {
  firstName: string;
  lastName: string;
  organization?: string;
  jobTitle?: string;
  phone?: string;
  email?: string;
  website?: string;
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  notes?: string;
}

export interface EmailFormData {
  email: string;
  subject?: string;
  body?: string;
}

export interface SmsFormData {
  phone: string;
  message?: string;
}

export interface WhatsAppFormData {
  phone: string;
  message?: string;
}

export interface LocationFormData {
  latitude: string;
  longitude: string;
  format: 'geo' | 'maps';
}

export interface EventFormData {
  title: string;
  startDateTime: string;
  endDateTime: string;
  location?: string;
  description?: string;
  allDay: boolean;
}

export interface SocialFormData {
  platform: 'instagram' | 'linkedin' | 'x' | 'youtube' | 'tiktok' | 'facebook' | 'github';
  handleOrUrl: string;
}

export interface QrHistoryEntry {
  id: string;
  title: string;
  type: QrType;
  rawPayload: string;
  timestamp: number;
  previewThumbnail?: string;
  customization: QrCustomization;
  formData: Record<string, unknown>;
}

export interface PresetPalette {
  id: string;
  name: string;
  foreground: string;
  background: string;
  cornerSquareColor?: string;
  cornerDotColor?: string;
}
