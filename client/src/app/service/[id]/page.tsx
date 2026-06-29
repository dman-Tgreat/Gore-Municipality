'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/component/Header';
import Footer from '@/component/Footer';
import { useLocale } from '@/context/LocaleContext';
import { tField } from '@/lib/locale';
import { departmentsApi, type Department } from '@/lib/api';

const iconList = ['📋', '🌱', '🏢', '⚕️', '🔧', '📚', '🏛️', '⚖️'];

export default function ServiceDetailPage() {
  const { locale, t } = useLocale();
  const params = useParams();
  const [dept, setDept] = useState<Department | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const id = Number(params.id);

  useEffect(() => {
    if (!id) return;
    departmentsApi.getOne(id)
      .then(setDept)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-pulse space-y-4 text-center">
            <div className="w-16 h-16 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto" />
            <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-48 mx-auto" />
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-64 mx-auto" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !dept) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-5xl mb-4">🔍</p>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{t.servicesPage.notFound}</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6">{t.servicesPage.notFoundDesc}</p>
            <Link href="/service" className="text-slate-700 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white font-semibold inline-flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              {t.servicesPage.backToServices}
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const iconIdx = (dept.id % iconList.length + iconList.length) % iconList.length;
  const deptIcon = iconList[iconIdx];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-sans flex flex-col">
      <Header />

      {/* Hero Banner */}
      <section className="relative bg-slate-800 dark:bg-slate-950 text-white py-16 overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `radial-gradient(circle at 20% 30%, rgba(255,255,255,0.2) 0%, transparent 50%),
                            radial-gradient(circle at 80% 70%, rgba(255,255,255,0.1) 0%, transparent 50%)`,
        }} />
        <div className="relative container mx-auto px-6">
          <Link href="/service" className="inline-flex items-center gap-1 text-slate-300 hover:text-white text-sm mb-6 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            {t.header.services}
          </Link>
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-4xl shadow-lg">
              {deptIcon}
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black">{tField(dept, 'name', locale)}</h1>
              <p className="text-slate-300 mt-1">{dept.head}</p>
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-6 py-10 max-w-5xl">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-slate-500 rounded-full" />
                {t.servicesPage.aboutDept}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{tField(dept, 'description', locale)}</p>
            </div>

            {/* Department Stats — derived from API data */}
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { label: t.servicesPage.deptHead, value: dept.head || '—', icon: '👤' },
                { label: t.servicesPage.contact, value: dept.phone || dept.email || '—', icon: '📞' },
                { label: t.servicesPage.office, value: dept.office || '—', icon: '📍' },
              ].map((stat, i) => (
                <div key={i} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 text-center hover:shadow-md transition">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-lg mb-3">
                    {stat.icon}
                  </div>
                  <p className="text-2xl font-black text-slate-800 dark:text-white truncate" title={stat.value}>{stat.value}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-slate-500 rounded-full" />
                {t.servicesPage.contactInfo}
              </h3>
              <div className="space-y-4">
                {dept.head && (
                  <div className="flex items-start gap-3">
                    <span className="text-lg shrink-0">👤</span>
                    <div>
                      <p className="text-xs text-slate-400 dark:text-slate-500">{t.admin.headField}</p>
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{dept.head}</p>
                    </div>
                  </div>
                )}
                {dept.phone && (
                  <div className="flex items-start gap-3">
                    <span className="text-lg shrink-0">📞</span>
                    <div>
                      <p className="text-xs text-slate-400 dark:text-slate-500">{t.admin.phoneField}</p>
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{dept.phone}</p>
                    </div>
                  </div>
                )}
                {dept.email && (
                  <div className="flex items-start gap-3">
                    <span className="text-lg shrink-0">✉️</span>
                    <div>
                      <p className="text-xs text-slate-400 dark:text-slate-500">{t.contact.email}</p>
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{dept.email}</p>
                    </div>
                  </div>
                )}
                {dept.office && (
                  <div className="flex items-start gap-3">
                    <span className="text-lg shrink-0">📍</span>
                    <div>
                      <p className="text-xs text-slate-400 dark:text-slate-500">{t.admin.officeField}</p>
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{dept.office}</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700">
                <Link
                  href="/contact"
                  className="w-full inline-flex items-center justify-center gap-2 bg-slate-700 dark:bg-slate-600 hover:bg-slate-600 dark:hover:bg-slate-500 text-white text-sm font-semibold px-5 py-3 rounded-xl transition-all"
                >
                  {t.contact.sendMessage}
                </Link>
              </div>
            </div>

            {/* Quick Stats — data-driven from API */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-slate-500 rounded-full" />
                {t.servicesPage.deptInfo}
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
                  <span className="text-xs text-slate-500 dark:text-slate-400">{t.servicesPage.registered}</span>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{new Date(dept.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
                  <span className="text-xs text-slate-500 dark:text-slate-400">{t.admin.headField}</span>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{dept.head}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
                  <span className="text-xs text-slate-500 dark:text-slate-400">{t.contact.email}</span>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[140px]" title={dept.email}>{dept.email}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400">{t.admin.phoneField}</span>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{dept.phone}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
