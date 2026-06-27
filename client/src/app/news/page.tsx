'use client';

import React from 'react';
import Header from '@/component/Header';
import { useLocale } from '@/context/LocaleContext';

export default function NewsPage() {
  const { t } = useLocale();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <div>
        <Header />
        
        <section className="bg-green-800 text-white py-12 text-center">
          <div className="container mx-auto px-6">
            <h1 className="text-3xl font-bold md:text-4xl">{t.news.title}</h1>
            <p className="mt-2 text-green-100 max-w-xl mx-auto text-sm">
              {t.news.subtitle}
            </p>
          </div>
        </section>

        <main className="container mx-auto px-6 py-12 max-w-6xl grid md:grid-cols-3 gap-12">
          {/* Main Feed Column (Left 2/3) */}
          <div className="md:col-span-2 space-y-8">
            <h2 className="text-xl font-bold text-gray-900 border-b pb-2">{t.news.latestPress}</h2>
            {t.news.articles.map((article, idx) => (
              <article key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-3">
                <div className="flex items-center space-x-2 text-xs">
                  <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-medium">{article.tag}</span>
                  <span className="text-gray-400">{article.date}</span>
                </div>
                <h3 className="text-lg font-bold text-green-800 hover:underline cursor-pointer">{article.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{article.summary}</p>
              </article>
            ))}
          </div>

          {/* Quick Profile Sidebar (Right 1/3) */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 h-fit space-y-6">
            <h2 className="text-lg font-bold text-green-800 border-b pb-2">{t.news.quickFacts}</h2>
            
            <div className="space-y-4 text-sm">
              <div>
                <span className="block font-semibold text-gray-500 text-xs uppercase">{t.news.capital}</span>
                <p className="text-gray-800 font-medium">{t.news.capitalValue}</p>
              </div>
              <div>
                <span className="block font-semibold text-gray-500 text-xs uppercase">{t.news.historicalRoots}</span>
                <p className="text-gray-800 text-sm">{t.news.historicalRootsValue}</p>
              </div>
              <div>
                <span className="block font-semibold text-gray-500 text-xs uppercase">{t.news.primaryEconomics}</span>
                <p className="text-gray-800 text-sm">{t.news.primaryEconomicsValue}</p>
              </div>
            </div>
          </div>
        </main>
      </div>

      <footer className="bg-gray-900 text-gray-400 py-6 text-center text-sm">
        <p>&copy; {new Date().getFullYear()} {t.footer.copyright}</p>
      </footer>
    </div>
  );
}
