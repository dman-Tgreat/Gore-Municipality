'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/component/Header';
import Footer from '@/component/Footer';
import { useLocale } from '@/context/LocaleContext';
import { tField } from '@/lib/locale';
import { documentsApi, type Document } from '@/lib/api';

const categoryIcons: Record<string, string> = {
  policy: '📋',
  report: '📊',
  form: '📝',
  regulation: '⚖️',
  minutes: '📑',
  budget: '💰',
  plan: '📐',
  notice: '📢',
};



function getFileIcon(fileUrl: string): string {
  const ext = fileUrl.split('.').pop()?.toLowerCase() || '';
  if (['pdf'].includes(ext)) return '📄';
  if (['doc', 'docx'].includes(ext)) return '📝';
  if (['xls', 'xlsx', 'csv'].includes(ext)) return '📊';
  if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(ext)) return '🖼️';
  return '📁';
}

function getFileType(fileUrl: string): string {
  const ext = fileUrl.split('.').pop()?.toUpperCase() || '';
  if (ext === 'PDF') return 'PDF Document';
  if (['DOC', 'DOCX'].includes(ext)) return 'Word Document';
  if (['XLS', 'XLSX', 'CSV'].includes(ext)) return 'Spreadsheet';
  if (['PNG', 'JPG', 'JPEG', 'GIF', 'WEBP'].includes(ext)) return 'Image';
  return 'File';
}

export default function DocumentsPage() {
  const { locale, t } = useLocale();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    documentsApi.getAll()
      .then(setDocuments)
      .catch(() => setDocuments([]))
      .finally(() => setLoading(false));
  }, []);

  const categories = ['all', ...new Set(documents.map((d) => d.category))];
  const filtered = documents.filter((d) => {
    const matchesCategory = categoryFilter === 'all' || d.category === categoryFilter;
    if (!searchQuery.trim()) return matchesCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch = d.title.toLowerCase().includes(q) || d.description.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-sans flex flex-col justify-between">
      <div>
        <Header />

        <section className="bg-slate-800 text-white py-14 px-4 text-center">
          <div className="container mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white/80 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
              <span className="w-1.5 h-1.5 bg-white/60 rounded-full animate-pulse" />
              {t.admin.cmsDocuments}
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black px-2">{t.documents.title}</h1>
            <p className="mt-2 text-slate-300 max-w-xl mx-auto text-xs sm:text-sm px-4">{t.documents.subtitle}</p>
          </div>
        </section>

        <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-6xl">
          {/* Search Bar */}
          <div className="mb-5">
            <div className="relative max-w-md">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.documents.searchPlaceholder}
                className="w-full pl-9 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 focus:border-transparent outline-none transition placeholder-slate-400 dark:placeholder-slate-500 bg-white dark:bg-slate-800"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition p-1"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 mb-6 sm:mb-8 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide snap-x">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}                  className={`px-3 sm:px-4 py-1.5 text-xs sm:text-sm rounded-full font-medium transition whitespace-nowrap snap-start shrink-0 ${
                    categoryFilter === cat
                      ? 'bg-slate-800 text-white shadow-md'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
              >
                {cat === 'all'
                  ? t.documents.allCategories
                  : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 animate-pulse p-4 sm:p-6 space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 sm:py-16">
              <p className="text-3xl sm:text-4xl mb-3">📂</p>
              <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base">{t.documents.noDocuments}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filtered.map((doc) => {
                const icon = categoryIcons[doc.category] || getFileIcon(doc.fileUrl);
                return (
                  <div
                    key={doc.id}
                    className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-all duration-200 hover:-translate-y-1 group"
                  >
                    {/* Header */}
                    <div className="bg-slate-700 px-4 sm:px-5 py-3 sm:py-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-xl shadow-sm shrink-0">
                        {icon}
                      </div>
                      <div className="min-w-0 text-white">
                        <h3 className="font-bold text-sm sm:text-base leading-tight truncate">{tField(doc, 'title', locale)}</h3>
                        <p className="text-[10px] sm:text-xs text-white/80 truncate">
                          {doc.category.charAt(0).toUpperCase() + doc.category.slice(1)}
                        </p>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="p-4 sm:p-5 space-y-3">
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                        {tField(doc, 'description', locale)}
                      </p>

                      <div className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 space-y-1.5 pt-2 border-t border-slate-200 dark:border-slate-700">
                        <p className="flex items-center gap-1.5">
                          <span>📎</span>
                          <span className="font-medium">{getFileType(doc.fileUrl)}</span>
                        </p>
                        <p className="flex items-center gap-1.5">
                          <span>🕐</span>
                          <span>{t.documents.lastUpdated}: {new Date(doc.createdAt).toLocaleDateString()}</span>
                        </p>
                        {doc.createdBy && (
                          <p className="flex items-center gap-1.5">
                            <span>👤</span>
                            <span className="truncate">{doc.createdBy.fullName}</span>
                          </p>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="flex gap-2 pt-1">
                        <Link
                          href={`/documents/${doc.id}`}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                          </svg>
                          {t.documents.view}
                        </Link>
                        <a
                          href={doc.fileUrl}
                          download
                          className="inline-flex items-center justify-center gap-1.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                          </svg>
                          {t.documents.download}
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
}
