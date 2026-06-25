'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  
  // State to handle selected language and toggle dropdown menu visibility
  const [currentLang, setCurrentLang] = useState({ code: 'EN', name: 'English' });
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'EN', name: 'English' },
    { code: 'OR', name: 'Afaan Oromoo' },
    { code: 'AM', name: 'አማርኛ (Amharic)' }
  ];

  const linkStyle = (path: string) => {
    const isActive = pathname === path;
    return `transition font-medium text-sm ${
      isActive 
        ? 'text-red-600 font-bold border-b-2 border-red-600 pb-1' 
        : 'text-gray-600 hover:text-red-600'                     
    }`;
  };

  const handleLanguageChange = (lang: { code: string; name: string }) => {
    setCurrentLang(lang);
    setIsOpen(false);
    // Future integration point: code to switch your language context dictionaries goes here!
    alert(`Language switched placeholder style to: ${lang.name}`);
  };

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
            <Link href="/" className={linkStyle('/')}>Home</Link>
            <Link href="/news" className={linkStyle('/news')}>About</Link>
            <Link href="/#services" className={linkStyle('/services')}>Services</Link>
            <Link href="/news" className={linkStyle('/news')}>News</Link>
            <Link href="/contact" className={linkStyle('/contact')}>Contact</Link>
          </nav>

          <span className="w-px h-5 bg-gray-200" /> {/* Vertical divider line */}

          {/* Interactive Language Selector Menu */}
          <div className="relative">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center space-x-2 text-sm font-semibold text-gray-700 hover:text-red-600 border border-gray-200 rounded-md px-3 py-1.5 transition bg-gray-50"
            >
              <span>🌐</span>
              <span>{currentLang.code}</span>
              <span className={`text-xs transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>

            {/* Dropdown Menu Overlay List */}
            {isOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-xl border border-gray-100 py-1 overflow-hidden animate-fade-in">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang)}
                    className={`w-full text-left px-4 py-2.5 text-sm transition text-gray-700 hover:bg-red-50 hover:text-red-600 flex justify-between items-center ${
                      currentLang.code === lang.code ? 'font-bold text-red-600 bg-red-50/30' : ''
                    }`}
                  >
                    <span>{lang.name}</span>
                    {currentLang.code === lang.code && <span className="text-xs">✓</span>}
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