'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/component/Header';
import Footer from '@/component/Footer';
import { useLocale } from '@/context/LocaleContext';
import { tField } from '@/lib/locale';
import { departmentsApi, type Department } from '@/lib/api';
import { ClipboardList, Sprout, Building, HeartPulse, Wrench, BookOpen, Landmark, Scale, Phone, Mail, MapPin } from 'lucide-react';

const deptIcons = [ClipboardList, Sprout, Building, HeartPulse, Wrench, BookOpen, Landmark, Scale];

export default function ServicesPage() {
  const { locale, t } = useLocale();
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
        
        <section className="bg-gradient-to-br from-green-900 via-green-800 to-green-950 text-white py-8 text-center">
          <div className="container mx-auto px-6">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white/80 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
              <span className="w-1.5 h-1.5 bg-emerald-300/80 rounded-full animate-pulse" />
              {t.header.services}
            </div>
            <h1 className="text-3xl md:text-4xl font-black">{t.servicesPage.title}</h1>
            <p className="mt-2 text-emerald-100/80 max-w-xl mx-auto text-sm">{t.servicesPage.subtitle}</p>
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
                      {React.createElement(deptIcons[idx % deptIcons.length], { className: 'w-6 h-6 text-green-500' })}
                    </div>
                    <div className="text-slate-900 dark:text-slate-100">
                      <h2 className="text-lg font-bold">{tField(dept, 'name', locale)}</h2>
                      <p className="text-base text-slate-700">{dept.head}</p>
                    </div>
                  </div>
                  <div className="p-6 space-y-3">
                    <p className="text-base text-slate-600 dark:text-slate-600 leading-relaxed line-clamp-3">{tField(dept, 'description', locale)}</p>
                    <div className="text-xs text-slate-500 dark:text-slate-600 space-y-1.5 pt-3 border-t border-slate-200 dark:border-slate-700">
                      {dept.phone && <p className="flex items-center gap-1.5 text-base"><Phone className="w-3.5 h-3.5 text-slate-600 " /> {dept.phone}</p>}
                      {dept.email && <p className="flex items-center gap-1.5 text-base"><Mail className="w-3.5 h-3.5 text-slate-600 " /> {dept.email}</p>}
                      {dept.office && <p className="flex items-center gap-1.5 text-base"><MapPin className="w-3.5 h-3.5 text-slate-600 " /> {dept.office}</p>}
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
