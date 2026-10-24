import QRCodeStyling from 'qr-code-styling';
import { jsPDF } from 'jspdf';
import { QrCustomization } from '../../types/qr';

/**
 * Sanitizes a string for use in safe filenames
 */
export function sanitizeFilename(title: string, fallback = 'qr-code'): string {
  const clean = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9_-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return clean || fallback;
}

/**
 * Builds the QRCodeStyling options from our customization object
 */
export function buildQrCodeOptions(
  data: string,
  customization: QrCustomization,
  width = 300,
  height = 300
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dotsOptions: any = {
    type: customization.dotType,
  };

  if (customization.gradient.enabled) {
    dotsOptions.gradient = {
      type: customization.gradient.type,
      rotation: (customization.gradient.rotation * Math.PI) / 180,
      colorStops: [
        { offset: 0, color: customization.gradient.color1 },
        { offset: 1, color: customization.gradient.color2 },
      ],
    };
  } else {
    dotsOptions.color = customization.foregroundColor;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const backgroundOptions: any = {
    color: customization.transparentBackground ? 'transparent' : customization.backgroundColor,
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cornersSquareOptions: any = {
    type: customization.cornerSquareType,
    color: customization.cornerSquareColor || customization.foregroundColor,
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cornersDotOptions: any = {
    type: customization.cornerDotType,
    color: customization.cornerDotColor || customization.foregroundColor,
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const imageOptions: any = {
    hideBackgroundDots: true,
    imageSize: customization.logoSize,
    margin: customization.logoMargin,
    crossOrigin: 'anonymous',
  };

  return {
    width,
    height,
    data: data || ' ',
    margin: customization.margin,
    qrOptions: {
      typeNumber: 0,
      mode: 'Byte' as const,
      errorCorrectionLevel: customization.errorCorrectionLevel,
    },
    image: customization.logoUrl || undefined,
    imageOptions,
    dotsOptions,
    backgroundOptions,
    cornersSquareOptions,
    cornersDotOptions,
  } as import('qr-code-styling').Options;
}

/**
 * Composites a frame and label around the generated QR code canvas
 */
async function compositeFramedPng(
  rawBlob: Blob,
  customization: QrCustomization,
  resolution: number
): Promise<Blob> {
  if (!customization.frameStyle || customization.frameStyle === 'none' || !customization.frameLabel) {
    return rawBlob;
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(rawBlob);

    img.onload = () => {
      URL.revokeObjectURL(url);
      const isCardBorder = customization.frameStyle === 'card-border';
      const isTopBadge = customization.frameStyle === 'top-badge';
      const isScanMe = customization.frameStyle === 'scan-me';

      const padding = Math.round(resolution * 0.08);
      const bannerHeight = Math.round(resolution * 0.14);

      const canvasWidth = resolution + padding * 2;
      const canvasHeight = resolution + padding * 2 + bannerHeight;

      const canvas = document.createElement('canvas');
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        resolve(rawBlob);
        return;
      }

      // Fill background
      const bgColor = customization.transparentBackground
        ? 'transparent'
        : customization.backgroundColor || '#ffffff';
      if (bgColor !== 'transparent') {
        ctx.fillStyle = bgColor;
        if (isCardBorder) {
          ctx.beginPath();
          const radius = Math.round(resolution * 0.04);
          ctx.roundRect(0, 0, canvasWidth, canvasHeight, radius);
          ctx.fill();
          // Draw border outline
          ctx.lineWidth = Math.max(4, Math.round(resolution * 0.015));
          ctx.strokeStyle = customization.frameColor || customization.foregroundColor || '#0f172a';
          ctx.stroke();
        } else {
          ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        }
      }

      // Draw QR image
      const qrY = isTopBadge ? padding + bannerHeight : padding;
      ctx.drawImage(img, padding, qrY, resolution, resolution);

      // Draw Frame / Banner
      const frameColor = customization.frameColor || customization.foregroundColor || '#0f172a';
      const textColor = customization.frameTextColor || '#ffffff';
      const labelText = (customization.frameLabel || '').trim();

      ctx.fillStyle = frameColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const fontSize = Math.round(bannerHeight * 0.42);
      ctx.font = `bold ${fontSize}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;

      if (isScanMe) {
        // Draw centered pill badge at bottom
        const pillWidth = Math.min(canvasWidth - padding * 2, Math.max(fontSize * labelText.length * 0.75, resolution * 0.6));
        const pillHeight = Math.round(bannerHeight * 0.75);
        const pillX = (canvasWidth - pillWidth) / 2;
        const pillY = canvasHeight - padding - pillHeight;
        const pillRadius = pillHeight / 2;

        ctx.beginPath();
        ctx.roundRect(pillX, pillY, pillWidth, pillHeight, pillRadius);
        ctx.fill();

        ctx.fillStyle = textColor;
        ctx.fillText(labelText, canvasWidth / 2, pillY + pillHeight / 2);
      } else if (isTopBadge) {
        // Top banner
        const bannerY = padding;
        const bannerW = resolution;
        const bannerX = padding;
        const bRadius = Math.round(bannerHeight * 0.2);

        ctx.beginPath();
        ctx.roundRect(bannerX, bannerY, bannerW, Math.round(bannerHeight * 0.8), bRadius);
        ctx.fill();

        ctx.fillStyle = textColor;
        ctx.fillText(labelText, canvasWidth / 2, bannerY + Math.round(bannerHeight * 0.4));
      } else {
        // Bottom bar (standard bottom-bar or card-border caption)
        const bannerY = canvasHeight - padding - Math.round(bannerHeight * 0.85);
        const bannerW = resolution;
        const bannerX = padding;
        const bRadius = Math.round(bannerHeight * 0.25);

        ctx.beginPath();
        ctx.roundRect(bannerX, bannerY, bannerW, Math.round(bannerHeight * 0.8), bRadius);
        ctx.fill();

        ctx.fillStyle = textColor;
        ctx.fillText(labelText, canvasWidth / 2, bannerY + Math.round(bannerHeight * 0.4));
      }

      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else resolve(rawBlob);
      }, 'image/png');
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(rawBlob);
    };

    img.src = url;
  });
}

/**
 * Exports QR code to PNG at the desired resolution (e.g. 512, 1024, 2048)
 */
export async function downloadPng(
  data: string,
  customization: QrCustomization,
  filename: string,
  resolution = 1024
): Promise<void> {
  const options = buildQrCodeOptions(data, customization, resolution, resolution);
  const qr = new QRCodeStyling(options);

  const rawData = await qr.getRawData('png');
  if (!rawData) {
    throw new Error('Failed to generate PNG image data');
  }

  let finalBlob = rawData as Blob;
  if (customization.frameStyle && customization.frameStyle !== 'none' && customization.frameLabel) {
    finalBlob = await compositeFramedPng(finalBlob, customization, resolution);
  }

  const url = URL.createObjectURL(finalBlob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

/**
 * Exports QR code to vector SVG
 */
export async function downloadSvg(
  data: string,
  customization: QrCustomization,
  filename: string
): Promise<void> {
  const options = buildQrCodeOptions(data, customization, 800, 800);
  const qr = new QRCodeStyling({
    ...options,
    type: 'svg',
  });

  const rawData = await qr.getRawData('svg');
  if (!rawData) {
    throw new Error('Failed to generate SVG vector data');
  }

  const blob = rawData as Blob;
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.svg`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

/**
 * Exports print-ready PDF containing the QR code, title, and optional description
 */
export async function downloadPdf(
  data: string,
  customization: QrCustomization,
  filename: string,
  title = 'QR Studio Code',
  description?: string
): Promise<void> {
  // Create high-res PNG for embedding into PDF
  const options = buildQrCodeOptions(data, customization, 1200, 1200);
  const qr = new QRCodeStyling(options);
  const rawData = await qr.getRawData('png');

  if (!rawData) {
    throw new Error('Failed to generate QR data for PDF');
  }

  let finalBlob = rawData as Blob;
  if (customization.frameStyle && customization.frameStyle !== 'none' && customization.frameLabel) {
    finalBlob = await compositeFramedPng(finalBlob, customization, 1200);
  }

  const reader = new FileReader();
  const base64Promise = new Promise<string>((resolve, reject) => {
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
  });
  reader.readAsDataURL(finalBlob);
  const base64Data = await base64Promise;

  // Standard A4 portrait (210mm x 297mm)
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  // Margins & Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(15, 23, 42); // slate 900
  doc.text(title, pageWidth / 2, 35, { align: 'center' });

  if (description) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(100, 116, 139); // slate 500
    const splitDesc = doc.splitTextToSize(description, 150);
    doc.text(splitDesc, pageWidth / 2, 45, { align: 'center' });
  }

  // Draw QR Code centered
  const qrWidth = 120;
  const qrHeight = customization.frameStyle && customization.frameStyle !== 'none' ? 140 : 120;
  const qrX = (pageWidth - qrWidth) / 2;
  const qrY = description ? 56 : 48;

  // Add QR image
  doc.addImage(base64Data, 'PNG', qrX, qrY, qrWidth, qrHeight);

  // Footer branding
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184); // slate 400
  doc.text('Scan with any smartphone camera or QR reader', pageWidth / 2, qrY + qrHeight + 12, {
    align: 'center',
  });
  doc.text('Generated with QR Studio • qr-studio-umar.vercel.app', pageWidth / 2, 280, {
    align: 'center',
  });

  doc.save(`${filename}.pdf`);
}
