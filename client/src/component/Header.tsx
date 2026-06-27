'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale, type LocaleCode } from '@/context/LocaleContext';
import { locales } from '@/i18n/messages';

export default function Header() {
  const pathname = usePathname();
  const { locale, setLocale, t } = useLocale();
  const [isOpen, setIsOpen] = useState(false);

  const linkStyle = (path: string) => {
    const isActive = pathname === path || pathname.startsWith(path + '/');
    return `transition font-medium text-sm ${
      isActive
        ? 'text-red-600 font-bold border-b-2 border-red-600 pb-1'
        : 'text-gray-600 hover:text-red-600'
    }`;
  };

  const handleLanguageChange = (lang: { code: LocaleCode }) => {
    setLocale(lang.code);
    setIsOpen(false);
  };

  const currentLocale = locales.find((l) => l.code === locale)!;

  return (
    <header className="bg-white text-gray-800 shadow-sm border-b border-gray-100 relative z-50 sticky top-0">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* Brand Identity */}
        <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition shrink-0">
          <img 
            src="https://via.placeholder.com/50/cc0000/ffffff?text=GW" 
            alt="Gore Woreda Emblem" 
            className="w-10 h-10 object-contain rounded-full bg-red-600 p-1"
          />
          <h1 className="text-xl font-black tracking-wide text-red-600">Gore Woreda</h1>
        </Link>
        
        {/* Navigation & Language */}
        <nav className="flex items-center space-x-5">
          <Link href="/" className={linkStyle('/')}>{t.header.home}</Link>
          <Link href="/news" className={linkStyle('/news')}>{t.header.news}</Link>
          <Link href="/announcements" className={linkStyle('/announcements')}>{t.header.announcements}</Link>
          <Link href="/service" className={linkStyle('/service')}>{t.header.services}</Link>
          <Link href="/projects" className={linkStyle('/projects')}>Projects</Link>
          <Link href="/contact" className={linkStyle('/contact')}>{t.header.contact}</Link>

          <span className="w-px h-5 bg-gray-200" />

          {/* Language Selector */}
          <div className="relative">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center space-x-1.5 text-sm font-semibold text-gray-700 hover:text-red-600 border border-gray-200 rounded-md px-2.5 py-1.5 transition bg-gray-50"
            >
              <span>🌐</span>
              <span>{currentLocale.native}</span>
              <span className={`text-xs transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>

            {isOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-xl border border-gray-100 py-1 overflow-hidden z-50">
                {locales.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange({ code: lang.code })}
                    className={`w-full text-left px-4 py-2.5 text-sm transition text-gray-700 hover:bg-red-50 hover:text-red-600 flex justify-between items-center ${
                      locale === lang.code ? 'font-bold text-red-600 bg-red-50/30' : ''
                    }`}
                  >
                    <span>{lang.native} — {lang.label}</span>
                    {locale === lang.code && <span className="text-xs">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
