import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Download,
  Sliders,
  Layers,
  Sparkles,
  Check,
  Utensils,
  MessageCircle,
  Package,
  Contact,
  Wifi,
  Calendar,
  Globe,
  Share2,
  Building2,
  Info,
} from 'lucide-react';
import { QR_TYPE_CONFIG } from '../components/generator/TypeSelector';
import { ContactSection } from '../components/contact/ContactSection';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [quickUrl, setQuickUrl] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleQuickCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickUrl.trim()) {
      navigate(`/generator?type=url&url=${encodeURIComponent(quickUrl.trim())}`);
    } else {
      navigate('/generator');
    }
  };

  const businessUseCases = [
    {
      id: 'menu',
      title: 'Restaurant & Cafe Menus',
      subtitle: 'Contactless Dining & Instant Menus',
      description:
        'Display on table tents and window stickers. Customers scan with their phone camera to instantly view your food, wine, and daily specials menu.',
      type: 'url',
      icon: Utensils,
      color: 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400',
      actionText: 'Create Menu QR',
      sampleUrl: 'https://qrstudio.app/menu',
    },
    {
      id: 'whatsapp',
      title: 'WhatsApp Ordering & Support',
      subtitle: 'Direct 1-Tap Customer Chat',
      description:
        'Let clients start a WhatsApp conversation with pre-filled order details or customer inquiries without typing in your phone number.',
      type: 'whatsapp',
      icon: MessageCircle,
      color: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400',
      actionText: 'Create WhatsApp QR',
    },
    {
      id: 'packaging',
      title: 'Product Packaging & Labels',
      subtitle: 'Digital Guides & Authenticity',
      description:
        'Add razor-sharp 2048px vector QR codes to your retail packaging, boxes, and garment tags linking to digital manuals and tutorials.',
      type: 'url',
      icon: Package,
      color: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400',
      actionText: 'Create Packaging QR',
    },
    {
      id: 'vcard',
      title: 'Digital Business Cards (vCard)',
      subtitle: 'Instant Contact Saving',
      description:
        'Empower sales representatives and founders. A single scan saves your full name, title, company, phone, and email straight into their phone address book.',
      type: 'vcard',
      icon: Contact,
      color: 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400',
      actionText: 'Create Contact QR',
    },
    {
      id: 'wifi',
      title: 'Guest Wi-Fi Network Access',
      subtitle: 'Zero Password Typing for Guests',
      description:
        'Place framed QR codes in your lobby, cafe, hotel, or retail store. Guests connect seamlessly to your secure network with zero manual typing.',
      type: 'wifi',
      icon: Wifi,
      color: 'bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400',
      actionText: 'Create Wi-Fi QR',
    },
    {
      id: 'events',
      title: 'Conferences & Events',
      subtitle: 'Schedules, Venues & RSVPs',
      description:
        'Print on attendee badges, banners, and promotional posters. Attendees add event start times, locations, and descriptions straight to their calendar.',
      type: 'event',
      icon: Calendar,
      color: 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400',
      actionText: 'Create Event QR',
    },
    {
      id: 'website',
      title: 'Website & Marketing Campaigns',
      subtitle: 'Flyers, Billboards & Direct Mail',
      description:
        'Turn offline billboards, vehicle wraps, and paper brochures into direct website traffic with clean vector graphics that scale to any size.',
      type: 'url',
      icon: Globe,
      color: 'bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400',
      actionText: 'Create Website QR',
    },
    {
      id: 'social',
      title: 'Social Media & Brand Channels',
      subtitle: 'Expand Your Follower Base',
      description:
        'Encourage in-store shoppers to follow your brand on Instagram, LinkedIn, YouTube, TikTok, or Facebook with a quick scan at checkout.',
      type: 'social',
      icon: Share2,
      color: 'bg-fuchsia-50 dark:bg-fuchsia-950/60 text-fuchsia-600 dark:text-fuchsia-400',
      actionText: 'Create Social QR',
    },
  ];

  const faqs = [
    {
      q: 'Do these QR codes ever expire or stop working?',
      a: 'No, never! QR Studio generates static QR codes. The encoded data (such as your URL, Wi-Fi credentials, or vCard) is embedded directly into the matrix pattern itself. Because there is no intermediary redirect server or subscription lock, your QR codes will function permanently on your packaging and print materials.',
    },
    {
      q: 'Why should businesses prefer static QR codes over subscription platforms?',
      a: 'Many commercial QR platforms offer a free trial, then disable your printed QR codes unless you pay an ongoing monthly fee ($15–$50/month). If your subscription lapses, all your printed menus, posters, and packaging stop working. QR Studio generates genuine static codes that are permanently free with zero recurring costs.',
    },
    {
      q: 'Can I use generated QR codes for commercial projects and printed packaging?',
      a: 'Yes, 100% free for both personal and commercial use. You can export up to 2048px high-resolution PNG images, scalable vector SVGs, and print-ready PDF files suitable for business cards, billboards, menus, and product labels.',
    },
    {
      q: 'Does QR Studio store, track, or analyze my customer scans?',
      a: 'No. QR Studio does not track scans or collect telemetry. All QR code generation is performed locally in your browser using modern Web APIs. Static QR codes encode data directly—ordinary static QR codes do not ping an external server or provide scan analytics, which guarantees complete privacy for you and your customers.',
    },
    {
      q: 'Can I add my company logo or brand colors to the QR code?',
      a: 'Yes! You can upload your own PNG, JPG, or SVG logo, customize foreground and background colors, apply two-color linear gradients, and choose custom corner shapes. Our engine automatically adjusts error correction levels (up to 30% recovery) so camera scanners can still read the code reliably even with your logo placed in the center.',
    },
  ];

  return (
    <div className="space-y-24 pb-16">
      {/* HERO SECTION */}
      <section className="relative pt-12 md:pt-20 pb-10 overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Turn Every Customer Interaction Into a Scan · 100% Free & Permanent</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15]">
            Create Your Free Business QR Code in Seconds
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Connect customers to your menu, WhatsApp, website, products, contact details, and more.
            One scan. Easier connections. Better customer experiences.
          </p>

          {/* Quick Launch Input */}
          <form
            onSubmit={handleQuickCreate}
            className="max-w-xl mx-auto flex flex-col sm:flex-row items-center gap-2 p-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md"
          >
            <input
              type="text"
              placeholder="Enter your website URL or business link..."
              value={quickUrl}
              onChange={(e) => setQuickUrl(e.target.value)}
              className="w-full px-4 py-3 text-sm rounded-xl bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
            />
            <button
              type="submit"
              className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-sm transition-all cursor-pointer"
            >
              <span>Create My QR Code — Free</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Feature Highlights beneath hero */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs font-medium text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-500" />
              SVG, PNG (2048px) & PDF
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-500" />
              Never Expires (No Subscription)
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-500" />
              Company Logo & Colors
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-500" />
              Zero Tracking Privacy
            </span>
          </div>
        </div>
      </section>

      {/* BUSINESS USE CASES SECTION */}
      <section id="use-cases" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5" />
            <span>Proven Commercial Applications</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Built for Every Business Sector
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm max-w-xl mx-auto leading-relaxed">
            See how cafes, retail stores, consultants, and event organizers turn everyday print surfaces into instant customer touchpoints.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {businessUseCases.map((useCase) => {
            const Icon = useCase.icon;
            const targetUrl = `/generator?type=${useCase.type}${
              useCase.sampleUrl ? `&url=${encodeURIComponent(useCase.sampleUrl)}` : ''
            }`;
            return (
              <div
                key={useCase.id}
                className="group flex flex-col justify-between p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all hover:shadow-xs"
              >
                <div className="space-y-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${useCase.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-0.5">
                      {useCase.subtitle}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {useCase.title}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {useCase.description}
                  </p>
                </div>

                <div className="pt-5 mt-4 border-t border-slate-100 dark:border-slate-800/80">
                  <button
                    type="button"
                    onClick={() => navigate(targetUrl)}
                    className="w-full flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors cursor-pointer"
                  >
                    <span>{useCase.actionText}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            How It Works
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm max-w-lg mx-auto">
            Design professional business QR codes in three simple steps with instant live preview.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs relative">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold flex items-center justify-center mb-4">
              1
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-white text-base mb-1.5">
              Select Content Type
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Choose from 12 standard formats including Website URLs, Wi-Fi networks, digital vCard business cards, email, WhatsApp, and events.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs relative">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold flex items-center justify-center mb-4">
              2
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-white text-base mb-1.5">
              Customize Design & Logo
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Tailor foreground and background colors, apply linear gradients, select rounded or dot patterns, and embed your brand logo seamlessly.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs relative">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold flex items-center justify-center mb-4">
              3
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-white text-base mb-1.5">
              Export in Any Format
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Download clean vector SVGs for limitless scaling, ultra high-res 2048px PNGs for graphics, or print-ready formatted PDF documents.
            </p>
          </div>
        </div>
      </section>

      {/* SUPPORTED QR TYPES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              12 Supported QR Code Types
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
              Engineered for all common mobile camera scanner protocols.
            </p>
          </div>
          <Link
            to="/generator"
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
          >
            <span>Open Generator Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {QR_TYPE_CONFIG.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => navigate(`/generator?type=${item.id}`)}
                className="group p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 text-left transition-all hover:shadow-xs cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 group-hover:bg-indigo-600 group-hover:text-white transition-colors flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {item.label}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {item.description}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* CUSTOMIZATION & EXPORT SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-slate-900 text-white p-8 sm:p-12 border border-slate-800 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-5">
              <span className="text-xs uppercase tracking-wider text-indigo-400 font-semibold">
                Vector Precision
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
                Designed for Flawless Printing and Digital Sharing
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                Whether you need a QR code for a business window sticker, a high-gloss product packaging box, or a conference presentation slide, QR Studio produces crisp, razor-sharp output without artifacts.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-start gap-2.5">
                  <Download className="w-4 h-4 text-indigo-400 mt-1 shrink-0" />
                  <div>
                    <h4 className="text-xs font-semibold text-white">PNG Up to 2048px</h4>
                    <p className="text-[11px] text-slate-400">Crisp raster rendering for web, social, and digital displays.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Layers className="w-4 h-4 text-indigo-400 mt-1 shrink-0" />
                  <div>
                    <h4 className="text-xs font-semibold text-white">Infinite Vector SVG</h4>
                    <p className="text-[11px] text-slate-400">Scale without pixelation for billboards and signage.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Sliders className="w-4 h-4 text-indigo-400 mt-1 shrink-0" />
                  <div>
                    <h4 className="text-xs font-semibold text-white">Print-Ready PDF</h4>
                    <p className="text-[11px] text-slate-400">Clean A4 document layout with your title and instructions.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-indigo-400 mt-1 shrink-0" />
                  <div>
                    <h4 className="text-xs font-semibold text-white">Optical Verification</h4>
                    <p className="text-[11px] text-slate-400">Built-in WCAG contrast checks to avoid unreadable color combinations.</p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/generator"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-medium text-xs shadow-sm transition-colors"
                >
                  <span>Launch QR Studio Generator</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Visual preview banner */}
            <div className="bg-slate-950/80 p-6 rounded-2xl border border-slate-800 flex flex-col items-center justify-center text-center">
              <div className="w-48 h-48 bg-white rounded-2xl p-4 shadow-xl flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900" fill="currentColor">
                  <rect x="0" y="0" width="30" height="30" rx="4" />
                  <rect x="5" y="5" width="20" height="20" rx="2" fill="white" />
                  <rect x="10" y="10" width="10" height="10" rx="2" />

                  <rect x="70" y="0" width="30" height="30" rx="4" />
                  <rect x="75" y="5" width="20" height="20" rx="2" fill="white" />
                  <rect x="80" y="10" width="10" height="10" rx="2" />

                  <rect x="0" y="70" width="30" height="30" rx="4" />
                  <rect x="5" y="75" width="20" height="20" rx="2" fill="white" />
                  <rect x="10" y="80" width="10" height="10" rx="2" />

                  <circle cx="50" cy="20" r="4" fill="#4f46e5" />
                  <circle cx="50" cy="50" r="8" fill="#4f46e5" />
                  <circle cx="20" cy="50" r="4" />
                  <circle cx="80" cy="50" r="4" />
                  <circle cx="50" cy="80" r="4" />
                  <rect x="70" y="70" width="10" height="10" rx="2" fill="#4f46e5" />
                  <rect x="85" y="85" width="15" height="15" rx="3" />
                </svg>
              </div>
              <div className="mt-4 text-xs font-mono text-slate-400">
                Standards-compliant · Instant scan
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST & PRIVACY EXPLAINER BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-8 rounded-3xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-900/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
              <Info className="w-4 h-4" />
              <span>Transparent & Honest Technology</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Pure Static Codes · No Middleman · Zero Scan Analytics
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              QR Studio encodes your information directly into the QR matrix in your browser. Because these are pure static QR codes, there are no tracking pixels or scan counters—your customers connect directly to your link with complete privacy and zero data leakage.
            </p>
          </div>
          <Link
            to="/about"
            className="shrink-0 px-4 py-2.5 rounded-xl border border-indigo-300 dark:border-indigo-700 bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-300 text-xs font-semibold hover:bg-indigo-50 dark:hover:bg-slate-800 transition-colors shadow-2xs"
          >
            Learn How It Works
          </Link>
        </div>
      </section>

      {/* FREQUENTLY ASKED QUESTIONS */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Everything you need to know about creating and deploying static QR codes for your business.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-4 text-left font-medium text-sm text-slate-900 dark:text-white cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          Ready to create your custom QR code?
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-md mx-auto">
          No sign-up, no hidden subscriptions, and no expiration dates. Completely free forever.
        </p>
        <div className="pt-2">
          <Link
            to="/generator"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-sm transition-all"
          >
            <span>Start Generating Now</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* PRIVATE CONTACT FORM (Immediately above the footer) */}
      <ContactSection />
    </div>
  );
};
