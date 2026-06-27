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
    const isActive = pathname === path;
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
        <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition">
          <img 
            src="https://via.placeholder.com/50/cc0000/ffffff?text=GW" 
            alt="Gore Woreda Emblem" 
            className="w-10 h-10 object-contain rounded-full bg-red-600 p-1"
          />
          <h1 className="text-2xl font-black tracking-wide text-red-600">Gore Woreda</h1>
        </Link>
        
        {/* Right Nav-Links & Language Dropdown Stack */}
        <div className="flex items-center space-x-8">
          <nav className="space-x-6 flex items-center">
            <Link href="/" className={linkStyle('/')}>{t.header.home}</Link>
            <Link href="/news" className={linkStyle('/news')}>{t.header.about}</Link>
            <Link href="/#services" className={linkStyle('/services')}>{t.header.services}</Link>
            <Link href="/news" className={linkStyle('/news')}>{t.header.news}</Link>
            <Link href="/contact" className={linkStyle('/contact')}>{t.header.contact}</Link>
          </nav>

          <span className="w-px h-5 bg-gray-200" />

          {/* Interactive Language Selector Menu */}
          <div className="relative">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center space-x-2 text-sm font-semibold text-gray-700 hover:text-red-600 border border-gray-200 rounded-md px-3 py-1.5 transition bg-gray-50"
            >
              <span>🌐</span>
              <span>{currentLocale.native}</span>
              <span className={`text-xs transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>

            {/* Dropdown Menu Overlay List */}
            {isOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-xl border border-gray-100 py-1 overflow-hidden animate-fade-in">
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
        </div>

      </div>
    </header>
  );
}
