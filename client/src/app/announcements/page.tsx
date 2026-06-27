'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/component/Header';
import { useLocale } from '@/context/LocaleContext';
import { announcementsApi, type Announcement } from '@/lib/api';

export default function AnnouncementsPage() {
  const { t } = useLocale();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    announcementsApi.getAll()
      .then(setAnnouncements)
      .catch(() => setAnnouncements([]))
      .finally(() => setLoading(false));
  }, []);

  const published = announcements.filter((a) => a.published);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <div>
        <Header />
        
        <section className="bg-green-800 text-white py-12 text-center">
          <div className="container mx-auto px-6">
            <h1 className="text-3xl font-bold md:text-4xl">{t.announcements.title}</h1>
            <p className="mt-2 text-green-100 max-w-xl mx-auto text-sm">
              {t.announcements.subtitle}
            </p>
          </div>
        </section>

        <main className="container mx-auto px-6 py-12 max-w-4xl">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-pulse space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                </div>
              ))}
            </div>
          ) : published.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-4xl mb-4">📢</p>
              <p className="text-gray-500 text-lg">{t.announcements.noAnnouncements}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {published.map((announcement) => (
                <div key={announcement.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
                  <button
                    onClick={() => setExpandedId(expandedId === announcement.id ? null : announcement.id)}
                    className="w-full text-left p-6 flex justify-between items-start"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full font-medium">
                          {t.announcements.published}
                        </span>
                        <span className="text-gray-400 text-xs">
                          {new Date(announcement.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">{announcement.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{announcement.description}</p>
                    </div>
                    <span className={`text-gray-400 transition-transform ml-4 mt-2 ${expandedId === announcement.id ? 'rotate-180' : ''}`}>
                      ▼
                    </span>
                  </button>
                  {expandedId === announcement.id && (
                    <div className="px-6 pb-6 border-t border-gray-100 pt-4">
                      <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                        {announcement.content}
                      </p>
                    </div>
                  )}
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
