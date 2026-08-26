'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import Header from '@/component/Header';
import Footer from '@/component/Footer';
import { useLocale } from '@/context/LocaleContext';
import { tField } from '@/lib/locale';
import { projectsApi, type Project } from '@/lib/api';
import { ClipboardList, Search } from 'lucide-react';

import Pagination from '@/component/Pagination';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const statusColors: Record<string, string> = {
  ongoing: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  completed: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
  planned: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
};

const statuses = ['all', 'planned', 'ongoing', 'completed', 'cancelled'];

export default function ProjectsPage() {
  const { locale, t } = useLocale();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Reset page to 1 when status filter changes
    setCurrentPage(1);
  }, [statusFilter]);

  useEffect(() => {
    setLoading(true);
    projectsApi.getAll(
      currentPage,
      6,
      statusFilter === 'all' ? undefined : statusFilter
    )
      .then((res) => {
        setProjects(res.data || []);
        setTotalPages(res.totalPages || 1);
      })
      .catch(() => {
        setProjects([]);
        setTotalPages(1);
      })
      .finally(() => setLoading(false));
  }, [currentPage, statusFilter]);

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return projects;
    const q = searchQuery.toLowerCase();
    return projects.filter((p) =>
      tField(p, 'name', locale).toLowerCase().includes(q) ||
      tField(p, 'description', locale).toLowerCase().includes(q) ||
      (p.location || '').toLowerCase().includes(q)
    );
  }, [projects, searchQuery, locale]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-sans flex flex-col justify-between">
      <div>
        <Header />
        
        <section className="bg-gradient-to-br from-green-900 via-green-800 to-green-950 text-white py-8 px-4 text-center overflow-x-hidden">
          <div className="container mx-auto">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black px-2">{t.projects.title}</h1>
            <p className="mt-2 text-emerald-100/80 max-w-xl mx-auto text-base sm:text-base px-4">{t.projects.subtitle}</p>
          </div>
        </section>

        <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-6xl">
          {/* Search Bar */}
          <div className="mb-4 sm:mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.admin.searchProjects}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-800 placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-[#1a7a3a] focus:border-transparent outline-none transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex gap-2 mb-4 sm:mb-8 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide snap-x">
            {statuses.map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 sm:px-4 py-1.5 text-sm sm:text-sm rounded-full font-medium transition whitespace-nowrap snap-start shrink-0 ${
                  statusFilter === status
                    ? 'bg-slate-800 text-white shadow-md dark:bg-slate-700'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {status === 'all' ? t.projects.allStatuses : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-slate-100 dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 animate-pulse p-4 sm:p-6 space-y-3">
                  <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full" />
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              {searchQuery ? (
                <>
                  <Search className="w-12 h-12 mx-auto mb-3 text-slate-400" />
                  <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base">No results for "{searchQuery}"</p>
                </>
              ) : (
                <>
                  <ClipboardList className="w-12 h-12 mx-auto mb-3 text-slate-400" />
                  <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base">{t.projects.noProjects}</p>
                </>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filtered.map((project) => (
                <Link
                  key={project.id}
                  href={`/projects/${project.id}`}
                  className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-all duration-200 hover:-translate-y-1 group block"
                >
                  {project.coverImage && (
                    <div className="h-32 sm:h-40 overflow-hidden">
                      <img src={project.coverImage?.startsWith('/uploads/') ? `${API_BASE}${project.coverImage}` : project.coverImage} alt={project.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                    </div>
                  )}
                  <div className="p-4 sm:p-6 space-y-2.5 sm:space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-base sm:text-lg text-slate-800 dark:text-white leading-tight line-clamp-2">{tField(project, 'name', locale)}</h3>
                      <span className={`text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-medium shrink-0 whitespace-nowrap ${statusColors[project.status] || 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'}`}>
                        {project.status}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2 sm:line-clamp-3">{tField(project, 'description', locale)}</p>

                    {/* Budget Progress Bar */}
                    {project.budget && (
                      <div className="pt-0.5 sm:pt-1">
                        <div className="flex justify-between text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-1">
                          <span>{t.projects.budget}</span>
                          <span className="font-semibold text-xs sm:text-sm">ETB {project.budget.toLocaleString()}</span>
                        </div>
                        <div className="w-full h-1.5 sm:h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all bg-slate-700 ${
                              project.status === 'completed' ? 'w-full' :
                              project.status === 'ongoing' ? 'w-3/4' :
                              project.status === 'planned' ? 'w-1/4' : 'w-0'
                            }`}
                          />
                        </div>
                      </div>
                    )}

                    <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 space-y-0.5 sm:space-y-1 pt-1.5 sm:pt-2 border-t border-slate-200 dark:border-slate-700">
                      {project.location && (
                        <p className="truncate"><span className="font-medium">{t.projects.location}:</span> {project.location}</p>
                      )}
                      {(project.startDate || project.endDate) && (
                        <p className="truncate">
                          <span className="font-medium">{t.projects.timeline}:</span>{' '}
                          {project.startDate && `${t.projects.from} ${new Date(project.startDate).toLocaleDateString()}`}
                          {project.startDate && project.endDate && ' — '}
                          {project.endDate && `${t.projects.to} ${new Date(project.endDate).toLocaleDateString()}`}
                        </p>
                      )}
                    </div>

                    <div className="pt-0.5 sm:pt-1">
                      <span className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 group-hover:gap-2 transition-all">
                        {t.projects.viewDetails}
                        <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
}
