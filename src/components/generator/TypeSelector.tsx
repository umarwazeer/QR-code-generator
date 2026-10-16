import React from 'react';
import {
  Globe,
  FileText,
  Wifi,
  Contact,
  Mail,
  Phone,
  MessageSquare,
  MessageCircle,
  MapPin,
  Calendar,
  Share2,
  Code2,
} from 'lucide-react';
import { QrType } from '../../types/qr';

interface TypeSelectorProps {
  selectedType: QrType;
  onSelectType: (type: QrType) => void;
}

export const QR_TYPE_CONFIG: {
  id: QrType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}[] = [
  { id: 'url', label: 'URL / Link', icon: Globe, description: 'Website, blog, or web page' },
  { id: 'wifi', label: 'Wi-Fi', icon: Wifi, description: 'Quick scan wireless connect' },
  { id: 'vcard', label: 'Contact', icon: Contact, description: 'Digital vCard business card' },
  { id: 'text', label: 'Text', icon: FileText, description: 'Notes, serials, instructions' },
  { id: 'email', label: 'Email', icon: Mail, description: 'Pre-filled mail message' },
  { id: 'phone', label: 'Phone', icon: Phone, description: 'Direct call dialer' },
  { id: 'sms', label: 'SMS', icon: MessageSquare, description: 'Text message with number' },
  { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle, description: 'Direct chat link' },
  { id: 'location', label: 'Location', icon: MapPin, description: 'GPS coordinates & maps' },
  { id: 'event', label: 'Event', icon: Calendar, description: 'Calendar invite & reminders' },
  { id: 'social', label: 'Social', icon: Share2, description: 'Profiles and social handles' },
  { id: 'custom', label: 'Custom', icon: Code2, description: 'Raw custom payload' },
];

export const TypeSelector: React.FC<TypeSelectorProps> = ({ selectedType, onSelectType }) => {
  return (
    <div className="w-full">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {QR_TYPE_CONFIG.map((item) => {
          const Icon = item.icon;
          const isSelected = selectedType === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectType(item.id)}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left border transition-all text-xs font-medium cursor-pointer ${
                isSelected
                  ? 'bg-indigo-50/80 dark:bg-indigo-950/50 border-indigo-500 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500/20 shadow-xs'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              <div
                className={`p-1.5 rounded-lg shrink-0 ${
                  isSelected
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
              </div>
              <div className="truncate">
                <span className="block truncate">{item.label}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
