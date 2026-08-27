'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { allMessages, type LocaleCode, type Messages } from '@/i18n/messages';

type LocaleContextType = {
  locale: LocaleCode;
  setLocale: (code: LocaleCode) => void;
  t: Messages;
};

const LocaleContext = createContext<LocaleContextType | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<LocaleCode>('en');

  // Resolve the real locale only on the client to avoid hydration mismatch
  useEffect(() => {
    let detected: LocaleCode = 'en';
    const stored = localStorage.getItem('locale') as LocaleCode | null;
    if (stored && ['en', 'am', 'om'].includes(stored)) {
      detected = stored;
    } else {
      const browserLang = navigator.language?.split('-')[0];
      if (browserLang === 'am') detected = 'am';
      else if (browserLang === 'om') detected = 'om';
    }
    setLocaleState(detected);
    document.documentElement.lang = detected;
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((code: LocaleCode) => {
    setLocaleState(code);
    localStorage.setItem('locale', code);
  }, []);

  const t = allMessages[locale];

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider');
  return ctx;
}

export { type LocaleCode };
