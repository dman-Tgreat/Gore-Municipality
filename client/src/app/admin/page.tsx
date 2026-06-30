'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from '@/context/LocaleContext';
import FileUpload from '@/component/FileUpload';
import {
  contactAdminApi, adminApi, newsApi, announcementsApi, projectsApi, departmentsApi, investmentsApi,
  heroSlidesApi, settingsApi,
  type ContactMessage, type AdminUser, type NewsArticle, type Announcement, type Project, type Department, type Investment,
  type HeroSlide, type SiteSetting,
} from '@/lib/api';

type Tab = 'messages' | 'news' | 'announcements' | 'projects' | 'departments' | 'investments' | 'admins' | 'hero-slides' | 'settings';

interface CmsFormState<T> {
  editing: boolean;
  editingId: number | null;
  data: T;
}

const emptyNewsForm = { title: '', titleAm: '', titleOm: '', slug: '', summary: '', summaryAm: '', summaryOm: '', content: '', contentAm: '', contentOm: '', coverImage: '', published: true };
const emptyAnnouncementForm = { title: '', titleAm: '', titleOm: '', description: '', descriptionAm: '', descriptionOm: '', content: '', contentAm: '', contentOm: '', published: true };
const emptyProjectForm = { name: '', nameAm: '', nameOm: '', description: '', descriptionAm: '', descriptionOm: '', budget: 0, status: 'planned', startDate: '', endDate: '', location: '', coverImage: '', fundingSource: '', contractor: '', category: '' };
const emptyDeptForm = { name: '', nameAm: '', nameOm: '', description: '', descriptionAm: '', descriptionOm: '', head: '', phone: '', email: '', office: '', image: '' };
const emptyInvestmentForm = { title: '', titleAm: '', titleOm: '', description: '', descriptionAm: '', descriptionOm: '', content: '', contentAm: '', contentOm: '', category: 'opportunity', coverImage: '', location: '', contactPhone: '', contactEmail: '', published: true };

// ── Loading Spinner Component ──
function Spinner({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={`animate-spin text-slate-400 ${className}`} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
}

// ── Skeleton row for table tabs ──
function SkeletonRow({ cols }: { cols: number }) {
  return (
    <tr className="border-b border-gray-50">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="p-4">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" style={{ width: i === 0 ? '55%' : i === cols - 1 ? '30%' : '40%' }} />
        </td>
      ))}
    </tr>
  );
}

// ── Skeleton card for list-style tabs ──
function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-5 animate-pulse space-y-3">
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
      <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
      <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full" />
    </div>
  );
}

export default function AdminDashboardPage() {
  const { t } = useLocale();
  const router = useRouter();

  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;

  // Data states
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>('messages');

  // Form language
  const [formLang, setFormLang] = useState<'en' | 'am' | 'om'>('en');

  // Language tab bar (reused across forms)
  function LangBar() {
    return (
      <div className="flex gap-1 mb-4 bg-slate-100 dark:bg-slate-700/50 rounded-lg p-1 w-fit">
        {(['en', 'am', 'om'] as const).map((lang) => (
          <button key={lang} type="button" onClick={() => setFormLang(lang)}
            className={`text-xs px-3 py-1.5 rounded-md font-medium transition ${
              formLang === lang
                ? 'bg-white dark:bg-slate-600 text-slate-800 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
            }`}>
            {lang === 'en' ? 'EN' : lang === 'am' ? 'AM' : 'OM'}
          </button>
        ))}
      </div>
    );
  }

  // Get/set form field value based on selected language
  const langVal = <T extends Record<string, unknown>>(data: T, field: string): string => {
    if (formLang === 'en') return (data[field] as string) || '';
    const key = `${field}${formLang === 'am' ? 'Am' : 'Om'}`;
    return (data[key] as string) || '';
  };

  // Message states
  const [msgFilter, setMsgFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [expandedMsg, setExpandedMsg] = useState<number | null>(null);

  // News CMS
  const [newsForm, setNewsForm] = useState<CmsFormState<typeof emptyNewsForm>>({ editing: false, editingId: null, data: { ...emptyNewsForm } });
  const [newsSubmitting, setNewsSubmitting] = useState(false);

  // Announcements CMS
  const [annForm, setAnnForm] = useState<CmsFormState<typeof emptyAnnouncementForm>>({ editing: false, editingId: null, data: { ...emptyAnnouncementForm } });
  const [annSubmitting, setAnnSubmitting] = useState(false);

  // Projects CMS
  const [projForm, setProjForm] = useState<CmsFormState<typeof emptyProjectForm>>({ editing: false, editingId: null, data: { ...emptyProjectForm } });
  const [projSubmitting, setProjSubmitting] = useState(false);

  // Departments CMS
  const [deptForm, setDeptForm] = useState<CmsFormState<typeof emptyDeptForm>>({ editing: false, editingId: null, data: { ...emptyDeptForm } });
  const [deptSubmitting, setDeptSubmitting] = useState(false);



  // Investment states
  const [invForm, setInvForm] = useState<CmsFormState<typeof emptyInvestmentForm>>({ editing: false, editingId: null, data: { ...emptyInvestmentForm } });
  const [invSubmitting, setInvSubmitting] = useState(false);

  // Hero Slides states
  const [slideForm, setSlideForm] = useState<CmsFormState<{ imageUrl: string; description: string; sortOrder: number; isActive: boolean }>>({
    editing: false, editingId: null,
    data: { imageUrl: '', description: '', sortOrder: 0, isActive: true },
  });
  const [slideSubmitting, setSlideSubmitting] = useState(false);

  // Settings states
  const [settingsForm, setSettingsForm] = useState<Record<string, string>>({});
  const [settingsSaving, setSettingsSaving] = useState(false);

  // Admin states
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminForm, setAdminForm] = useState({ fullName: '', email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const [adminError, setAdminError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [togglingId, setTogglingId] = useState<number | null>(null);

  const fetchData = useCallback(() => {
    if (!token) { router.push('/admin/login'); return; }
    Promise.all([
      contactAdminApi.getAll(token),
      adminApi.getAll(token),
      newsApi.getAll(),
      announcementsApi.getAll(),
      projectsApi.getAll(),
      departmentsApi.getAll(),
      investmentsApi.getAll(),
      heroSlidesApi.getAll(),
      settingsApi.getAll(),
    ])
      .then(([msgs, adms, n, a, p, d, i, slides, sets]) => {
        setMessages(msgs); setAdmins(adms); setNews(n); setAnnouncements(a); setProjects(p); setDepartments(d); setInvestments(i);
        setHeroSlides(slides); setSiteSettings(sets);
        const formMap: Record<string, string> = {};
        (sets as SiteSetting[]).forEach((s) => { formMap[s.settingKey] = s.settingValue; });
        setSettingsForm(formMap);
      })
      .catch(() => { localStorage.removeItem('admin_token'); router.push('/admin/login'); })
      .finally(() => setLoading(false));
  }, [token, router]);

  useEffect(() => { fetchData(); }, [fetchData]);
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') { setShowAdminModal(false); setConfirmDelete(null); } };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  // Logout
  const handleLogout = () => { localStorage.removeItem('admin_token'); router.push('/admin/login'); };

  // ── CRUD Handlers (unchanged) ──

  const handleMarkRead = async (id: number) => {
    if (!token) return;
    try { await contactAdminApi.markRead(token, id); setMessages((p) => p.map((m) => (m.id === id ? { ...m, isRead: true } : m))); } catch {}
  };
  const handleDeleteMsg = async (id: number) => {
    if (!token) return;
    try { await contactAdminApi.delete(token, id); setMessages((p) => p.filter((m) => m.id !== id)); } catch {}
  };

  const handleSaveNews = async (e: React.FormEvent) => {
    e.preventDefault(); if (!token) return;
    setNewsSubmitting(true);
    try {
      if (newsForm.editingId) {
        const updated = await newsApi.update(token, newsForm.editingId, newsForm.data);
        setNews((p) => p.map((n) => (n.id === newsForm.editingId ? updated : n)));
      } else {
        const created = await newsApi.create(token, newsForm.data);
        setNews((p) => [created, ...p]);
      }
      setNewsForm({ editing: false, editingId: null, data: { ...emptyNewsForm } });
    } catch {} finally { setNewsSubmitting(false); }
  };
  const handleDeleteNews = async (id: number) => {
    if (!token) return;
    try { await newsApi.remove(token, id); setNews((p) => p.filter((n) => n.id !== id)); } catch {}
  };
  const handleToggleNews = async (item: NewsArticle) => {
    if (!token) return;
    try { const u = await newsApi.update(token, item.id, { published: !item.published }); setNews((p) => p.map((n) => (n.id === item.id ? u : n))); } catch {}
  };

  const handleSaveAnn = async (e: React.FormEvent) => {
    e.preventDefault(); if (!token) return;
    setAnnSubmitting(true);
    try {
      if (annForm.editingId) {
        const updated = await announcementsApi.update(token, annForm.editingId, annForm.data);
        setAnnouncements((p) => p.map((a) => (a.id === annForm.editingId ? updated : a)));
      } else {
        const created = await announcementsApi.create(token, annForm.data);
        setAnnouncements((p) => [created, ...p]);
      }
      setAnnForm({ editing: false, editingId: null, data: { ...emptyAnnouncementForm } });
    } catch {} finally { setAnnSubmitting(false); }
  };
  const handleDeleteAnn = async (id: number) => {
    if (!token) return;
    try { await announcementsApi.remove(token, id); setAnnouncements((p) => p.filter((a) => a.id !== id)); } catch {}
  };
  const handleToggleAnn = async (item: Announcement) => {
    if (!token) return;
    try { const u = await announcementsApi.update(token, item.id, { published: !item.published }); setAnnouncements((p) => p.map((a) => (a.id === item.id ? u : a))); } catch {}
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault(); if (!token) return;
    setProjSubmitting(true);
    try {
      const payload = { ...projForm.data, budget: projForm.data.budget || undefined };
      if (projForm.editingId) {
        const updated = await projectsApi.update(token, projForm.editingId, payload);
        setProjects((p) => p.map((pr) => (pr.id === projForm.editingId ? updated : pr)));
      } else {
        const created = await projectsApi.create(token, payload);
        setProjects((p) => [created, ...p]);
      }
      setProjForm({ editing: false, editingId: null, data: { ...emptyProjectForm } });
    } catch {} finally { setProjSubmitting(false); }
  };
  const handleDeleteProject = async (id: number) => {
    if (!token) return;
    try { await projectsApi.remove(token, id); setProjects((p) => p.filter((pr) => pr.id !== id)); } catch {}
  };

  const handleSaveDept = async (e: React.FormEvent) => {
    e.preventDefault(); if (!token) return;
    setDeptSubmitting(true);
    try {
      if (deptForm.editingId) {
        const updated = await departmentsApi.update(token, deptForm.editingId, deptForm.data);
        setDepartments((p) => p.map((d) => (d.id === deptForm.editingId ? updated : d)));
      } else {
        const created = await departmentsApi.create(token, deptForm.data);
        setDepartments((p) => [created, ...p]);
      }
      setDeptForm({ editing: false, editingId: null, data: { ...emptyDeptForm } });
    } catch {} finally { setDeptSubmitting(false); }
  };
  const handleDeleteDept = async (id: number) => {
    if (!token) return;
    try { await departmentsApi.remove(token, id); setDepartments((p) => p.filter((d) => d.id !== id)); } catch {}
  };

  const handleSaveInvestment = async (e: React.FormEvent) => {
    e.preventDefault(); if (!token) return;
    setInvSubmitting(true);
    try {
      if (invForm.editingId) {
        const updated = await investmentsApi.update(token, invForm.editingId, invForm.data);
        setInvestments((p) => p.map((inv) => (inv.id === invForm.editingId ? updated : inv)));
      } else {
        const created = await investmentsApi.create(token, invForm.data);
        setInvestments((p) => [created, ...p]);
      }
      setInvForm({ editing: false, editingId: null, data: { ...emptyInvestmentForm } });
    } catch {} finally { setInvSubmitting(false); }
  };
  const handleDeleteInvestment = async (id: number) => {
    if (!token) return;
    try { await investmentsApi.remove(token, id); setInvestments((p) => p.filter((inv) => inv.id !== id)); } catch {}
  };
  const handleToggleInvestment = async (item: Investment) => {
    if (!token) return;
    try { const u = await investmentsApi.update(token, item.id, { published: !item.published }); setInvestments((p) => p.map((inv) => (inv.id === item.id ? u : inv))); } catch {}
  };

  const handleSaveSlide = async (e: React.FormEvent) => {
    e.preventDefault(); if (!token) return;
    setSlideSubmitting(true);
    try {
      if (slideForm.editingId) {
        const updated = await heroSlidesApi.update(token, slideForm.editingId, slideForm.data);
        setHeroSlides((p) => p.map((s) => (s.id === slideForm.editingId ? updated : s)));
      } else {
        const created = await heroSlidesApi.create(token, slideForm.data);
        setHeroSlides((p) => [...p, created]);
      }
      setSlideForm({ editing: false, editingId: null, data: { imageUrl: '', description: '', sortOrder: 0, isActive: true } });
    } catch {} finally { setSlideSubmitting(false); }
  };
  const handleDeleteSlide = async (id: number) => {
    if (!token) return;
    try { await heroSlidesApi.remove(token, id); setHeroSlides((p) => p.filter((s) => s.id !== id)); } catch {}
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault(); if (!token) return;
    setSettingsSaving(true);
    try {
      const entries = Object.entries(settingsForm).map(([settingKey, settingValue]) => ({ settingKey, settingValue }));
      await settingsApi.upsertMany(token, entries);
      const fresh = await settingsApi.getAll();
      setSiteSettings(fresh);
    } catch {} finally { setSettingsSaving(false); }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault(); if (!token) return;
    setSubmitting(true); setAdminError('');
    try {
      await adminApi.create(token, adminForm);
      setShowAdminModal(false); setAdminForm({ fullName: '', email: '', password: '' });
      const updated = await adminApi.getAll(token); setAdmins(updated);
    } catch (err: unknown) { setAdminError(err instanceof Error ? err.message : 'Failed'); } finally { setSubmitting(false); }
  };
  const handleToggleActive = async (admin: AdminUser) => {
    if (!token || togglingId !== null) return;
    setTogglingId(admin.id);
    try { const u = await adminApi.update(token, admin.id, { isActive: !admin.isActive }); setAdmins((p) => p.map((a) => (a.id === admin.id ? u : a))); } catch {}
    finally { setTogglingId(null); }
  };
  const handleDeleteAdmin = async (id: number) => {
    if (!token) return;
    try { await adminApi.remove(token, id); setAdmins((p) => p.filter((a) => a.id !== id)); setConfirmDelete(null); } catch {}
  };

  if (!token) return null;

  const unreadCount = messages.filter((m) => !m.isRead).length;
  const filteredMessages = messages.filter((m) => { if (msgFilter === 'unread') return !m.isRead; if (msgFilter === 'read') return m.isRead; return true; });

  const tabClasses = (tabName: Tab) =>
    `px-4 py-2 text-sm font-medium rounded-lg transition ${
      tab === tabName ? 'bg-slate-800 text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700'
    }`;

  const badge = (published: boolean) =>
    published
      ? <span className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-2 py-0.5 rounded-full font-medium">{t.admin.publishedBadge}</span>
      : <span className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full font-medium">{t.admin.draftBadge}</span>;

  // ── Tab-aware Loading Skeleton ──
  function TabLoadingSkeleton() {
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
        // Table-based tabs (news, announcements, projects, departments, documents, investments, admins)
        const colCount =
          tab === 'projects' ? 5 :
          tab === 'departments' ? 5 :
          tab === 'investments' ? 5 :
          tab === 'admins' ? 5 : 5;
        return (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 animate-pulse">
            <div className="p-4 border-b border-gray-100 flex justify-between">
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-32" />
              <div className="h-9 bg-slate-200 dark:bg-slate-700 rounded-lg w-28" />
            </div>
            <table className="w-full">
              <thead><tr className="bg-gray-50">
                {Array.from({ length: colCount }).map((_, i) => <th key={i} className="p-4"><div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-16" /></th>)}
              </tr></thead>
              <tbody>
                {[1, 2, 3, 4].map((i) => <SkeletonRow key={i} cols={colCount} />)}
              </tbody>
            </table>
          </div>
        );
    }
  }

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

        {/* Loading state with tab-specific skeleton */}
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
        ) : tab === 'messages' ? MessagesTab() :
          tab === 'news' ? NewsTab() :
          tab === 'announcements' ? AnnouncementsTab() :
          tab === 'projects' ? ProjectsTab() :
          tab === 'departments' ? DepartmentsTab() :
          tab === 'investments' ? InvestmentsTab() :
          tab === 'hero-slides' ? HeroSlidesTab() :
          tab === 'settings' ? SettingsTab() :
          AdminsTab()}
      </div>

      {/* Admin Create Modal */}
      {showAdminModal && (          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setShowAdminModal(false)}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-2">{t.admin.addAdmin}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{t.admin.createAdmin}</p>
            <form onSubmit={handleCreateAdmin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">{t.admin.fullNameLabel}</label>
                <input type="text" required value={adminForm.fullName} onChange={(e) => setAdminForm((p) => ({ ...p, fullName: e.target.value }))}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-slate-600 focus:border-transparent outline-none text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 bg-white dark:bg-slate-800" placeholder="e.g. John Doe" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">{t.admin.email}</label>
                <input type="email" required value={adminForm.email} onChange={(e) => setAdminForm((p) => ({ ...p, email: e.target.value }))}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-slate-600 focus:border-transparent outline-none text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 bg-white dark:bg-slate-800" placeholder="admin@example.com" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">{t.admin.password}</label>
                <input type="password" required minLength={8} value={adminForm.password} onChange={(e) => setAdminForm((p) => ({ ...p, password: e.target.value }))}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-slate-600 focus:border-transparent outline-none text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 bg-white dark:bg-slate-800" placeholder="Min. 8 characters" />
              </div>
              {adminError && <p className="text-red-600 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">{adminError}</p>}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowAdminModal(false)}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition">{t.admin.cancel}</button>
                <button type="submit" disabled={submitting}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-slate-800 rounded-lg hover:bg-slate-700 transition disabled:opacity-50 flex items-center justify-center gap-2">
                  {submitting && <Spinner className="w-4 h-4" />}
                  {submitting ? t.admin.creating : t.admin.createAdmin}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  // ====== Messages Tab ======
  function MessagesTab() {
    return (
      <>
        <div className="flex gap-2 mb-4 flex-wrap">
          {(['all', 'unread', 'read'] as const).map((f) => (
            <button key={f} onClick={() => setMsgFilter(f)}
              className={`text-xs px-3 py-1.5 rounded-full transition font-medium ${msgFilter === f ? 'bg-slate-800 text-white' : 'bg-white text-slate-500 hover:bg-slate-100 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-700'}`}>
              {f === 'all' ? t.admin.allMessages : f === 'unread' ? `${t.admin.unread} (${unreadCount})` : t.admin.read}
            </button>
          ))}
        </div>
        {filteredMessages.length === 0 ? (
          <p className="text-center text-slate-500 dark:text-slate-400 py-12">{t.admin.noMessages}</p>
        ) : (
          <div className="space-y-3">
            {filteredMessages.map((msg) => (
              <div key={msg.id} className={`bg-white dark:bg-slate-800 rounded-xl shadow-sm border transition ${msg.isRead ? 'border-slate-200 dark:border-slate-700' : 'border-l-4 border-l-slate-500 border-slate-200 dark:border-slate-700'}`}>
                <button onClick={() => setExpandedMsg(expandedMsg === msg.id ? null : msg.id)} className="w-full text-left p-5">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        {!msg.isRead && <span className="w-2 h-2 bg-slate-500 rounded-full shrink-0" />}
                        <h3 className="font-semibold text-slate-800 dark:text-white truncate">{msg.subject}</h3>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{msg.name} &lt;{msg.email}&gt;</p>
                    </div>
                    <span className="text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap ml-4">{new Date(msg.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  {expandedMsg === msg.id && (
                    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                      <p className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap">{msg.message}</p>
                      <div className="flex gap-2 mt-4">
                        {!msg.isRead && <button onClick={(e) => { e.stopPropagation(); handleMarkRead(msg.id); }}
                          className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition font-medium">{t.admin.markRead}</button>}
                        <button onClick={(e) => { e.stopPropagation(); handleDeleteMsg(msg.id); }}
                          className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition font-medium">{t.admin.delete}</button>
                      </div>
                    </div>
                  )}
                  {expandedMsg !== msg.id && <p className="text-sm text-slate-400 dark:text-slate-500 mt-1 truncate">{msg.message}</p>}
                </button>
              </div>
            ))}
          </div>
        )}
      </>
    );
  }

  // ====== News Tab ======
  function NewsTab() {
    if (newsForm.editing) return NewsForm();
    return (
      <>
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-slate-500">{news.length} article{news.length !== 1 ? 's' : ''}</p>
          <button onClick={() => setNewsForm({ editing: true, editingId: null, data: { ...emptyNewsForm } })}
            className="bg-slate-800 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-700 transition">{t.admin.createItem}</button>
        </div>
        {news.length === 0 ? <p className="text-center text-slate-500 py-12">{t.admin.noItems}</p> : (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="bg-slate-50 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-600">
                  <th className="text-left p-4 font-semibold text-slate-600 dark:text-slate-400">{t.admin.titleField}</th>
                  <th className="text-left p-4 font-semibold text-slate-600 dark:text-slate-400">{t.admin.statusField}</th>
                  <th className="text-left p-4 font-semibold text-slate-600 dark:text-slate-400 hidden md:table-cell">{t.admin.authorField}</th>
                  <th className="text-left p-4 font-semibold text-slate-600 dark:text-slate-400 hidden md:table-cell">{t.admin.dateField}</th>
                  <th className="text-right p-4 font-semibold text-slate-600 dark:text-slate-400">{t.admin.editItem}</th>
                </tr></thead>
                <tbody>
                  {news.map((item) => (
                    <tr key={item.id} className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition">
                      <td className="p-4 font-medium text-slate-800 dark:text-white max-w-xs truncate">{item.title}</td>
                      <td className="p-4"><button onClick={() => handleToggleNews(item)} className="hover:opacity-80">{badge(item.published)}</button></td>
                      <td className="p-4 text-slate-500 text-xs hidden md:table-cell dark:text-slate-400">{item.createdBy?.fullName}</td>
                      <td className="p-4 text-slate-400 text-xs hidden md:table-cell dark:text-slate-500">{new Date(item.createdAt).toLocaleDateString()}</td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => setNewsForm({ editing: true, editingId: item.id, data: { title: item.title, titleAm: item.titleAm || '', titleOm: item.titleOm || '', slug: item.slug, summary: item.summary, summaryAm: item.summaryAm || '', summaryOm: item.summaryOm || '', content: item.content, contentAm: item.contentAm || '', contentOm: item.contentOm || '', coverImage: item.coverImage || '', published: item.published } })}
                            className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition font-medium">{t.admin.editItem}</button>
                          <button onClick={() => { if (window.confirm(t.admin.confirmDeleteItemTitle)) handleDeleteNews(item.id); }}
                            className="text-xs text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition font-medium">{t.admin.deleteItem}</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </>
    );
  }
  function NewsForm() {
    const d = newsForm.data;
    return (
      <form onSubmit={handleSaveNews} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 space-y-4 max-w-2xl">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">{newsForm.editingId ? t.admin.editItem : t.admin.createItem} {t.admin.cmsNews}</h2>
          <button type="button" onClick={() => setNewsForm({ editing: false, editingId: null, data: { ...emptyNewsForm } })}
            className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition">{t.admin.cancelEdit}</button>
        </div>
        <LangBar />
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">{t.admin.titleField}{formLang === 'en' ? ' *' : ''} <span className="text-slate-400 font-normal">({formLang === 'en' ? 'EN' : formLang === 'am' ? 'አማ' : 'OM'})</span></label>
            <input type="text" required={formLang === 'en'} value={formLang === 'en' ? d.title : formLang === 'am' ? (d.titleAm || '') : (d.titleOm || '')}
              onChange={(e) => { const v = e.target.value; setNewsForm((p) => ({ ...p, data: { ...p.data, ...(formLang === 'en' ? {title: v} : formLang === 'am' ? {titleAm: v} : {titleOm: v}) } })); }}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none bg-white dark:bg-slate-800" placeholder={formLang === 'en' ? '' : 'Optional'} />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">{t.admin.slugField}</label>
            <input type="text" value={d.slug} onChange={(e) => setNewsForm((p) => ({ ...p, data: { ...p.data, slug: e.target.value } }))}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none bg-white dark:bg-slate-800" placeholder="Auto-generated if empty" />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">{t.admin.summaryField}{formLang === 'en' ? ' *' : ''} <span className="text-slate-400 font-normal">({formLang === 'en' ? 'EN' : formLang === 'am' ? 'አማ' : 'OM'})</span></label>
            <textarea required={formLang === 'en'} value={formLang === 'en' ? d.summary : formLang === 'am' ? (d.summaryAm || '') : (d.summaryOm || '')}
              onChange={(e) => { const v = e.target.value; setNewsForm((p) => ({ ...p, data: { ...p.data, ...(formLang === 'en' ? {summary: v} : formLang === 'am' ? {summaryAm: v} : {summaryOm: v}) } })); }}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none bg-white dark:bg-slate-800" rows={2} placeholder={formLang === 'en' ? '' : 'Optional'} />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">{t.admin.contentField}{formLang === 'en' ? ' *' : ''} <span className="text-slate-400 font-normal">({formLang === 'en' ? 'EN' : formLang === 'am' ? 'አማ' : 'OM'})</span></label>
            <textarea required={formLang === 'en'} value={formLang === 'en' ? d.content : formLang === 'am' ? (d.contentAm || '') : (d.contentOm || '')}
              onChange={(e) => { const v = e.target.value; setNewsForm((p) => ({ ...p, data: { ...p.data, ...(formLang === 'en' ? {content: v} : formLang === 'am' ? {contentAm: v} : {contentOm: v}) } })); }}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none font-mono bg-white dark:bg-slate-800" rows={8} placeholder={formLang === 'en' ? '' : 'Optional'} />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">{t.admin.coverImageField}</label>
            <FileUpload existingUrl={d.coverImage} onUpload={(url) => setNewsForm((p) => ({ ...p, data: { ...p.data, coverImage: url } }))} label="Upload Cover Image" />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">{t.admin.statusField}</label>
            <select value={d.published ? 'true' : 'false'} onChange={(e) => setNewsForm((p) => ({ ...p, data: { ...p.data, published: e.target.value === 'true' } }))}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none bg-white dark:bg-slate-800">
              <option value="true">{t.admin.publishedBadge}</option>
              <option value="false">{t.admin.draftBadge}</option>
            </select>
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={newsSubmitting}
            className="bg-slate-800 text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-slate-700 transition disabled:opacity-50 flex items-center gap-2">
            {newsSubmitting && <Spinner className="w-4 h-4" />}
            {newsSubmitting ? t.admin.saving : t.admin.saveItem}
          </button>
        </div>
      </form>
    );
  }

  // ====== Announcements Tab ======
  function AnnouncementsTab() {
    if (annForm.editing) return AnnouncementsForm();
    return (
      <>
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-slate-500">{announcements.length} announcement{announcements.length !== 1 ? 's' : ''}</p>
          <button onClick={() => setAnnForm({ editing: true, editingId: null, data: { ...emptyAnnouncementForm } })}
            className="bg-slate-800 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-700 transition">{t.admin.createItem}</button>
        </div>
        {announcements.length === 0 ? <p className="text-center text-slate-500 py-12">{t.admin.noItems}</p> : (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="bg-slate-50 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-600">
                  <th className="text-left p-4 font-semibold text-slate-600 dark:text-slate-400">{t.admin.titleField}</th>
                  <th className="text-left p-4 font-semibold text-slate-600 dark:text-slate-400">{t.admin.statusField}</th>
                  <th className="text-left p-4 font-semibold text-slate-600 dark:text-slate-400 hidden md:table-cell">{t.admin.authorField}</th>
                  <th className="text-left p-4 font-semibold text-slate-600 dark:text-slate-400 hidden md:table-cell">{t.admin.dateField}</th>
                  <th className="text-right p-4 font-semibold text-slate-600 dark:text-slate-400">{t.admin.editItem}</th>
                </tr></thead>
                <tbody>
                  {announcements.map((item) => (
                    <tr key={item.id} className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition">
                      <td className="p-4 font-medium text-slate-800 dark:text-white max-w-xs truncate">{item.title}</td>
                      <td className="p-4"><button onClick={() => handleToggleAnn(item)} className="hover:opacity-80">{badge(item.published)}</button></td>
                      <td className="p-4 text-slate-500 text-xs hidden md:table-cell dark:text-slate-400">{item.createdBy?.fullName}</td>
                      <td className="p-4 text-slate-400 text-xs hidden md:table-cell dark:text-slate-500">{new Date(item.createdAt).toLocaleDateString()}</td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => setAnnForm({ editing: true, editingId: item.id, data: { title: item.title, titleAm: item.titleAm || '', titleOm: item.titleOm || '', description: item.description, descriptionAm: item.descriptionAm || '', descriptionOm: item.descriptionOm || '', content: item.content, contentAm: item.contentAm || '', contentOm: item.contentOm || '', published: item.published } })}
                            className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition font-medium">{t.admin.editItem}</button>
                          <button onClick={() => { if (window.confirm(t.admin.confirmDeleteItemTitle)) handleDeleteAnn(item.id); }}
                            className="text-xs text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition font-medium">{t.admin.deleteItem}</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </>
    );
  }
  function AnnouncementsForm() {
    const d = annForm.data;
    return (
      <form onSubmit={handleSaveAnn} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 space-y-4 max-w-2xl">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">{annForm.editingId ? t.admin.editItem : t.admin.createItem} {t.admin.cmsAnnouncements}</h2>
          <button type="button" onClick={() => setAnnForm({ editing: false, editingId: null, data: { ...emptyAnnouncementForm } })}
            className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition">{t.admin.cancelEdit}</button>
        </div>
        <LangBar />
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">{t.admin.titleField}{formLang === 'en' ? ' *' : ''} <span className="text-slate-400 font-normal">({formLang === 'en' ? 'EN' : formLang === 'am' ? 'አማ' : 'OM'})</span></label>
          <input type="text" required={formLang === 'en'} value={formLang === 'en' ? d.title : formLang === 'am' ? (d.titleAm || '') : (d.titleOm || '')}
            onChange={(e) => { const v = e.target.value; setAnnForm((p) => ({ ...p, data: { ...p.data, ...(formLang === 'en' ? {title: v} : formLang === 'am' ? {titleAm: v} : {titleOm: v}) } })); }}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none bg-white dark:bg-slate-800" placeholder={formLang === 'en' ? '' : 'Optional'} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">{t.admin.summaryField}{formLang === 'en' ? ' *' : ''} <span className="text-slate-400 font-normal">({formLang === 'en' ? 'EN' : formLang === 'am' ? 'አማ' : 'OM'})</span></label>
          <textarea required={formLang === 'en'} value={formLang === 'en' ? d.description : formLang === 'am' ? (d.descriptionAm || '') : (d.descriptionOm || '')}
            onChange={(e) => { const v = e.target.value; setAnnForm((p) => ({ ...p, data: { ...p.data, ...(formLang === 'en' ? {description: v} : formLang === 'am' ? {descriptionAm: v} : {descriptionOm: v}) } })); }}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none bg-white dark:bg-slate-800" rows={2} placeholder={formLang === 'en' ? '' : 'Optional'} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">{t.admin.contentField}{formLang === 'en' ? ' *' : ''} <span className="text-slate-400 font-normal">({formLang === 'en' ? 'EN' : formLang === 'am' ? 'አማ' : 'OM'})</span></label>
          <textarea required={formLang === 'en'} value={formLang === 'en' ? d.content : formLang === 'am' ? (d.contentAm || '') : (d.contentOm || '')}
            onChange={(e) => { const v = e.target.value; setAnnForm((p) => ({ ...p, data: { ...p.data, ...(formLang === 'en' ? {content: v} : formLang === 'am' ? {contentAm: v} : {contentOm: v}) } })); }}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none font-mono bg-white dark:bg-slate-800" rows={8} placeholder={formLang === 'en' ? '' : 'Optional'} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">{t.admin.statusField}</label>
          <select value={d.published ? 'true' : 'false'} onChange={(e) => setAnnForm((p) => ({ ...p, data: { ...p.data, published: e.target.value === 'true' } }))}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none bg-white dark:bg-slate-800">
            <option value="true">{t.admin.publishedBadge}</option>
            <option value="false">{t.admin.draftBadge}</option>
          </select>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={annSubmitting}
            className="bg-slate-800 text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-slate-700 transition disabled:opacity-50 flex items-center gap-2">
            {annSubmitting && <Spinner className="w-4 h-4" />}
            {annSubmitting ? t.admin.saving : t.admin.saveItem}
          </button>
        </div>
      </form>
    );
  }

  // ====== Projects Tab ======
  function ProjectsTab() {
    if (projForm.editing) return ProjectsForm();
    return (
      <>
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-slate-500">{projects.length} project{projects.length !== 1 ? 's' : ''}</p>
          <button onClick={() => setProjForm({ editing: true, editingId: null, data: { ...emptyProjectForm } })}
            className="bg-slate-800 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-700 transition">{t.admin.createItem}</button>
        </div>
        {projects.length === 0 ? <p className="text-center text-slate-500 py-12">{t.admin.noItems}</p> : (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="bg-slate-50 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-600">
                  <th className="text-left p-4 font-semibold text-slate-600 dark:text-slate-400">{t.admin.nameField}</th>
                  <th className="text-left p-4 font-semibold text-slate-600 dark:text-slate-400">{t.admin.statusField}</th>
                  <th className="text-left p-4 font-semibold text-slate-600 dark:text-slate-400 hidden md:table-cell">{t.admin.budgetField}</th>
                  <th className="text-left p-4 font-semibold text-slate-600 dark:text-slate-400 hidden md:table-cell">Date</th>
                  <th className="text-right p-4 font-semibold text-slate-600 dark:text-slate-400">{t.admin.editItem}</th>
                </tr></thead>
                <tbody>
                  {projects.map((item) => (
                    <tr key={item.id} className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition">
                      <td className="p-4 font-medium text-slate-800 dark:text-white max-w-xs truncate">{item.name}</td>
                      <td className="p-4">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          item.status === 'completed' ? 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200' :
                          item.status === 'ongoing' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                          'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                        }`}>{item.status}</span>
                      </td>
                      <td className="p-4 text-slate-500 text-xs hidden md:table-cell dark:text-slate-400">{item.budget ? `ETB ${Number(item.budget).toLocaleString()}` : '-'}</td>
                      <td className="p-4 text-slate-400 text-xs hidden md:table-cell dark:text-slate-500">{new Date(item.createdAt).toLocaleDateString()}</td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => setProjForm({ editing: true, editingId: item.id, data: { name: item.name, nameAm: item.nameAm || '', nameOm: item.nameOm || '', description: item.description, descriptionAm: item.descriptionAm || '', descriptionOm: item.descriptionOm || '', budget: Number(item.budget) || 0, status: item.status, startDate: item.startDate || '', endDate: item.endDate || '', location: item.location || '', coverImage: item.coverImage || '', fundingSource: item.fundingSource || '', contractor: item.contractor || '', category: item.category || '' } })}
                            className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition font-medium">{t.admin.editItem}</button>
                          <button onClick={() => { if (window.confirm(t.admin.confirmDeleteItemTitle)) handleDeleteProject(item.id); }}
                            className="text-xs text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition font-medium">{t.admin.deleteItem}</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </>
    );
  }
  // ====== Projects Form ======
  function ProjectsForm() {
    const d = projForm.data;
    return (
      <form onSubmit={handleSaveProject} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 space-y-4 max-w-2xl">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">{projForm.editingId ? t.admin.editItem : t.admin.createItem} {t.admin.cmsProjects}</h2>
          <button type="button" onClick={() => setProjForm({ editing: false, editingId: null, data: { ...emptyProjectForm } })}
            className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition">{t.admin.cancelEdit}</button>
        </div>
        <LangBar />
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">{t.admin.nameField}{formLang === 'en' ? ' *' : ''} <span className="text-slate-400 font-normal">({formLang === 'en' ? 'EN' : formLang === 'am' ? 'አማ' : 'OM'})</span></label>
            <input type="text" required={formLang === 'en'} value={formLang === 'en' ? d.name : formLang === 'am' ? (d.nameAm || '') : (d.nameOm || '')}
              onChange={(e) => { const v = e.target.value; setProjForm((p) => ({ ...p, data: { ...p.data, ...(formLang === 'en' ? {name: v} : formLang === 'am' ? {nameAm: v} : {nameOm: v}) } })); }}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none bg-white dark:bg-slate-800" placeholder={formLang === 'en' ? '' : 'Optional'} />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">{t.admin.statusField}</label>
            <select value={d.status} onChange={(e) => setProjForm((p) => ({ ...p, data: { ...p.data, status: e.target.value } }))}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none bg-white dark:bg-slate-800">
              <option value="planned">Planned</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">{t.admin.descriptionField} <span className="text-slate-400 font-normal">({formLang === 'en' ? 'EN' : formLang === 'am' ? 'አማ' : 'OM'})</span></label>
            <textarea value={formLang === 'en' ? d.description : formLang === 'am' ? (d.descriptionAm || '') : (d.descriptionOm || '')}
              onChange={(e) => { const v = e.target.value; setProjForm((p) => ({ ...p, data: { ...p.data, ...(formLang === 'en' ? {description: v} : formLang === 'am' ? {descriptionAm: v} : {descriptionOm: v}) } })); }}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none bg-white dark:bg-slate-800" rows={3} placeholder={formLang === 'en' ? '' : 'Optional'} />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">{t.admin.budgetField}</label>
            <input type="number" value={d.budget} onChange={(e) => setProjForm((p) => ({ ...p, data: { ...p.data, budget: Number(e.target.value) } }))}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none bg-white dark:bg-slate-800" />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Location</label>
            <input type="text" value={d.location} onChange={(e) => setProjForm((p) => ({ ...p, data: { ...p.data, location: e.target.value } }))}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none bg-white dark:bg-slate-800" />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Start Date</label>
            <input type="date" value={d.startDate} onChange={(e) => setProjForm((p) => ({ ...p, data: { ...p.data, startDate: e.target.value } }))}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none bg-white dark:bg-slate-800" />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">End Date</label>
            <input type="date" value={d.endDate} onChange={(e) => setProjForm((p) => ({ ...p, data: { ...p.data, endDate: e.target.value } }))}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none bg-white dark:bg-slate-800" />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Funding Source</label>
            <input type="text" value={d.fundingSource} onChange={(e) => setProjForm((p) => ({ ...p, data: { ...p.data, fundingSource: e.target.value } }))}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none bg-white dark:bg-slate-800" />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Contractor</label>
            <input type="text" value={d.contractor} onChange={(e) => setProjForm((p) => ({ ...p, data: { ...p.data, contractor: e.target.value } }))}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none bg-white dark:bg-slate-800" />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Category</label>
            <input type="text" value={d.category} onChange={(e) => setProjForm((p) => ({ ...p, data: { ...p.data, category: e.target.value } }))}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none bg-white dark:bg-slate-800" />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Cover Image</label>
            <FileUpload existingUrl={d.coverImage} onUpload={(url) => setProjForm((p) => ({ ...p, data: { ...p.data, coverImage: url } }))} label="Upload Cover Image" />
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={projSubmitting}
            className="bg-slate-800 text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-slate-700 transition disabled:opacity-50 flex items-center gap-2">
            {projSubmitting && <Spinner className="w-4 h-4" />}
            {projSubmitting ? t.admin.saving : t.admin.saveItem}
          </button>
        </div>
      </form>
    );
  }

  // ====== Departments Tab ======
  function DepartmentsTab() {
    if (deptForm.editing) return DepartmentsForm();
    return (
      <>
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-slate-500">{departments.length} department{departments.length !== 1 ? 's' : ''}</p>
          <button onClick={() => setDeptForm({ editing: true, editingId: null, data: { ...emptyDeptForm } })}
            className="bg-slate-800 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-700 transition">{t.admin.createItem}</button>
        </div>
        {departments.length === 0 ? <p className="text-center text-slate-500 py-12">{t.admin.noItems}</p> : (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="bg-slate-50 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-600">
                  <th className="text-left p-4 font-semibold text-slate-600 dark:text-slate-400">{t.admin.nameField}</th>
                  <th className="text-left p-4 font-semibold text-slate-600 dark:text-slate-400">Head</th>
                  <th className="text-left p-4 font-semibold text-slate-600 dark:text-slate-400 hidden md:table-cell">Contact</th>
                  <th className="text-left p-4 font-semibold text-slate-600 dark:text-slate-400 hidden md:table-cell">{t.admin.dateField}</th>
                  <th className="text-right p-4 font-semibold text-slate-600 dark:text-slate-400">{t.admin.editItem}</th>
                </tr></thead>
                <tbody>
                  {departments.map((item) => (
                    <tr key={item.id} className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition">
                      <td className="p-4 font-medium text-slate-800 dark:text-white max-w-xs truncate">{item.name}</td>
                      <td className="p-4 text-sm text-slate-600 dark:text-slate-400">{item.head || '-'}</td>
                      <td className="p-4 text-xs text-slate-500 hidden md:table-cell dark:text-slate-400">{item.email || item.phone || '-'}</td>
                      <td className="p-4 text-slate-400 text-xs hidden md:table-cell dark:text-slate-500">{new Date(item.createdAt).toLocaleDateString()}</td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => setDeptForm({ editing: true, editingId: item.id, data: { name: item.name, nameAm: item.nameAm || '', nameOm: item.nameOm || '', description: item.description, descriptionAm: item.descriptionAm || '', descriptionOm: item.descriptionOm || '', head: item.head || '', phone: item.phone || '', email: item.email || '', office: item.office || '', image: item.image || '' } })}
                            className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition font-medium">{t.admin.editItem}</button>
                          <button onClick={() => { if (window.confirm(t.admin.confirmDeleteItemTitle)) handleDeleteDept(item.id); }}
                            className="text-xs text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition font-medium">{t.admin.deleteItem}</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </>
    );
  }
  function DepartmentsForm() {
    const d = deptForm.data;
    return (
      <form onSubmit={handleSaveDept} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 space-y-4 max-w-2xl">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">{deptForm.editingId ? t.admin.editItem : t.admin.createItem} {t.admin.cmsDepartments}</h2>
          <button type="button" onClick={() => setDeptForm({ editing: false, editingId: null, data: { ...emptyDeptForm } })}
            className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition">{t.admin.cancelEdit}</button>
        </div>
        <LangBar />
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">{t.admin.nameField}{formLang === 'en' ? ' *' : ''} <span className="text-slate-400 font-normal">({formLang === 'en' ? 'EN' : formLang === 'am' ? 'አማ' : 'OM'})</span></label>
            <input type="text" required={formLang === 'en'} value={formLang === 'en' ? d.name : formLang === 'am' ? (d.nameAm || '') : (d.nameOm || '')}
              onChange={(e) => { const v = e.target.value; setDeptForm((p) => ({ ...p, data: { ...p.data, ...(formLang === 'en' ? {name: v} : formLang === 'am' ? {nameAm: v} : {nameOm: v}) } })); }}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none bg-white dark:bg-slate-800" placeholder={formLang === 'en' ? '' : 'Optional'} />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Head</label>
            <input type="text" value={d.head} onChange={(e) => setDeptForm((p) => ({ ...p, data: { ...p.data, head: e.target.value } }))}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none bg-white dark:bg-slate-800" />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">{t.admin.descriptionField} <span className="text-slate-400 font-normal">({formLang === 'en' ? 'EN' : formLang === 'am' ? 'አማ' : 'OM'})</span></label>
            <textarea value={formLang === 'en' ? d.description : formLang === 'am' ? (d.descriptionAm || '') : (d.descriptionOm || '')}
              onChange={(e) => { const v = e.target.value; setDeptForm((p) => ({ ...p, data: { ...p.data, ...(formLang === 'en' ? {description: v} : formLang === 'am' ? {descriptionAm: v} : {descriptionOm: v}) } })); }}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none bg-white dark:bg-slate-800" rows={3} placeholder={formLang === 'en' ? '' : 'Optional'} />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Phone</label>
            <input type="text" value={d.phone} onChange={(e) => setDeptForm((p) => ({ ...p, data: { ...p.data, phone: e.target.value } }))}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none bg-white dark:bg-slate-800" />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Email</label>
            <input type="email" value={d.email} onChange={(e) => setDeptForm((p) => ({ ...p, data: { ...p.data, email: e.target.value } }))}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none bg-white dark:bg-slate-800" />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Office</label>
            <input type="text" value={d.office} onChange={(e) => setDeptForm((p) => ({ ...p, data: { ...p.data, office: e.target.value } }))}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none bg-white dark:bg-slate-800" />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Image</label>
            <FileUpload existingUrl={d.image} onUpload={(url) => setDeptForm((p) => ({ ...p, data: { ...p.data, image: url } }))} label="Upload Image" />
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={deptSubmitting}
            className="bg-slate-800 text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-slate-700 transition disabled:opacity-50 flex items-center gap-2">
            {deptSubmitting && <Spinner className="w-4 h-4" />}
            {deptSubmitting ? t.admin.saving : t.admin.saveItem}
          </button>
        </div>
      </form>
    );
  }

  // ====== Investments Tab ======
  function InvestmentsTab() {
    if (invForm.editing) return InvestmentsForm();
    return (
      <>
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-slate-500">{investments.length} investment{investments.length !== 1 ? 's' : ''}</p>
          <button onClick={() => setInvForm({ editing: true, editingId: null, data: { ...emptyInvestmentForm } })}
            className="bg-slate-800 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-700 transition">{t.admin.createItem}</button>
        </div>
        {investments.length === 0 ? <p className="text-center text-slate-500 py-12">{t.admin.noItems}</p> : (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="bg-slate-50 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-600">
                  <th className="text-left p-4 font-semibold text-slate-600 dark:text-slate-400">{t.admin.titleField}</th>
                  <th className="text-left p-4 font-semibold text-slate-600 dark:text-slate-400">{t.admin.statusField}</th>
                  <th className="text-left p-4 font-semibold text-slate-600 dark:text-slate-400 hidden md:table-cell">Category</th>
                  <th className="text-left p-4 font-semibold text-slate-600 dark:text-slate-400 hidden md:table-cell">{t.admin.dateField}</th>
                  <th className="text-right p-4 font-semibold text-slate-600 dark:text-slate-400">{t.admin.editItem}</th>
                </tr></thead>
                <tbody>
                  {investments.map((item) => (
                    <tr key={item.id} className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition">
                      <td className="p-4 font-medium text-slate-800 dark:text-white max-w-xs truncate">{item.title}</td>
                      <td className="p-4"><button onClick={() => handleToggleInvestment(item)} className="hover:opacity-80">{badge(item.published)}</button></td>
                      <td className="p-4 text-xs text-slate-500 hidden md:table-cell dark:text-slate-400">{item.category}</td>
                      <td className="p-4 text-slate-400 text-xs hidden md:table-cell dark:text-slate-500">{new Date(item.createdAt).toLocaleDateString()}</td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => setInvForm({ editing: true, editingId: item.id, data: { title: item.title, titleAm: item.titleAm || '', titleOm: item.titleOm || '', description: item.description, descriptionAm: item.descriptionAm || '', descriptionOm: item.descriptionOm || '', content: item.content, contentAm: item.contentAm || '', contentOm: item.contentOm || '', category: item.category, coverImage: item.coverImage || '', location: item.location || '', contactPhone: item.contactPhone || '', contactEmail: item.contactEmail || '', published: item.published } })}
                            className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition font-medium">{t.admin.editItem}</button>
                          <button onClick={() => { if (window.confirm(t.admin.confirmDeleteItemTitle)) handleDeleteInvestment(item.id); }}
                            className="text-xs text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition font-medium">{t.admin.deleteItem}</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </>
    );
  }
  function InvestmentsForm() {
    const d = invForm.data;
    return (
      <form onSubmit={handleSaveInvestment} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 space-y-4 max-w-2xl">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">{invForm.editingId ? t.admin.editItem : t.admin.createItem} {t.admin.cmsInvestments}</h2>
          <button type="button" onClick={() => setInvForm({ editing: false, editingId: null, data: { ...emptyInvestmentForm } })}
            className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition">{t.admin.cancelEdit}</button>
        </div>
        <LangBar />
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">{t.admin.titleField}{formLang === 'en' ? ' *' : ''} <span className="text-slate-400 font-normal">({formLang === 'en' ? 'EN' : formLang === 'am' ? 'አማ' : 'OM'})</span></label>
            <input type="text" required={formLang === 'en'} value={formLang === 'en' ? d.title : formLang === 'am' ? (d.titleAm || '') : (d.titleOm || '')}
              onChange={(e) => { const v = e.target.value; setInvForm((p) => ({ ...p, data: { ...p.data, ...(formLang === 'en' ? {title: v} : formLang === 'am' ? {titleAm: v} : {titleOm: v}) } })); }}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none bg-white dark:bg-slate-800" placeholder={formLang === 'en' ? '' : 'Optional'} />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Category</label>
            <select value={d.category} onChange={(e) => setInvForm((p) => ({ ...p, data: { ...p.data, category: e.target.value } }))}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none bg-white dark:bg-slate-800">
              <option value="opportunity">Opportunity</option>
              <option value="attraction">Attraction</option>
              <option value="incentive">Incentive</option>
              <option value="accommodation">Accommodation</option>
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">{t.admin.summaryField} <span className="text-slate-400 font-normal">({formLang === 'en' ? 'EN' : formLang === 'am' ? 'አማ' : 'OM'})</span></label>
            <textarea value={formLang === 'en' ? d.description : formLang === 'am' ? (d.descriptionAm || '') : (d.descriptionOm || '')}
              onChange={(e) => { const v = e.target.value; setInvForm((p) => ({ ...p, data: { ...p.data, ...(formLang === 'en' ? {description: v} : formLang === 'am' ? {descriptionAm: v} : {descriptionOm: v}) } })); }}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none bg-white dark:bg-slate-800" rows={2} placeholder={formLang === 'en' ? '' : 'Optional'} />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">{t.admin.contentField} <span className="text-slate-400 font-normal">({formLang === 'en' ? 'EN' : formLang === 'am' ? 'አማ' : 'OM'})</span></label>
            <textarea value={formLang === 'en' ? d.content : formLang === 'am' ? (d.contentAm || '') : (d.contentOm || '')}
              onChange={(e) => { const v = e.target.value; setInvForm((p) => ({ ...p, data: { ...p.data, ...(formLang === 'en' ? {content: v} : formLang === 'am' ? {contentAm: v} : {contentOm: v}) } })); }}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none font-mono bg-white dark:bg-slate-800" rows={6} placeholder={formLang === 'en' ? '' : 'Optional'} />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Location</label>
            <input type="text" value={d.location} onChange={(e) => setInvForm((p) => ({ ...p, data: { ...p.data, location: e.target.value } }))}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none bg-white dark:bg-slate-800" />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Cover Image</label>
            <FileUpload existingUrl={d.coverImage} onUpload={(url) => setInvForm((p) => ({ ...p, data: { ...p.data, coverImage: url } }))} label="Upload Image" />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Contact Phone</label>
            <input type="text" value={d.contactPhone} onChange={(e) => setInvForm((p) => ({ ...p, data: { ...p.data, contactPhone: e.target.value } }))}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none bg-white dark:bg-slate-800" />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Contact Email</label>
            <input type="email" value={d.contactEmail} onChange={(e) => setInvForm((p) => ({ ...p, data: { ...p.data, contactEmail: e.target.value } }))}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none bg-white dark:bg-slate-800" />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">{t.admin.statusField}</label>
            <select value={d.published ? 'true' : 'false'} onChange={(e) => setInvForm((p) => ({ ...p, data: { ...p.data, published: e.target.value === 'true' } }))}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none bg-white dark:bg-slate-800">
              <option value="true">{t.admin.publishedBadge}</option>
              <option value="false">{t.admin.draftBadge}</option>
            </select>
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={invSubmitting}
            className="bg-slate-800 text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-slate-700 transition disabled:opacity-50 flex items-center gap-2">
            {invSubmitting && <Spinner className="w-4 h-4" />}
            {invSubmitting ? t.admin.saving : t.admin.saveItem}
          </button>
        </div>
      </form>
    );
  }

  // ====== Hero Slides Tab ======
  function HeroSlidesTab() {
    if (slideForm.editing) return HeroSlidesForm();
    return (
      <>
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-slate-500">{heroSlides.length} slide{heroSlides.length !== 1 ? 's' : ''}</p>
          <button onClick={() => setSlideForm({ editing: true, editingId: null, data: { imageUrl: '', description: '', sortOrder: heroSlides.length, isActive: true } })}
            className="bg-slate-800 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-700 transition">{t.admin.createItem}</button>
        </div>
        {heroSlides.length === 0 ? <p className="text-center text-slate-500 py-12">{t.admin.noItems}</p> : (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="bg-slate-50 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-600">
                  <th className="text-left p-4 font-semibold text-slate-600 dark:text-slate-400">Image</th>
                  <th className="text-left p-4 font-semibold text-slate-600 dark:text-slate-400">Description</th>
                  <th className="text-left p-4 font-semibold text-slate-600 dark:text-slate-400">Order</th>
                  <th className="text-left p-4 font-semibold text-slate-600 dark:text-slate-400">Active</th>
                  <th className="text-right p-4 font-semibold text-slate-600 dark:text-slate-400">{t.admin.editItem}</th>
                </tr></thead>
                <tbody>
                  {heroSlides.map((item) => (
                    <tr key={item.id} className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition">
                      <td className="p-4">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt="" className="w-16 h-10 object-cover rounded border border-slate-200 dark:border-slate-600" />
                        ) : (
                          <span className="text-xs text-slate-400">No image</span>
                        )}
                      </td>
                      <td className="p-4 text-sm text-slate-700 dark:text-slate-300 max-w-xs truncate">{item.description || '-'}</td>
                      <td className="p-4 text-xs text-slate-500 dark:text-slate-400">{item.sortOrder}</td>
                      <td className="p-4">{badge(item.isActive)}</td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => setSlideForm({ editing: true, editingId: item.id, data: { imageUrl: item.imageUrl || '', description: item.description || '', sortOrder: item.sortOrder, isActive: item.isActive } })}
                            className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition font-medium">{t.admin.editItem}</button>
                          <button onClick={() => { if (window.confirm(t.admin.confirmDeleteItemTitle)) handleDeleteSlide(item.id); }}
                            className="text-xs text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition font-medium">{t.admin.deleteItem}</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </>
    );
  }
  function HeroSlidesForm() {
    const d = slideForm.data;
    return (
      <form onSubmit={handleSaveSlide} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 space-y-4 max-w-2xl">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">{slideForm.editingId ? t.admin.editItem : t.admin.createItem} {t.admin.cmsHeroSlides}</h2>
          <button type="button" onClick={() => setSlideForm({ editing: false, editingId: null, data: { imageUrl: '', description: '', sortOrder: 0, isActive: true } })}
            className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition">{t.admin.cancelEdit}</button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Image URL</label>
            <FileUpload existingUrl={d.imageUrl} onUpload={(url) => setSlideForm((p) => ({ ...p, data: { ...p.data, imageUrl: url } }))} label="Upload Slide Image" />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Description</label>
            <textarea value={d.description} onChange={(e) => setSlideForm((p) => ({ ...p, data: { ...p.data, description: e.target.value } }))}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none bg-white dark:bg-slate-800" rows={2} />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Sort Order</label>
            <input type="number" value={d.sortOrder} onChange={(e) => setSlideForm((p) => ({ ...p, data: { ...p.data, sortOrder: Number(e.target.value) } }))}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none bg-white dark:bg-slate-800" />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Active</label>
            <select value={d.isActive ? 'true' : 'false'} onChange={(e) => setSlideForm((p) => ({ ...p, data: { ...p.data, isActive: e.target.value === 'true' } }))}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none bg-white dark:bg-slate-800">
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={slideSubmitting}
            className="bg-slate-800 text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-slate-700 transition disabled:opacity-50 flex items-center gap-2">
            {slideSubmitting && <Spinner className="w-4 h-4" />}
            {slideSubmitting ? t.admin.saving : t.admin.saveItem}
          </button>
        </div>
      </form>
    );
  }

  // ====== Settings Tab ======
  function SettingsTab() {
    return (
      <form onSubmit={handleSaveSettings} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 space-y-5 max-w-2xl">
        <div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-1">{t.admin.cmsSettings}</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Manage site-wide labels and text</p>
        </div>
        {Object.entries(settingsForm).map(([key, value]) => (
          <div key={key}>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">{key.replace(/_/g, ' ')}</label>
            <input type="text" value={value} onChange={(e) => setSettingsForm((p) => ({ ...p, [key]: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none bg-white dark:bg-slate-800" />
          </div>
        ))}
        <div className="pt-2">
          <button type="submit" disabled={settingsSaving}
            className="bg-slate-800 text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-slate-700 transition disabled:opacity-50 flex items-center gap-2">
            {settingsSaving && <Spinner className="w-4 h-4" />}
            {settingsSaving ? t.admin.saving : t.admin.saveAllSettings}
          </button>
        </div>
      </form>
    );
  }

  // ====== Admins Tab ======
  function AdminsTab() {
    return (
      <>
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-slate-500">{admins.length} admin{admins.length !== 1 ? 's' : ''}</p>
          <button onClick={() => setShowAdminModal(true)}
            className="bg-slate-800 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-700 transition">{t.admin.addAdmin}</button>
        </div>
        {admins.length === 0 ? <p className="text-center text-slate-500 py-12">{t.admin.noItems}</p> : (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="bg-slate-50 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-600">
                  <th className="text-left p-4 font-semibold text-slate-600 dark:text-slate-400">{t.admin.fullNameLabel}</th>
                  <th className="text-left p-4 font-semibold text-slate-600 dark:text-slate-400">{t.admin.email}</th>
                  <th className="text-left p-4 font-semibold text-slate-600 dark:text-slate-400 hidden md:table-cell">Status</th>
                  <th className="text-left p-4 font-semibold text-slate-600 dark:text-slate-400 hidden md:table-cell">{t.admin.dateField}</th>
                  <th className="text-right p-4 font-semibold text-slate-600 dark:text-slate-400">{t.admin.editItem}</th>
                </tr></thead>
                <tbody>
                  {admins.map((item) => (
                    <tr key={item.id} className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition">
                      <td className="p-4 font-medium text-slate-800 dark:text-white">{item.fullName}</td>
                      <td className="p-4 text-sm text-slate-600 dark:text-slate-400">{item.email}</td>
                      <td className="p-4 hidden md:table-cell">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${item.isActive ? 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200' : 'bg-slate-100 text-slate-400 dark:bg-slate-700 dark:text-slate-500'}`}>
                          {item.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="p-4 text-slate-400 text-xs hidden md:table-cell dark:text-slate-500">{new Date(item.createdAt).toLocaleDateString()}</td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => handleToggleActive(item)} disabled={togglingId === item.id}
                            className="text-xs text-amber-600 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-300 transition font-medium disabled:opacity-50">
                            {togglingId === item.id ? '...' : item.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                          <button onClick={() => { if (window.confirm(t.admin.confirmDeleteItemTitle || 'Delete this admin?')) handleDeleteAdmin(item.id); }}
                            className="text-xs text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition font-medium">{t.admin.deleteItem}</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </>
    );
  }
}