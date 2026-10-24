export type PrintTemplateType = 'business-card' | 'flyer' | 'tent-card';

export interface PrintTemplateConfig {
  templateType: PrintTemplateType;
  businessName: string;
  tagline: string;
  headline: string;
  bodyText: string;
  ctaText: string;
  contactPhone: string;
  contactEmail: string;
  contactWebsite: string;
  address: string;
  tableNumber: string; // Used specifically for tent cards
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  includeCutGuides: boolean;
  logoUrl?: string;
  accentStyle: 'modern' | 'minimal' | 'bold';
}

export interface PrintTemplateMeta {
  id: PrintTemplateType;
  name: string;
  badge: string;
  aspectRatio: string;
  dimensionsDescription: string;
  description: string;
  idealFor: string;
  defaultConfig: PrintTemplateConfig;
}

export const PRINT_TEMPLATE_PRESETS: Record<PrintTemplateType, PrintTemplateMeta> = {
  'business-card': {
    id: 'business-card',
    name: 'Business Card',
    badge: 'Standard 3.5" × 2"',
    aspectRatio: '7:4',
    dimensionsDescription: '88.9 × 50.8 mm (Standard Wallet Card)',
    description: 'Crisp executive card featuring brand name, credentials, contact details, and scannable contact QR.',
    idealFor: 'Networking, executives, freelancers, real estate agents, consultants',
    defaultConfig: {
      templateType: 'business-card',
      businessName: 'Alex Morgan',
      tagline: 'Principal Product & Design Consultant',
      headline: 'Scan for Digital Card & Portfolio',
      bodyText: 'Instant contact save • Verified portfolio • Direct calendar',
      ctaText: 'Scan with camera to connect',
      contactPhone: '+1 (415) 555-0199',
      contactEmail: 'alex@example.com',
      contactWebsite: 'https://qr-studio-umar.vercel.app',
      address: 'San Francisco, CA',
      tableNumber: '',
      primaryColor: '#4f46e5',
      secondaryColor: '#e0e7ff',
      backgroundColor: '#ffffff',
      textColor: '#0f172a',
      includeCutGuides: true,
      accentStyle: 'modern',
    },
  },
  'flyer': {
    id: 'flyer',
    name: 'Promotional Flyer',
    badge: 'A4 / US Letter',
    aspectRatio: '1:1.414',
    dimensionsDescription: '210 × 297 mm (Standard Print Sheet)',
    description: 'High-impact promotional poster layout with bold header, highlight bullets, prominent QR, and scan prompt.',
    idealFor: 'Storefronts, gym promotions, retail sales, event bulletin boards, trade fairs',
    defaultConfig: {
      templateType: 'flyer',
      businessName: 'Apex Studio & Fitness',
      tagline: 'Special Community Membership Drive',
      headline: 'SCAN HERE FOR 25% OFF YOUR FIRST VISIT',
      bodyText: '• Unlimited all-access gym and recovery lounge\n• Complimentary 1-on-1 personalized induction\n• Instant mobile booking with no hidden contracts',
      ctaText: 'Open phone camera & point at code • No app download required',
      contactPhone: '+1 (800) 555-0199',
      contactEmail: 'hello@apexfit.example',
      contactWebsite: 'https://qr-studio-umar.vercel.app',
      address: '450 Mission Street, Suite 300',
      tableNumber: '',
      primaryColor: '#059669',
      secondaryColor: '#d1fae5',
      backgroundColor: '#ffffff',
      textColor: '#0f172a',
      includeCutGuides: true,
      accentStyle: 'bold',
    },
  },
  'tent-card': {
    id: 'tent-card',
    name: 'Table Tent Card',
    badge: '4" × 6" / Fold-Ready Stand',
    aspectRatio: '2:3',
    dimensionsDescription: '101.6 × 152.4 mm (Counter & Table Display)',
    description: 'Double-sided or stand-ready display card with table/booth indicator, headline, clear QR, and fold guide marks.',
    idealFor: 'Restaurants, cafes, bar tables, hotel check-ins, conference booths',
    defaultConfig: {
      templateType: 'tent-card',
      businessName: 'The Terrace Bistro & Lounge',
      tagline: 'Contactless Dining & Instant Ordering',
      headline: 'Scan to View Our Menu & Daily Specials',
      bodyText: 'Browse food & drink options • Filter by dietary tags • Pay smoothly from your table',
      ctaText: 'Point camera to scan • Fast & contactless',
      contactPhone: '',
      contactEmail: '',
      contactWebsite: 'https://qr-studio-umar.vercel.app',
      address: 'Complimentary Wi-Fi: Terrace-Guest (PW: welcome2026)',
      tableNumber: 'TABLE 14',
      primaryColor: '#d97706',
      secondaryColor: '#fef3c7',
      backgroundColor: '#ffffff',
      textColor: '#0f172a',
      includeCutGuides: true,
      accentStyle: 'modern',
    },
  },
};
