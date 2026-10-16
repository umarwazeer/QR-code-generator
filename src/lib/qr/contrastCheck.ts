/**
 * Checks color contrast and scan reliability for QR codes.
 */

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const cleanHex = hex.replace('#', '').trim();
  if (cleanHex.length === 3) {
    return {
      r: parseInt(cleanHex[0] + cleanHex[0], 16),
      g: parseInt(cleanHex[1] + cleanHex[1], 16),
      b: parseInt(cleanHex[2] + cleanHex[2], 16),
    };
  }
  if (cleanHex.length === 6) {
    return {
      r: parseInt(cleanHex.substring(0, 2), 16),
      g: parseInt(cleanHex.substring(2, 4), 16),
      b: parseInt(cleanHex.substring(4, 6), 16),
    };
  }
  return null;
}

function getLuminance(r: number, g: number, b: number): number {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

export interface ContrastAnalysis {
  ratio: number;
  isReliable: boolean;
  isInverted: boolean;
  warning?: string;
}

export function analyzeQrContrast(
  fgHex: string,
  bgHex: string,
  isTransparent: boolean
): ContrastAnalysis {
  if (isTransparent) {
    // If background is transparent, warn user that target surface must provide contrast
    return {
      ratio: 5.0,
      isReliable: true,
      isInverted: false,
      warning: 'Transparent background: ensure the QR is placed on a high-contrast light surface.',
    };
  }

  const fg = hexToRgb(fgHex);
  const bg = hexToRgb(bgHex);

  if (!fg || !bg) {
    return { ratio: 21, isReliable: true, isInverted: false };
  }

  const lumFg = getLuminance(fg.r, fg.g, fg.b);
  const lumBg = getLuminance(bg.r, bg.g, bg.b);

  const brighter = Math.max(lumFg, lumBg);
  const darker = Math.min(lumFg, lumBg);
  const ratio = (brighter + 0.05) / (darker + 0.05);

  const isInverted = lumFg > lumBg; // Light dots on dark background

  let warning: string | undefined;

  if (ratio < 2.5) {
    warning = 'Very low contrast! Most standard smartphone cameras will fail to scan this QR code.';
  } else if (ratio < 4.0) {
    warning = 'Sub-optimal contrast. Some phone cameras in dim lighting may struggle to read it.';
  } else if (isInverted) {
    warning = 'Inverted colors (light QR on dark background). While supported by modern smartphones, some physical barcode scanners prefer dark on light.';
  }

  return {
    ratio: Math.round(ratio * 10) / 10,
    isReliable: ratio >= 3.0,
    isInverted,
    warning,
  };
}
