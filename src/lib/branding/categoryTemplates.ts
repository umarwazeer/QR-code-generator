import { BusinessCategory, CategoryTemplate, PremiumPackage } from '../../types/businessBranding';

export const BUSINESS_CATEGORIES: CategoryTemplate[] = [
  {
    id: 'restaurant',
    name: 'Restaurant / Cafe',
    defaultHeading: 'Scan to View Our Menu',
    defaultSubheading: 'Browse appetizers, chef specials, beverages & desserts directly on your phone.',
    defaultBadge: 'Contactless Dining',
    defaultCallToAction: 'Point your camera to view menu',
    defaultPrimaryColor: '#b45309', // Amber 700
    defaultSecondaryColor: '#fef3c7', // Amber 100
    suggestedQrType: 'url',
    description: 'Perfect for tabletop acrylic stands, counter cards, and takeaway boxes.',
  },
  {
    id: 'retail',
    name: 'Retail / Shop',
    defaultHeading: 'Scan for In-Store Specials',
    defaultSubheading: 'Unlock exclusive store discounts, member rewards & digital product catalogs.',
    defaultBadge: 'Exclusive Offer',
    defaultCallToAction: 'Scan now to claim discount',
    defaultPrimaryColor: '#4338ca', // Indigo 700
    defaultSecondaryColor: '#e0e7ff', // Indigo 100
    suggestedQrType: 'url',
    description: 'Ideal for window displays, checkout counters, product packaging & shopping bags.',
  },
  {
    id: 'freelancer',
    name: 'Freelancer / Personal Brand',
    defaultHeading: 'Connect & Save Contact',
    defaultSubheading: 'Instant digital business card with direct phone, email, portfolio & WhatsApp.',
    defaultBadge: 'Direct Contact',
    defaultCallToAction: 'Scan to save vCard to contacts',
    defaultPrimaryColor: '#0f766e', // Teal 700
    defaultSecondaryColor: '#ccfbf1', // Teal 100
    suggestedQrType: 'vcard',
    description: 'Ideal for networking conferences, portfolio cards, resumes & proposal pitch decks.',
  },
  {
    id: 'salon',
    name: 'Salon / Beauty',
    defaultHeading: 'Book Appointments & Services',
    defaultSubheading: 'Check available slots, browse treatment packages & book your next session.',
    defaultBadge: 'Easy Booking',
    defaultCallToAction: 'Scan to view salon pricing & book',
    defaultPrimaryColor: '#be185d', // Pink 700
    defaultSecondaryColor: '#fce7f3', // Pink 100
    suggestedQrType: 'whatsapp',
    description: 'Tailored for reception desks, styling mirrors, service flyers & appointment cards.',
  },
  {
    id: 'hotel',
    name: 'Hotel / Event',
    defaultHeading: 'Welcome to Your Stay',
    defaultSubheading: 'Instant high-speed guest Wi-Fi, room service directory & event schedule.',
    defaultBadge: 'Guest Services',
    defaultCallToAction: 'Scan to connect & explore',
    defaultPrimaryColor: '#1e293b', // Slate 800
    defaultSecondaryColor: '#f1f5f9', // Slate 100
    suggestedQrType: 'wifi',
    description: 'Great for bedside nightstands, lobby signboards, badges & event hall entrances.',
  },
  {
    id: 'other',
    name: 'Other Business',
    defaultHeading: 'Scan to Connect With Us',
    defaultSubheading: 'Visit our official website, place custom orders, or chat with our team.',
    defaultBadge: 'Scan & Explore',
    defaultCallToAction: 'Point camera to scan QR code',
    defaultPrimaryColor: '#2563eb', // Blue 600
    defaultSecondaryColor: '#dbeafe', // Blue 100
    suggestedQrType: 'url',
    description: 'Adaptable for healthcare clinics, fitness gyms, auto workshops, and real estate.',
  },
];

export const PREMIUM_PACKAGES: PremiumPackage[] = [
  {
    id: 'custom-card',
    title: 'Custom Promotional Card Design',
    pricePkr: 800,
    badge: 'Fast Turnaround',
    summary:
      'Personalized branded tabletop stand or counter display card crafted by a professional designer.',
    deliverables: [
      'Tailored brand layout matching your exact corporate guidelines',
      'Dual-format: Acrylic stand card (4x6" / 5x7") & window poster layout',
      'High-resolution 300 DPI print-ready PDF with bleed margins',
      'Custom color harmony and verified optical scan contrast',
      'Delivered in 24–48 hours via Email/WhatsApp',
    ],
    idealFor: 'Cafes, salons, retail cash counters, and exhibition booths.',
  },
  {
    id: 'menu-package',
    title: 'Restaurant Menu QR Package',
    pricePkr: 1500,
    badge: 'Most Popular',
    summary:
      'Complete dining presentation package including branded table-tent card and hosted menu presentation artwork.',
    deliverables: [
      'Custom-designed table-tent or counter stand QR card artwork',
      'Eye-catching food & drink iconography with category dividers',
      'Print-ready vector PDF + high-res PNG for professional laminating',
      'Multiple sizes provided (A5, A6, and tent-fold dimensions)',
      '1 complimentary round of menu revisions / link updates',
      'Delivered in 24–48 hours',
    ],
    idealFor: 'Restaurants, coffee shops, juice bars, bakeries, and food trucks.',
  },
  {
    id: 'business-branding',
    title: 'Complete Print-Ready Branding Package',
    pricePkr: 2500,
    badge: 'Best Value',
    summary:
      'Comprehensive promotional collateral suite designed for retail stores, agencies, and expanding businesses.',
    deliverables: [
      'Full brand asset kit: Custom QR emblem, window decal & counter stand layout',
      'Matching digital business card (vCard) and social review booster card',
      'Vector SVG and CMYK print-ready files for commercial print shops',
      'Custom packaging insert / unboxing thank-you card design',
      'Full commercial ownership rights and vector source files',
      'Priority delivery within 24–36 hours with dedicated support',
    ],
    idealFor: 'Retail storefronts, boutique brands, corporate offices, and clinics.',
  },
];
