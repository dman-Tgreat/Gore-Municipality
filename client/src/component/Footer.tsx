'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLocale } from '@/context/LocaleContext';
import { settingsApi, type SiteSetting } from '@/lib/api';

export default function Footer() {
  const { t } = useLocale();
  const year = new Date().getFullYear();
  const [settings, setSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    settingsApi.getAll()
      .then((data) => {
        const map: Record<string, string> = {};
        data.forEach((s: SiteSetting) => { map[s.settingKey] = s.settingValue; });
        setSettings(map);
      })
      .catch(() => {});
  }, []);

  const phone = settings.contact_phone_main || t.footer.phone;
  const email = settings.contact_email_main || t.footer.email;
  const address = settings.contact_address || t.footer.address;
  const hours = settings.contact_hours_weekday || t.footer.workingHours;
  const tagline1 = settings.footer_tagline1 || 'Gore Woreda';
  const tagline2 = settings.footer_tagline2 || 'Illubabor Zone';
  const tagline3 = settings.footer_tagline3 || 'Oromia';

  const quickLinks = [
    { label: t.footer.home, href: '/' },
    { label: t.header.about, href: '/about' },
    { label: t.footer.news, href: '/news' },
    { label: t.footer.announcements, href: '/announcements' },
    { label: t.footer.services, href: '/service' },
    { label: t.footer.projects, href: '/projects' },
    { label: t.footer.contact, href: '/contact' },
  ];

  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-slate-400">
      {/* Top decorative bar */}
      <div className="h-0.5 bg-gradient-to-r from-slate-700 via-slate-500 to-slate-700 dark:from-slate-600 dark:via-slate-400 dark:to-slate-600" />

      {/* Main Footer */}
      <div className="container mx-auto px-6 py-14 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Brand & About - spans 4 cols */}
          <div className="lg:col-span-4">
            <Link href="/" className="inline-flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-slate-700 dark:bg-slate-800 flex items-center justify-center shadow-sm">
                <span className="text-white font-black text-sm">GW</span>
              </div>
              <div>
                <h3 className="text-white font-bold text-base leading-tight">Gore Woreda</h3>
                <p className="text-slate-500 text-[10px] uppercase tracking-wider">Administration</p>
              </div>
            </Link>
            <p className="text-slate-400 dark:text-slate-500 text-sm leading-relaxed mb-5 max-w-sm">
              {t.footer.aboutDesc}
            </p>
            <div className="inline-flex items-center gap-2 text-xs bg-slate-800 dark:bg-slate-800 rounded-lg px-3 py-2 text-slate-400 dark:text-slate-500">
              <span className="w-2 h-2 bg-slate-500 dark:bg-slate-600 rounded-full" />
              {hours}
            </div>
          </div>

          {/* Quick Links - spans 2 cols */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-400 dark:text-slate-500 hover:text-white text-sm transition-colors inline-flex items-center gap-2"
                  >
                    <span className="w-1 h-1 rounded-full bg-slate-600 dark:bg-slate-600 shrink-0" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information - spans 3 cols */}
          <div className="lg:col-span-3">
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">
              {t.footer.contactInfo}
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-slate-500 dark:text-slate-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                <span className="text-slate-400 dark:text-slate-500 text-sm leading-relaxed">{address}</span>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-slate-500 dark:text-slate-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
                <span className="text-slate-400 dark:text-slate-500 text-sm">{phone}</span>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-slate-500 dark:text-slate-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                <a href={`mailto:${email}`} className="text-slate-400 dark:text-slate-500 hover:text-white text-sm transition-colors">{email}</a>
              </li>
            </ul>
          </div>

          {/* Mission Statement - spans 3 cols */}
          <div className="lg:col-span-3">
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">
              {t.footer.aboutTitle}
            </h4>
            <p className="text-slate-400 dark:text-slate-500 text-sm leading-relaxed mb-6">
              {t.footer.aboutDesc}
            </p>
            <div className="inline-flex items-center gap-2 text-xs bg-slate-800 dark:bg-slate-800 rounded-lg px-3 py-2 text-slate-400 dark:text-slate-500">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {t.footer.workingHours}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800 dark:border-slate-800">
        <div className="container mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-slate-500 dark:text-slate-600 text-xs">
            &copy; {year} {t.footer.copyright}
          </p>
          <div className="flex items-center gap-4 text-slate-600 dark:text-slate-700 text-[10px] uppercase tracking-wider">
            <span>{tagline1}</span>
            <span className="w-px h-3 bg-slate-700 dark:bg-slate-700" />
            <span>{tagline2}</span>
            <span className="w-px h-3 bg-slate-700 dark:bg-slate-700" />
            <span>{tagline3}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
