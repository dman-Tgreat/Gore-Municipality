'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLocale } from '@/context/LocaleContext';
import { newsApi, departmentsApi, projectsApi, type NewsArticle, type Department, type Project } from '@/lib/api';

const serviceIcons = {
  news: (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
    </svg>
  ),
  services: (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.646 5.647a1.5 1.5 0 01-2.122 0l-.004-.004a1.5 1.5 0 010-2.122l5.647-5.646m3.397 1.06l5.647-5.646a1.5 1.5 0 000-2.122l-.004-.004a1.5 1.5 0 00-2.122 0l-5.647 5.647m-5.646 5.646l-.004-.004a1.5 1.5 0 010-2.122L8.28 12.78M15 3l3 3M9 21l-3-3" />
    </svg>
  ),
  about: (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
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
    <section id="services" className="py-12 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="section-badge mb-4">
            <span className="w-1.5 h-1.5 bg-slate-500 dark:bg-white/60 rounded-full" />
            {t.header.services}
          </div>
          <h2 className="section-title mb-3">
            {t.services.latestNews}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xl mx-auto">
            {t.services.latestNewsDesc}
          </p>
        </div>

        {/* Service Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {/* ── Card 1: Latest News ── */}
          <div className="group bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 hover:-translate-y-0.5">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 dark:bg-primary-dark/50 text-primary dark:text-gold-light mb-5 group-hover:scale-110 transition-transform duration-300">
              {serviceIcons.news}
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">{t.services.latestNews}</h3>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-4 bg-slate-100 dark:bg-slate-700 rounded animate-pulse" />
                ))}
              </div>
            ) : news.length > 0 ? (
              <ul className="space-y-3 mb-6">
                {news.map((article) => (
                  <li key={article.id}>
                    <Link
                      href={`/news`}
                      className="group/item flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors"
                    >
                      <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600 mt-2 shrink-0 group-hover/item:bg-slate-800 dark:group-hover/item:bg-white" />
                      <div className="min-w-0">
                        <p className="font-medium text-slate-800 dark:text-slate-200 leading-snug line-clamp-1">
                          {article.title}
                        </p>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500">
                          {new Date(article.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-400 dark:text-slate-500 text-sm mb-6">{t.services.noUpdates}</p>
            )}

            <Link
              href="/news"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-800 dark:text-white hover:gap-2.5 transition-all group/link"
            >
              {t.services.viewAll} ({publishedNewsCount})
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>

          {/* ── Card 2: Municipal Services ── */}
          <div className="group bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 hover:-translate-y-0.5">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 dark:bg-primary-dark/50 text-primary dark:text-gold-light mb-5 group-hover:scale-110 transition-transform duration-300">
              {serviceIcons.services}
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">{t.services.municipalServices}</h3>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-4 bg-slate-100 dark:bg-slate-700 rounded animate-pulse" />
                ))}
              </div>
            ) : departments.length > 0 ? (
              <>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-2xl font-black text-slate-800 dark:text-white">{deptCount}</span>
                  <span className="text-sm text-slate-500 dark:text-slate-400">{t.services.departmentsLabel}</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {departments.slice(0, 5).map((dept) => (
                    <li key={dept.id}>
                      <Link
                        href={`/service/${dept.id}`}
                        className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors group/item"
                      >
                        <span className="w-5 h-5 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 flex items-center justify-center text-[10px] font-bold shrink-0">
                          {dept.name.charAt(0)}
                        </span>
                        <span className="truncate">{dept.name}</span>
                      </Link>
                    </li>
                  ))}
                  {deptCount > 5 && (
                    <li className="text-xs text-slate-400 dark:text-slate-500 italic">
                      +{deptCount - 5} more departments
                    </li>
                  )}
                </ul>
              </>
            ) : (
              <p className="text-slate-400 dark:text-slate-500 text-sm mb-6">{t.services.noUpdates}</p>
            )}

            <Link
              href="/service"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-800 dark:text-white hover:gap-2.5 transition-all group/link"
            >
              {t.services.viewAll}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>

          {/* ── Card 3: About Gore ── */}
          <div className="group bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 hover:-translate-y-0.5">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 dark:bg-primary-dark/50 text-primary dark:text-gold-light mb-5 group-hover:scale-110 transition-transform duration-300">
              {serviceIcons.about}
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">{t.services.aboutGore}</h3>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-4 bg-slate-100 dark:bg-slate-700 rounded animate-pulse" />
                ))}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl p-3 text-center">
                    <p className="text-xl font-black text-slate-800 dark:text-white">{publishedNewsCount + deptCount}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">{t.services.updatesLabel}</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl p-3 text-center">
                    <p className="text-xl font-black text-slate-800 dark:text-white">{deptCount}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">{t.services.departmentsLabel}</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl p-3 text-center">
                    <p className="text-xl font-black text-slate-800 dark:text-white">{projectCount}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">{t.services.activeProjectsLabel}</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl p-3 text-center">
                    <p className="text-xl font-black text-slate-800 dark:text-white">{projects.length}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">{t.services.totalProjectsLabel}</p>
                  </div>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6">
                  {t.services.aboutGoreDesc}
                </p>
              </>
            )}

            <Link
              href="/about"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-800 dark:text-white hover:gap-2.5 transition-all group/link"
            >
              {t.services.readHistory}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Bottom decorative element */}
        <div className="flex items-center justify-center gap-3 mt-12 text-slate-400 dark:text-slate-500">
          <div className="h-px w-12 bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-600 to-transparent" />
          <span className="text-[10px] uppercase tracking-[0.2em] font-semibold">{t.services.goreWoredaTagline}</span>
          <div className="h-px w-12 bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-600 to-transparent" />
        </div>
      </div>
    </section>
  );
}
