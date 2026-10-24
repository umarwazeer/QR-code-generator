import { jsPDF } from 'jspdf';
import QRCodeStyling from 'qr-code-styling';
import { PrintTemplateConfig } from '../../types/printTemplate';
import { QrCustomization } from '../../types/qr';
import { buildQrCodeOptions, sanitizeFilename } from './exportQr';

/**
 * Helper to safely load an image URL into an HTMLImageElement
 */
async function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

/**
 * Draws crop / cut marks at the 4 corners of a designated rectangular area on canvas
 */
function drawCanvasCropMarks(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  markLength = 30,
  offset = 12
) {
  ctx.save();
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 1.5;

  // Top-Left
  ctx.beginPath();
  ctx.moveTo(x - offset - markLength, y);
  ctx.lineTo(x - offset, y);
  ctx.moveTo(x, y - offset - markLength);
  ctx.lineTo(x, y - offset);
  ctx.stroke();

  // Top-Right
  ctx.beginPath();
  ctx.moveTo(x + width + offset, y);
  ctx.lineTo(x + width + offset + markLength, y);
  ctx.moveTo(x + width, y - offset - markLength);
  ctx.lineTo(x + width, y - offset);
  ctx.stroke();

  // Bottom-Left
  ctx.beginPath();
  ctx.moveTo(x - offset - markLength, y + height);
  ctx.lineTo(x - offset, y + height);
  ctx.moveTo(x, y + height + offset);
  ctx.lineTo(x, y + height + offset + markLength);
  ctx.stroke();

  // Bottom-Right
  ctx.beginPath();
  ctx.moveTo(x + width + offset, y + height);
  ctx.lineTo(x + width + offset + markLength, y + height);
  ctx.moveTo(x + width, y + height + offset);
  ctx.lineTo(x + width, y + height + offset + markLength);
  ctx.stroke();

  ctx.restore();
}

/**
 * Generates QR code image element with matching primary brand color
 */
async function generateQrImage(
  qrPayload: string,
  qrCustomization: QrCustomization,
  primaryColor: string,
  logoUrl: string | undefined,
  size = 500
): Promise<HTMLImageElement | null> {
  const effectivePayload = qrPayload.trim() || 'https://qr-studio-umar.vercel.app';
  const qrOptions = buildQrCodeOptions(
    effectivePayload,
    {
      ...qrCustomization,
      foregroundColor: primaryColor || qrCustomization.foregroundColor,
      cornerSquareColor: primaryColor || qrCustomization.cornerSquareColor,
      cornerDotColor: primaryColor || qrCustomization.cornerDotColor,
      logoUrl: logoUrl || qrCustomization.logoUrl,
    },
    size,
    size
  );

  const qrInstance = new QRCodeStyling(qrOptions);
  const blob = await qrInstance.getRawData('png');
  if (!blob) return null;

  const url = URL.createObjectURL(blob as Blob);
  const img = await loadImage(url);
  URL.revokeObjectURL(url);
  return img;
}

/**
 * 1. RENDER BUSINESS CARD TO CANVAS (3.5" x 2" ratio @ 300 DPI = 1050 x 600 px)
 */
export async function renderBusinessCardToCanvas(
  config: PrintTemplateConfig,
  qrPayload: string,
  qrCustomization: QrCustomization
): Promise<HTMLCanvasElement> {
  const canvas = document.createElement('canvas');
  const width = 1050;
  const height = 600;
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not obtain canvas context');

  // Fill background
  ctx.fillStyle = config.backgroundColor || '#ffffff';
  ctx.fillRect(0, 0, width, height);

  // Left decorative color bar
  ctx.fillStyle = config.primaryColor || '#4f46e5';
  ctx.fillRect(0, 0, 18, height);

  // Top slim accent line
  ctx.fillStyle = config.secondaryColor || '#e0e7ff';
  ctx.fillRect(18, 0, width - 18, 6);

  // Outer container border
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 2;
  ctx.strokeRect(1, 1, width - 2, height - 2);

  // Layout splits: Left content area (0 to 650), Right QR area (660 to 1050)
  const leftX = 54;
  let currentY = 75;

  // Optional Logo
  if (config.logoUrl) {
    const logoImg = await loadImage(config.logoUrl);
    if (logoImg) {
      const logoSize = 64;
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(leftX, currentY, logoSize, logoSize, 12);
      ctx.clip();
      ctx.drawImage(logoImg, leftX, currentY, logoSize, logoSize);
      ctx.restore();
      currentY += logoSize + 22;
    }
  }

  // Business / Person Name
  ctx.fillStyle = config.textColor || '#0f172a';
  ctx.font = 'bold 38px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(config.businessName || 'Your Name / Business', leftX, currentY);
  currentY += 34;

  // Tagline / Role
  ctx.fillStyle = config.primaryColor || '#4f46e5';
  ctx.font = '600 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(config.tagline || 'Professional Role & Expertise', leftX, currentY);
  currentY += 36;

  // Horizontal divider
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(leftX, currentY);
  ctx.lineTo(620, currentY);
  ctx.stroke();
  currentY += 38;

  // Contact rows
  ctx.font = '500 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = '#334155';

  const contactItems: string[] = [];
  if (config.contactPhone) contactItems.push(`Phone: ${config.contactPhone}`);
  if (config.contactEmail) contactItems.push(`Email: ${config.contactEmail}`);
  if (config.contactWebsite) contactItems.push(`Web: ${config.contactWebsite.replace(/^https?:\/\//, '')}`);
  if (config.address) contactItems.push(`Location: ${config.address}`);

  // Fallback items if empty
  if (contactItems.length === 0) {
    contactItems.push('Phone: +1 (415) 555-0199');
    contactItems.push('Email: hello@example.com');
    contactItems.push('Web: qr-studio-umar.vercel.app');
  }

  for (const item of contactItems.slice(0, 4)) {
    ctx.fillText(item, leftX, currentY);
    currentY += 32;
  }

  // Right Column: QR Code Container
  const qrBoxSize = 340;
  const qrBoxX = 660;
  const qrBoxY = 80;

  // White rounded card background for QR
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.06)';
  ctx.shadowBlur = 18;
  ctx.shadowOffsetY = 6;
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.roundRect(qrBoxX, qrBoxY, qrBoxSize, qrBoxSize + 85, 20);
  ctx.fill();
  ctx.restore();

  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(qrBoxX, qrBoxY, qrBoxSize, qrBoxSize + 85);

  // Render QR
  const qrImg = await generateQrImage(qrPayload, qrCustomization, config.primaryColor, config.logoUrl, 300);
  if (qrImg) {
    ctx.drawImage(qrImg, qrBoxX + 20, qrBoxY + 20, 300, 300);
  }

  // CTA text under QR
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(config.ctaText || 'Scan to save contact', qrBoxX + qrBoxSize / 2, qrBoxY + qrBoxSize + 48);

  ctx.fillStyle = '#94a3b8';
  ctx.font = 'normal 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('Point smartphone camera', qrBoxX + qrBoxSize / 2, qrBoxY + qrBoxSize + 68);

  // Crop marks if enabled
  if (config.includeCutGuides) {
    drawCanvasCropMarks(ctx, 10, 10, width - 20, height - 20, 35, 8);
  }

  return canvas;
}

/**
 * 2. RENDER PROMOTIONAL FLYER TO CANVAS (A4 standard ratio 1:1.414 @ 1414 x 2000 px)
 */
export async function renderFlyerToCanvas(
  config: PrintTemplateConfig,
  qrPayload: string,
  qrCustomization: QrCustomization
): Promise<HTMLCanvasElement> {
  const canvas = document.createElement('canvas');
  const width = 1414;
  const height = 2000;
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not obtain canvas context');

  // Background
  ctx.fillStyle = config.backgroundColor || '#ffffff';
  ctx.fillRect(0, 0, width, height);

  // Top header color banner
  const gradient = ctx.createLinearGradient(0, 0, width, 180);
  gradient.addColorStop(0, config.primaryColor || '#059669');
  gradient.addColorStop(1, config.secondaryColor || '#d1fae5');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, 24);

  // Border outline
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 4;
  ctx.strokeRect(28, 28, width - 56, height - 56);

  let currentY = 130;

  // Optional Logo
  if (config.logoUrl) {
    const logoImg = await loadImage(config.logoUrl);
    if (logoImg) {
      const logoSize = 100;
      ctx.save();
      ctx.beginPath();
      ctx.roundRect((width - logoSize) / 2, currentY, logoSize, logoSize, 20);
      ctx.clip();
      ctx.drawImage(logoImg, (width - logoSize) / 2, currentY, logoSize, logoSize);
      ctx.restore();
      currentY += logoSize + 30;
    }
  }

  // Business Name
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 58px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(config.businessName || 'Apex Studio', width / 2, currentY);
  currentY += 50;

  // Tagline
  ctx.fillStyle = config.primaryColor || '#059669';
  ctx.font = 'bold 26px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText((config.tagline || 'Special Announcement').toUpperCase(), width / 2, currentY);
  currentY += 65;

  // Promotional Headline Badge
  const headlineText = config.headline || 'SCAN HERE FOR SPECIAL PROMOTIONAL OFFER';
  ctx.font = 'bold 38px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  const headlineMetrics = ctx.measureText(headlineText);
  const badgeWidth = Math.min(width - 160, headlineMetrics.width + 80);
  const badgeHeight = 76;
  const badgeX = (width - badgeWidth) / 2;

  ctx.fillStyle = config.secondaryColor || '#ecfdf5';
  ctx.beginPath();
  ctx.roundRect(badgeX, currentY, badgeWidth, badgeHeight, 18);
  ctx.fill();

  ctx.strokeStyle = config.primaryColor || '#059669';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.roundRect(badgeX, currentY, badgeWidth, badgeHeight, 18);
  ctx.stroke();

  ctx.fillStyle = config.primaryColor || '#059669';
  ctx.fillText(headlineText, width / 2, currentY + 52);
  currentY += badgeHeight + 60;

  // Multi-line bullet points or body text
  if (config.bodyText) {
    const lines = config.bodyText.split('\n');
    ctx.font = '500 28px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = '#334155';
    for (const textLine of lines) {
      if (textLine.trim()) {
        ctx.fillText(textLine.trim(), width / 2, currentY);
        currentY += 46;
      }
    }
    currentY += 20;
  }

  // QR Code Frame
  const qrBoxSize = 580;
  const qrBoxX = (width - qrBoxSize) / 2;
  const qrBoxY = currentY;

  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.08)';
  ctx.shadowBlur = 35;
  ctx.shadowOffsetY = 15;
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.roundRect(qrBoxX, qrBoxY, qrBoxSize, qrBoxSize, 32);
  ctx.fill();
  ctx.restore();

  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(qrBoxX, qrBoxY, qrBoxSize, qrBoxSize, 32);
  ctx.stroke();

  // Draw QR
  const qrInnerSize = 500;
  const qrImg = await generateQrImage(qrPayload, qrCustomization, config.primaryColor, config.logoUrl, qrInnerSize);
  if (qrImg) {
    const pad = (qrBoxSize - qrInnerSize) / 2;
    ctx.drawImage(qrImg, qrBoxX + pad, qrBoxY + pad, qrInnerSize, qrInnerSize);
  }
  currentY += qrBoxSize + 60;

  // CTA Text
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 32px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(config.ctaText || 'Point smartphone camera to scan • Instant access', width / 2, currentY);
  currentY += 50;

  // Footer Contacts
  const footerParts: string[] = [];
  if (config.contactPhone) footerParts.push(config.contactPhone);
  if (config.contactEmail) footerParts.push(config.contactEmail);
  if (config.contactWebsite) footerParts.push(config.contactWebsite.replace(/^https?:\/\//, ''));
  if (config.address) footerParts.push(config.address);

  if (footerParts.length > 0) {
    ctx.fillStyle = '#64748b';
    ctx.font = 'normal 22px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(footerParts.join('  •  '), width / 2, currentY);
  }

  // Bottom attribution
  ctx.fillStyle = '#94a3b8';
  ctx.font = 'normal 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('Printable Template Created with QR Studio • qr-studio-umar.vercel.app', width / 2, height - 55);

  // Crop marks if enabled
  if (config.includeCutGuides) {
    drawCanvasCropMarks(ctx, 36, 36, width - 72, height - 72, 45, 14);
  }

  return canvas;
}

/**
 * 3. RENDER TABLE TENT CARD TO CANVAS (4" x 6" ratio = 1200 x 1800 px)
 */
export async function renderTentCardToCanvas(
  config: PrintTemplateConfig,
  qrPayload: string,
  qrCustomization: QrCustomization
): Promise<HTMLCanvasElement> {
  const canvas = document.createElement('canvas');
  const width = 1200;
  const height = 1800;
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not obtain canvas context');

  // Background
  ctx.fillStyle = config.backgroundColor || '#ffffff';
  ctx.fillRect(0, 0, width, height);

  // Top color band
  ctx.fillStyle = config.primaryColor || '#d97706';
  ctx.fillRect(0, 0, width, 18);

  // Outer border
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 3;
  ctx.strokeRect(20, 20, width - 40, height - 40);

  // Optional Table Number Badge (High visual prominence for table tent cards)
  let currentY = 80;
  if (config.tableNumber) {
    const tableBadge = config.tableNumber.toUpperCase();
    ctx.font = 'bold 26px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    const badgeW = ctx.measureText(tableBadge).width + 60;
    const badgeX = (width - badgeW) / 2;

    ctx.fillStyle = config.secondaryColor || '#fef3c7';
    ctx.beginPath();
    ctx.roundRect(badgeX, currentY, badgeW, 52, 26);
    ctx.fill();

    ctx.fillStyle = config.primaryColor || '#d97706';
    ctx.textAlign = 'center';
    ctx.fillText(tableBadge, width / 2, currentY + 36);
    currentY += 85;
  } else {
    currentY += 30;
  }

  // Optional Logo
  if (config.logoUrl) {
    const logoImg = await loadImage(config.logoUrl);
    if (logoImg) {
      const logoSize = 90;
      ctx.save();
      ctx.beginPath();
      ctx.roundRect((width - logoSize) / 2, currentY, logoSize, logoSize, 18);
      ctx.clip();
      ctx.drawImage(logoImg, (width - logoSize) / 2, currentY, logoSize, logoSize);
      ctx.restore();
      currentY += logoSize + 25;
    }
  }

  // Business Name
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 52px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(config.businessName || 'The Terrace Bistro', width / 2, currentY);
  currentY += 50;

  // Tagline
  ctx.fillStyle = config.primaryColor || '#d97706';
  ctx.font = '600 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(config.tagline || 'Contactless Ordering & Menu', width / 2, currentY);
  currentY += 60;

  // Headline
  ctx.fillStyle = '#1e293b';
  ctx.font = 'bold 36px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  const headlineWords = (config.headline || 'Scan to View Our Menu & Daily Specials').split(' ');
  let headlineLine = '';
  for (let i = 0; i < headlineWords.length; i++) {
    const testLine = headlineLine + headlineWords[i] + ' ';
    const testWidth = ctx.measureText(testLine).width;
    if (testWidth > 900 && i > 0) {
      ctx.fillText(headlineLine, width / 2, currentY);
      headlineLine = headlineWords[i] + ' ';
      currentY += 46;
    } else {
      headlineLine = testLine;
    }
  }
  ctx.fillText(headlineLine, width / 2, currentY);
  currentY += 50;

  // Subtext / body text
  if (config.bodyText) {
    ctx.fillStyle = '#64748b';
    ctx.font = 'normal 22px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(config.bodyText, width / 2, currentY);
    currentY += 45;
  }

  // QR Code Container
  const qrBoxSize = 560;
  const qrBoxX = (width - qrBoxSize) / 2;
  const qrBoxY = currentY;

  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.08)';
  ctx.shadowBlur = 30;
  ctx.shadowOffsetY = 12;
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.roundRect(qrBoxX, qrBoxY, qrBoxSize, qrBoxSize, 30);
  ctx.fill();
  ctx.restore();

  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(qrBoxX, qrBoxY, qrBoxSize, qrBoxSize, 30);
  ctx.stroke();

  // QR rendering
  const qrInnerSize = 480;
  const qrImg = await generateQrImage(qrPayload, qrCustomization, config.primaryColor, config.logoUrl, qrInnerSize);
  if (qrImg) {
    const pad = (qrBoxSize - qrInnerSize) / 2;
    ctx.drawImage(qrImg, qrBoxX + pad, qrBoxY + pad, qrInnerSize, qrInnerSize);
  }
  currentY += qrBoxSize + 65;

  // CTA
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 30px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(config.ctaText || 'Point camera to scan • Works with iOS & Android', width / 2, currentY);
  currentY += 45;

  // Address / Wi-Fi details
  if (config.address) {
    ctx.fillStyle = config.primaryColor || '#d97706';
    ctx.font = '600 22px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(config.address, width / 2, currentY);
  }

  // Footer branding note
  ctx.fillStyle = '#94a3b8';
  ctx.font = 'normal 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('Table Display Stand • Created with QR Studio • qr-studio-umar.vercel.app', width / 2, height - 48);

  // Crop marks & Fold Guide if enabled
  if (config.includeCutGuides) {
    drawCanvasCropMarks(ctx, 28, 28, width - 56, height - 56, 40, 12);
  }

  return canvas;
}

/**
 * Master Canvas Renderer dispatching to the appropriate template function
 */
export async function renderPrintTemplateToCanvas(
  config: PrintTemplateConfig,
  qrPayload: string,
  qrCustomization: QrCustomization
): Promise<HTMLCanvasElement> {
  switch (config.templateType) {
    case 'business-card':
      return renderBusinessCardToCanvas(config, qrPayload, qrCustomization);
    case 'flyer':
      return renderFlyerToCanvas(config, qrPayload, qrCustomization);
    case 'tent-card':
      return renderTentCardToCanvas(config, qrPayload, qrCustomization);
    default:
      return renderBusinessCardToCanvas(config, qrPayload, qrCustomization);
  }
}

/**
 * Downloads the Print Template as high-resolution PNG
 */
export async function downloadPrintTemplatePng(
  config: PrintTemplateConfig,
  qrPayload: string,
  qrCustomization: QrCustomization
): Promise<void> {
  const canvas = await renderPrintTemplateToCanvas(config, qrPayload, qrCustomization);
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
  if (!blob) throw new Error('Failed to generate PNG blob');

  const filename = sanitizeFilename(
    `print-${config.templateType}-${config.businessName || 'template'}`,
    `print-${config.templateType}`
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
 * Downloads the Print Template as a formatted, print-ready PDF
 */
export async function downloadPrintTemplatePdf(
  config: PrintTemplateConfig,
  qrPayload: string,
  qrCustomization: QrCustomization
): Promise<void> {
  const canvas = await renderPrintTemplateToCanvas(config, qrPayload, qrCustomization);
  const imgData = canvas.toDataURL('image/png');

  let doc: jsPDF;

  if (config.templateType === 'business-card') {
    // Standard business card is 88.9mm x 50.8mm (3.5" x 2")
    // Produce standard A4 sheet with card centered and precision crop marks for home/office printing!
    doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const cardW = 88.9;
    const cardH = 50.8;
    const x = (210 - cardW) / 2;
    const y = (297 - cardH) / 2;

    doc.addImage(imgData, 'PNG', x, y, cardW, cardH);

    // Draw print crop guides around card
    doc.setDrawColor(180, 180, 180);
    doc.setLineWidth(0.3);

    // Top-Left
    doc.line(x - 8, y, x - 2, y);
    doc.line(x, y - 8, x, y - 2);

    // Top-Right
    doc.line(x + cardW + 2, y, x + cardW + 8, y);
    doc.line(x + cardW, y - 8, x + cardW, y - 2);

    // Bottom-Left
    doc.line(x - 8, y + cardH, x - 2, y + cardH);
    doc.line(x, y + cardH + 2, x, y + cardH + 8);

    // Bottom-Right
    doc.line(x + cardW + 2, y + cardH, x + cardW + 8, y + cardH);
    doc.line(x + cardW, y + cardH + 2, x + cardW, y + cardH + 8);

    // Instructions on the sheet outside print area
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(148, 163, 184);
    doc.text('Standard 3.5" × 2" Business Card • Cut along corner crop marks', 105, y - 14, { align: 'center' });
    doc.text('Printed via QR Studio • qr-studio-umar.vercel.app', 105, y + cardH + 18, { align: 'center' });

  } else if (config.templateType === 'flyer') {
    // Full A4 Portrait (210mm x 297mm)
    doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // 10mm margins for standard full-page flyer
    const margin = 10;
    const w = 210 - margin * 2;
    const h = 297 - margin * 2;
    doc.addImage(imgData, 'PNG', margin, margin, w, h);

  } else {
    // Table Tent Card: A4 Sheet with 4" x 6" (101.6mm x 152.4mm) display card centered with cut & fold guide
    doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const cardW = 101.6;
    const cardH = 152.4;
    const x = (210 - cardW) / 2;
    const y = (297 - cardH) / 2;

    doc.addImage(imgData, 'PNG', x, y, cardW, cardH);

    // Crop marks
    doc.setDrawColor(180, 180, 180);
    doc.setLineWidth(0.3);

    // Top-Left
    doc.line(x - 8, y, x - 2, y);
    doc.line(x, y - 8, x, y - 2);

    // Top-Right
    doc.line(x + cardW + 2, y, x + cardW + 8, y);
    doc.line(x + cardW, y - 8, x + cardW, y - 2);

    // Bottom-Left
    doc.line(x - 8, y + cardH, x - 2, y + cardH);
    doc.line(x, y + cardH + 2, x, y + cardH + 8);

    // Bottom-Right
    doc.line(x + cardW + 2, y + cardH, x + cardW + 8, y + cardH);
    doc.line(x + cardW, y + cardH + 2, x + cardW, y + cardH + 8);

    // Helpful instructions
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(148, 163, 184);
    doc.text('4" × 6" Tabletop / Counter Tent Stand Card • Cut along corner marks', 105, y - 14, { align: 'center' });
    doc.text('Suitable for acrylic stands or folded counter cards • QR Studio', 105, y + cardH + 18, { align: 'center' });
  }

  const filename = sanitizeFilename(
    `print-ready-${config.templateType}-${config.businessName || 'card'}`,
    `print-${config.templateType}`
  );
  doc.save(`${filename}.pdf`);
}
