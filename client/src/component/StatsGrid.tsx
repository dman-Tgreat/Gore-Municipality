'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useLocale } from '@/context/LocaleContext';
import { newsApi, departmentsApi, projectsApi, settingsApi, type SiteSetting } from '@/lib/api';
import { Newspaper, Landmark, Construction, BarChart3 } from 'lucide-react';

interface StatsItem {
  label: string;
  value: string;
  icon: React.ReactNode;
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
      icon: <Newspaper className="w-5 h-5" />,
      detail: getSetting('stats_detail_1', t.stats.stats[0].detail),
    },
    {
      label: getSetting('stats_label_2', t.stats.stats[1].label),
      value: loading ? '—' : `${deptCount}`,
      icon: <Landmark className="w-5 h-5" />,
      detail: getSetting('stats_detail_2', t.stats.stats[1].detail),
    },
    {
      label: getSetting('stats_label_3', t.stats.stats[2].label),
      value: loading ? '—' : `${ongoingCount}`,
      icon: <Construction className="w-5 h-5" />,
      detail: getSetting('stats_detail_3', t.stats.stats[2].detail),
    },
    {
      label: getSetting('stats_label_4', t.stats.stats[3].label),
      value: loading ? '—' : `${projectCount}`,
      icon: <BarChart3 className="w-5 h-5" />,
      detail: getSetting('stats_detail_4', t.stats.stats[3].detail),
    },
  ];

  return (
    <section className="relative py-20 bg-slate-50 dark:bg-slate-900 overflow-hidden">
      {/* Subtle top border */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-0.5 bg-slate-300 dark:bg-slate-700 rounded-full" />

      <div className="relative container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="section-badge mb-4">
            <span className="w-1.5 h-1.5 bg-slate-500 dark:bg-white/60 rounded-full" />
            {t.stats.title}
          </div>
          <h2 className="section-title mb-3">
            {t.stats.subtitle}
          </h2>
          <div className="w-12 h-0.5 bg-slate-300 dark:bg-slate-600 rounded-full mx-auto" />
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="group bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 lg:p-8 text-center shadow-sm
                         hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
            >
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300
                            text-2xl mb-5 group-hover:scale-110 transition-transform duration-300">
                <span>{stat.icon}</span>
              </div>

              {/* Value */}
              <p className="text-3xl lg:text-4xl font-black text-slate-800 dark:text-white mb-2 tracking-tight">
                <AnimatedCounter value={stat.value} />
              </p>

              {/* Label */}
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                {stat.label}
              </p>

              {/* Detail */}
              <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed font-light">
                {stat.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
