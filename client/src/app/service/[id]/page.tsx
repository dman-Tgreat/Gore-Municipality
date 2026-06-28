'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/component/Header';
import Footer from '@/component/Footer';
import { useLocale } from '@/context/LocaleContext';
import { departmentsApi, type Department } from '@/lib/api';

const iconList = ['📋', '🌱', '🏢', '⚕️', '🔧', '📚', '🏛️', '⚖️'];

const serviceCategories = [
  'Document Processing', 'Field Services', 'Consultation & Advisory', 'Permits & Licensing',
  'Inspections', 'Community Outreach', 'Records Management', 'Emergency Response',
];

export default function ServiceDetailPage() {
  const { t } = useLocale();
  const params = useParams();
  const [dept, setDept] = useState<Department | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const id = Number(params.id);

  useEffect(() => {
    if (!id) return;
    departmentsApi.getOne(id)
      .then(setDept)
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

  if (error || !dept) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-5xl mb-4">🔍</p>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Department Not Found</h2>
            <p className="text-gray-500 mb-6">The department you are looking for does not exist.</p>
            <Link href="/service" className="text-red-600 hover:text-red-700 font-semibold inline-flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Back to Services
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const iconIdx = (dept.id % iconList.length + iconList.length) % iconList.length;
  const deptIcon = iconList[iconIdx];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col">
      <Header />

      {/* Hero Banner */}
      <section className="relative bg-gradient-to-br from-green-800 via-green-700 to-emerald-800 text-white py-16 overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `radial-gradient(circle at 20% 30%, rgba(255,255,255,0.2) 0%, transparent 50%),
                            radial-gradient(circle at 80% 70%, rgba(255,255,255,0.1) 0%, transparent 50%)`,
        }} />
        <div className="relative container mx-auto px-6">
          <Link href="/service" className="inline-flex items-center gap-1 text-green-200 hover:text-white text-sm mb-6 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            {t.header.services}
          </Link>
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-4xl shadow-lg">
              {deptIcon}
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black">{dept.name}</h1>
              <p className="text-green-200 mt-1">{dept.head}</p>
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-6 py-10 max-w-5xl">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-green-600 rounded-full" />
                About This Department
              </h2>
              <p className="text-gray-600 leading-relaxed">{dept.description}</p>

              {/* Services Provided */}
              <div className="mt-8">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Services Provided</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {serviceCategories.map((service, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                      <div className="w-8 h-8 rounded-lg bg-green-100 text-green-600 flex items-center justify-center text-sm shrink-0">
                        ✓
                      </div>
                      <span className="text-sm text-gray-700">{service}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { label: 'Active Staff', value: '24', icon: '👥', gradient: 'from-blue-500 to-blue-400' },
                { label: 'Avg Response', value: '2 Days', icon: '⚡', gradient: 'from-amber-500 to-amber-400' },
                { label: 'Service Years', value: '15+', icon: '📅', gradient: 'from-purple-500 to-purple-400' },
              ].map((stat, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 text-center hover:shadow-md transition">
                  <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} text-white text-lg mb-3`}>
                    {stat.icon}
                  </div>
                  <p className="text-2xl font-black text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Organizational Chart Placeholder */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-green-600 rounded-full" />
                Organizational Structure
              </h2>
              <div className="flex items-center justify-center p-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">🏛️</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-700">{dept.head}</p>
                  <p className="text-xs text-gray-400">Department Head</p>
                  <div className="w-px h-6 bg-gray-300 mx-auto my-2" />
                  <div className="flex items-center gap-4 justify-center">
                    <div className="px-4 py-2 bg-white rounded-lg border border-gray-200 text-xs text-gray-600">Division A</div>
                    <div className="px-4 py-2 bg-white rounded-lg border border-gray-200 text-xs text-gray-600">Division B</div>
                    <div className="px-4 py-2 bg-white rounded-lg border border-gray-200 text-xs text-gray-600">Division C</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-green-600 rounded-full" />
                Contact Information
              </h3>
              <div className="space-y-4">
                {dept.head && (
                  <div className="flex items-start gap-3">
                    <span className="text-lg shrink-0">👤</span>
                    <div>
                      <p className="text-xs text-gray-400">Department Head</p>
                      <p className="text-sm font-medium text-gray-800">{dept.head}</p>
                    </div>
                  </div>
                )}
                {dept.phone && (
                  <div className="flex items-start gap-3">
                    <span className="text-lg shrink-0">📞</span>
                    <div>
                      <p className="text-xs text-gray-400">Phone</p>
                      <p className="text-sm font-medium text-gray-800">{dept.phone}</p>
                    </div>
                  </div>
                )}
                {dept.email && (
                  <div className="flex items-start gap-3">
                    <span className="text-lg shrink-0">✉️</span>
                    <div>
                      <p className="text-xs text-gray-400">Email</p>
                      <p className="text-sm font-medium text-gray-800">{dept.email}</p>
                    </div>
                  </div>
                )}
                {dept.office && (
                  <div className="flex items-start gap-3">
                    <span className="text-lg shrink-0">📍</span>
                    <div>
                      <p className="text-xs text-gray-400">Office</p>
                      <p className="text-sm font-medium text-gray-800">{dept.office}</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100">
                <Link
                  href="/contact"
                  className="w-full inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-5 py-3 rounded-xl transition-all"
                >
                  {t.contact.sendMessage}
                </Link>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-green-600 rounded-full" />
                Department Info
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                  <span className="text-xs text-gray-500">Established</span>
                  <span className="text-xs font-semibold text-gray-800">2005 E.C</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                  <span className="text-xs text-gray-500">Staff Count</span>
                  <span className="text-xs font-semibold text-gray-800">24</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                  <span className="text-xs text-gray-500">Branches</span>
                  <span className="text-xs font-semibold text-gray-800">3</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-xs text-gray-500">Status</span>
                  <span className="text-[10px] font-semibold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Active</span>
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
