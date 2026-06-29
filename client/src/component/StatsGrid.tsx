'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useLocale } from '@/context/LocaleContext';
import { newsApi, departmentsApi, projectsApi, settingsApi, type SiteSetting } from '@/lib/api';

interface StatsItem {
  label: string;
  value: string;
  icon: string;
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
  const [settings, setSettings] = useState<SiteSetting[]>([]);
  const [loading, setLoading] = useState(true);

  const getSetting = (key: string, fallback: string): string => {
    const found = settings.find((s) => s.settingKey === key);
    return found ? found.settingValue : fallback;
  };

  useEffect(() => {
    Promise.all([
      newsApi.getAll().catch(() => []),
      departmentsApi.getAll().catch(() => []),
      projectsApi.getAll().catch(() => []),
      settingsApi.getAll().catch(() => [] as SiteSetting[]),
    ]).then(([news, depts, projects, sets]) => {
      setNewsCount(news.filter((n: any) => n.published).length);
      setDeptCount(depts.length);
      setProjectCount(projects.length);
      setOngoingCount(projects.filter((p: any) => p.status === 'ongoing').length);
      setSettings(sets as SiteSetting[]);
    }).finally(() => setLoading(false));
  }, []);

  const stats: StatsItem[] = [
    {
      label: getSetting('stats_label_1', t.stats.stats[0].label),
      value: loading ? '—' : `${newsCount}`,
      icon: '📰',
      detail: getSetting('stats_detail_1', t.stats.stats[0].detail),
    },
    {
      label: getSetting('stats_label_2', t.stats.stats[1].label),
      value: loading ? '—' : `${deptCount}`,
      icon: '🏛️',
      detail: getSetting('stats_detail_2', t.stats.stats[1].detail),
    },
    {
      label: getSetting('stats_label_3', t.stats.stats[2].label),
      value: loading ? '—' : `${ongoingCount}`,
      icon: '🚧',
      detail: getSetting('stats_detail_3', t.stats.stats[2].detail),
    },
    {
      label: getSetting('stats_label_4', t.stats.stats[3].label),
      value: loading ? '—' : `${projectCount}`,
      icon: '📊',
      detail: getSetting('stats_detail_4', t.stats.stats[3].detail),
    },
  ];

  return (
    <section className="relative py-20 overflow-hidden bg-slate-900 dark:bg-slate-950">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.05) 0%, transparent 50%),
                          radial-gradient(circle at 75% 75%, rgba(255,255,255,0.05) 0%, transparent 50%)`,
      }} />

      <div className="relative container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white/80 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
            <span className="w-1.5 h-1.5 bg-white/60 rounded-full animate-pulse" />
            {t.stats.title}
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-3 tracking-tight">
            {t.stats.subtitle}
          </h2>
          <div className="w-16 h-1 bg-white/20 rounded-full mx-auto" />
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="group relative bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 lg:p-8 text-center
                         hover:bg-white/10 hover:border-white/20 transition-all duration-500 hover:-translate-y-1"
            >
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10
                            text-2xl mb-5 shadow-lg group-hover:scale-110 transition-transform duration-500">
                <span className="text-white brightness-125">{stat.icon}</span>
              </div>

              {/* Value */}
              <p className="text-3xl lg:text-4xl font-black text-white mb-2 tracking-tight">
                <AnimatedCounter value={stat.value} />
              </p>

              {/* Label */}
              <p className="text-sm font-semibold text-white/80 uppercase tracking-wider mb-2">
                {stat.label}
              </p>

              {/* Detail */}
              <p className="text-xs text-white/50 leading-relaxed font-light">
                {stat.detail}
              </p>

              {/* Decorative bar */}
              <div className="mt-4 w-12 h-0.5 bg-white/20 rounded-full mx-auto opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
