'use client';

import React from 'react';
import Header from '@/component/Header';
import { useLocale } from '@/context/LocaleContext';

export default function ServicesPage() {
  const { t } = useLocale();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <div>
        <Header />
        
        <section className="bg-green-800 text-white py-12 text-center">
          <div className="container mx-auto px-6">
            <h1 className="text-3xl font-bold md:text-4xl">{t.servicesPage.title}</h1>
            <p className="mt-2 text-green-100 max-w-xl mx-auto text-sm">
              {t.servicesPage.subtitle}
            </p>
          </div>
        </section>

        <main className="container mx-auto px-6 py-12 max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8">
            {t.servicesPage.categories.map((cat, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                <div className="p-6 bg-green-50 border-b border-gray-100 flex items-center space-x-3">
                  <span className="text-2xl">{cat.icon}</span>
                  <h2 className="text-lg font-bold text-green-800">{cat.title}</h2>
                </div>
                <ul className="p-6 divide-y divide-gray-100">
                  {cat.items.map((item, i) => (
                    <li key={i} className="py-3 flex justify-between items-center text-sm text-gray-600 hover:text-green-700 transition">
                      <span>{item}</span>
                      <button className="text-xs bg-green-700 text-white px-2 py-1 rounded hover:bg-green-600">{t.servicesPage.apply}</button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </main>
      </div>

      <footer className="bg-gray-900 text-gray-400 py-6 text-center text-sm">
        <p>&copy; {new Date().getFullYear()} {t.footer.copyright}</p>
      </footer>
    </div>
  );
}
