'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/component/Header';
import Footer from '@/component/Footer';
import { useLocale } from '@/context/LocaleContext';

export default function AttractionsPage() {
  const { t } = useLocale();
  const items = t.investmentTourism.attractionsList as unknown as string[];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-sans flex flex-col justify-between">
      <div>
        <Header />
        <section className="bg-gradient-to-br from-green-900 via-green-800 to-green-950 text-white py-10 sm:py-14 text-center overflow-x-hidden">
          <div className="container mx-auto px-4 sm:px-6">
            <h1 className="text-3xl md:text-4xl font-black">{t.investmentTourism.attractions}</h1>
            <p className="mt-2 text-emerald-100/80 max-w-xl mx-auto text-sm">{t.investmentTourism.attractionsDesc}</p>
          </div>
        </section>
        <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-4xl">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8">
            <div className="grid md:grid-cols-2 gap-4">
              {items.map((item, i) => (
                <div key={i} className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                  <div className="shrink-0 w-10 h-10 rounded-xl bg-slate-700 dark:bg-slate-600 text-white flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" /></svg>
                  </div>
                  <span className="text-slate-700 dark:text-slate-300 text-sm pt-1.5">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="text-center mt-8">
            <Link href="/investment-tourism" className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 text-sm inline-flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              {t.investmentTourism.overview}
            </Link>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
