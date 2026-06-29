'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLocale } from '@/context/LocaleContext';
import { newsApi, departmentsApi, projectsApi, type NewsArticle, type Department, type Project } from '@/lib/api';

const serviceIcons = {
  news: (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
    </svg>
  ),
  services: (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.646 5.647a1.5 1.5 0 01-2.122 0l-.004-.004a1.5 1.5 0 010-2.122l5.647-5.646m3.397 1.06l5.647-5.646a1.5 1.5 0 000-2.122l-.004-.004a1.5 1.5 0 00-2.122 0l-5.647 5.647m-5.646 5.646l-.004-.004a1.5 1.5 0 010-2.122L8.28 12.78M15 3l3 3M9 21l-3-3" />
    </svg>
  ),
  about: (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm1.5-9h3v3h-3v-3z" />
    </svg>
  ),
};

export default function Services() {
  const { t } = useLocale();
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      newsApi.getAll().catch(() => [] as NewsArticle[]),
      departmentsApi.getAll().catch(() => [] as Department[]),
      projectsApi.getAll().catch(() => [] as Project[]),
    ])
      .then(([allNews, allDepts, allProjects]) => {
        setNews(allNews.filter((a) => a.published).slice(0, 4));
        setDepartments(allDepts);
        setProjects(allProjects);
      })
      .finally(() => setLoading(false));
  }, []);

  const publishedNewsCount = news.length;
  const deptCount = departments.length;
  const projectCount = projects.filter((p) => p.status === 'ongoing').length;

  return (
    <section id="services" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 bg-red-50 text-red-600 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
            <span className="w-1.5 h-1.5 bg-red-600 rounded-full" />
            {t.header.services}
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3 tracking-tight">
            {t.services.latestNews}
          </h2>
          <p className="text-gray-500 text-sm max-w-xl mx-auto">
            {t.services.latestNewsDesc}
          </p>
        </div>

        {/* Service Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {/* ── Card 1: Latest News ── */}
          <div className="group relative bg-white rounded-2xl border border-red-100 hover:border-red-200 p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="absolute top-0 left-6 right-6 h-1 bg-gradient-to-r from-red-600 to-red-400 rounded-full opacity-60 group-hover:opacity-100 transition-opacity" />
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-red-50 text-red-600 mb-6 group-hover:scale-110 transition-transform duration-300">
              {serviceIcons.news}
            </div>
            <h3 className="text-lg font-bold text-red-600 mb-4">{t.services.latestNews}</h3>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-4 bg-gray-100 rounded animate-pulse" />
                ))}
              </div>
            ) : news.length > 0 ? (
              <ul className="space-y-3 mb-6">
                {news.map((article) => (
                  <li key={article.id}>
                    <Link
                      href={`/news`}
                      className="group/item flex items-start gap-2 text-sm text-gray-600 hover:text-red-600 transition-colors"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0 group-hover/item:bg-red-600" />
                      <div className="min-w-0">
                        <p className="font-medium text-gray-800 group-hover/item:text-red-600 transition-colors leading-snug line-clamp-1">
                          {article.title}
                        </p>
                        <span className="text-[10px] text-gray-400">
                          {new Date(article.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400 text-sm mb-6">{t.services.noUpdates}</p>
            )}

            <Link
              href="/news"
              className="inline-flex items-center gap-2 text-sm font-semibold text-red-600 hover:gap-3 transition-all"
            >
              {t.services.viewAll} ({publishedNewsCount})
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>

          {/* ── Card 2: Municipal Services ── */}
          <div className="group relative bg-white rounded-2xl border border-emerald-100 hover:border-emerald-200 p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="absolute top-0 left-6 right-6 h-1 bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full opacity-60 group-hover:opacity-100 transition-opacity" />
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-emerald-50 text-emerald-600 mb-6 group-hover:scale-110 transition-transform duration-300">
              {serviceIcons.services}
            </div>
            <h3 className="text-lg font-bold text-emerald-600 mb-4">{t.services.municipalServices}</h3>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-4 bg-gray-100 rounded animate-pulse" />
                ))}
              </div>
            ) : departments.length > 0 ? (
              <>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-3xl font-black text-emerald-600">{deptCount}</span>
                  <span className="text-sm text-gray-500">{t.services.departmentsLabel}</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {departments.slice(0, 5).map((dept) => (
                    <li key={dept.id}>
                      <Link
                        href={`/service/${dept.id}`}
                        className="flex items-center gap-2 text-sm text-gray-600 hover:text-emerald-600 transition-colors group/item"
                      >
                        <span className="w-5 h-5 rounded bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold shrink-0">
                          {dept.name.charAt(0)}
                        </span>
                        <span className="truncate">{dept.name}</span>
                      </Link>
                    </li>
                  ))}
                  {deptCount > 5 && (
                    <li className="text-xs text-gray-400 italic">
                      +{deptCount - 5} more departments
                    </li>
                  )}
                </ul>
              </>
            ) : (
              <p className="text-gray-400 text-sm mb-6">{t.services.noUpdates}</p>
            )}

            <Link
              href="/service"
              className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:gap-3 transition-all"
            >
              {t.services.viewAll}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>

          {/* ── Card 3: About Gore (dynamic stats) ── */}
          <div className="group relative bg-white rounded-2xl border border-amber-100 hover:border-amber-200 p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="absolute top-0 left-6 right-6 h-1 bg-gradient-to-r from-amber-600 to-amber-400 rounded-full opacity-60 group-hover:opacity-100 transition-opacity" />
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-amber-50 text-amber-600 mb-6 group-hover:scale-110 transition-transform duration-300">
              {serviceIcons.about}
            </div>
            <h3 className="text-lg font-bold text-amber-600 mb-4">{t.services.aboutGore}</h3>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-4 bg-gray-100 rounded animate-pulse" />
                ))}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-amber-50 rounded-xl p-3 text-center">
                    <p className="text-xl font-black text-amber-700">{publishedNewsCount + deptCount}</p>
                    <p className="text-[10px] text-amber-600 font-medium uppercase tracking-wider">{t.services.updatesLabel}</p>
                  </div>
                  <div className="bg-amber-50 rounded-xl p-3 text-center">
                    <p className="text-xl font-black text-amber-700">{deptCount}</p>
                    <p className="text-[10px] text-amber-600 font-medium uppercase tracking-wider">{t.services.departmentsLabel}</p>
                  </div>
                  <div className="bg-amber-50 rounded-xl p-3 text-center">
                    <p className="text-xl font-black text-amber-700">{projectCount}</p>
                    <p className="text-[10px] text-amber-600 font-medium uppercase tracking-wider">{t.services.activeProjectsLabel}</p>
                  </div>
                  <div className="bg-amber-50 rounded-xl p-3 text-center">
                    <p className="text-xl font-black text-amber-700">{projects.length}</p>
                    <p className="text-[10px] text-amber-600 font-medium uppercase tracking-wider">{t.services.totalProjectsLabel}</p>
                  </div>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">
                  {t.services.aboutGoreDesc}
                </p>
              </>
            )}

            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-sm font-semibold text-amber-600 hover:gap-3 transition-all"
            >
              {t.services.readHistory}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Bottom decorative element */}
        <div className="flex items-center justify-center gap-3 mt-12 text-gray-300">
          <div className="h-px w-12 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
          <span className="text-[10px] uppercase tracking-[0.2em] font-semibold">{t.services.goreWoredaTagline}</span>
          <div className="h-px w-12 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
        </div>
      </div>
    </section>
  );
}
