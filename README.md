# QR Studio

A modern, fast, and 100% private online QR Code Generator built with React, TypeScript, Tailwind CSS, and Vite. Created by **Umar Wazir**.

QR Studio allows businesses, freelancers, restaurants, shops, and creators to generate, customize, preview, and download standards-compliant, high-resolution QR codes in seconds. Everything runs in-browser without accounts, backends, subscription locks, or server-side telemetry.

---

## Business Use Cases

- **Restaurant & Cafe Menus**: Contactless dining menus, wine lists, and daily specials directly from table tents.
- **WhatsApp Ordering & Support**: 1-tap customer chat with pre-filled orders without manual number typing.
- **Product Packaging & Labels**: Ultra-high-resolution 2048px vector codes for packaging, boxes, and garment tags.
- **Digital Business Cards (vCard 3.0)**: Instant contact saving for sales reps and founders.
- **Guest Wi-Fi Access**: Instant connect for cafe patrons, hotel guests, and office visitors.
- **Conferences & Events**: Attendee badges, agendas, schedules, and venue maps.
- **Website & Marketing**: High-impact offline billboards, print flyers, and direct mail.
- **Social Media Profiles**: Grow followers across Instagram, LinkedIn, YouTube, TikTok, and.

---

## Key Features

- **12 Standard QR Code Types**:
  1. **URL / Website**: Validated links with HTTP/HTTPS handling.
  2. **Plain Text**: Multiline messages with real-time character count.
  3. **Wi-Fi Network**: WPA/WPA2/WPA3, WEP, or Open with proper character escaping and hidden network support.
  4. **vCard 3.0 (Digital Contact)**: Name, company, title, phone, email, website, and physical address.
  5. **Email**: Pre-filled `mailto:` links with subject and body.
  6. **Phone**: `tel:` direct dialing links.
  7. **SMS**: `smsto:` message payloads with phone number and optional text.
  8. **WhatsApp**: `wa.me` links with international country codes.
  9. **Location**: Standard Geo URI (`geo:`) and Google Maps links with GPS coordinate validation.
  10. **Calendar Event**: iCalendar `VEVENT` format with start/end times and location.
  11. **Social Media**: Profiles for Instagram, LinkedIn, X (Twitter), YouTube, TikTok, Facebook, and GitHub.
  12. **Custom Payload**: Raw string input for custom schemes, JSON, or scanner commands.

- **Deep Customization**:
  - **Colors & Palettes**: Foreground, background, transparent background, and 7 curated designer presets.
  - **Multi-Color Gradients**: Linear gradients with custom color stops and angle controls.
  - **Dot Patterns**: Classic Square, Rounded Edge, Circular Dots, Classy Diamond, Classy Smooth, and Extra Rounded.
  - **Corner Eyes**: Custom Corner Square and Corner Dot shapes and independent colors.
  - **Center Logo Emblem**: Upload custom PNG, JPG, or WebP logo with scale slider and automatic error-correction elevation.
  - **Quiet Zone / Margin**: Adjustable border margins (0 to 40px).
  - **Error Correction Levels**: Low (7%), Medium (15%), Quartile (25%), and High (30%).
  - **Optical Contrast Advisor**: Real-time WCAG contrast calculation that alerts users if colors may impede camera scan reliability.

- **Export Formats**:
  - **PNG Image**: Choice of 512px, 1024px, or ultra high-resolution 2048px for sharp printing.
  - **Vector SVG**: Infinite resolution scalable vector graphics.
  - **Print-Ready PDF**: Centered A4 portrait page with document title and custom instructions.

- **Local Browser History**:
  - Opt-in storage in browser `localStorage`.
  - Wi-Fi passwords automatically masked.
  - Rename, reload into editor, or delete individual entries.
  - One-click clear all history.

---

## Contact Form Setup (Formspree Integration)

The homepage includes a private **"Get in Touch"** contact form designed for direct inquiries, feedback, and commercial requests. Messages are delivered privately to the owner's email address and are never displayed publicly.

### How to Configure Private Email Delivery:

1. Create a free account at [Formspree](https://formspree.io).
2. Click **+ New Form**, enter a name (e.g. `QR Studio Inquiries`), and set the target recipient email address to your own email.
3. Formspree will provide a Form Endpoint URL in the format:
   ```
   https://formspree.io/f/your_form_id
   ```
4. In your project environment (or hosting dashboard, e.g., Vercel / Netlify environment variables), set:
   ```env
   VITE_FORMSPREE_ENDPOINT=https://formspree.io/f/your_form_id
   VITE_LINKEDIN_URL=https://www.linkedin.com/in/your_actual_profile
   ```
5. Restart your dev server or redeploy.

### Testing Delivery:
1. On the homepage, scroll down to the **"Let's Make QR Studio Better"** section.
2. Enter your Name, Email, select an Inquiry Type, and type a test message.
3. Click **Send Message**.
4. Check your inbox for the Formspree notification containing the message details.
5. In development without `VITE_FORMSPREE_ENDPOINT` set, the form gracefully simulates submission without crashing.

---

## Local Development Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
The application will be accessible at `http://localhost:3000`.

### 3. Run Automated Tests
```bash
npm test
```
Runs the test suite verifying payload generation for all 12 types, escaping rules, optical contrast checks, and filename sanitization.

### 4. Build for Production
```bash
npm run build
```
Generates optimized static assets in the `dist/` directory.

### 5. Preview Production Build
```bash
npm run preview
```

---

## Deployment Instructions

### Deploy to Vercel
1. Push your repository to GitHub.
2. In Vercel, click **New Project** and import the repository.
3. Framework Preset: **Vite**.
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Under **Environment Variables**, add `VITE_FORMSPREE_ENDPOINT` and `VITE_LINKEDIN_URL`.
7. Click **Deploy**.

For single-page application route rewrites on Vercel, `vercel.json`:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### Deploy to Netlify
1. Connect your repository in Netlify.
2. Build Command: `npm run build`
3. Publish Directory: `dist`
4. Under **Site Configuration > Environment Variables**, add your environment variables.
5. `public/_redirects` is already included for SPA routing.

---

## Creator & Copyright

Created by **Umar Wazir**.
All generated QR codes belong entirely to the user and can be used for commercial or personal purposes with zero attribution required.
