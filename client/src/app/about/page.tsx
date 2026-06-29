'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/component/Header';
import Footer from '@/component/Footer';
import { useLocale } from '@/context/LocaleContext';
import { newsApi, departmentsApi, projectsApi, settingsApi, type NewsArticle, type Department, type Project, type SiteSetting } from '@/lib/api';

const councilIcon = (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
  </svg>
);

const mayorSeal = (
  <svg className="w-7 h-7 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
  </svg>
);

const visionIcon = (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
  </svg>
);

export default function AboutPage() {
  const { t } = useLocale();
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [settings, setSettings] = useState<SiteSetting[]>([]);
  const [loading, setLoading] = useState(true);

  // Helper to get a setting value by key, falling back to a default
  const getSetting = (key: string, fallback: string): string => {
    const found = settings.find((s) => s.settingKey === key);
    return found ? found.settingValue : fallback;
  };

  // Parse council members from settings JSON or use i18n fallback
  const getCouncilMembers = (): { name: string; role: string; desc: string }[] => {
    const raw = getSetting('about_council_members', '');
    if (raw) {
      try { return JSON.parse(raw); } catch {}
    }
    return t.about.councilMembers as { name: string; role: string; desc: string }[];
  };

  useEffect(() => {
    Promise.all([
      newsApi.getAll().catch(() => [] as NewsArticle[]),
      departmentsApi.getAll().catch(() => [] as Department[]),
      projectsApi.getAll().catch(() => [] as Project[]),
      settingsApi.getAll().catch(() => [] as SiteSetting[]),
    ])
      .then(([allNews, allDepts, allProjects, allSettings]) => {
        setNews(allNews.filter((a) => a.published));
        setDepartments(allDepts);
        setProjects(allProjects);
        setSettings(allSettings);
      })
      .finally(() => setLoading(false));
  }, []);

  const councilMembers = getCouncilMembers();

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-sans">
      <Header />

      {/* ── Hero ── */}
      <section className="relative bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDE4YzEuNjU3IDAgMy0xLjM0MyAzLTNzLTEuMzQzLTMtMy0zLTMgMS4zNDMtMyAzIDEuMzQzIDMgMyAzem0tMTIgMGMxLjY1NyAwIDMtMS4zNDMgMy0zcy0xLjM0My0zLTMtMy0zIDEuMzQzLTMgMyAxLjM0MyAzIDMgM3oiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-40" />
        <div className="container mx-auto px-6 py-20 md:py-28 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-red-500/20 text-red-300 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4 backdrop-blur-sm border border-red-500/10">
              <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
              {t.header.about}
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">{t.about.title}</h1>
            <p className="text-lg text-gray-300 max-w-2xl">{t.about.subtitle}</p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white dark:from-slate-900 to-transparent" />
      </section>

      {/* ── Quick Stats Bar ── */}
      <div className="container mx-auto px-6 -mt-8 relative z-20">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-6 md:p-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: t.about.statUpdates, value: loading ? '—' : news.length, icon: '📰' },
            { label: t.about.statDepartments, value: loading ? '—' : departments.length, icon: '🏛️' },
            { label: t.about.statActiveProjects, value: loading ? '—' : projects.filter((p) => p.status === 'ongoing').length, icon: '🚧' },
            { label: t.about.statKebeles, value: '22', icon: '📍' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <span className="text-2xl mb-1 block">{stat.icon}</span>
              <p className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white">{stat.value}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── History ── */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <div>
              <div className="inline-flex items-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
                <span className="w-1.5 h-1.5 bg-slate-600 dark:bg-slate-400 rounded-full" />
                {t.about.historyTitle}
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{getSetting('about_history_desc', t.about.historyDesc)}</p>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl bg-slate-100 dark:bg-slate-800 overflow-hidden border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                <div className="text-center p-6">
                  <span className="text-6xl block mb-4">📜</span>
                  <p className="text-slate-700 dark:text-slate-300 font-semibold text-sm">{t.about.historyIllustration}</p>
                  <p className="text-slate-500 dark:text-slate-400 text-xs mt-2">{t.about.historyIllustrationSub}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Geography ── */}
      <section className="py-16 bg-white dark:bg-slate-800/50">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <div className="relative order-2 md:order-1">
              <div className="aspect-[4/3] rounded-2xl bg-slate-100 dark:bg-slate-800 overflow-hidden border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                <div className="text-center p-6">
                  <span className="text-6xl block mb-4">🌍</span>
                  <p className="text-slate-700 dark:text-slate-300 font-semibold text-sm">{t.about.geographyIllustration}</p>
                  <p className="text-slate-500 dark:text-slate-400 text-xs mt-2">{t.about.geographyIllustrationSub}</p>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="inline-flex items-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
                <span className="w-1.5 h-1.5 bg-slate-600 dark:bg-slate-400 rounded-full" />
                {t.about.geographyTitle}
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{getSetting('about_geography_desc', t.about.geographyDesc)}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Leadership ── */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
              <span className="w-1.5 h-1.5 bg-slate-600 dark:bg-slate-400 rounded-full" />
              {t.about.leadershipTitle}
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-white mb-3 tracking-tight">
              {t.about.leadershipTitle}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">{t.about.leadershipDesc}</p>
          </div>

          {/* Mayor & Vice Mayor */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
            {/* Mayor Card */}
            <div className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg text-center">
              <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-700 mx-auto mb-5 flex items-center justify-center border-2 border-slate-200 dark:border-slate-600 group-hover:border-slate-400 dark:group-hover:border-slate-500 transition-colors">
                <span className="text-4xl text-slate-700 dark:text-slate-300">{mayorSeal}</span>
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-1">{t.about.mayorTitle}</h3>
              <p className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-3">{getSetting('about_mayor_name', t.about.mayorName)}</p>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{getSetting('about_mayor_bio', t.about.mayorBio)}</p>
            </div>

            {/* Vice Mayor Card */}
            <div className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg text-center">
              <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-700 mx-auto mb-5 flex items-center justify-center border-2 border-slate-200 dark:border-slate-600 group-hover:border-slate-400 dark:group-hover:border-slate-500 transition-colors">
                <span className="text-4xl text-slate-700 dark:text-slate-300">{mayorSeal}</span>
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-1">{t.about.viceMayorTitle}</h3>
              <p className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-3">{getSetting('about_vice_mayor_name', t.about.viceMayorName)}</p>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{getSetting('about_vice_mayor_bio', t.about.viceMayorBio)}</p>
            </div>
          </div>

          {/* Council Members */}
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 mx-auto mb-4">
                {councilIcon}
              </div>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{t.about.councilTitle}</h3>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {councilMembers.map((member, i) => (
                <div
                  key={i}
                  className="group bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center text-sm font-bold shrink-0">
                      {member.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-800 dark:text-white text-sm">{member.name}</p>
                      <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">{member.role}</p>
                      <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">{member.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Vision & Mission ── */}
      <section className="py-20 bg-white dark:bg-slate-800/50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 mx-auto mb-4">
                {visionIcon}
              </div>
              <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">{t.about.visionTitle}</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">🎯</span>
                  <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">{t.about.visionLabel}</h3>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{getSetting('about_vision_text', t.about.visionText)}</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">⚡</span>
                  <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">{t.about.missionLabel}</h3>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{getSetting('about_mission_text', t.about.missionText)}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 bg-slate-800 dark:bg-slate-950 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-black mb-3">{t.about.ctaTitle}</h2>
          <p className="text-slate-300 text-sm max-w-xl mx-auto mb-8">
            {t.about.ctaDesc}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/service"
              className="inline-flex items-center gap-2 bg-white text-slate-800 font-bold px-6 py-3 rounded-xl hover:bg-slate-100 transition-colors shadow-lg"
            >
              🏛️ {t.header.services}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <Link
              href="/investment-tourism"
              className="inline-flex items-center gap-2 bg-slate-700 text-white font-bold px-6 py-3 rounded-xl hover:bg-slate-600 transition-colors border border-slate-600"
            >
              💼 {t.investmentTourism.title}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
