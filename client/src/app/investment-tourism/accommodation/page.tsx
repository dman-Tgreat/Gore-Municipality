'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/component/Header';
import Footer from '@/component/Footer';
import { useLocale } from '@/context/LocaleContext';

export default function AccommodationPage() {
  const { t } = useLocale();
  const items = t.investmentTourism.accommodationList as unknown as string[];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-sans flex flex-col justify-between">
      <div>
        <Header />
        <section className="bg-gradient-to-br from-green-900 via-green-800 to-green-950 text-white py-10 sm:py-14 text-center overflow-x-hidden">
          <div className="container mx-auto px-4 sm:px-6">
            <h1 className="text-3xl md:text-4xl font-black">{t.investmentTourism.accommodation}</h1>
            <p className="mt-2 text-emerald-100/80 max-w-xl mx-auto text-sm">{t.investmentTourism.accommodationDesc}</p>
          </div>
        </section>
        <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-4xl">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8">
            <div className="grid md:grid-cols-2 gap-4">
              {items.map((item, i) => (
                <div key={i} className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                  <div className="shrink-0 w-10 h-10 rounded-xl bg-slate-700 dark:bg-slate-600 text-white flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" /></svg>
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
