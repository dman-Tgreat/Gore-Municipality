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
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <div>
        <Header />
        <section className="bg-gradient-to-br from-purple-700 to-purple-600 text-white py-14 text-center">
          <div className="container mx-auto px-6">
            <h1 className="text-3xl md:text-4xl font-black">{t.investmentTourism.accommodation}</h1>
            <p className="mt-2 text-purple-100 max-w-xl mx-auto text-sm">{t.investmentTourism.accommodationDesc}</p>
          </div>
        </section>
        <main className="container mx-auto px-6 py-12 max-w-4xl">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="grid md:grid-cols-2 gap-4">
              {items.map((item, i) => (
                <div key={i} className="flex items-start gap-4 p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors">
                  <div className="shrink-0 w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center text-lg">🏨</div>
                  <span className="text-gray-700 text-sm pt-1.5">{item}</span>
                </div>
              ))}
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
