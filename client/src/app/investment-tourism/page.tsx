'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/component/Header';
import QuickLinks from '@/component/QuickLinks';
import Footer from '@/component/Footer';
import { useLocale } from '@/context/LocaleContext';

const investmentIcon = (
  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const tourismIcon = (
  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5M3.75 3.75v16.5M21 3.75v16.5" />
  </svg>
);

const sections = [
  {
    key: 'opportunities',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
    gradient: 'from-blue-600 to-blue-400',
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    border: 'border-blue-100',
    href: '/investment-tourism/opportunities',
  },
  {
    key: 'incentives',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
      </svg>
    ),
    gradient: 'from-amber-500 to-yellow-500',
    bg: 'bg-amber-50',
    text: 'text-amber-600',
    border: 'border-amber-100',
    href: '/investment-tourism/incentives',
  },
  {
    key: 'attractions',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5M3.75 3.75v16.5M21 3.75v16.5" />
      </svg>
    ),
    gradient: 'from-emerald-600 to-emerald-400',
    bg: 'bg-emerald-50',
    text: 'text-emerald-600',
    border: 'border-emerald-100',
    href: '/investment-tourism/attractions',
  },
  {
    key: 'accommodation',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819" />
      </svg>
    ),
    gradient: 'from-purple-600 to-purple-400',
    bg: 'bg-purple-50',
    text: 'text-purple-600',
    border: 'border-purple-100',
    href: '/investment-tourism/accommodation',
  },
  {
    key: 'culture',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" />
      </svg>
    ),
    gradient: 'from-rose-600 to-rose-400',
    bg: 'bg-rose-50',
    text: 'text-rose-600',
    border: 'border-rose-100',
    href: '/investment-tourism',
  },
  {
    key: 'localProducts',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
      </svg>
    ),
    gradient: 'from-orange-600 to-orange-400',
    bg: 'bg-orange-50',
    text: 'text-orange-600',
    border: 'border-orange-100',
    href: '/investment-tourism',
  },
];

export default function InvestmentTourismPage() {
  const { t } = useLocale();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <div>
        <Header />

        {/* Banner */}
        <section className="relative bg-gradient-to-br from-red-800 via-red-700 to-amber-800 text-white py-16 text-center overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `radial-gradient(circle at 30% 20%, rgba(255,255,255,0.2) 0%, transparent 50%),
                              radial-gradient(circle at 70% 80%, rgba(255,255,255,0.15) 0%, transparent 50%)`,
          }} />
          <div className="relative container mx-auto px-6">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white/80 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
              <span className="w-1.5 h-1.5 bg-amber-300 rounded-full animate-pulse" />
              {t.investmentTourism.title}
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-4">
              {t.investmentTourism.title}
            </h1>
            <p className="text-amber-100 max-w-2xl mx-auto text-sm md:text-base">
              {t.investmentTourism.subtitle}
            </p>
          </div>
        </section>

        {/* Investment Section */}
        <section className="py-16 bg-white border-b border-gray-100">
          <div className="container mx-auto px-6">
            <div className="max-w-5xl mx-auto">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-white shadow-lg">
                  {investmentIcon}
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-black text-gray-900">{t.investmentTourism.investmentTitle}</h2>
                  <p className="text-gray-500 text-sm mt-1">{t.investmentTourism.investmentDesc}</p>
                </div>
              </div>

              {/* Sub-section cards */}
              <div className="grid md:grid-cols-2 gap-5">
                {sections.slice(0, 3).map((section) => (
                  <Link
                    key={section.key}
                    href={section.href}
                    className={`group flex items-start gap-4 p-5 rounded-xl border ${section.border} ${section.bg} hover:-translate-y-0.5 transition-all duration-200 hover:shadow-md`}
                  >
                    <div className={`shrink-0 w-11 h-11 rounded-xl ${section.bg} ${section.text} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      {section.icon}
                    </div>
                    <div>
                      <h3 className={`font-bold text-sm ${section.text} mb-1`}>
                        {t.investmentTourism[section.key as keyof typeof t.investmentTourism] as unknown as string}
                      </h3>
                      <p className="text-gray-600 text-xs leading-relaxed">
                        {t.investmentTourism[`${section.key}Desc` as keyof typeof t.investmentTourism] as unknown as string}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Tourism Section */}
        <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-6">
            <div className="max-w-5xl mx-auto">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-400 flex items-center justify-center text-white shadow-lg">
                  {tourismIcon}
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-black text-gray-900">{t.investmentTourism.tourismTitle}</h2>
                  <p className="text-gray-500 text-sm mt-1">{t.investmentTourism.tourismDesc}</p>
                </div>
              </div>

              {/* Sub-section cards */}
              <div className="grid md:grid-cols-2 gap-5">
                {sections.slice(3).map((section) => (
                  <Link
                    key={section.key}
                    href={section.href}
                    className={`group flex items-start gap-4 p-5 rounded-xl border ${section.border} ${section.bg} hover:-translate-y-0.5 transition-all duration-200 hover:shadow-md`}
                  >
                    <div className={`shrink-0 w-11 h-11 rounded-xl ${section.bg} ${section.text} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      {section.icon}
                    </div>
                    <div>
                      <h3 className={`font-bold text-sm ${section.text} mb-1`}>
                        {t.investmentTourism[section.key as keyof typeof t.investmentTourism] as unknown as string}
                      </h3>
                      <p className="text-gray-600 text-xs leading-relaxed">
                        {t.investmentTourism[`${section.key}Desc` as keyof typeof t.investmentTourism] as unknown as string}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gray-900 text-white">
          <div className="container mx-auto px-6 text-center">
            <h3 className="text-2xl md:text-3xl font-black mb-4">{t.investmentTourism.contactInvest}</h3>
            <p className="text-gray-400 max-w-xl mx-auto text-sm mb-8">
              {t.contact.description}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-8 py-3.5 rounded-xl font-semibold transition-all duration-200 hover:-translate-y-0.5 shadow-xl shadow-red-600/20"
              >
                {t.contact.sendMessage}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-300 px-8 py-3.5 rounded-xl font-semibold transition-all duration-200 border border-gray-700"
              >
                {t.footer.home}
              </Link>
            </div>
          </div>
        </section>
      </div>

      <QuickLinks page="investment" />

      <Footer />
    </div>
  );
}
