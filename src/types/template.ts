import { QrCustomization, QrType, FrameStyle } from './qr';

export type TemplateCategory =
  | 'all'
  | 'business'
  | 'restaurant'
  | 'retail'
  | 'personal'
  | 'social'
  | 'wifi'
  | 'events'
  | 'minimal'
  | 'creative';

export type TemplateStyle =
  | 'all'
  | 'minimal'
  | 'corporate'
  | 'gradient'
  | 'modern'
  | 'elegant'
  | 'bold'
  | 'high-contrast'
  | 'pastel';

export type TemplateSortOption = 'recommended' | 'popular' | 'name-asc' | 'name-desc';

export interface QrTemplate {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  styleTag: TemplateStyle;
  customization: QrCustomization;
  suggestedType: QrType;
  frameLabel?: string;
  frameStyle?: FrameStyle;
  tags: string[];
  recommendedFor: string;
  isPopular?: boolean;
  isNew?: boolean;
  contrastRatio?: number;
}

export interface CategoryMetadata {
  id: TemplateCategory;
  name: string;
  shortLabel: string;
  description: string;
}

export const TEMPLATE_CATEGORIES: CategoryMetadata[] = [
  {
    id: 'all',
    name: 'All Templates',
    shortLabel: 'All',
    description: 'Explore our complete library of professionally engineered QR designs.',
  },
  {
    id: 'business',
    name: 'Business & Corporate',
    shortLabel: 'Business',
    description: 'Crisp corporate aesthetics for enterprise collateral, pitch decks, and annual reports.',
  },
  {
    id: 'restaurant',
    name: 'Restaurant & Cafe',
    shortLabel: 'Dining',
    description: 'Warm, appetizing color palettes for digital food menus, table stands, and bar specials.',
  },
  {
    id: 'retail',
    name: 'Retail & E-commerce',
    shortLabel: 'Retail',
    description: 'High-visibility marketing styles for product packaging, promotional flyers, and store windows.',
  },
  {
    id: 'personal',
    name: 'Personal Brand & Portfolio',
    shortLabel: 'Portfolio',
    description: 'Sophisticated modern aesthetics for resume cards, creative folios, and speaking bios.',
  },
  {
    id: 'social',
    name: 'Social Media & Creator',
    shortLabel: 'Creator',
    description: 'Eye-catching gradients and vibrant frames tailored for Instagram, TikTok, and YouTube.',
  },
  {
    id: 'wifi',
    name: 'Wi-Fi & Hospitality',
    shortLabel: 'Wi-Fi',
    description: 'Welcoming designs with explicit Wi-Fi and hospitality guidance for hotel rooms and lobbies.',
  },
  {
    id: 'events',
    name: 'Events & Invitations',
    shortLabel: 'Events',
    description: 'Celebratory, gala, and wedding RSVP designs that elevate invitations and badges.',
  },
  {
    id: 'minimal',
    name: 'Minimal & Professional',
    shortLabel: 'Minimal',
    description: 'High-contrast, timeless layouts engineered for maximum optical readability.',
  },
  {
    id: 'creative',
    name: 'Creative & Colorful',
    shortLabel: 'Creative',
    description: 'Expressive gradient and geometry styles that stand out in modern design environments.',
  },
];

export const TEMPLATE_STYLES: { id: TemplateStyle; name: string }[] = [
  { id: 'all', name: 'All Styles' },
  { id: 'minimal', name: 'Minimalist & Clean' },
  { id: 'corporate', name: 'Corporate & Executive' },
  { id: 'gradient', name: 'Vibrant Gradients' },
  { id: 'modern', name: 'Modern Rounded' },
  { id: 'elegant', name: 'Luxury & Elegant' },
  { id: 'bold', name: 'Bold & High-Impact' },
  { id: 'high-contrast', name: 'High-Contrast A11y' },
  { id: 'pastel', name: 'Soft Pastel' },
];
