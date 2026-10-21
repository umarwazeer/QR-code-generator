import React from 'react';
import {
  Sparkles,
  RotateCcw,
  Eye,
  EyeOff,
  Navigation,
} from 'lucide-react';
import {
  QrType,
  WifiFormData,
  VCardFormData,
  EmailFormData,
  SmsFormData,
  WhatsAppFormData,
  LocationFormData,
  EventFormData,
  SocialFormData,
} from '../../types/qr';

interface FormFieldsProps {
  type: QrType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (data: any) => void;
  onReset: () => void;
  onLoadSample: () => void;
}

export const FormFields: React.FC<FormFieldsProps> = ({
  type,
  data,
  onChange,
  onReset,
  onLoadSample,
}) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [geoLocating, setGeoLocating] = React.useState(false);

  // Field change helper
  const updateField = (field: string, value: unknown) => {
    onChange({ ...data, [field]: value });
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      console.warn('Geolocation is not supported by your browser.');
      return;
    }
    setGeoLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGeoLocating(false);
        onChange({
          ...data,
          latitude: pos.coords.latitude.toFixed(6),
          longitude: pos.coords.longitude.toFixed(6),
        });
      },
      (err) => {
        setGeoLocating(false);
        console.warn('Geolocation error:', err.message);
      },
      { timeout: 10000 }
    );
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800/80">
        <div>
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
            Content Details
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Enter the details to embed inside your static QR code
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onLoadSample}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors"
            title="Load sample content to test generation"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Load Sample</span>
          </button>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Clear all fields"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>
      </div>

      {/* Dynamic forms based on type */}
      {type === 'url' && (
        <div className="space-y-4">
          <div>
            <label htmlFor="url-input" className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Website URL <span className="text-rose-500">*</span>
            </label>
            <input
              id="url-input"
              type="text"
              placeholder="https://example.com or yourbrand.com"
              value={data.url || ''}
              onChange={(e) => updateField('url', e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
              Users who scan will be redirected directly to this web address.
            </p>
          </div>
        </div>
      )}

      {type === 'text' && (
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="text-input" className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                Plain Text Message <span className="text-rose-500">*</span>
              </label>
              <span className="text-xs text-slate-500 font-mono">
                {(data.text || '').length} characters
              </span>
            </div>
            <textarea
              id="text-input"
              rows={4}
              placeholder="Enter plain text, notes, serial numbers, product codes, or instructions..."
              value={data.text || ''}
              onChange={(e) => updateField('text', e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      )}

      {type === 'wifi' && (
        <div className="space-y-4">
          <div>
            <label htmlFor="wifi-ssid" className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Network Name (SSID) <span className="text-rose-500">*</span>
            </label>
            <input
              id="wifi-ssid"
              type="text"
              placeholder="e.g. Guest-WiFi or Studio-Office"
              value={(data as WifiFormData).ssid || ''}
              onChange={(e) => updateField('ssid', e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="wifi-security" className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Security Protocol
              </label>
              <select
                id="wifi-security"
                value={(data as WifiFormData).security || 'WPA'}
                onChange={(e) => updateField('security', e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="WPA">WPA / WPA2 / WPA3 (Standard)</option>
                <option value="WEP">WEP (Legacy)</option>
                <option value="nopass">None (Open Network)</option>
              </select>
            </div>

            {(data as WifiFormData).security !== 'nopass' && (
              <div>
                <label htmlFor="wifi-pass" className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="wifi-pass"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Wireless network password"
                    value={(data as WifiFormData).password || ''}
                    onChange={(e) => updateField('password', e.target.value)}
                    className="w-full px-3.5 py-2.5 pr-10 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="hidden-network"
              checked={!!(data as WifiFormData).hidden}
              onChange={(e) => updateField('hidden', e.target.checked)}
              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
            />
            <label htmlFor="hidden-network" className="text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
              Hidden Network (SSID is not broadcasting)
            </label>
          </div>
        </div>
      )}

      {type === 'vcard' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                First Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Alex"
                value={(data as VCardFormData).firstName || ''}
                onChange={(e) => updateField('firstName', e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Last Name
              </label>
              <input
                type="text"
                placeholder="Morgan"
                value={(data as VCardFormData).lastName || ''}
                onChange={(e) => updateField('lastName', e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Organization / Company
              </label>
              <input
                type="text"
                placeholder="Acme Studio Inc."
                value={(data as VCardFormData).organization || ''}
                onChange={(e) => updateField('organization', e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Job Title
              </label>
              <input
                type="text"
                placeholder="Product Lead"
                value={(data as VCardFormData).jobTitle || ''}
                onChange={(e) => updateField('jobTitle', e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="+1 555-0199"
                value={(data as VCardFormData).phone || ''}
                onChange={(e) => updateField('phone', e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="alex@acme.com"
                value={(data as VCardFormData).email || ''}
                onChange={(e) => updateField('email', e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Website
              </label>
              <input
                type="text"
                placeholder="https://acme.com"
                value={(data as VCardFormData).website || ''}
                onChange={(e) => updateField('website', e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                City / Location
              </label>
              <input
                type="text"
                placeholder="San Francisco, CA"
                value={(data as VCardFormData).city || ''}
                onChange={(e) => updateField('city', e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>
      )}

      {type === 'email' && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Recipient Email <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              placeholder="contact@example.com"
              value={(data as EmailFormData).email || ''}
              onChange={(e) => updateField('email', e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Subject Line
            </label>
            <input
              type="text"
              placeholder="Inquiry regarding design services"
              value={(data as EmailFormData).subject || ''}
              onChange={(e) => updateField('subject', e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Body / Pre-filled Message
            </label>
            <textarea
              rows={3}
              placeholder="Hello, I would like more information on..."
              value={(data as EmailFormData).body || ''}
              onChange={(e) => updateField('body', e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      )}

      {type === 'phone' && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Phone Number <span className="text-rose-500">*</span>
            </label>
            <input
              type="tel"
              placeholder="+1 (555) 234-5678"
              value={data.phone || ''}
              onChange={(e) => updateField('phone', e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500"
            />
            <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
              Include country code (e.g. +1 for US/Canada, +44 for UK, +49 for Germany) for universal dialing.
            </p>
          </div>
        </div>
      )}

      {type === 'sms' && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Recipient Phone Number <span className="text-rose-500">*</span>
            </label>
            <input
              type="tel"
              placeholder="+1 555-0144"
              value={(data as SmsFormData).phone || ''}
              onChange={(e) => updateField('phone', e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Prefilled SMS Text
            </label>
            <textarea
              rows={3}
              placeholder="e.g. SUBSCRIBE or RSVP YES"
              value={(data as SmsFormData).message || ''}
              onChange={(e) => updateField('message', e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      )}

      {type === 'whatsapp' && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              WhatsApp Number <span className="text-rose-500">*</span>
            </label>
            <input
              type="tel"
              placeholder="15551234567 (with country code, no + or dashes)"
              value={(data as WhatsAppFormData).phone || ''}
              onChange={(e) => updateField('phone', e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500"
            />
            <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
              Must include country code without plus sign (e.g., 14155552671 for US, 447911123456 for UK).
            </p>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Prefilled Message (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="Hi! I scanned your QR code and would like to chat."
              value={(data as WhatsAppFormData).message || ''}
              onChange={(e) => updateField('message', e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      )}

      {type === 'location' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Latitude (-90 to 90) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="37.7749"
                value={(data as LocationFormData).latitude || ''}
                onChange={(e) => updateField('latitude', e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Longitude (-180 to 180) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="-122.4194"
                value={(data as LocationFormData).longitude || ''}
                onChange={(e) => updateField('longitude', e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-3">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Format:</label>
              <label className="inline-flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
                <input
                  type="radio"
                  name="loc-format"
                  value="maps"
                  checked={(data as LocationFormData).format === 'maps'}
                  onChange={() => updateField('format', 'maps')}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
                Google Maps Link
              </label>
              <label className="inline-flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
                <input
                  type="radio"
                  name="loc-format"
                  value="geo"
                  checked={(data as LocationFormData).format === 'geo'}
                  onChange={() => updateField('format', 'geo')}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
                Standard Geo URI (geo:)
              </label>
            </div>

            <button
              type="button"
              onClick={handleGetCurrentLocation}
              disabled={geoLocating}
              className="inline-flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>{geoLocating ? 'Locating...' : 'Use current GPS'}</span>
            </button>
          </div>
        </div>
      )}

      {type === 'event' && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Event Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Design Conference 2026"
              value={(data as EventFormData).title || ''}
              onChange={(e) => updateField('title', e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Start Date & Time <span className="text-rose-500">*</span>
              </label>
              <input
                type="datetime-local"
                value={(data as EventFormData).startDateTime || ''}
                onChange={(e) => updateField('startDateTime', e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                End Date & Time
              </label>
              <input
                type="datetime-local"
                value={(data as EventFormData).endDateTime || ''}
                onChange={(e) => updateField('endDateTime', e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Location / Venue
            </label>
            <input
              type="text"
              placeholder="Moscone Center, San Francisco or Online"
              value={(data as EventFormData).location || ''}
              onChange={(e) => updateField('location', e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Event Description
            </label>
            <textarea
              rows={2}
              placeholder="Join us for keynotes, workshops, and networking."
              value={(data as EventFormData).description || ''}
              onChange={(e) => updateField('description', e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      )}

      {type === 'social' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Platform
              </label>
              <select
                value={(data as SocialFormData).platform || 'instagram'}
                onChange={(e) => updateField('platform', e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
              >
                <option value="instagram">Instagram</option>
                <option value="linkedin">LinkedIn</option>
                <option value="x">X (Twitter)</option>
                <option value="youtube">YouTube</option>
                <option value="tiktok">TikTok</option>
                <option value="facebook">Facebook</option>
                <option value="github">GitHub</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Username or Profile URL <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. @yourusername or full URL"
                value={(data as SocialFormData).handleOrUrl || ''}
                onChange={(e) => updateField('handleOrUrl', e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>
      )}

      {type === 'custom' && (
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                Raw Custom Payload <span className="text-rose-500">*</span>
              </label>
              <span className="text-xs text-slate-500 font-mono">
                {(data.custom || '').length} characters
              </span>
            </div>
            <textarea
              rows={4}
              placeholder="Enter any raw string, custom URI scheme, JSON payload, or specialized scanner command..."
              value={data.custom || ''}
              onChange={(e) => updateField('custom', e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm font-mono rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      )}
    </div>
  );
};
