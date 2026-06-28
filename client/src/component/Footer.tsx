'use client';

import React from 'react';
import Link from 'next/link';
import { useLocale } from '@/context/LocaleContext';

export default function Footer() {
  const { t } = useLocale();
  const year = new Date().getFullYear();

  const quickLinks = [
    { label: t.footer.home, href: '/' },
    { label: t.header.about, href: '/about' },
    { label: t.footer.news, href: '/news' },
    { label: t.footer.announcements, href: '/announcements' },
    { label: t.admin.cmsDocuments, href: '/documents' },
    { label: t.footer.services, href: '/service' },
    { label: t.footer.projects, href: '/projects' },
    { label: t.footer.contact, href: '/contact' },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="container mx-auto px-6 py-14 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand & About */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white font-black text-sm shadow-lg">
                GW
              </div>
              <div>
                <h3 className="text-white font-bold text-lg leading-tight">Gore Woreda</h3>
                <p className="text-gray-500 text-[10px] uppercase tracking-widest">Administration</p>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              {t.footer.aboutDesc}
            </p>
            {/* Working Hours Badge */}
            <div className="inline-flex items-center gap-2 text-xs bg-gray-800 rounded-lg px-3 py-2 text-gray-400">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              {t.footer.workingHours}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-red-400 text-sm transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-gray-600 rounded-full group-hover:bg-red-400 transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">
              {t.footer.contactInfo}
            </h4>
            <ul className="space-y-4">
              {/* Address */}
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-red-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                <span className="text-gray-400 text-sm leading-relaxed">
                  {t.footer.address}
                </span>
              </li>
              {/* Phone */}
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
                <span className="text-gray-400 text-sm">{t.footer.phone}</span>
              </li>
              {/* Email */}
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                <a href={`mailto:${t.footer.email}`} className="text-gray-400 hover:text-red-400 text-sm transition-colors">
                  {t.footer.email}
                </a>
              </li>
            </ul>
          </div>

          {/* Admin & Quick Access */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">
              {t.footer.adminPanel}
            </h4>
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white text-sm font-medium rounded-lg px-5 py-3 transition-all duration-200 w-full justify-center border border-gray-700"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
              {t.admin.login}
            </Link>
            <div className="mt-6 pt-6 border-t border-gray-800">
              <p className="text-gray-500 text-xs leading-relaxed">
                {t.footer.workingHours}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-500 text-xs">
            &copy; {year} {t.footer.copyright}
          </p>
          <div className="flex items-center gap-4 text-gray-600 text-[10px] uppercase tracking-wider">
            <span>Gore Woreda</span>
            <span className="w-px h-3 bg-gray-700" />
            <span>Illubabor Zone</span>
            <span className="w-px h-3 bg-gray-700" />
            <span>Oromia</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
