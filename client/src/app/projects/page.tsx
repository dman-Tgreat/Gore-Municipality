'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/component/Header';
import { useLocale } from '@/context/LocaleContext';
import { projectsApi, type Project } from '@/lib/api';

const statusColors: Record<string, string> = {
  ongoing: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  planned: 'bg-yellow-100 text-yellow-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function ProjectsPage() {
  const { t } = useLocale();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    projectsApi.getAll()
      .then(setProjects)
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = statusFilter === 'all'
    ? projects
    : projects.filter((p) => p.status === statusFilter);

  const statuses = ['all', ...new Set(projects.map((p) => p.status))];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <div>
        <Header />
        
        <section className="bg-green-800 text-white py-12 text-center">
          <div className="container mx-auto px-6">
            <h1 className="text-3xl font-bold md:text-4xl">{t.projects.title}</h1>
            <p className="mt-2 text-green-100 max-w-xl mx-auto text-sm">
              {t.projects.subtitle}
            </p>
          </div>
        </section>

        <main className="container mx-auto px-6 py-12 max-w-6xl">
          {/* Status Filter */}
          <div className="flex space-x-2 mb-8 flex-wrap gap-2">
            {statuses.map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-1.5 text-sm rounded-full font-medium transition ${
                  statusFilter === status
                    ? 'bg-green-700 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl shadow-md border border-gray-100 animate-pulse p-6 space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-center text-gray-500 py-12">{t.projects.noProjects}</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((project) => (
                <div key={project.id} className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition group">
                  {project.coverImage && (
                    <div className="h-40 overflow-hidden">
                      <img src={project.coverImage} alt={project.name} className="w-full h-full object-cover group-hover:scale-105 transition" />
                    </div>
                  )}
                  <div className="p-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-gray-900">{project.name}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[project.status] || 'bg-gray-100 text-gray-600'}`}>
                        {project.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">{project.description}</p>
                    <div className="text-xs text-gray-500 space-y-1 pt-2 border-t border-gray-100">
                      {project.budget && (
                        <p><span className="font-medium">{t.projects.budget}:</span> ETB {project.budget.toLocaleString()}</p>
                      )}
                      {project.location && (
                        <p><span className="font-medium">{t.projects.location}:</span> {project.location}</p>
                      )}
                      {(project.startDate || project.endDate) && (
                        <p>
                          <span className="font-medium">{t.projects.timeline}:</span>{' '}
                          {project.startDate && `${t.projects.from} ${new Date(project.startDate).toLocaleDateString()}`}
                          {project.startDate && project.endDate && ' — '}
                          {project.endDate && `${t.projects.to} ${new Date(project.endDate).toLocaleDateString()}`}
                        </p>
                      )}
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
