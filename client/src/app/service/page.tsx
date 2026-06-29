'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/component/Header';
import Footer from '@/component/Footer';
import { useLocale } from '@/context/LocaleContext';
import { departmentsApi, type Department } from '@/lib/api';

const icons = ['📋', '🌱', '🏢', '⚕️', '🔧', '📚', '🏛️', '⚖️'];

export default function ServicesPage() {
  const { t } = useLocale();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    departmentsApi.getAll()
      .then(setDepartments)
      .catch(() => setDepartments([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-sans flex flex-col justify-between">
      <div>
        <Header />
        
        <section className="bg-slate-800 text-white py-14 text-center">
          <div className="container mx-auto px-6">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white/80 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
              <span className="w-1.5 h-1.5 bg-white/60 rounded-full animate-pulse" />
              {t.header.services}
            </div>
            <h1 className="text-3xl md:text-4xl font-black">{t.servicesPage.title}</h1>
            <p className="mt-2 text-slate-300 max-w-xl mx-auto text-sm">{t.servicesPage.subtitle}</p>
          </div>
        </section>

        <main className="container mx-auto px-6 py-12 max-w-6xl">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white dark:bg-slate-800 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 animate-pulse p-6 space-y-4">
                  <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full" />
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {departments.map((dept, idx) => (
                <Link
                  key={dept.id}
                  href={`/service/${dept.id}`}
                  className="bg-white dark:bg-slate-800 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-all duration-200 hover:-translate-y-1 group block"
                >
                  <div className="p-6 bg-slate-100 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-600 flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-700 flex items-center justify-center text-2xl shadow-sm">
                      {icons[idx % icons.length]}
                    </div>
                    <div className="text-white">
                      <h2 className="text-lg font-bold">{dept.name}</h2>
                      <p className="text-xs text-slate-300">{dept.head}</p>
                    </div>
                  </div>
                  <div className="p-6 space-y-3">
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">{dept.description}</p>
                    <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1.5 pt-3 border-t border-slate-200 dark:border-slate-700">
                      {dept.phone && <p className="flex items-center gap-1.5"><span>📞</span> {dept.phone}</p>}
                      {dept.email && <p className="flex items-center gap-1.5"><span>✉️</span> {dept.email}</p>}
                      {dept.office && <p className="flex items-center gap-1.5"><span>📍</span> {dept.office}</p>}
                    </div>
                    <div className="pt-2">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:gap-2 transition-all">
                        {t.projects.viewDetails}
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
}
