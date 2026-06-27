'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/component/Header';
import { useLocale } from '@/context/LocaleContext';
import { departmentsApi, type Department } from '@/lib/api';

const icons = ['📋', '🌱', '🏢', '⚕️', '🔧', '📚', '🏛️', '⚖️'];

export default function ServicesPage() {
  const { t } = useLocale();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    departmentsApi.getAll()
      .then(setDepartments)
      .catch(() => setDepartments([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <div>
        <Header />
        
        <section className="bg-green-800 text-white py-12 text-center">
          <div className="container mx-auto px-6">
            <h1 className="text-3xl font-bold md:text-4xl">{t.servicesPage.title}</h1>
            <p className="mt-2 text-green-100 max-w-xl mx-auto text-sm">
              {t.servicesPage.subtitle}
            </p>
          </div>
        </section>

        <main className="container mx-auto px-6 py-12 max-w-6xl">
          {loading ? (
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl shadow-md border border-gray-100 animate-pulse p-6 space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {departments.map((dept, idx) => (
                <div key={dept.id} className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition">
                  <div className="p-6 bg-green-50 border-b border-gray-100 flex items-center space-x-3">
                    <span className="text-2xl">{icons[idx % icons.length]}</span>
                    <div>
                      <h2 className="text-lg font-bold text-green-800">{dept.name}</h2>
                      <p className="text-xs text-gray-500">{dept.head}</p>
                    </div>
                  </div>
                  <div className="p-6 space-y-3">
                    <p className="text-sm text-gray-600 leading-relaxed">{dept.description}</p>
                    <div className="text-xs text-gray-500 space-y-1 pt-2 border-t border-gray-100">
                      {dept.phone && <p>📞 {dept.phone}</p>}
                      {dept.email && <p>✉️ {dept.email}</p>}
                      {dept.office && <p>📍 {dept.office}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      <footer className="bg-gray-900 text-gray-400 py-6 text-center text-sm">
        <p>&copy; {new Date().getFullYear()} {t.footer.copyright}</p>
      </footer>
    </div>
  );
}
