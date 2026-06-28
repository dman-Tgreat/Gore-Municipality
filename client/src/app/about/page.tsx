'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/component/Header';
import Footer from '@/component/Footer';
import { useLocale } from '@/context/LocaleContext';
import { newsApi, departmentsApi, projectsApi, type NewsArticle, type Department, type Project } from '@/lib/api';

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      newsApi.getAll().catch(() => [] as NewsArticle[]),
      departmentsApi.getAll().catch(() => [] as Department[]),
      projectsApi.getAll().catch(() => [] as Project[]),
    ])
      .then(([allNews, allDepts, allProjects]) => {
        setNews(allNews.filter((a) => a.published));
        setDepartments(allDepts);
        setProjects(allProjects);
      })
      .finally(() => setLoading(false));
  }, []);

  const councilMembers = t.about.councilMembers as { name: string; role: string; desc: string }[];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <Header />

      {/* ── Hero ── */}
      <section className="relative bg-gradient-to-br from-gray-900 to-gray-800 text-white overflow-hidden">
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
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 to-transparent" />
      </section>

      {/* ── Quick Stats Bar ── */}
      <div className="container mx-auto px-6 -mt-8 relative z-20">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: t.about.statUpdates, value: loading ? '—' : news.length, icon: '📰' },
            { label: t.about.statDepartments, value: loading ? '—' : departments.length, icon: '🏛️' },
            { label: t.about.statActiveProjects, value: loading ? '—' : projects.filter((p) => p.status === 'ongoing').length, icon: '🚧' },
            { label: t.about.statKebeles, value: '22', icon: '📍' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <span className="text-2xl mb-1 block">{stat.icon}</span>
              <p className="text-2xl md:text-3xl font-black text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── History ── */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <div>
              <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-600 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
                <span className="w-1.5 h-1.5 bg-amber-600 rounded-full" />
                {t.about.historyTitle}
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">{t.about.historyDesc}</p>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-amber-100 to-amber-50 overflow-hidden border border-amber-200 flex items-center justify-center">
                <div className="text-center p-6">
                  <span className="text-6xl block mb-4">📜</span>
                  <p className="text-amber-800 font-semibold text-sm">Gore Woreda — Est. Late 19th Century</p>
                  <p className="text-amber-600 text-xs mt-2">Ras Tessema Nadew Compound</p>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-amber-600/10 rounded-full blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Geography ── */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <div className="relative order-2 md:order-1">
              <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-50 overflow-hidden border border-emerald-200 flex items-center justify-center">
                <div className="text-center p-6">
                  <span className="text-6xl block mb-4">🌍</span>
                  <p className="text-emerald-800 font-semibold text-sm">650 km² · 90,000+ Residents · 22 Kebeles</p>
                  <p className="text-emerald-600 text-xs mt-2">Illubabor Zone, Oromia, Ethiopia</p>
                </div>
              </div>
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-emerald-600/10 rounded-full blur-2xl" />
            </div>
            <div className="order-1 md:order-2">
              <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
                <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full" />
                {t.about.geographyTitle}
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">{t.about.geographyDesc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Leadership ── */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 bg-red-50 text-red-600 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
              <span className="w-1.5 h-1.5 bg-red-600 rounded-full" />
              {t.about.leadershipTitle}
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3 tracking-tight">
              {t.about.leadershipTitle}
            </h2>
            <p className="text-gray-500 text-sm">{t.about.leadershipDesc}</p>
          </div>

          {/* Mayor & Vice Mayor */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
            {/* Mayor Card */}
            <div className="group bg-white rounded-2xl border border-gray-100 hover:border-red-200 p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg text-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-red-100 to-red-50 mx-auto mb-5 flex items-center justify-center border-2 border-red-200 group-hover:border-red-400 transition-colors">
                <span className="text-4xl">{mayorSeal}</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">{t.about.mayorTitle}</h3>
              <p className="text-lg font-semibold text-red-600 mb-3">{t.about.mayorName}</p>
              <p className="text-gray-500 text-sm leading-relaxed">{t.about.mayorBio}</p>
            </div>

            {/* Vice Mayor Card */}
            <div className="group bg-white rounded-2xl border border-gray-100 hover:border-amber-200 p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg text-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-100 to-amber-50 mx-auto mb-5 flex items-center justify-center border-2 border-amber-200 group-hover:border-amber-400 transition-colors">
                <span className="text-4xl">{mayorSeal}</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">{t.about.viceMayorTitle}</h3>
              <p className="text-lg font-semibold text-amber-600 mb-3">{t.about.viceMayorName}</p>
              <p className="text-gray-500 text-sm leading-relaxed">{t.about.viceMayorBio}</p>
            </div>
          </div>

          {/* Council Members */}
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-indigo-50 text-indigo-600 mx-auto mb-4">
                {councilIcon}
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{t.about.councilTitle}</h3>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {councilMembers.map((member, i) => (
                <div
                  key={i}
                  className="group bg-white rounded-xl border border-gray-100 hover:border-indigo-200 p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-bold shrink-0">
                      {member.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 text-sm">{member.name}</p>
                      <p className="text-xs font-medium text-indigo-600 mb-1">{member.role}</p>
                      <p className="text-gray-500 text-xs leading-relaxed">{member.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Vision & Mission ── */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-purple-50 text-purple-600 mx-auto mb-4">
                {visionIcon}
              </div>
              <h2 className="text-3xl font-black text-gray-900 tracking-tight">{t.about.visionTitle}</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-purple-50 to-white rounded-2xl border border-purple-100 p-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">🎯</span>
                  <h3 className="text-lg font-bold text-purple-700">Vision</h3>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{t.about.visionText}</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl border border-blue-100 p-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">⚡</span>
                  <h3 className="text-lg font-bold text-blue-700">Mission</h3>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{t.about.missionText}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 bg-gradient-to-r from-red-600 to-red-700 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-black mb-3">Learn More About Our Woreda</h2>
          <p className="text-red-100 text-sm max-w-xl mx-auto mb-8">
            Explore our departments, services, and investment opportunities to see how Gore Woreda is growing.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/service"
              className="inline-flex items-center gap-2 bg-white text-red-600 font-bold px-6 py-3 rounded-xl hover:bg-red-50 transition-colors shadow-lg"
            >
              🏛️ {t.header.services}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <Link
              href="/investment-tourism"
              className="inline-flex items-center gap-2 bg-red-500 text-white font-bold px-6 py-3 rounded-xl hover:bg-red-400 transition-colors border border-red-400"
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
