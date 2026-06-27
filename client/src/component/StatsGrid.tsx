'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useLocale } from '@/context/LocaleContext';
import { newsApi, departmentsApi, projectsApi, announcementsApi } from '@/lib/api';

interface StatsData {
  label: string;
  value: string;
  detail: string;
}

const defaultStats = (t: any) => t.stats.stats as StatsData[];

export default function StatsGrid() {
  const { t } = useLocale();
  const [stats, setStats] = useState<StatsData[]>(defaultStats(t));
  const [loading, setLoading] = useState(true);

  const fetched = useRef(false);

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;

    async function fetchStats() {
      try {
        const [news, departments, projects, announcements] = await Promise.all([
          newsApi.getAll(),
          departmentsApi.getAll(),
          projectsApi.getAll(),
          announcementsApi.getAll(),
        ]);

        setStats([
          {
            label: t.stats.stats[0].label,
            value: `${news.length + announcements.length}`,
            detail: 'News & announcements published',
          },
          {
            label: t.stats.stats[1].label,
            value: `${departments.length}`,
            detail: 'Municipal departments & offices',
          },
          {
            label: t.stats.stats[2].label,
            value: `${projects.length}`,
            detail: 'Active & completed projects',
          },
          {
            label: t.stats.stats[3].label,
            value: 'Agriculture',
            detail: 'Premium Tea, Coffee, & Apiculture',
          },
        ]);
      } catch {
        setStats(defaultStats(t));
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, [t]);

  // Update labels when locale changes without re-fetching
  useEffect(() => {
    if (!loading) {
      setStats((prev) =>
        prev.map((s, i) => ({ ...s, label: defaultStats(t)[i]?.label || s.label }))
      );
    }
  }, [t, loading]);

  return (
    <section className="bg-white border-y border-gray-100 py-12 my-6">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-xs uppercase tracking-widest font-bold text-red-600 mb-2">{t.stats.title}</h2>
          <p className="text-2xl font-black text-gray-900">{t.stats.subtitle}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading
            ? defaultStats(t).map((stat, idx) => (
                <div key={idx} className="p-6 bg-gray-50/50 rounded-xl border border-gray-100 text-center animate-pulse">
                  <div className="h-3 bg-gray-200 rounded w-24 mx-auto mb-3" />
                  <div className="h-6 bg-gray-200 rounded w-20 mx-auto my-3" />
                  <div className="h-3 bg-gray-200 rounded w-32 mx-auto" />
                </div>
              ))
            : stats.map((stat, idx) => (
                <div 
                  key={idx} 
                  className="p-6 bg-gray-50/50 rounded-xl border border-gray-100 text-center hover:border-red-100 hover:bg-white transition duration-300"
                >
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-black text-red-600 tracking-tight my-2">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-600 leading-relaxed font-light">
                    {stat.detail}
                  </p>
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}
