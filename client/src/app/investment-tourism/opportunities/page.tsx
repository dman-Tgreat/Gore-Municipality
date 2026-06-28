'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/component/Header';
import Footer from '@/component/Footer';
import { useLocale } from '@/context/LocaleContext';

export default function OpportunitiesPage() {
  const { t } = useLocale();
  const items = t.investmentTourism.opportunitiesList as unknown as string[];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <div>
        <Header />
        <section className="bg-gradient-to-br from-blue-700 to-blue-600 text-white py-14 text-center">
          <div className="container mx-auto px-6">
            <h1 className="text-3xl md:text-4xl font-black">{t.investmentTourism.opportunities}</h1>
            <p className="mt-2 text-blue-100 max-w-xl mx-auto text-sm">{t.investmentTourism.opportunitiesDesc}</p>
          </div>
        </section>
        <main className="container mx-auto px-6 py-12 max-w-4xl">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <ul className="space-y-4">
              {items.map((item, i) => (
                <li key={i} className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl">
                  <span className="shrink-0 w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center text-sm font-bold">{i + 1}</span>
                  <span className="text-gray-700 pt-1">{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
              <Link href="/contact" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all">
                {t.investmentTourism.contactInvest}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
          </div>
          <div className="text-center mt-8">
            <Link href="/investment-tourism" className="text-gray-500 hover:text-red-600 text-sm inline-flex items-center gap-1">
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
