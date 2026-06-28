'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/component/Header';
import Footer from '@/component/Footer';
import { useLocale } from '@/context/LocaleContext';
import { investmentsApi, type Investment } from '@/lib/api';

const categoryConfig: Record<string, { label: string; icon: string; gradient: string; accent: string; bar: string; avatarBg: string }> = {
  opportunity: { label: 'Investment Opportunity', icon: '💼', gradient: 'from-blue-600 to-blue-400', accent: 'bg-blue-100 text-blue-700', bar: 'bg-blue-600', avatarBg: 'bg-blue-600' },
  incentive: { label: 'Incentive & Policy', icon: '⭐', gradient: 'from-amber-500 to-yellow-500', accent: 'bg-amber-100 text-amber-700', bar: 'bg-amber-500', avatarBg: 'bg-amber-600' },
  attraction: { label: 'Tourist Attraction', icon: '🌿', gradient: 'from-emerald-600 to-emerald-400', accent: 'bg-emerald-100 text-emerald-700', bar: 'bg-emerald-600', avatarBg: 'bg-emerald-600' },
  accommodation: { label: 'Hotel & Accommodation', icon: '🏨', gradient: 'from-purple-600 to-purple-400', accent: 'bg-purple-100 text-purple-700', bar: 'bg-purple-600', avatarBg: 'bg-purple-600' },
  culture: { label: 'Cultural Heritage', icon: '🎭', gradient: 'from-rose-600 to-rose-400', accent: 'bg-rose-100 text-rose-700', bar: 'bg-rose-600', avatarBg: 'bg-rose-600' },
  'local-product': { label: 'Local Product', icon: '🏺', gradient: 'from-orange-600 to-orange-400', accent: 'bg-orange-100 text-orange-700', bar: 'bg-orange-600', avatarBg: 'bg-orange-600' },
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function InvestmentDetailPage() {
  const { t } = useLocale();
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
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-pulse space-y-4 text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto" />
            <div className="h-6 bg-gray-200 rounded w-48 mx-auto" />
            <div className="h-4 bg-gray-200 rounded w-64 mx-auto" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !investment) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-5xl mb-4">🔍</p>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Not Found</h2>
            <p className="text-gray-500 mb-6">The item you are looking for does not exist.</p>
            <Link href="/investment-tourism" className="text-red-600 hover:text-red-700 font-semibold inline-flex items-center gap-1">
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
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col">
      <Header />

      {/* Hero Banner */}
      <section className={`relative h-64 lg:h-72 overflow-hidden bg-gradient-to-br ${cfg.gradient}`}>
        {imgSrc ? (
          <img src={imgSrc} alt={investment.title} className="w-full h-full object-cover" />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${cfg.gradient}`} />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-gray-900/50 to-transparent" />
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
                <span className={`text-xs px-3 py-1 rounded-full font-semibold ${cfg.accent} inline-block mb-2`}>
                  {cfg.label}
                </span>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white">{investment.title}</h1>
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
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className={`w-1.5 h-6 rounded-full ${cfg.bar}`} />
                Overview
              </h2>
              <p className="text-gray-600 leading-relaxed text-base">{investment.description}</p>
            </div>

            {/* Full Content */}
            {investment.content && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className={`w-1.5 h-6 rounded-full ${cfg.bar}`} />
                  Details
                </h2>
                <div className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {investment.content}
                </div>
              </div>
            )}

            {/* Highlights Section — Visual stats cards based on category */}
            <div className="grid sm:grid-cols-3 gap-4">
              {investment.location && (
                <div className="bg-white rounded-xl border border-gray-100 p-5 text-center hover:shadow-md transition">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-400 text-white text-lg mb-3">
                    📍
                  </div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Location</p>
                  <p className="text-sm font-semibold text-gray-800">{investment.location}</p>
                </div>
              )}
              <div className="bg-white rounded-xl border border-gray-100 p-5 text-center hover:shadow-md transition">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-400 text-white text-lg mb-3">
                  📅
                </div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Posted</p>
                <p className="text-sm font-semibold text-gray-800">{new Date(investment.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 p-5 text-center hover:shadow-md transition">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-400 text-white text-lg mb-3">
                  {cfg.icon}
                </div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Category</p>
                <p className="text-sm font-semibold text-gray-800">{cfg.label}</p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className={`w-1 h-5 rounded-full ${cfg.bar}`} />
                Contact Information
              </h3>
              <div className="space-y-4">
                {investment.contactPhone && (
                  <div className="flex items-start gap-3">
                    <span className="text-lg shrink-0">📞</span>
                    <div>
                      <p className="text-xs text-gray-400">Phone</p>
                      <p className="text-sm font-medium text-gray-800">{investment.contactPhone}</p>
                    </div>
                  </div>
                )}
                {investment.contactEmail && (
                  <div className="flex items-start gap-3">
                    <span className="text-lg shrink-0">✉️</span>
                    <div>
                      <p className="text-xs text-gray-400">Email</p>
                      <p className="text-sm font-medium text-gray-800">{investment.contactEmail}</p>
                    </div>
                  </div>
                )}
                {investment.location && (
                  <div className="flex items-start gap-3">
                    <span className="text-lg shrink-0">📍</span>
                    <div>
                      <p className="text-xs text-gray-400">Location</p>
                      <p className="text-sm font-medium text-gray-800">{investment.location}</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100">
                <Link
                  href="/contact"
                  className="w-full inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-5 py-3 rounded-xl transition-all"
                >
                  {t.contact.sendMessage}
                </Link>
              </div>
            </div>

            {/* Created By */}
            {investment.createdBy && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className={`w-1 h-5 rounded-full ${cfg.bar}`} />
                Published By
                </h3>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${cfg.avatarBg}`}>
                    {investment.createdBy.fullName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{investment.createdBy.fullName}</p>
                    <p className="text-xs text-gray-400">{investment.createdBy.email}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className={`w-1 h-5 rounded-full ${cfg.bar}`} />
                Quick Info
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                  <span className="text-xs text-gray-500">Category</span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${cfg.accent}`}>
                    {cfg.label}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                  <span className="text-xs text-gray-500">Status</span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${investment.published ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                    {investment.published ? 'Published' : 'Draft'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-xs text-gray-500">Last Updated</span>
                  <span className="text-xs font-semibold text-gray-800">
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
