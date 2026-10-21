import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Loader2, Linkedin, Mail, MessageSquare } from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  inquiryType: string;
  message: string;
  honeypot: string; // Anti-spam field
}

const INITIAL_FORM_DATA: FormData = {
  name: '',
  email: '',
  inquiryType: 'Business Inquiry',
  message: '',
  honeypot: '',
};

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const linkedinUrl =
    import.meta.env.VITE_LINKEDIN_URL || 'https://www.linkedin.com/in/umarwazir';

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Please provide your full name.';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Please provide your email address.';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Please enter a message.';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long.';
    } else if (formData.message.length > 1000) {
      newErrors.message = 'Message exceeds the 1000 character limit.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Spam honeypot detection: bots fill hidden fields
    if (formData.honeypot) {
      // Silently pretend success to confuse bots
      setSubmitSuccess(true);
      return;
    }

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const endpoint = import.meta.env.VITE_FORMSPREE_ENDPOINT;

      if (!endpoint || !endpoint.trim().startsWith('http')) {
        throw new Error(
          'Contact service is not configured. Please reach out directly on LinkedIn.'
        );
      }

      // Send directly to configured Formspree endpoint via HTTPS POST
      const response = await fetch(endpoint.trim(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          inquiryType: formData.inquiryType,
          message: formData.message.trim(),
          _subject: `QR Studio [${formData.inquiryType}]: message from ${formData.name.trim()}`,
        }),
      });

      if (response.ok) {
        setSubmitSuccess(true);
        setFormData(INITIAL_FORM_DATA);
      } else {
        const result = await response.json().catch(() => ({}));
        const errMsg =
          (Array.isArray(result.errors) && result.errors.length > 0
            ? result.errors.map((e: any) => e.message).join(', ')
            : result.error) ||
          'Unable to deliver message at this time. Please check your connection or reach out on LinkedIn.';
        throw new Error(errMsg);
      }
    } catch (err: any) {
      console.error('Contact form submission error:', err);
      setErrorMessage(
        err.message ||
          'Failed to send message. Please verify your connection or try again in a few moments.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-xs space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 border-b border-slate-100 dark:border-slate-800 pb-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-medium">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Direct Creator Inquiries</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Let's Make QR Studio Better
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Have a question, feature suggestion, or business inquiry? Send me a message. I'd love to hear from you.
            </p>
          </div>

          {/* LinkedIn Profile Quick Action */}
          <div className="shrink-0">
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-300 dark:hover:border-indigo-700 text-xs font-semibold transition-all shadow-2xs"
            >
              <Linkedin className="w-4 h-4 text-[#0077B5]" />
              <span>Connect on LinkedIn</span>
            </a>
          </div>
        </div>

        {/* Success Confirmation State */}
        {submitSuccess ? (
          <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-3 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Thank you for reaching out! Your message has been submitted successfully.
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto">
              Your inquiry has been sent privately. I personally review all submissions and will get back to you as soon as possible.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setSubmitSuccess(false)}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 hover:opacity-90 transition-opacity"
              >
                Send Another Message
              </button>
            </div>
          </div>
        ) : (
          /* Contact Form */
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error Banner */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Anti-spam hidden honeypot */}
            <input
              type="text"
              name="_gotcha"
              tabIndex={-1}
              autoComplete="off"
              value={formData.honeypot}
              onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
              className="hidden pointer-events-none"
              aria-hidden="true"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label
                  htmlFor="contact-name"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
                >
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  id="contact-name"
                  type="text"
                  placeholder="e.g. Sarah Jenkins"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (errors.name) setErrors({ ...errors, name: '' });
                  }}
                  className={`w-full px-3.5 py-2.5 text-sm rounded-xl border ${
                    errors.name
                      ? 'border-rose-400 dark:border-rose-600 focus:ring-rose-500'
                      : 'border-slate-200 dark:border-slate-800 focus:ring-indigo-500'
                  } bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2`}
                />
                {errors.name && <p className="mt-1 text-xs text-rose-500">{errors.name}</p>}
              </div>

              {/* Email Address */}
              <div>
                <label
                  htmlFor="contact-email"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
                >
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  id="contact-email"
                  type="email"
                  placeholder="name@business.com"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (errors.email) setErrors({ ...errors, email: '' });
                  }}
                  className={`w-full px-3.5 py-2.5 text-sm rounded-xl border ${
                    errors.email
                      ? 'border-rose-400 dark:border-rose-600 focus:ring-rose-500'
                      : 'border-slate-200 dark:border-slate-800 focus:ring-indigo-500'
                  } bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2`}
                />
                {errors.email && <p className="mt-1 text-xs text-rose-500">{errors.email}</p>}
              </div>
            </div>

            {/* Inquiry Type */}
            <div>
              <label
                htmlFor="contact-inquiry"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Inquiry Type
              </label>
              <select
                id="contact-inquiry"
                value={formData.inquiryType}
                onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Business Inquiry">Business / Commercial Inquiry</option>
                <option value="Feature Request">Feature Request</option>
                <option value="Feedback">Feedback & Suggestions</option>
                <option value="Bug Report">Bug Report</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Message */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="contact-message"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  Message <span className="text-rose-500">*</span>
                </label>
                <span className="text-[11px] text-slate-400 font-mono">
                  {formData.message.length} / 1000
                </span>
              </div>
              <textarea
                id="contact-message"
                rows={4}
                maxLength={1000}
                placeholder="Write your question, suggestion, or commercial proposal here..."
                value={formData.message}
                onChange={(e) => {
                  setFormData({ ...formData, message: e.target.value });
                  if (errors.message) setErrors({ ...errors, message: '' });
                }}
                className={`w-full px-3.5 py-2.5 text-sm rounded-xl border ${
                  errors.message
                    ? 'border-rose-400 dark:border-rose-600 focus:ring-rose-500'
                    : 'border-slate-200 dark:border-slate-800 focus:ring-indigo-500'
                } bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2`}
              />
              {errors.message && <p className="mt-1 text-xs text-rose-500">{errors.message}</p>}
            </div>

            {/* Privacy notice & Submit button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                Submissions are sent directly and privately to Umar Wazir. Never displayed publicly.
              </p>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs hover:shadow transition-all disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Sending Message...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};
