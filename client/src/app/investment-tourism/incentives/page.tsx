'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/component/Header';
import Footer from '@/component/Footer';
import { useLocale } from '@/context/LocaleContext';

export default function IncentivesPage() {
  const { t } = useLocale();
  const items = t.investmentTourism.incentivesList as unknown as string[];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-sans flex flex-col justify-between">
      <div>
        <Header />
        <section className="bg-slate-800 dark:bg-slate-950 text-white py-14 text-center">
          <div className="container mx-auto px-6">
            <h1 className="text-3xl md:text-4xl font-black">{t.investmentTourism.incentives}</h1>
            <p className="mt-2 text-slate-300 max-w-xl mx-auto text-sm">{t.investmentTourism.incentivesDesc}</p>
          </div>
        </section>
        <main className="container mx-auto px-6 py-12 max-w-4xl">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8">
            <div className="grid gap-4">
              {items.map((item, i) => (
                <div key={i} className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                  <div className="shrink-0 w-8 h-8 rounded-lg bg-slate-700 dark:bg-slate-600 text-white flex items-center justify-center text-sm font-bold">✓</div>
                  <span className="text-slate-700 dark:text-slate-300 pt-1">{item}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 text-center">
              <Link href="/contact" className="inline-flex items-center gap-2 bg-slate-700 dark:bg-slate-600 hover:bg-slate-600 dark:hover:bg-slate-500 text-white px-6 py-3 rounded-xl font-semibold transition-all">
                {t.investmentTourism.contactInvest}
              </Link>
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
