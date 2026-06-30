'use client';

import React from 'react';
import { AdminProvider, useAdmin, type Tab } from './components/admin-context';
import { Spinner, SkeletonRow, SkeletonCard } from './components/spinner';
import { MessagesTab } from './components/messages-tab';
import { NewsTab } from './components/news-tab';
import { AnnouncementsTab } from './components/announcements-tab';
import { ProjectsTab } from './components/projects-tab';
import { DepartmentsTab } from './components/departments-tab';
import { InvestmentsTab } from './components/investments-tab';
import { HeroSlidesTab } from './components/hero-slides-tab';
import { SettingsTab } from './components/settings-tab';
import { AdminsTab } from './components/admins-tab';

function TabLoadingSkeleton() {
  const { tab } = useAdmin();
  switch (tab) {
    case 'messages':
      return (
        <div className="space-y-3">
          <div className="flex gap-2 mb-4">
            {[1, 2, 3].map((i) => <div key={i} className="h-8 w-20 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse" />)}
          </div>
          {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
        </div>
      );
    case 'settings':
      return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 space-y-5 max-w-2xl animate-pulse">
          <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-48" />
          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-96" />
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i}>
              <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-32 mb-2" />
              <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded-lg w-full" />
            </div>
          ))}
        </div>
      );
    case 'hero-slides':
      return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 animate-pulse">
          <div className="p-4 border-b border-gray-100">
            <div className="flex justify-between">
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-32" />
              <div className="h-9 bg-slate-200 dark:bg-slate-700 rounded-lg w-28" />
            </div>
          </div>
          <table className="w-full">
            <thead><tr className="bg-gray-50">
              {[1, 2, 3, 4, 5].map((i) => <th key={i} className="p-4"><div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-16" /></th>)}
            </tr></thead>
            <tbody>
              {[1, 2, 3].map((i) => <SkeletonRow key={i} cols={5} />)}
            </tbody>
          </table>
        </div>
      );
    default:
      return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 animate-pulse">
          <div className="p-4 border-b border-gray-100 flex justify-between">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-32" />
            <div className="h-9 bg-slate-200 dark:bg-slate-700 rounded-lg w-28" />
          </div>
          <table className="w-full">
            <thead><tr className="bg-gray-50">
              {[1, 2, 3, 4, 5].map((i) => <th key={i} className="p-4"><div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-16" /></th>)}
            </tr></thead>
            <tbody>
              {[1, 2, 3, 4].map((i) => <SkeletonRow key={i} cols={5} />)}
            </tbody>
          </table>
        </div>
      );
  }
}

function AdminDashboardContent() {
  const { t, tab, setTab, unreadCount, loading, token, handleLogout, news, announcements, projects, departments, investments, heroSlides, admins } = useAdmin();

  if (!token) return null;

  const tabClasses = (tabName: Tab) =>
    `px-4 py-2 text-sm font-medium rounded-lg transition ${
      tab === tabName ? 'bg-slate-800 text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700'
    }`;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 shadow-sm border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-slate-800 dark:text-white">{t.admin.dashboard}</h1>
            {unreadCount > 0 && <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{unreadCount}</span>}
          </div>
          <button onClick={handleLogout} className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition">{t.admin.logout}</button>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button onClick={() => setTab('messages')} className={tabClasses('messages')}>
            {t.admin.messages} {unreadCount > 0 && <span className="text-xs ml-1 bg-red-400 text-white px-1.5 py-0.5 rounded-full">{unreadCount}</span>}
          </button>
          <button onClick={() => setTab('news')} className={tabClasses('news')}>{t.admin.cmsNews} ({news.length})</button>
          <button onClick={() => setTab('announcements')} className={tabClasses('announcements')}>{t.admin.cmsAnnouncements} ({announcements.length})</button>
          <button onClick={() => setTab('projects')} className={tabClasses('projects')}>{t.admin.cmsProjects} ({projects.length})</button>
          <button onClick={() => setTab('departments')} className={tabClasses('departments')}>{t.admin.cmsDepartments} ({departments.length})</button>
          <button onClick={() => setTab('investments')} className={tabClasses('investments')}>{t.admin.cmsInvestments} ({investments.length})</button>
          <button onClick={() => setTab('admins')} className={tabClasses('admins')}>{t.admin.admins} ({admins.length})</button>
          <button onClick={() => setTab('hero-slides')} className={tabClasses('hero-slides')}>{t.admin.cmsHeroSlides} ({heroSlides.length})</button>
          <button onClick={() => setTab('settings')} className={tabClasses('settings')}>{t.admin.cmsSettings}</button>
        </div>

        {/* Loading state */}
        {loading ? (
          <div className="flex flex-col items-center gap-6">
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <Spinner className="w-4 h-4" />
              <span>Loading {tab}...</span>
            </div>
            <div className="w-full">
              <TabLoadingSkeleton />
            </div>
          </div>
        ) : tab === 'messages' ? <MessagesTab /> :
          tab === 'news' ? <NewsTab /> :
          tab === 'announcements' ? <AnnouncementsTab /> :
          tab === 'projects' ? <ProjectsTab /> :
          tab === 'departments' ? <DepartmentsTab /> :
          tab === 'investments' ? <InvestmentsTab /> :
          tab === 'hero-slides' ? <HeroSlidesTab /> :
          tab === 'settings' ? <SettingsTab /> :
          <AdminsTab />}
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <AdminProvider>
      <AdminDashboardContent />
    </AdminProvider>
  );
}
