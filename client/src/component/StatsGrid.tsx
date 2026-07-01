'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useLocale } from '@/context/LocaleContext';
import { settingsApi, type SiteSetting } from '@/lib/api';
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
  const [settings, setSettings] = useState<SiteSetting[]>([]);
  const [loading, setLoading] = useState(true);

  const getSetting = (key: string, fallback: string): string => {
    const found = settings.find((s) => s.settingKey === key);
    return found ? found.settingValue : fallback;
  };

  useEffect(() => {
    settingsApi.getAll()
      .then((sets) => setSettings(sets as SiteSetting[]))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const stats: StatsItem[] = [
    {
      label: getSetting('stats_label_1', t.stats.stats[0].label),
      value: getSetting('stats_value_1', t.stats.stats[0].value),
      icon: <Newspaper className="w-5 h-5" />,
      detail: getSetting('stats_detail_1', t.stats.stats[0].detail),
    },
    {
      label: getSetting('stats_label_2', t.stats.stats[1].label),
      value: getSetting('stats_value_2', t.stats.stats[1].value),
      icon: <Landmark className="w-5 h-5" />,
      detail: getSetting('stats_detail_2', t.stats.stats[1].detail),
    },
    {
      label: getSetting('stats_label_3', t.stats.stats[2].label),
      value: getSetting('stats_value_3', t.stats.stats[2].value),
      icon: <Construction className="w-5 h-5" />,
      detail: getSetting('stats_detail_3', t.stats.stats[2].detail),
    },
    {
      label: getSetting('stats_label_4', t.stats.stats[3].label),
      value: getSetting('stats_value_4', t.stats.stats[3].value),
      icon: <BarChart3 className="w-5 h-5" />,
      detail: getSetting('stats_detail_4', t.stats.stats[3].detail),
    },
  ];

  return (
    <section className="relative py-0 bg-slate-50 dark:bg-slate-900 ">
      
      <div className="container mx-auto px-4 sm:px-6 -mt-20 sm:-mt-24 relative z-20 max-w-6xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="group bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 sm:p-4 lg:p-5 flex items-start gap-2.5 sm:gap-3.5 shadow-sm 
                         hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
            >
              {/* Icon */}
              <div className="shrink-0 inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-primary/10 dark:bg-primary-dark/50 text-primary dark:text-gold-light
                            text-lg sm:text-2xl group-hover:scale-110 transition-transform duration-300">
                <span className="w-4 h-4 sm:w-5 sm:h-5">{stat.icon}</span>
              </div>
              <div className="flex flex-col text-left min-w-0">
                {/* Value */}
                <p className="text-lg sm:text-xl lg:text-xl font-bold text-slate-600 dark:text-white mb-1 sm:mb-2 tracking-tight">
                  <AnimatedCounter value={loading ? '—' : stat.value} />
                </p>

                {/* Label */}
                <p className="text-[11px] sm:text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1 sm:mb-1.5">
                  {stat.label}
                </p>

                {/* Detail */}
                <p className="text-xs sm:text-base text-slate-700 dark:text-slate-400 leading-relaxed font-light">
                  {stat.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
