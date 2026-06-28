'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useLocale } from '@/context/LocaleContext';
import { newsApi, departmentsApi, projectsApi } from '@/lib/api';

interface StatsItem {
  label: string;
  value: string;
  icon: string;
  gradient: string;
  detail: string;
}

function AnimatedCounter({ value, duration = 1500 }: { value: string; duration?: number }) {
  const [displayed, setDisplayed] = useState(value);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const numericMatch = value.match(/[\d,]+/);
    if (!numericMatch || hasAnimated.current) {
      setDisplayed(value);
      return;
    }

    const target = parseInt(numericMatch[0].replace(/,/g, ''), 10);
    const prefix = value.slice(0, value.indexOf(numericMatch[0]));
    const suffix = value.slice(value.indexOf(numericMatch[0]) + numericMatch[0].length);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const increment = target / (duration / 16);
          let current = 0;

          const animate = () => {
            current += increment;
            if (current < target) {
              setDisplayed(`${prefix}${Math.floor(current).toLocaleString()}${suffix}`);
              requestAnimationFrame(animate);
            } else {
              setDisplayed(value);
            }
          };
          requestAnimationFrame(animate);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, duration]);

  return <span ref={ref}>{displayed}</span>;
}

export default function StatsGrid() {
  const { t } = useLocale();
  const [newsCount, setNewsCount] = useState(0);
  const [deptCount, setDeptCount] = useState(0);
  const [projectCount, setProjectCount] = useState(0);
  const [ongoingCount, setOngoingCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      newsApi.getAll().catch(() => []),
      departmentsApi.getAll().catch(() => []),
      projectsApi.getAll().catch(() => []),
    ]).then(([news, depts, projects]) => {
      setNewsCount(news.filter((n: any) => n.published).length);
      setDeptCount(depts.length);
      setProjectCount(projects.length);
      setOngoingCount(projects.filter((p: any) => p.status === 'ongoing').length);
    }).finally(() => setLoading(false));
  }, []);

  const stats: StatsItem[] = [
    {
      label: t.stats.stats[0].label,
      value: loading ? '—' : `${newsCount}`,
      icon: '📰',
      gradient: 'from-blue-600 to-blue-400',
      detail: 'Published news articles & announcements',
    },
    {
      label: t.stats.stats[1].label,
      value: loading ? '—' : `${deptCount}`,
      icon: '🏛️',
      gradient: 'from-emerald-600 to-emerald-400',
      detail: 'Municipal departments & offices',
    },
    {
      label: 'Active Projects',
      value: loading ? '—' : `${ongoingCount}`,
      icon: '🚧',
      gradient: 'from-amber-600 to-amber-400',
      detail: 'Ongoing development initiatives',
    },
    {
      label: t.stats.stats[3].label,
      value: loading ? '—' : `${projectCount}`,
      icon: '📊',
      gradient: 'from-green-600 to-green-400',
      detail: 'Total projects completed & planned',
    },
  ];

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gray-900">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%),
                            radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 0%, transparent 50%)`,
        }} />
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(45deg, rgba(255,255,255,0.03) 25%, transparent 25%,
                            transparent 50%, rgba(255,255,255,0.03) 50%, rgba(255,255,255,0.03) 75%, transparent 75%, transparent)`,
          backgroundSize: '60px 60px',
        }} />
      </div>

      <div className="relative container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white/80 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            {t.stats.title}
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-3 tracking-tight">
            {t.stats.subtitle}
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-green-400 to-emerald-300 rounded-full mx-auto" />
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="group relative bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 lg:p-8 text-center
                         hover:bg-white/10 hover:border-white/20 transition-all duration-500 hover:-translate-y-1"
            >
              {/* Glow effect on hover */}
              <div className={`absolute inset-0 bg-gradient-to-b ${stat.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-500`} />

              {/* Icon */}
              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.gradient}
                            text-2xl mb-5 shadow-lg shadow-${stat.gradient.split(' ')[0].replace('from-', '')}/20
                            group-hover:scale-110 transition-transform duration-500`}>
                <span className="filter brightness-125">{stat.icon}</span>
              </div>

              {/* Value */}
              <p className={`text-3xl lg:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r ${stat.gradient} mb-2 tracking-tight`}>
                <AnimatedCounter value={stat.value} />
              </p>

              {/* Label */}
              <p className="text-sm font-semibold text-white/90 uppercase tracking-wider mb-2">
                {stat.label}
              </p>

              {/* Detail */}
              <p className="text-xs text-white/50 leading-relaxed font-light">
                {stat.detail}
              </p>

              {/* Decorative bar */}
              <div className={`mt-4 w-12 h-0.5 bg-gradient-to-r ${stat.gradient} rounded-full mx-auto opacity-50 group-hover:opacity-100 transition-opacity duration-300`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
