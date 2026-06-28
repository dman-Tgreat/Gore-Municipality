'use client';

import React from 'react';
import Link from 'next/link';
import { useLocale } from '@/context/LocaleContext';

const serviceIcons = {
  news: (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
    </svg>
  ),
  services: (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.646 5.647a1.5 1.5 0 01-2.122 0l-.004-.004a1.5 1.5 0 010-2.122l5.647-5.646m3.397 1.06l5.647-5.646a1.5 1.5 0 000-2.122l-.004-.004a1.5 1.5 0 00-2.122 0l-5.647 5.647m-5.646 5.646l-.004-.004a1.5 1.5 0 010-2.122L8.28 12.78M15 3l3 3M9 21l-3-3" />
    </svg>
  ),
  about: (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm1.5-9h3v3h-3v-3z" />
    </svg>
  ),
};

const serviceGradients = [
  { from: 'from-red-600', to: 'to-red-400', bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-100', hover: 'hover:border-red-200' },
  { from: 'from-emerald-600', to: 'to-emerald-400', bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100', hover: 'hover:border-emerald-200' },
  { from: 'from-amber-600', to: 'to-amber-400', bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100', hover: 'hover:border-amber-200' },
];

const serviceLinks = ['/news', '/service', '/news'];

export default function Services() {
  const { t } = useLocale();

  const services = [
    {
      title: t.services.latestNews,
      desc: t.services.latestNewsDesc,
      icon: serviceIcons.news,
      link: serviceLinks[0],
      cta: t.services.viewAll,
    },
    {
      title: t.services.municipalServices,
      desc: t.services.municipalServicesDesc,
      icon: serviceIcons.services,
      link: serviceLinks[1],
      cta: t.services.viewAll,
    },
    {
      title: t.services.aboutGore,
      desc: t.services.aboutGoreDesc,
      icon: serviceIcons.about,
      link: serviceLinks[2],
      cta: t.services.readHistory,
    },
  ];

  return (
    <section id="services" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 bg-red-50 text-red-600 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
            <span className="w-1.5 h-1.5 bg-red-600 rounded-full" />
            {t.header.services}
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3 tracking-tight">
            {t.services.latestNews}
          </h2>
          <p className="text-gray-500 text-sm max-w-xl mx-auto">
            {t.services.latestNewsDesc}
          </p>
        </div>

        {/* Service Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {services.map((service, idx) => {
            const grad = serviceGradients[idx];
            return (
              <div
                key={idx}
                className={`group relative bg-white rounded-2xl border ${grad.border} ${grad.hover} p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}
              >
                {/* Top accent bar */}
                <div className={`absolute top-0 left-6 right-6 h-1 bg-gradient-to-r ${grad.from} ${grad.to} rounded-full opacity-60 group-hover:opacity-100 transition-opacity`} />

                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl ${grad.bg} ${grad.text} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {service.icon}
                </div>

                {/* Content */}
                <h3 className={`text-lg font-bold ${grad.text} mb-3`}>
                  {service.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">
                  {service.desc}
                </p>

                {/* CTA Link */}
                <Link
                  href={service.link}
                  className={`inline-flex items-center gap-2 text-sm font-semibold ${grad.text} hover:gap-3 transition-all`}
                >
                  {service.cta}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              </div>
            );
          })}
        </div>

        {/* Bottom decorative element */}
        <div className="flex items-center justify-center gap-3 mt-12 text-gray-300">
          <div className="h-px w-12 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
          <span className="text-[10px] uppercase tracking-[0.2em] font-semibold">የጎሬ ወረዳ · Gore Woreda · Woreda Gore</span>
          <div className="h-px w-12 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
        </div>
      </div>
    </section>
  );
}
