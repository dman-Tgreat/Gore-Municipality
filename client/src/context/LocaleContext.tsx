'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { allMessages, type LocaleCode, type Messages } from '@/i18n/messages';

type LocaleContextType = {
  locale: LocaleCode;
  setLocale: (code: LocaleCode) => void;
  t: Messages;
};

const LocaleContext = createContext<LocaleContextType | null>(null);

function getInitialLocale(): LocaleCode {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('locale') as LocaleCode | null;
    if (stored && ['en', 'am', 'om'].includes(stored)) return stored;
  }
  return 'en';
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<LocaleCode>('en');

  useEffect(() => {
    setLocaleState(getInitialLocale());
  }, []);

  const setLocale = useCallback((code: LocaleCode) => {
    setLocaleState(code);
    localStorage.setItem('locale', code);
    document.documentElement.lang = code === 'en' ? 'en' : code === 'am' ? 'am' : 'om';
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
