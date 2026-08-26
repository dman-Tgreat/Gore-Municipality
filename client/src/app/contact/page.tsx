'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/component/Header';
import Footer from '@/component/Footer';
import { useLocale } from '@/context/LocaleContext';
import { contactApi, settingsApi, type SiteSetting } from '@/lib/api';
import { MapPin, Phone, Mail, Clock, User, ClipboardList, MessageSquare } from 'lucide-react';

const contactChannels = [
  { key: 'address', icon: <MapPin className="w-5 h-5" />, lines: ['officeAddress1', 'officeAddress2'], gradient: 'from-red-600 to-red-400' },
  { key: 'phone', icon: <Phone className="w-5 h-5" />, lines: ['mainOffice', 'publicRelations'], gradient: 'from-green-600 to-emerald-400' },
  { key: 'email', icon: <Mail className="w-5 h-5" />, lines: ['emailLine1', 'emailLine2'], gradient: 'from-blue-600 to-blue-400' },
  { key: 'hours', icon: <Clock className="w-5 h-5" />, lines: ['hoursLine1', 'hoursLine2'], gradient: 'from-amber-500 to-yellow-400' },
];

export default function ContactPage() {
  const { t } = useLocale();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState('');
  const [siteSettings, setSiteSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    settingsApi.getAll()
      .then((data) => {
        const map: Record<string, string> = {};
        data.forEach((s: SiteSetting) => { map[s.settingKey] = s.settingValue; });
        setSiteSettings(map);
      })
      .catch(() => {});
  }, []);

  const rawPhoneMain = siteSettings.contact_phone_main || '';
  const rawPhonePR = siteSettings.contact_phone_pr || '';
  const rawEmailMain = siteSettings.contact_email_main || '';
  const rawEmailSupport = siteSettings.contact_email_support || '';
  const rawHoursWeekday = siteSettings.contact_hours_weekday || '';
  const rawHoursSaturday = siteSettings.contact_hours_saturday || '';
  const rawAddress = siteSettings.contact_address || '';

  // Build display strings with labels, falling back to i18n if setting is empty
  const settingsPhoneMain = rawPhoneMain
    ? rawPhoneMain
    : t.contact.mainOffice.replace(/^[^:]+:\s*/, '');
  const settingsPhonePR = rawPhonePR
    ? rawPhonePR
    : t.contact.publicRelations.replace(/^[^:]+:\s*/, '');
  const settingsEmailMain = rawEmailMain || 'info@goreworeda.gov.et';
  const settingsEmailSupport = rawEmailSupport || 'support@goreworeda.gov.et';
  const settingsHoursWeekday = rawHoursWeekday || 'Mon–Fri: 8:00 AM – 5:00 PM';
  const settingsHoursSaturday = rawHoursSaturday || 'Sat: 8:00 AM – 12:00 PM';
  const settingsAddress = rawAddress || `${t.contact.officeAddress1} ${t.contact.officeAddress2}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await contactApi.submit(formData);
      setSubmitted(true);
      setFormError('');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      console.error('Contact submit error:', err);
      setFormError(t.contact.submitError || 'Failed to submit. Please try again later.');
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-sans flex flex-col justify-between">
      <div>
        <Header />

        {/* ── Hero Banner ── */}
        <section className="relative bg-gradient-to-br from-green-900 via-green-800 to-green-950 text-white py-10 md:py-12 text-center overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `radial-gradient(circle at 15% 30%, rgba(255,255,255,0.25) 0%, transparent 45%),
                              radial-gradient(circle at 85% 70%, rgba(255,255,255,0.15) 0%, transparent 40%),
                              radial-gradient(circle at 50% 50%, rgba(255,255,255,0.05) 0%, transparent 60%)`,
          }} />
          <div className="relative container mx-auto px-6">
            <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-4">{t.contact.title}</h1>
            <p className="text-slate-300 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">{t.contact.subtitle}</p>
          </div>
        </section>

        {/* ── Contact Info Cards ── */}
        <section className="container mx-auto px-4 sm:px-6 -mt-8 sm:-mt-10 relative z-10 overflow-x-hidden">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-5xl mx-auto">
            {contactChannels.map((channel) => (
              <div key={channel.key} className="bg-white dark:bg-slate-800 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 p-5 hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate-700 text-white text-xl mb-4 shadow-sm`}>
                  {channel.icon}
                </div>
                <h3 className="font-semibold text-slate-800 dark:text-white text-sm mb-2">
                  {channel.key === 'address' ? t.contact.officeLocation :
                   channel.key === 'phone' ? t.contact.phone :
                   channel.key === 'email' ? t.contact.email :
                   t.footer.workingHours}
                </h3>                  {channel.lines.map((line, i) => {
                  let display = line;
                  if (line === 'officeAddress1') display = settingsAddress;
                  else if (line === 'officeAddress2') return null; // address is a single line now
                  else if (line === 'mainOffice') display = t.contact.mainOffice.replace(/:\s*.*/, ': ') + settingsPhoneMain;
                  else if (line === 'publicRelations') display = t.contact.publicRelations.replace(/:\s*.*/, ': ') + settingsPhonePR;
                  else if (line === 'emailLine1') display = 'Main Email: ' + settingsEmailMain;
                  else if (line === 'emailLine2') display = 'Support Email: ' + settingsEmailSupport;
                  else if (line === 'hoursLine1') display = settingsHoursWeekday;
                  else if (line === 'hoursLine2') display = settingsHoursSaturday;
                  return (
                    <p key={i} className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">{display}</p>                  );
                    })}
                    {channel.key === 'hours' && (
                  <div className="flex items-center gap-1.5 mt-3 text-[10px] text-slate-600 dark:text-slate-400 font-semibold">
                    <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-pulse" />
                    {t.contact.openNow}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── Main Content: Form + Info ── */}
        <main id="main" className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 max-w-6xl">
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Left — Map & Office Info */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white mb-3 tracking-tight">{t.contact.getInTouch}</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{t.contact.description}</p>
              </div>

              {/* Map Card */}
              <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden group">
                <div className="relative aspect-[4/3] w-full bg-slate-100 dark:bg-slate-900">
                  <iframe
                    title="Gore Office Location Map"
                    width="100%"
                    height="100%"
                    className="w-full h-full border-0 grayscale-[15%] contrast-[105%] dark:invert-[90%] dark:hue-rotate-180 transition-all duration-300 group-hover:grayscale-0"
                    loading="lazy"
                    allowFullScreen
                    src="https://www.openstreetmap.org/export/embed.html?bbox=35.4800%2C8.1000%2C35.5900%2C8.2000&layer=mapnik&marker=8.1527%2C35.5368"
                  />
                  {/* Map Header Overlay */}
                  <div className="absolute top-3 left-3 right-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-md flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-white">
                      <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 animate-bounce" />
                      <span>{t.contact.officeLocation}</span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">8.15° N, 35.53° E</span>
                  </div>
                </div>
                {/* Map Footer */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 mb-3">
                    <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                    </svg>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Illubabor Zone, Oromia, Ethiopia</span>
                  </div>
                  <a
                    href="https://www.google.com/maps/place/Gore,+Ethiopia"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-600 dark:text-emerald-400 text-xs font-bold hover:underline flex items-center gap-1"
                  >
                    View Larger Map &rarr;
                  </a>
                </div>
              </div>

              {/* Office Hours Card */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700 p-5">
                <div className="flex items-center gap-2 text-sm mb-3">
                  <span className="w-2 h-2 bg-slate-500 rounded-full animate-pulse" />
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{t.contact.openNow}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5 text-xs text-slate-500 dark:text-slate-400">
                    <Clock className="w-4 h-4 shrink-0" />
                    <span>{settingsHoursWeekday}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-slate-500 dark:text-slate-400">
                    <Clock className="w-4 h-4 shrink-0" />
                    <span>{settingsHoursSaturday}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-3 pt-3 border-t border-slate-100 dark:border-slate-700">{t.contact.weAreHereToHelp}</p>
              </div>
            </div>

            {/* Right — Contact Form */}
            <div className="lg:col-span-3">
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700 p-8 md:p-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-slate-700 flex items-center justify-center text-white shadow-sm">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">{t.contact.sendMessage}</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{t.contact.respondWithinHours}</p>
                  </div>
                </div>

                {submitted ? (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mx-auto mb-6">
                      <svg className="w-10 h-10 text-slate-600 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">{t.contact.thankYou}!</h3>
                    <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">{t.contact.messageSent}</p>
                  </div>
                ) : (
                  <>
                    <div role="status" aria-live="polite" className="min-h-[1.25rem]">
                      {formError && <p className="text-sm text-red-600">{formError}</p>}
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid md:grid-cols-2 gap-5">
                        <div>
                          <label htmlFor="full-name" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">{t.contact.fullName}</label>
                          <div className="relative">
                            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                              id="full-name"
                              type="text"
                              required
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-slate-600 focus:border-transparent outline-none text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 bg-white dark:bg-slate-800 transition"
                              placeholder={t.contact.namePlaceholder}
                            />
                          </div>
                        </div>
                        <div>
                          <label htmlFor="email-address" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">{t.contact.emailAddress}</label>
                          <div className="relative">
                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                              id="email-address"
                              type="email"
                              required
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-slate-600 focus:border-transparent outline-none text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 bg-white dark:bg-slate-800 transition"
                              placeholder={t.contact.emailPlaceholder}
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label htmlFor="subject" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">{t.contact.subject}</label>
                        <div className="relative">
                          <ClipboardList className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            id="subject"
                            type="text"
                            required
                            value={formData.subject}
                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-slate-600 focus:border-transparent outline-none text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 bg-white dark:bg-slate-800 transition"                            placeholder={t.contact.subjectPlaceholder}
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="message-content" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">{t.contact.messageContent}</label>
                        <div className="relative">
                          <MessageSquare className="absolute left-3.5 top-4 w-4 h-4 text-gray-400" />
                          <textarea
                            id="message-content"
                            rows={5}
                            required
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-slate-600 focus:border-transparent outline-none text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 bg-white dark:bg-slate-800 transition resize-none"                            placeholder={t.contact.messagePlaceholder}
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-4 pt-2">
                        <button
                          type="submit"
                          className="inline-flex items-center gap-2 bg-[#1a7a3a] hover:bg-[#14632f] text-white font-semibold py-3.5 px-8 rounded-xl transition-all duration-200 hover:-translate-y-0.5 shadow-lg shadow-green-900/20"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                          </svg>
                          {t.contact.submit}
                        </button>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">{t.contact.privacyLabel}</p>
                      </div>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>


      <Footer />
    </div>
  );
}
