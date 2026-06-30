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

  const settingsEmailMain = siteSettings.contact_email_main || 'info@goreworeda.gov.et';
  const settingsEmailSupport = siteSettings.contact_email_support || 'support@goreworeda.gov.et';
  const settingsPhoneMain = siteSettings.contact_phone_main || t.contact.mainOffice;
  const settingsPhonePR = siteSettings.contact_phone_pr || t.contact.publicRelations;
  const settingsHoursWeekday = siteSettings.contact_hours_weekday || 'Mon–Fri: 8:00 AM – 5:00 PM';
  const settingsHoursSaturday = siteSettings.contact_hours_saturday || 'Sat: 8:00 AM – 12:00 PM';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await contactApi.submit(formData);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch {
      alert('Failed to submit. Please try again later.');
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-sans flex flex-col justify-between">
      <div>
        <Header />

        {/* ── Hero Banner ── */}
        <section className="relative bg-slate-800 text-white py-16 md:py-20 text-center overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `radial-gradient(circle at 15% 30%, rgba(255,255,255,0.25) 0%, transparent 45%),
                              radial-gradient(circle at 85% 70%, rgba(255,255,255,0.15) 0%, transparent 40%),
                              radial-gradient(circle at 50% 50%, rgba(255,255,255,0.05) 0%, transparent 60%)`,
          }} />
          <div className="relative container mx-auto px-6">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white/80 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5">                  <span className="w-1.5 h-1.5 bg-white/60 rounded-full animate-pulse" />
              {t.header.contact}
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-4">{t.contact.title}</h1>
            <p className="text-slate-300 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">{t.contact.subtitle}</p>
          </div>
        </section>

        {/* ── Contact Info Cards ── */}
        <section className="container mx-auto px-6 -mt-10 relative z-10">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
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
                </h3>
                {channel.lines.map((line, i) => {
                  let display = line;
                  if (line === 'officeAddress1') display = t.contact.officeAddress1;
                  else if (line === 'officeAddress2') display = t.contact.officeAddress2;
                  else if (line === 'mainOffice') display = t.contact.mainOffice;
                  else if (line === 'publicRelations') display = t.contact.publicRelations;
                  else if (line === 'emailLine1') display = settingsEmailMain;
                  else if (line === 'emailLine2') display = settingsEmailSupport;
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
        <main className="container mx-auto px-6 py-14 max-w-6xl">
          <div className="grid lg:grid-cols-5 gap-10">
            {/* Left — Get In Touch & Map */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <div className="inline-flex items-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
                  <span className="w-1.5 h-1.5 bg-slate-600 dark:bg-slate-400 rounded-full" />
                  {t.contact.getInTouch}
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white mb-3 tracking-tight">{t.contact.getInTouch}</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{t.contact.description}</p>
              </div>

              {/* Decorative Map / Location Illustration */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="bg-slate-700 p-6 text-white relative overflow-hidden">
                  <div className="absolute inset-0 opacity-[0.08]" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                  }} />
                  <div className="relative flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl shadow-lg shrink-0">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base">{t.contact.officeLocation}</h3>
                      <p className="text-slate-300 text-xs mt-0.5">{t.contact.officeAddress1}</p>
                      <p className="text-slate-300 text-xs">{t.contact.officeAddress2}</p>
                    </div>
                  </div>
                </div>
                <div className="p-5 space-y-4">
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 shrink-0 mt-0.5 text-slate-500" />
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">{t.contact.phone}</p>
                      <p className="text-sm font-medium text-slate-800 dark:text-white">{t.contact.mainOffice}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{t.contact.publicRelations}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 shrink-0 mt-0.5 text-slate-500" />
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">{t.contact.email}</p>
                      <p className="text-sm font-medium text-slate-800 dark:text-white">{settingsEmailMain}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{settingsEmailSupport}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 shrink-0 mt-0.5 text-slate-500" />
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">{t.footer.workingHours}</p>
                      <p className="text-sm font-medium text-slate-800 dark:text-white">{settingsHoursWeekday}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{settingsHoursSaturday}</p>
                    </div>
                  </div>                    <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="w-2 h-2 bg-slate-500 rounded-full animate-pulse" />
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{t.contact.openNow} — {t.contact.weAreHereToHelp}</span>
                    </div>
                  </div>
                </div>
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
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">{t.contact.fullName}</label>
                        <div className="relative">
                          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
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
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">{t.contact.emailAddress}</label>
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
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

                    <div>                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">{t.contact.subject}</label>
                      <div className="relative">
                        <ClipboardList className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          required
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-slate-600 focus:border-transparent outline-none text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 bg-white dark:bg-slate-800 transition"                            placeholder={t.contact.subjectPlaceholder}
                        />
                      </div>
                    </div>

                    <div>                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">{t.contact.messageContent}</label>
                      <div className="relative">
                        <MessageSquare className="absolute left-3.5 top-4 w-4 h-4 text-gray-400" />
                        <textarea
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
                        className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3.5 px-8 rounded-xl transition-all duration-200 hover:-translate-y-0.5 shadow-lg"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                        </svg>
                        {t.contact.submit}
                      </button>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{t.contact.privacyLabel}</p>
                    </div>
                  </form>
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
