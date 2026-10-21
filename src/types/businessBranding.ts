import { QrType } from './qr';

export type BusinessCategory =
  | 'restaurant'
  | 'retail'
  | 'freelancer'
  | 'salon'
  | 'hotel'
  | 'other';

export interface CategoryTemplate {
  id: BusinessCategory;
  name: string;
  defaultHeading: string;
  defaultSubheading: string;
  defaultBadge: string;
  defaultCallToAction: string;
  defaultPrimaryColor: string;
  defaultSecondaryColor: string;
  suggestedQrType: QrType;
  description: string;
}

export interface BrandingConfig {
  category: BusinessCategory;
  businessName: string;
  heading: string;
  subheading: string;
  badgeText: string;
  callToAction: string;
  primaryColor: string;
  secondaryColor: string;
  logoUrl?: string;
  footerNote?: string;
}

export interface PremiumPackage {
  id: string;
  title: string;
  pricePkr: number;
  badge?: string;
  summary: string;
  deliverables: string[];
  idealFor: string;
}
