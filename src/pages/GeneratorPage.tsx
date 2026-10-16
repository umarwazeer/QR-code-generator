import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  History,
  RotateCcw,
  Sparkles,
  Info,
} from 'lucide-react';
import { QrType, QrCustomization, QrHistoryEntry } from '../types/qr';
import { DEFAULT_CUSTOMIZATION } from '../lib/qr/presets';
import {
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
} from '../lib/qr/payloadBuilders';
import { TypeSelector } from '../components/generator/TypeSelector';
import { FormFields } from '../components/generator/FormFields';
import { CustomizationPanel } from '../components/generator/CustomizationPanel';
import { QrPreview } from '../components/generator/QrPreview';
import { HistoryModal } from '../components/generator/HistoryModal';
import { useToast } from '../components/ui/Toast';

export const GeneratorPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { showToast } = useToast();

  const initialType = (searchParams.get('type') as QrType) || 'url';
  const initialUrl = searchParams.get('url') || '';

  const [selectedType, setSelectedType] = useState<QrType>(initialType);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [formData, setFormData] = useState<Record<string, any>>({
    url: initialUrl || 'https://qrstudio.app',
  });
  const [customization, setCustomization] = useState<QrCustomization>(DEFAULT_CUSTOMIZATION);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  // Sync URL query params if type changes
  const handleSelectType = (type: QrType) => {
    setSelectedType(type);
    setSearchParams({ type });
  };

  // Sample data generator for each type
  const handleLoadSample = () => {
    switch (selectedType) {
      case 'url':
        setFormData({ url: 'https://qrstudio.app' });
        break;
      case 'text':
        setFormData({
          text: 'Welcome to QR Studio! Enjoy your complimentary coffee on the 3rd floor lounge. WiFi code: Studio2026',
        });
        break;
      case 'wifi':
        setFormData({
          ssid: 'CoffeeShop-Guest',
          password: 'SummerCoffee2026!',
          security: 'WPA',
          hidden: false,
        });
        break;
      case 'vcard':
        setFormData({
          firstName: 'Alex',
          lastName: 'Morgan',
          organization: 'Apex Interactive',
          jobTitle: 'Creative Director',
          phone: '+1 (415) 555-0199',
          email: 'alex@apexcreative.io',
          website: 'https://apexcreative.io',
          street: '500 Howard Street',
          city: 'San Francisco',
          state: 'CA',
          zip: '94105',
          country: 'USA',
          notes: 'Met at Design Summit 2026',
        });
        break;
      case 'email':
        setFormData({
          email: 'hello@qrstudio.app',
          subject: 'Partnership Inquiry',
          body: 'Hello QR Studio team, I would like to inquire about integrating your custom QR codes.',
        });
        break;
      case 'phone':
        setFormData({ phone: '+1 (800) 555-0199' });
        break;
      case 'sms':
        setFormData({
          phone: '+1 555-0144',
          message: 'JOIN VIP',
        });
        break;
      case 'whatsapp':
        setFormData({
          phone: '14155552671',
          message: 'Hi there! I scanned your QR code and would like to chat.',
        });
        break;
      case 'location':
        setFormData({
          latitude: '37.7749',
          longitude: '-122.4194',
          format: 'maps',
        });
        break;
      case 'event':
        setFormData({
          title: 'Global Tech & Design Expo',
          startDateTime: '2026-11-15T09:00',
          endDateTime: '2026-11-15T17:00',
          location: 'Moscone Convention Center, SF',
          description: 'Keynotes, networking sessions, and interactive workshops.',
          allDay: false,
        });
        break;
      case 'social':
        setFormData({
          platform: 'instagram',
          handleOrUrl: 'qrstudio',
        });
        break;
      case 'custom':
        setFormData({
          custom: '{"app":"QRStudio","action":"checkin","station":12,"timestamp":1780000000}',
        });
        break;
    }
    showToast(`Loaded sample data for ${selectedType.toUpperCase()}`, 'info');
  };

  // Reset form
  const handleResetForm = () => {
    setFormData({});
    showToast('Cleared content fields', 'info');
  };

  // Reset all including styling
  const handleResetAll = () => {
    setFormData({ url: 'https://qrstudio.app' });
    setCustomization(DEFAULT_CUSTOMIZATION);
    setSelectedType('url');
    showToast('Reset generator to default settings', 'info');
  };

  // Load entry from history modal
  const handleLoadFromHistory = (entry: QrHistoryEntry) => {
    setSelectedType(entry.type);
    setFormData(entry.formData || {});
    if (entry.customization) {
      setCustomization(entry.customization);
    }
  };

  // Compute raw payload string
  const rawPayload = useMemo(() => {
    switch (selectedType) {
      case 'url':
        return formatUrl(formData.url || '');
      case 'text':
        return formData.text || '';
      case 'wifi':
        return buildWifiPayload({
          ssid: formData.ssid || '',
          password: formData.password || '',
          security: formData.security || 'WPA',
          hidden: !!formData.hidden,
        });
      case 'vcard':
        return buildVCardPayload(formData as any);
      case 'email':
        return buildEmailPayload({
          email: formData.email || '',
          subject: formData.subject,
          body: formData.body,
        });
      case 'phone':
        return buildPhonePayload(formData.phone || '');
      case 'sms':
        return buildSmsPayload({
          phone: formData.phone || '',
          message: formData.message,
        });
      case 'whatsapp':
        return buildWhatsAppPayload({
          phone: formData.phone || '',
          message: formData.message,
        });
      case 'location':
        return buildLocationPayload({
          latitude: formData.latitude || '',
          longitude: formData.longitude || '',
          format: formData.format || 'maps',
        });
      case 'event':
        return buildEventPayload(formData as any);
      case 'social':
        return buildSocialPayload({
          platform: formData.platform || 'instagram',
          handleOrUrl: formData.handleOrUrl || '',
        });
      case 'custom':
        return formData.custom || '';
      default:
        return '';
    }
  }, [selectedType, formData]);

  // Derived title hint for file naming
  const titleHint = useMemo(() => {
    switch (selectedType) {
      case 'url':
        return formData.url ? `qr-${formData.url.replace(/^https?:\/\//, '').split('/')[0]}` : 'qr-website';
      case 'wifi':
        return formData.ssid ? `qr-wifi-${formData.ssid}` : 'qr-wifi';
      case 'vcard':
        return formData.firstName ? `qr-contact-${formData.firstName}-${formData.lastName || ''}` : 'qr-vcard';
      case 'event':
        return formData.title ? `qr-event-${formData.title}` : 'qr-event';
      case 'social':
        return formData.handleOrUrl ? `qr-${formData.platform}-${formData.handleOrUrl}` : 'qr-social';
      default:
        return `qr-${selectedType}`;
    }
  }, [selectedType, formData]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            QR Generator Studio
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Craft customized, standards-compliant QR codes with real-time vector preview.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsHistoryModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <History className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Recent Codes</span>
          </button>

          <button
            type="button"
            onClick={handleResetAll}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Reset generator to initial defaults"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Defaults</span>
          </button>
        </div>
      </div>

      {/* Content Type Selector */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Step 1: Select QR Type
        </label>
        <TypeSelector selectedType={selectedType} onSelectType={handleSelectType} />
      </div>

      {/* Workspace Grid: Left Form & Customization, Right Sticky Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pt-2">
        {/* Left Column: Form & Styling */}
        <div className="lg:col-span-7 space-y-6">
          <FormFields
            type={selectedType}
            data={formData}
            onChange={setFormData}
            onReset={handleResetForm}
            onLoadSample={handleLoadSample}
          />

          <CustomizationPanel
            customization={customization}
            onChange={setCustomization}
          />

          {/* Static QR Notice banner */}
          <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 text-xs text-indigo-900 dark:text-indigo-300 flex items-start gap-3">
            <Info className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-semibold block">Permanent Static QR Code</span>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                The payload is encoded directly into the matrix. It never expires, has no scan limits, and requires no ongoing hosting or subscription.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Live QR Preview & Downloads */}
        <div className="lg:col-span-5">
          <QrPreview
            payload={rawPayload}
            type={selectedType}
            customization={customization}
            titleHint={titleHint}
            formData={formData}
          />
        </div>
      </div>

      {/* History Modal */}
      <HistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        onLoadEntry={handleLoadFromHistory}
      />
    </div>
  );
};
