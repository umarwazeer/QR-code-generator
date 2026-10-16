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

  const blob = rawData as Blob;
  const url = URL.createObjectURL(blob);
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

  const blob = rawData as Blob;
  const reader = new FileReader();
  const base64Promise = new Promise<string>((resolve, reject) => {
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
  });
  reader.readAsDataURL(blob);
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

  // Draw QR Code centered (120mm x 120mm)
  const qrSize = 120;
  const qrX = (pageWidth - qrSize) / 2;
  const qrY = description ? 58 : 50;

  // Add QR image
  doc.addImage(base64Data, 'PNG', qrX, qrY, qrSize, qrSize);

  // Footer branding
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184); // slate 400
  doc.text('Scan with any smartphone camera or QR reader', pageWidth / 2, qrY + qrSize + 15, {
    align: 'center',
  });
  doc.text('Generated with QR Studio • qrstudio.app', pageWidth / 2, 280, {
    align: 'center',
  });

  doc.save(`${filename}.pdf`);
}
