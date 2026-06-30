'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/component/Header';
import Footer from '@/component/Footer';
import { useLocale } from '@/context/LocaleContext';
import { tField } from '@/lib/locale';
import { projectsApi, type Project } from '@/lib/api';
import { ClipboardList } from 'lucide-react';

const statusColors: Record<string, string> = {
  ongoing: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200',
  completed: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200',
  planned: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200',
  cancelled: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200',
};

export default function ProjectsPage() {
  const { locale, t } = useLocale();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    projectsApi.getAll()
      .then(setProjects)
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = statusFilter === 'all'
    ? projects
    : projects.filter((p) => p.status === statusFilter);

  const statuses = ['all', ...new Set(projects.map((p) => p.status))];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-sans flex flex-col justify-between">
      <div>
        <Header />
        
        <section className="bg-slate-800 text-white py-14 px-4 text-center">
          <div className="container mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white/80 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
              <span className="w-1.5 h-1.5 bg-white/60 rounded-full animate-pulse" />
              {t.projects.title}
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black px-2">{t.projects.title}</h1>
            <p className="mt-2 text-slate-300 max-w-xl mx-auto text-xs sm:text-sm px-4">{t.projects.subtitle}</p>
          </div>
        </section>

        <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-6xl">
          {/* Status Filter */}
          <div className="flex gap-2 mb-6 sm:mb-8 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide snap-x">
            {statuses.map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 sm:px-4 py-1.5 text-xs sm:text-sm rounded-full font-medium transition whitespace-nowrap snap-start shrink-0 ${
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
                <div key={i} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 animate-pulse p-4 sm:p-6 space-y-3">
                  <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full" />
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 sm:py-16">
              <ClipboardList className="w-12 h-12 mx-auto mb-3 text-slate-400" />
              <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base">{t.projects.noProjects}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filtered.map((project) => (
                <Link
                  key={project.id}
                  href={`/projects/${project.id}`}
                  className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-all duration-200 hover:-translate-y-1 group block"
                >
                  {project.coverImage && (
                    <div className="h-32 sm:h-40 overflow-hidden">
                      <img src={project.coverImage} alt={project.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                    </div>
                  )}
                  <div className="p-4 sm:p-6 space-y-2.5 sm:space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-sm sm:text-base text-slate-800 dark:text-white leading-tight line-clamp-2">{tField(project, 'name', locale)}</h3>
                      <span className={`text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full font-medium shrink-0 whitespace-nowrap ${statusColors[project.status] || 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'}`}>
                        {project.status}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2 sm:line-clamp-3">{tField(project, 'description', locale)}</p>

                    {/* Budget Progress Bar */}
                    {project.budget && (
                      <div className="pt-0.5 sm:pt-1">
                        <div className="flex justify-between text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 mb-1">
                          <span>{t.projects.budget}</span>
                          <span className="font-semibold text-[10px] sm:text-xs">ETB {project.budget.toLocaleString()}</span>
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

                    <div className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 space-y-0.5 sm:space-y-1 pt-1.5 sm:pt-2 border-t border-slate-200 dark:border-slate-700">
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
                      <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:gap-2 transition-all">
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
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
}
