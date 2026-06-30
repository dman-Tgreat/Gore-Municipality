'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/component/Header';
import Footer from '@/component/Footer';
import { useLocale } from '@/context/LocaleContext';
import { tField } from '@/lib/locale';
import { investmentsApi, type Investment } from '@/lib/api';
import { Briefcase, Star, Leaf, Hotel, MapPin, Phone, Mail, Calendar, Search, Package } from 'lucide-react';

const categoryConfig: Record<string, { label: string; icon: React.ReactNode }> = {
  opportunity: { label: 'Investment Opportunity', icon: <Briefcase className="w-8 h-8" /> },
  incentive: { label: 'Incentive & Policy', icon: <Star className="w-8 h-8" /> },
  attraction: { label: 'Tourist Attraction', icon: <Leaf className="w-8 h-8" /> },
  accommodation: { label: 'Hotel & Accommodation', icon: <Hotel className="w-8 h-8" /> },
  culture: { label: 'Cultural Heritage', icon: <Star className="w-8 h-8" /> },
  'local-product': { label: 'Local Product', icon: <Package className="w-8 h-8" /> },
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function InvestmentDetailPage() {
  const { locale, t } = useLocale();
  const params = useParams();
  const [investment, setInvestment] = useState<Investment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const id = Number(params.id);

  useEffect(() => {
    if (!id) return;
    investmentsApi.getOne(id)
      .then(setInvestment)
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

  if (error || !investment) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Search className="w-16 h-16 mx-auto mb-4 text-slate-400" />
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Not Found</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6">The item you are looking for does not exist.</p>
            <Link href="/investment-tourism" className="text-slate-700 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white font-semibold inline-flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              {t.investmentTourism.title}
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const cfg = categoryConfig[investment.category] || categoryConfig.opportunity;
  const imgSrc = investment.coverImage?.startsWith('/uploads/')
    ? `${API_BASE}${investment.coverImage}`
    : investment.coverImage;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-sans flex flex-col">
      <Header />

      {/* Hero Banner */}
      <section className="relative h-64 lg:h-72 overflow-hidden bg-green-900">
        {imgSrc ? (
          <img src={imgSrc} alt={investment.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-green-900 via-green-800 to-green-950" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-green-950/80 via-green-900/50 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-center">
          <div className="container mx-auto px-6">
            <Link href="/investment-tourism" className="inline-flex items-center gap-1 text-white/70 hover:text-white text-sm mb-4 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              {t.investmentTourism.title}
            </Link>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-4xl shadow-lg shrink-0">
                {cfg.icon}
              </div>
              <div>
                <span className="text-xs px-3 py-1 rounded-full font-semibold bg-white/20 text-white inline-block mb-2">
                  {cfg.label}
                </span>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white">{tField(investment, 'title', locale)}</h1>
              </div>
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
                <span className="w-1.5 h-6 rounded-full bg-slate-700" />
                Overview
              </h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-base">{tField(investment, 'description', locale)}</p>
            </div>

            {/* Full Content */}
            {investment.content && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-6 rounded-full bg-slate-700" />
                  Details
                </h2>
                <div className="text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">
                  {tField(investment, 'content', locale)}
                </div>
              </div>
            )}

            {/* Highlights Section — Visual stats cards based on category */}
            <div className="grid sm:grid-cols-3 gap-4">
              {investment.location && (
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 text-center hover:shadow-md transition">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-slate-700 text-white text-lg mb-3">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Location</p>
                  <p className="text-sm font-semibold text-slate-800 dark:text-white">{investment.location}</p>
                </div>
              )}
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 text-center hover:shadow-md transition">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-slate-700 text-white text-lg mb-3">
                  <Calendar className="w-5 h-5" />
                </div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Posted</p>
                <p className="text-sm font-semibold text-slate-800 dark:text-white">{new Date(investment.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 text-center hover:shadow-md transition">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-slate-700 text-white text-lg mb-3">
                  {cfg.icon}
                </div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Category</p>
                <p className="text-sm font-semibold text-slate-800 dark:text-white">{cfg.label}</p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-1 h-5 rounded-full bg-slate-700" />
                Contact Information
              </h3>
              <div className="space-y-4">
                {investment.contactPhone && (
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 shrink-0 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-400 dark:text-slate-500">Phone</p>
                      <p className="text-sm font-medium text-slate-800 dark:text-white">{investment.contactPhone}</p>
                    </div>
                  </div>
                )}
                {investment.contactEmail && (
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 shrink-0 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-400 dark:text-slate-500">Email</p>
                      <p className="text-sm font-medium text-slate-800 dark:text-white">{investment.contactEmail}</p>
                    </div>
                  </div>
                )}
                {investment.location && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 shrink-0 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-400 dark:text-slate-500">Location</p>
                      <p className="text-sm font-medium text-slate-800 dark:text-white">{investment.location}</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                <Link
                  href="/contact"
                  className="w-full inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold px-5 py-3 rounded-xl transition-all"
                >
                  {t.contact.sendMessage}
                </Link>
              </div>
            </div>

            {/* Created By */}
            {investment.createdBy && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-1 h-5 rounded-full bg-slate-700" />
                Published By
                </h3>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm bg-slate-700">
                    {investment.createdBy.fullName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800 dark:text-white">{investment.createdBy.fullName}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">{investment.createdBy.email}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Info */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-1 h-5 rounded-full bg-slate-700" />
                Quick Info
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Category</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
                    {cfg.label}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Status</span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${investment.published ? 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200' : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'}`}>
                    {investment.published ? 'Published' : 'Draft'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Last Updated</span>
                  <span className="text-xs font-semibold text-slate-800 dark:text-white">
                    {new Date(investment.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
