'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/component/Header';
import Footer from '@/component/Footer';
import { useLocale } from '@/context/LocaleContext';
import { newsApi, announcementsApi, type NewsArticle, type Announcement } from '@/lib/api';

type Tab = 'news' | 'announcements';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function NewsPage() {
  const { t } = useLocale();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<Tab>(() => {
    const tab = searchParams.get('tab');
    return tab === 'announcements' ? 'announcements' : 'news';
  });
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    Promise.all([
      newsApi.getAll().catch(() => [] as NewsArticle[]),
      announcementsApi.getAll().catch(() => [] as Announcement[]),
    ]).then(([allNews, allAnnouncements]) => {
      setArticles(allNews.filter((a) => a.published));
      setAnnouncements(allAnnouncements.filter((a) => a.published));
    }).finally(() => setLoading(false));
  }, []);

  const imgSrc = (url: string | undefined) => {
    if (!url) return undefined;
    if (url.startsWith('/uploads/')) return `${API_BASE}${url}`;
    return url;
  };

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: 'news', label: t.header.news, icon: '📰' },
    { key: 'announcements', label: t.announcements.title, icon: '📢' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <div>
        <Header />

        {/* Header Banner */}
        <section className="relative bg-gradient-to-br from-green-800 via-green-700 to-emerald-800 text-white py-14 text-center overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.2) 0%, transparent 50%),
                              radial-gradient(circle at 80% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)`,
          }} />
          <div className="relative container mx-auto px-6">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white/80 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
              <span className="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse" />
              {t.header.home}
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">
              {activeTab === 'news' ? t.news.title : t.announcements.title}
            </h1>
            <p className="mt-2 text-green-100 max-w-2xl mx-auto text-sm">
              {activeTab === 'news' ? t.news.subtitle : t.announcements.subtitle}
            </p>
          </div>
        </section>

        {/* Tab Selector */}
        <div className="bg-white border-b border-gray-200 sticky top-[73px] z-30">
          <div className="container mx-auto px-6">
            <div className="flex gap-1 -mb-px">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => { setActiveTab(tab.key); setExpandedId(null); }}
                  className={`flex items-center gap-2 px-5 py-3.5 text-sm font-semibold transition-all duration-200 border-b-2 ${
                    activeTab === tab.key
                      ? 'border-red-600 text-red-600 bg-red-50/50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="text-base">{tab.icon}</span>
                  {tab.label}
                  {tab.key === 'news' && articles.length > 0 && (
                    <span className="text-[10px] bg-gray-100 text-gray-500 rounded-full px-1.5 py-0.5 font-mono">
                      {articles.length}
                    </span>
                  )}
                  {tab.key === 'announcements' && announcements.length > 0 && (
                    <span className="text-[10px] bg-gray-100 text-gray-500 rounded-full px-1.5 py-0.5 font-mono">
                      {announcements.length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <main className="container mx-auto px-6 py-10 max-w-6xl">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-pulse space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-20" />
                  <div className="h-5 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                </div>
              ))}
            </div>
          ) : activeTab === 'news' ? (
            /* === NEWS TAB === */
            <div className="grid md:grid-cols-3 gap-10">
              {/* Main Feed */}
              <div className="md:col-span-2 space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-red-600">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
                    </svg>
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">{t.news.latestPress}</h2>
                </div>

                {articles.length === 0 ? (
                  <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
                    <p className="text-4xl mb-3">📰</p>
                    <p className="text-gray-500">{t.services.noUpdates}</p>
                  </div>
                ) : (
                  articles.map((article) => (
                    <article key={article.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
                      {article.coverImage && (
                        <img src={imgSrc(article.coverImage)} alt={article.title} className="w-full h-52 object-cover" />
                      )}
                      <div className="p-6 space-y-3">
                        <div className="flex items-center gap-2 text-xs">
                          <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                            {t.news.latestPress}
                          </span>
                          <span className="text-gray-400">
                            {new Date(article.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 hover:text-red-600 transition-colors cursor-pointer">
                          {article.title}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {article.summary}
                        </p>
                        <button className="text-red-600 text-sm font-semibold hover:text-red-700 transition-colors inline-flex items-center gap-1">
                          {t.announcements.readMore}
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                          </svg>
                        </button>
                      </div>
                    </article>
                  ))
                )}
              </div>

              {/* Quick Facts Sidebar */}
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 h-fit space-y-6 sticky top-[140px]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                    </svg>
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">{t.news.quickFacts}</h2>
                </div>
                <div className="space-y-5 text-sm border-t border-gray-100 pt-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <span className="block font-semibold text-gray-500 text-[10px] uppercase tracking-wider mb-1">{t.news.capital}</span>
                    <p className="text-gray-800 font-medium text-sm">{t.news.capitalValue}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <span className="block font-semibold text-gray-500 text-[10px] uppercase tracking-wider mb-1">{t.news.historicalRoots}</span>
                    <p className="text-gray-800 text-sm">{t.news.historicalRootsValue}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <span className="block font-semibold text-gray-500 text-[10px] uppercase tracking-wider mb-1">{t.news.primaryEconomics}</span>
                    <p className="text-gray-800 text-sm">{t.news.primaryEconomicsValue}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* === ANNOUNCEMENTS TAB === */
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38a.875.875 0 01-.978-.017 13.112 13.112 0 01-2.827-2.436m0 0a15.052 15.052 0 01-2.373-5.474m10.264 3.527c.253-.962.584-1.892.985-2.783.247-.55.06-1.21-.463-1.511l-.657-.38a.875.875 0 00-.978.017 13.112 13.112 0 00-2.827 2.436m0 0a15.052 15.052 0 012.373 5.474M16.5 7.5h3.75a.75.75 0 01.75.75v.75m0 0v11.25c0 .414-.336.75-.75.75H12.75a.75.75 0 01-.75-.75v-2.25" />
                  </svg>
                </div>
                <h2 className="text-lg font-bold text-gray-900">{t.announcements.title}</h2>
              </div>

              {announcements.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
                  <p className="text-4xl mb-3">📢</p>
                  <p className="text-gray-500 text-lg">{t.announcements.noAnnouncements}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {announcements.map((announcement) => (
                    <div key={announcement.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200">
                      <button
                        onClick={() => setExpandedId(expandedId === announcement.id ? null : announcement.id)}
                        className="w-full text-left p-6 flex justify-between items-start gap-4"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className="bg-red-100 text-red-700 text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider">
                              {t.announcements.published}
                            </span>
                            <span className="text-gray-400 text-xs">
                              {new Date(announcement.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <h3 className="text-lg font-bold text-gray-900">{announcement.title}</h3>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{announcement.description}</p>
                        </div>
                        <div className={`shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center transition-all duration-200 ${
                          expandedId === announcement.id ? 'rotate-180 bg-red-100 text-red-600' : 'text-gray-400'
                        }`}>
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                          </svg>
                        </div>
                      </button>
                      {expandedId === announcement.id && (
                        <div className="px-6 pb-6 border-t border-gray-100 pt-4">
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                              {announcement.content}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}
