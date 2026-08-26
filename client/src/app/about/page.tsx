'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/component/Header';
import Footer from '@/component/Footer';
import { useLocale } from '@/context/LocaleContext';
import { newsApi, departmentsApi, projectsApi, settingsApi, type NewsArticle, type Department, type Project, type SiteSetting } from '@/lib/api';
import { Newspaper, Landmark, Construction, MapPin, ScrollText, Globe, User, Crosshair, Zap, Briefcase } from 'lucide-react';

const councilIcon = (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
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
        setNews(allNews.filter((a: NewsArticle) => a.published));
        setDepartments(allDepts);
        setProjects(allProjects);
        setSettings(allSettings);
      })
      .finally(() => setLoading(false));
  }, []);

  const councilMembers = getCouncilMembers();

  return (
    <div className="min-h-screen bg-page-bg text-slate-900 dark:text-slate-100 font-sans">
      <Header />
      {/* ── Hero ── */}
      <section className="relative bg-green-700 text-white overflow-hidden">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 relative z-10">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 tracking-tight">{t.about.title}</h1>
            <p className="text-lg md:text-xl text-gray-200 max-w-3xl leading-relaxed">{t.about.subtitle}</p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white dark:from-slate-900 to-transparent" />
      </section>

      {/* ── Quick Stats Bar ── */}
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 relative z-20 overflow-x-hidden">
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 sm:p-6 md:p-8 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 shadow-xl">
          {[
            { label: t.about.statUpdates, value: loading ? '—' : news.length, icon: <Newspaper className="w-6 h-6 text-emerald-600 dark:text-emerald-400" /> },
            { label: t.about.statDepartments, value: loading ? '—' : departments.length, icon: <Landmark className="w-6 h-6 text-emerald-600 dark:text-emerald-400" /> },
            { label: t.about.statActiveProjects, value: loading ? '—' : projects.filter((p) => p.status === 'ongoing').length, icon: <Construction className="w-6 h-6 text-emerald-600 dark:text-emerald-400" /> },
            { label: t.about.statKebeles, value: '22', icon: <MapPin className="w-6 h-6 text-emerald-600 dark:text-emerald-400" /> },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <span className="inline-flex items-center justify-center mb-1 text-slate-500 dark:text-slate-400">{stat.icon}</span>
              <p className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white">{stat.value}</p>
              <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── History ── */}
      <section className="relative w-full overflow-hidden py-16 sm:py-28 my-8 shadow-2xl">
        {/* Full-bleed Historical Background Image matching website aesthetic */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 hover:scale-105"
          style={{ backgroundImage: `url('/gore_history_bg.jpg')` }}
        />
        {/* Aesthetic Gradient Mask matching green & slate dark theme */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/75 to-transparent dark:from-slate-950/95 dark:via-slate-950/85 dark:to-slate-900/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/40" />
        <div className="absolute inset-0 bg-emerald-950/15 backdrop-blur-[0.5px]" />

        {/* History Text Container aligned inside standard max-w-7xl grid */}
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight drop-shadow-md">
              {t.about.historyTitle}
            </h2>
            <div className="bg-slate-900/75 backdrop-blur-md p-6 sm:p-8 md:p-10 rounded-2xl border border-white/10 shadow-2xl">
              <p className="text-slate-100 text-base sm:text-lg md:text-xl leading-relaxed font-normal">
                {getSetting('about_history_desc', t.about.historyDesc)}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Geography ── */}
      <section className="py-12 sm:py-16 bg-slate-50 dark:bg-slate-800/40">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Card: Location Map complementing geography text */}
            <div className="relative order-2 md:order-1">
              <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden group">
                <div className="relative aspect-[4/3] w-full bg-slate-100 dark:bg-slate-900">
                  <iframe
                    title="Gore Location Map"
                    width="100%"
                    height="100%"
                    className="w-full h-full border-0 grayscale-[15%] contrast-[105%] dark:invert-[90%] dark:hue-rotate-180 transition-all duration-300 group-hover:grayscale-0"
                    loading="lazy"
                    allowFullScreen
                    src="https://www.openstreetmap.org/export/embed.html?bbox=35.4800%2C8.1000%2C35.5900%2C8.2000&layer=mapnik&marker=8.1527%2C35.5368"
                  />
                  {/* Map Header Overlay */}
                  <div className="absolute top-3 left-3 right-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-md flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-white">
                      <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 animate-bounce" />
                      <span>Gore Town & Woreda</span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">8.15° N, 35.53° E</span>
                  </div>
                </div>
                {/* Map Footer Bar with details complementing text */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 dark:text-slate-400">
                  <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    Illubabor Zone, Oromia, Ethiopia
                  </span>
                  <a
                    href="https://www.google.com/maps/place/Gore,+Ethiopia"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline flex items-center gap-1"
                  >
                    View Larger Map &rarr;
                  </a>
                </div>
              </div>
            </div>

            {/* Right Side: Geography & Demographics Text */}
            <div className="order-1 md:order-2">
              <h2 className="text-3xl sm:text-4xl font-black text-slate-800 dark:text-white mb-6 tracking-tight">
                {t.about.geographyTitle}
              </h2>
              <div className="bg-white dark:bg-slate-800/60 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm">
                <p className="text-slate-700 dark:text-slate-300 text-base sm:text-lg leading-relaxed">{getSetting('about_geography_desc', t.about.geographyDesc)}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Leadership ── */}
      <section className="py-12 sm:py-16">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-white mb-3 tracking-tight">
              {t.about.leadershipTitle}
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg">{t.about.leadershipDesc}</p>
          </div>

          {/* Mayor & Vice Mayor */}
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
            {/* Mayor Card */}
            <div className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-emerald-500/40 p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl text-center">
              <div className="w-24 h-24 rounded-full bg-emerald-50 dark:bg-slate-700 mx-auto mb-5 flex items-center justify-center border-2 border-emerald-200 dark:border-slate-600 group-hover:border-emerald-500 transition-colors">
                <User className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-1">{t.about.mayorTitle}</h3>
              <p className="text-lg font-semibold text-emerald-600 dark:text-emerald-400 mb-3">{getSetting('about_mayor_name', t.about.mayorName)}</p>
              <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed">{getSetting('about_mayor_bio', t.about.mayorBio)}</p>
            </div>

            {/* Vice Mayor Card */}
            <div className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-emerald-500/40 p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl text-center">
              <div className="w-24 h-24 rounded-full bg-emerald-50 dark:bg-slate-700 mx-auto mb-5 flex items-center justify-center border-2 border-emerald-200 dark:border-slate-600 group-hover:border-emerald-500 transition-colors">
                <User className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-1">{t.about.viceMayorTitle}</h3>
              <p className="text-lg font-semibold text-emerald-600 dark:text-emerald-400 mb-3">{getSetting('about_vice_mayor_name', t.about.viceMayorName)}</p>
              <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed">{getSetting('about_vice_mayor_bio', t.about.viceMayorBio)}</p>
            </div>
          </div>

          {/* Council Members */}
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 mx-auto mb-4 border border-emerald-200 dark:border-slate-700 shadow-sm">
                {councilIcon}
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white">{t.about.councilTitle}</h3>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {councilMembers.map((member, i) => (
                <div
                  key={i}
                  className="group bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-emerald-500/40 p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-base font-bold shrink-0">
                      {member.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-800 dark:text-white text-lg">{member.name}</p>
                      <p className="text-base font-medium text-emerald-600 dark:text-emerald-400 mb-1">{member.role}</p>
                      <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{member.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Vision & Mission ── */}
      <section className="py-12 sm:py-16 bg-slate-50 dark:bg-slate-800/40">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 mx-auto mb-4 border border-emerald-200 dark:border-slate-700 shadow-sm">
                {visionIcon}
              </div>
              <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">{t.about.visionTitle}</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <Crosshair className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white">{t.about.visionLabel}</h3>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed">{getSetting('about_vision_text', t.about.visionText)}</p>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <Zap className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white">{t.about.missionLabel}</h3>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed">{getSetting('about_mission_text', t.about.missionText)}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-12 sm:py-16 bg-gradient-to-r from-green-900 via-green-800 to-green-950 text-white">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-4">{t.about.ctaTitle}</h2>
          <p className="text-emerald-100/90 text-lg max-w-2xl mx-auto mb-8">
            {t.about.ctaDesc}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/service"
              className="inline-flex items-center gap-2 bg-white text-[#1a7a3a] font-bold px-6 py-3.5 rounded-xl hover:bg-slate-100 transition-colors shadow-lg"
            >
              <Landmark className="w-5 h-5" /> {t.header.services}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <Link
              href="/investment-tourism"
              className="inline-flex items-center gap-2 bg-[#d4a017] text-slate-900 font-bold px-6 py-3.5 rounded-xl hover:bg-[#b8850f] hover:text-white transition-colors shadow-lg"
            >
              <Briefcase className="w-5 h-5" /> {t.investmentTourism.title}
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
