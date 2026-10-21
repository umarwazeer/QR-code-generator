import { jsPDF } from 'jspdf';
import QRCodeStyling from 'qr-code-styling';
import { BrandingConfig } from '../../types/businessBranding';
import { QrCustomization } from '../../types/qr';
import { buildQrCodeOptions, sanitizeFilename } from './exportQr';

/**
 * Draws the high-resolution promotional card onto an HTML Canvas.
 */
export async function renderPromotionalCardToCanvas(
  branding: BrandingConfig,
  qrPayload: string,
  qrCustomization: QrCustomization
): Promise<HTMLCanvasElement> {
  const canvas = document.createElement('canvas');
  const width = 1200;
  const height = 1600;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get 2D canvas context');

  // Background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  // Decorative top accent banner
  const gradient = ctx.createLinearGradient(0, 0, width, 240);
  gradient.addColorStop(0, branding.primaryColor || '#4338ca');
  gradient.addColorStop(1, branding.secondaryColor || '#e0e7ff');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, 22);

  // Subtle outer border
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 4;
  ctx.strokeRect(20, 20, width - 40, height - 40);

  // Business Category Badge
  const badgeText = branding.badgeText.toUpperCase();
  ctx.font = 'bold 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  const badgeWidth = ctx.measureText(badgeText).width + 48;
  const badgeX = (width - badgeWidth) / 2;
  const badgeY = 100;

  ctx.fillStyle = branding.secondaryColor || '#f1f5f9';
  ctx.beginPath();
  ctx.roundRect(badgeX, badgeY, badgeWidth, 48, 24);
  ctx.fill();

  ctx.fillStyle = branding.primaryColor || '#1e293b';
  ctx.textAlign = 'center';
  ctx.fillText(badgeText, width / 2, badgeY + 33);

  // Optional Business Logo (drawn above business name)
  let contentStartY = 210;
  if (branding.logoUrl) {
    try {
      const logoImg = new Image();
      logoImg.crossOrigin = 'anonymous';
      const logoLoaded = new Promise<boolean>((resolve) => {
        logoImg.onload = () => resolve(true);
        logoImg.onerror = () => resolve(false);
      });
      logoImg.src = branding.logoUrl;
      const success = await logoLoaded;
      if (success) {
        const logoSize = 110;
        ctx.save();
        ctx.beginPath();
        ctx.roundRect((width - logoSize) / 2, 175, logoSize, logoSize, 20);
        ctx.clip();
        ctx.drawImage(logoImg, (width - logoSize) / 2, 175, logoSize, logoSize);
        ctx.restore();
        contentStartY = 330;
      }
    } catch {
      // Continue without logo if failed to load
    }
  }

  // Business Name
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 54px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(branding.businessName || 'Your Business Name', width / 2, contentStartY);

  // Main Action Heading
  ctx.fillStyle = branding.primaryColor || '#4338ca';
  ctx.font = 'bold 44px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(branding.heading || 'Scan with Camera', width / 2, contentStartY + 70);

  // Subheading (multiline)
  ctx.fillStyle = '#64748b';
  ctx.font = 'normal 26px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  const subWords = (branding.subheading || 'Point your smartphone camera to connect').split(' ');
  let line = '';
  let lineY = contentStartY + 120;
  for (let i = 0; i < subWords.length; i++) {
    const testLine = line + subWords[i] + ' ';
    const testWidth = ctx.measureText(testLine).width;
    if (testWidth > 900 && i > 0) {
      ctx.fillText(line, width / 2, lineY);
      line = subWords[i] + ' ';
      lineY += 38;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, width / 2, lineY);

  // QR Code Frame (Rounded White Container with Drop Shadow)
  const qrFrameSize = 640;
  const qrFrameX = (width - qrFrameSize) / 2;
  const qrFrameY = lineY + 50;

  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.08)';
  ctx.shadowBlur = 35;
  ctx.shadowOffsetY = 15;
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.roundRect(qrFrameX, qrFrameY, qrFrameSize, qrFrameSize, 36);
  ctx.fill();
  ctx.restore();

  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(qrFrameX, qrFrameY, qrFrameSize, qrFrameSize, 36);
  ctx.stroke();

  // Render QR Code onto frame
  const qrInnerSize = 560;
  const qrOptions = buildQrCodeOptions(
    qrPayload || 'https://qrstudio.app',
    {
      ...qrCustomization,
      foregroundColor: branding.primaryColor || qrCustomization.foregroundColor,
      cornerSquareColor: branding.primaryColor || qrCustomization.cornerSquareColor,
      cornerDotColor: branding.primaryColor || qrCustomization.cornerDotColor,
      logoUrl: branding.logoUrl || qrCustomization.logoUrl,
    },
    qrInnerSize,
    qrInnerSize
  );

  const qrInstance = new QRCodeStyling(qrOptions);
  const qrBlob = await qrInstance.getRawData('png');
  if (qrBlob) {
    const qrImg = new Image();
    const qrLoaded = new Promise<void>((res) => {
      qrImg.onload = () => res();
    });
    qrImg.src = URL.createObjectURL(qrBlob as Blob);
    await qrLoaded;
    const qrPadding = (qrFrameSize - qrInnerSize) / 2;
    ctx.drawImage(qrImg, qrFrameX + qrPadding, qrFrameY + qrPadding, qrInnerSize, qrInnerSize);
    URL.revokeObjectURL(qrImg.src);
  }

  // Call to Action beneath QR
  const ctaY = qrFrameY + qrFrameSize + 65;
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 30px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(branding.callToAction || 'Point camera to scan · No app required', width / 2, ctaY);

  // Footer Branding Note
  ctx.fillStyle = '#94a3b8';
  ctx.font = 'normal 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(
    branding.footerNote || 'Free Static QR Code • Created with QR Studio • qrstudio.app',
    width / 2,
    height - 50
  );

  return canvas;
}

/**
 * Downloads the promotional card as a high-resolution PNG (1200x1600px).
 */
export async function downloadPromotionalCardPng(
  branding: BrandingConfig,
  qrPayload: string,
  qrCustomization: QrCustomization
): Promise<void> {
  const canvas = await renderPromotionalCardToCanvas(branding, qrPayload, qrCustomization);
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
  if (!blob) throw new Error('Failed to create PNG blob');

  const filename = sanitizeFilename(
    `promo-card-${branding.businessName || 'business'}`,
    'promo-card'
  );
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
 * Downloads the promotional card centered in an A4 portrait PDF for printing.
 */
export async function downloadPromotionalCardPdf(
  branding: BrandingConfig,
  qrPayload: string,
  qrCustomization: QrCustomization
): Promise<void> {
  const canvas = await renderPromotionalCardToCanvas(branding, qrPayload, qrCustomization);
  const imgData = canvas.toDataURL('image/png');

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // A4 is 210mm x 297mm. Fit 3:4 card (150mm x 200mm) centered
  const cardW = 150;
  const cardH = 200;
  const x = (210 - cardW) / 2;
  const y = (297 - cardH) / 2;

  doc.addImage(imgData, 'PNG', x, y, cardW, cardH);

  // Add subtle crop / cut guides at the 4 corners
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.line(x - 5, y, x + 5, y);
  doc.line(x, y - 5, x, y + 5);

  doc.line(x + cardW - 5, y, x + cardW + 5, y);
  doc.line(x + cardW, y - 5, x + cardW, y + 5);

  doc.line(x - 5, y + cardH, x + 5, y + cardH);
  doc.line(x, y + cardH - 5, x, y + cardH + 5);

  doc.line(x + cardW - 5, y + cardH, x + cardW + 5, y + cardH);
  doc.line(x + cardW, y + cardH - 5, x + cardW, y + cardH + 5);

  const filename = sanitizeFilename(
    `promo-card-print-${branding.businessName || 'business'}`,
    'promo-card-print'
  );
  doc.save(`${filename}.pdf`);
}
