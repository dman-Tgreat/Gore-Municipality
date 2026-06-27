'use client';

import React from 'react';
import Link from 'next/link';
import { useLocale } from '@/context/LocaleContext';

export default function Services() {
  const { t } = useLocale();

  return (
    <main id="services" className="container mx-auto px-6 py-12 grid md:grid-cols-3 gap-8 scroll-mt-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold text-green-700 mb-2">{t.services.latestNews}</h3>
        <p className="text-gray-600 text-sm mb-4">{t.services.latestNewsDesc}</p>
        <Link href="/news" className="text-emerald-600 font-medium hover:underline text-sm">{t.services.viewAll}</Link>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold text-green-700 mb-2">{t.services.municipalServices}</h3>
        <p className="text-gray-600 text-sm mb-4">{t.services.municipalServicesDesc}</p>
        <Link href="/service" className="text-emerald-600 font-medium hover:underline text-sm">{t.services.viewAll}</Link>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold text-green-700 mb-2">{t.services.aboutGore}</h3>
        <p className="text-gray-600 text-sm mb-4">{t.services.aboutGoreDesc}</p>
        <Link href="/news" className="text-emerald-600 font-medium hover:underline text-sm">{t.services.readHistory}</Link>
      </div>
    </main>
  );
}
