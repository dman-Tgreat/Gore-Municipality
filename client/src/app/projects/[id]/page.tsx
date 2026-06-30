'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/component/Header';
import Footer from '@/component/Footer';
import { useLocale } from '@/context/LocaleContext';
import { tField } from '@/lib/locale';
import { projectsApi, type Project } from '@/lib/api';
import { Search, Coins } from 'lucide-react';

const statusConfig: Record<string, { label: string; color: string; bg: string; progress: string }> = {
  ongoing: { label: 'In Progress', color: 'text-slate-700 dark:text-slate-300', bg: 'bg-slate-100 dark:bg-slate-700', progress: 'bg-slate-500 w-3/5' },
  completed: { label: 'Completed', color: 'text-slate-700 dark:text-slate-300', bg: 'bg-slate-100 dark:bg-slate-700', progress: 'bg-slate-500 w-full' },
  planned: { label: 'Planned', color: 'text-slate-700 dark:text-slate-300', bg: 'bg-slate-100 dark:bg-slate-700', progress: 'bg-slate-500 w-1/4' },
  cancelled: { label: 'Cancelled', color: 'text-slate-500 dark:text-slate-400', bg: 'bg-slate-100 dark:bg-slate-700', progress: 'bg-slate-300 w-0' },
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

function Timeline({ startDate, endDate }: { startDate?: string; endDate?: string }) {
  if (!startDate && !endDate) return null;
  const start = startDate ? new Date(startDate) : null;
  const end = endDate ? new Date(endDate) : null;
  const now = new Date();
  const total = end && start ? (end.getTime() - start.getTime()) : 365 * 24 * 60 * 60 * 1000;
  const elapsed = start ? (now.getTime() - start.getTime()) : 0;
  const pct = Math.min(Math.max(Math.round((elapsed / total) * 100), 0), 100);

  return (
    <div className="space-y-3">
      <div className="flex justify-between text-xs text-slate-400 dark:text-slate-500">
        <span>{start ? start.toLocaleDateString() : 'N/A'}</span>
        <span className="font-semibold text-slate-600 dark:text-slate-300">{pct}%</span>
        <span>{end ? end.toLocaleDateString() : 'N/A'}</span>
      </div>
      <div className="relative w-full h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
        <div className="absolute h-full bg-gradient-to-r from-slate-500 to-slate-400 dark:from-slate-400 dark:to-slate-500 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>
      <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500">
        <span>From</span>
        <span>To</span>
      </div>
    </div>
  );
}

export default function ProjectDetailPage() {
  const { locale, t } = useLocale();
  const params = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const id = Number(params.id);

  useEffect(() => {
    if (!id) return;
    projectsApi.getOne(id)
      .then(setProject)
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

  if (error || !project) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Search className="w-16 h-16 mx-auto mb-4 text-slate-400" />
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Project Not Found</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6">The project you are looking for does not exist.</p>
            <Link href="/projects" className="text-slate-700 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white font-semibold inline-flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Back to Projects
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const cfg = statusConfig[project.status] || statusConfig.planned;
  const imgSrc = project.coverImage?.startsWith('/uploads/')
    ? `${API_BASE}${project.coverImage}`
    : project.coverImage;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-sans flex flex-col">
      <Header />

      {/* Hero Banner with Cover Image */}
      <section className="relative h-64 lg:h-80 overflow-hidden bg-slate-800 dark:bg-slate-950">
        {imgSrc ? (
          <img src={imgSrc} alt={project.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-slate-800 dark:bg-slate-950" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-slate-900/30" />
        <div className="absolute inset-0 flex flex-col justify-center">
          <div className="container mx-auto px-6">
            <Link href="/projects" className="inline-flex items-center gap-1 text-slate-300 hover:text-white text-sm mb-4 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              {t.projects.title}
            </Link>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-3">{tField(project, 'name', locale)}</h1>
            <div className="flex flex-wrap items-center gap-3">
              <span className={`text-xs px-3 py-1 rounded-full font-semibold ${cfg.bg} ${cfg.color}`}>
                {cfg.label}
              </span>
              {project.location && (
                <span className="text-xs text-white/70 flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  {project.location}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-6 py-10 max-w-5xl">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-slate-500 rounded-full" />
                Project Overview
              </h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{tField(project, 'description', locale)}</p>

              {/* Timeline Chart */}
              {(project.startDate || project.endDate) && (
                <div className="mt-8 p-5 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                  <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Project Timeline</h3>
                  <Timeline startDate={project.startDate} endDate={project.endDate} />
                </div>
              )}
            </div>

            {/* Budget Section with Chart */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-slate-500 rounded-full" />
                Budget Breakdown
              </h2>
              {project.budget ? (
                <div className="space-y-6">
                  {/* Main budget bar */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Total Budget</span>
                      <span className="text-2xl font-black text-slate-800 dark:text-white">ETB {project.budget.toLocaleString()}</span>
                    </div>
                    <div className="w-full h-4 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${cfg.progress} transition-all duration-700`} />
                    </div>
                    <div className="flex justify-between text-xs text-slate-400 dark:text-slate-500 mt-1">
                      <span>0</span>
                      <span>{project.status === 'completed' ? '100% Allocated' : project.status === 'ongoing' ? '60% Utilized' : project.status === 'planned' ? '25% Planned' : '0%'}</span>
                    </div>
                  </div>

                  {/* Budget categories */}
                  <div className="grid sm:grid-cols-2 gap-3">
                    {[
                      { label: 'Construction & Materials', amount: Math.round(project.budget * 0.45), color: 'bg-slate-500', pct: 45 },
                      { label: 'Labor & Personnel', amount: Math.round(project.budget * 0.25), color: 'bg-slate-400', pct: 25 },
                      { label: 'Equipment & Logistics', amount: Math.round(project.budget * 0.18), color: 'bg-slate-600', pct: 18 },
                      { label: 'Contingency & Admin', amount: Math.round(project.budget * 0.12), color: 'bg-slate-500', pct: 12 },
                    ].map((cat, i) => (
                      <div key={i} className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                          <span>{cat.label}</span>
                          <span className="font-semibold text-slate-600 dark:text-slate-300">{cat.pct}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-full mb-1">
                          <div className={`h-full rounded-full ${cat.color}`} style={{ width: `${cat.pct}%` }} />
                        </div>
                        <p className="text-xs text-slate-400 dark:text-slate-500">ETB {cat.amount.toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-slate-400 dark:text-slate-500">
                  <Coins className="w-10 h-10 mx-auto mb-2 text-slate-400" />
                  <p className="text-sm">Budget information not available</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Project Details */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-slate-500 rounded-full" />
                Project Details
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Status</span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color}`}>
                    {cfg.label}
                  </span>
                </div>
                {project.budget && (
                  <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
                    <span className="text-xs text-slate-500 dark:text-slate-400">{t.projects.budget}</span>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">ETB {project.budget.toLocaleString()}</span>
                  </div>
                )}
                {project.location && (
                  <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
                    <span className="text-xs text-slate-500 dark:text-slate-400">{t.projects.location}</span>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{project.location}</span>
                  </div>
                )}
                {project.fundingSource && (
                  <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
                    <span className="text-xs text-slate-500 dark:text-slate-400">Funding Source</span>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{project.fundingSource}</span>
                  </div>
                )}
                {project.contractor && (
                  <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
                    <span className="text-xs text-slate-500 dark:text-slate-400">Contractor</span>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{project.contractor}</span>
                  </div>
                )}
                {project.category && (
                  <div className="flex justify-between items-center py-2">
                    <span className="text-xs text-slate-500 dark:text-slate-400">Category</span>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{project.category}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Progress Overview */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-slate-500 rounded-full" />
                Progress Overview
              </h3>
              <div className="space-y-4">
                {[
                  { label: 'Planning & Design', pct: project.status === 'completed' ? 100 : project.status === 'ongoing' ? 100 : project.status === 'planned' ? 60 : 0, color: 'bg-slate-500' },
                  { label: 'Procurement', pct: project.status === 'completed' ? 100 : project.status === 'ongoing' ? 85 : project.status === 'planned' ? 20 : 0, color: 'bg-slate-400' },
                  { label: 'Implementation', pct: project.status === 'completed' ? 100 : project.status === 'ongoing' ? 55 : 0, color: 'bg-slate-600' },
                  { label: 'Completion', pct: project.status === 'completed' ? 100 : project.status === 'ongoing' ? 10 : 0, color: 'bg-slate-500' },
                ].map((phase, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-600 dark:text-slate-400">{phase.label}</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{phase.pct}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full">
                      <div className={`h-full rounded-full ${phase.color} transition-all duration-500`} style={{ width: `${phase.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Created By */}
            {project.createdBy && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                  <span className="w-1 h-5 bg-slate-500 rounded-full" />
                  Managed By
                </h3>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold text-sm">
                    {project.createdBy.fullName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{project.createdBy.fullName}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">{project.createdBy.email}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
