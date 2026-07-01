'use client';

import React from 'react';
import Link from 'next/link';
import { useLocale } from '@/context/LocaleContext';

type LinkSet = 'news' | 'services' | 'projects' | 'contact' | 'investment' | 'home';

const newsIcon = (
  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
  </svg>
);

const servicesIcon = (
  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.646 5.647a1.5 1.5 0 01-2.122 0l-.004-.004a1.5 1.5 0 010-2.122l5.647-5.646m3.397 1.06l5.647-5.646a1.5 1.5 0 000-2.122l-.004-.004a1.5 1.5 0 00-2.122 0l-5.647 5.647m-5.646 5.646l-.004-.004a1.5 1.5 0 010-2.122L8.28 12.78M15 3l3 3M9 21l-3-3" />
  </svg>
);

const projectsIcon = (
  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
  </svg>
);

const investmentIcon = (
  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const contactIcon = (
  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
  </svg>
);

const iconMap: Record<string, React.ReactNode> = {
  news: newsIcon,
  services: servicesIcon,
  projects: projectsIcon,
  investment: investmentIcon,
  contact: contactIcon,
};

const linkSets: Record<LinkSet, { href: string; key: string }[]> = {
  news: [
    { href: '/service', key: 'services' },
    { href: '/projects', key: 'projects' },
    { href: '/investment-tourism', key: 'investment' },
    { href: '/contact', key: 'contact' },
  ],
  services: [
    { href: '/news', key: 'news' },
    { href: '/projects', key: 'projects' },
    { href: '/investment-tourism', key: 'investment' },
    { href: '/contact', key: 'contact' },
  ],
  projects: [
    { href: '/news', key: 'news' },
    { href: '/service', key: 'services' },
    { href: '/investment-tourism', key: 'investment' },
    { href: '/contact', key: 'contact' },
  ],
  contact: [
    { href: '/news', key: 'news' },
    { href: '/service', key: 'services' },
    { href: '/projects', key: 'projects' },
    { href: '/investment-tourism', key: 'investment' },
  ],
  investment: [
    { href: '/news', key: 'news' },
    { href: '/service', key: 'services' },
    { href: '/projects', key: 'projects' },
    { href: '/contact', key: 'contact' },
  ],
  home: [
    { href: '/news', key: 'news' },
    { href: '/service', key: 'services' },
    { href: '/projects', key: 'projects' },
    { href: '/investment-tourism', key: 'investment' },
  ],
};

interface QuickLinksProps {
  page: LinkSet;
}

export default function QuickLinks({ page }: QuickLinksProps) {
  const { t } = useLocale();
  const links = linkSets[page];

  const getTitle = (key: string): string => {
    switch (key) {
      case 'news': return t.services.latestNews;
      case 'services': return t.services.municipalServices;
      case 'projects': return t.projects.title;
      case 'investment': return t.investmentTourism.title;
      case 'contact': return t.contact.title;
      default: return '';
    }
  };

  const getDesc = (key: string): string => {
    switch (key) {
      case 'news': return t.quickLinks.newsDesc;
      case 'services': return t.quickLinks.servicesDesc;
      case 'projects': return t.quickLinks.projectsDesc;
      case 'investment': return t.quickLinks.investmentDesc;
      case 'contact': return t.quickLinks.contactDesc;
      default: return '';
    }
  };

  return (
    <section className="py-5 bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="section-badge mb-4">
            <span className="w-1.5 h-1.5 bg-slate-100 dark:bg-white/60 rounded-full" />
            {t.footer.quickLinks}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-20 lg:gap-10 max-w-6xl mx-auto">
          {links.map((link) => (
            <div
              key={link.key}
              className="group bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 hover:-translate-y-0.5"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 mb-5 group-hover:scale-110 transition-transform duration-300">
                {iconMap[link.key]}
              </div>

              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-3">
                {getTitle(link.key)}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed mb-6">
                {getDesc(link.key)}
              </p>

              <Link
                href={link.href}
                className="inline-flex items-center gap-1.5 text-base font-semibold text-slate-800 dark:text-white hover:gap-2.5 transition-all group/link"
              >
                {t.services.viewAll}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
