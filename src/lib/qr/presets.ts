import { PresetPalette, QrCustomization } from '../../types/qr';

export const DEFAULT_CUSTOMIZATION: QrCustomization = {
  foregroundColor: '#0f172a', // Slate 900
  backgroundColor: '#ffffff',
  transparentBackground: false,
  gradient: {
    enabled: false,
    type: 'linear',
    color1: '#4338ca',
    color2: '#06b6d4',
    rotation: 45,
  },
  dotType: 'rounded',
  cornerSquareType: 'extra-rounded',
  cornerDotType: 'dot',
  cornerSquareColor: '#0f172a',
  cornerDotColor: '#0f172a',
  errorCorrectionLevel: 'M',
  margin: 10,
  logoSize: 0.25,
  logoMargin: 6,
};

export const COLOR_PRESETS: PresetPalette[] = [
  {
    id: 'classic',
    name: 'Classic Black',
    foreground: '#0f172a',
    background: '#ffffff',
    cornerSquareColor: '#0f172a',
    cornerDotColor: '#0f172a',
  },
  {
    id: 'indigo-tech',
    name: 'Indigo Tech',
    foreground: '#3730a3',
    background: '#ffffff',
    cornerSquareColor: '#312e81',
    cornerDotColor: '#4f46e5',
  },
  {
    id: 'emerald-mint',
    name: 'Emerald Minimal',
    foreground: '#065f46',
    background: '#f0fdf4',
    cornerSquareColor: '#047857',
    cornerDotColor: '#059669',
  },
  {
    id: 'crimson-bold',
    name: 'Crimson Bold',
    foreground: '#991b1b',
    background: '#ffffff',
    cornerSquareColor: '#b91c1c',
    cornerDotColor: '#dc2626',
  },
  {
    id: 'royal-violet',
    name: 'Royal Violet',
    foreground: '#581c87',
    background: '#faf5ff',
    cornerSquareColor: '#6b21a8',
    cornerDotColor: '#7e22ce',
  },
  {
    id: 'slate-blue',
    name: 'Midnight Navy',
    foreground: '#1e293b',
    background: '#f8fafc',
    cornerSquareColor: '#0f172a',
    cornerDotColor: '#2563eb',
  },
  {
    id: 'amber-sunset',
    name: 'Sunset Bronze',
    foreground: '#78350f',
    background: '#fffbeb',
    cornerSquareColor: '#92400e',
    cornerDotColor: '#b45309',
  },
];
