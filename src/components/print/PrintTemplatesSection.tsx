import React, { useState } from 'react';
import {
  CreditCard,
  FileSpreadsheet,
  Columns3,
  QrCode,
  Info,
} from 'lucide-react';
import {
  PrintTemplateConfig,
  PrintTemplateType,
  PRINT_TEMPLATE_PRESETS,
} from '../../types/printTemplate';
import { QrCustomization, QrType } from '../../types/qr';
import { PrintTemplateControls } from './PrintTemplateControls';
import { PrintTemplatePreview } from './PrintTemplatePreview';
import { TypeSelector } from '../generator/TypeSelector';
import { FormFields } from '../generator/FormFields';
import { useToast } from '../ui/Toast';

interface PrintTemplatesSectionProps {
  qrPayload: string;
  selectedType: QrType;
  formData: Record<string, any>;
  customization: QrCustomization;
  onSelectType: (type: QrType) => void;
  onChangeFormData: (data: Record<string, any>) => void;
  onResetFormData: () => void;
  onLoadSampleData: () => void;
}

export const PrintTemplatesSection: React.FC<PrintTemplatesSectionProps> = ({
  qrPayload,
  selectedType,
  formData,
  customization,
  onSelectType,
  onChangeFormData,
  onResetFormData,
  onLoadSampleData,
}) => {
  const { showToast } = useToast();
  const [templateType, setTemplateType] = useState<PrintTemplateType>('business-card');
  const [config, setConfig] = useState<PrintTemplateConfig>(
    PRINT_TEMPLATE_PRESETS['business-card'].defaultConfig
  );

  const handleSelectTemplate = (type: PrintTemplateType) => {
    setTemplateType(type);
    const preset = PRINT_TEMPLATE_PRESETS[type];
    setConfig(preset.defaultConfig);

    // Contextual QR type suggestion:
    if (type === 'business-card' && selectedType !== 'vcard') {
      onSelectType('vcard');
      if (!formData.firstName) {
        onChangeFormData({
          firstName: 'Alex',
          lastName: 'Morgan',
          phone: '+1 (415) 555-0199',
          email: 'alex@example.com',
          jobTitle: 'Principal Consultant',
          website: 'https://qr-studio-umar.vercel.app',
        });
      }
    } else if (type === 'tent-card' && selectedType !== 'url' && selectedType !== 'wifi') {
      onSelectType('url');
    }

    showToast(`Switched to ${preset.name} print layout`, 'info');
  };

  const handleResetDefaults = () => {
    const preset = PRINT_TEMPLATE_PRESETS[templateType];
    setConfig(preset.defaultConfig);
    showToast(`Reset ${preset.name} to standard defaults`, 'info');
  };

  return (
    <div className="space-y-6">
      {/* Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pt-2">
        {/* Left Column: Template Selection, Customization & Content */}
        <div className="lg:col-span-7 space-y-6">
          <PrintTemplateControls
            config={config}
            onChange={setConfig}
            onSelectTemplate={handleSelectTemplate}
            onResetDefaults={handleResetDefaults}
          />

          {/* QR Payload Content configuration */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
                  4. QR Payload & Destination
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Configure what users will see when they scan the QR on your printout
                </p>
              </div>

              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-semibold uppercase">
                {selectedType}
              </span>
            </div>

            <TypeSelector selectedType={selectedType} onSelectType={onSelectType} />

            <div className="pt-2">
              <FormFields
                type={selectedType}
                data={formData}
                onChange={onChangeFormData}
                onReset={onResetFormData}
                onLoadSample={onLoadSampleData}
              />
            </div>
          </div>

          {/* Permanent Static QR Info Banner */}
          <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 text-xs text-indigo-900 dark:text-indigo-300 flex items-start gap-3">
            <Info className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-semibold block">Print-Ready Vector Precision</span>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                All templates generate 300 DPI high-resolution matrices with optional crop guides. QR codes are static and permanent, ensuring your printed cards, flyers, and tent displays function indefinitely without subscription expirations.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Live Mockup Preview & Download Actions */}
        <div className="lg:col-span-5">
          <PrintTemplatePreview
            config={config}
            qrPayload={qrPayload}
            qrType={selectedType}
            customization={customization}
          />
        </div>
      </div>
    </div>
  );
};
