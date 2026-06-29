'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from '@/context/LocaleContext';
import FileUpload from '@/component/FileUpload';
import {
  contactAdminApi, adminApi, newsApi, announcementsApi, projectsApi, departmentsApi, documentsApi, investmentsApi,
  heroSlidesApi, settingsApi,
  type ContactMessage, type AdminUser, type NewsArticle, type Announcement, type Project, type Department, type Document, type Investment,
  type HeroSlide, type SiteSetting,
} from '@/lib/api';

type Tab = 'messages' | 'news' | 'announcements' | 'projects' | 'departments' | 'documents' | 'investments' | 'admins' | 'hero-slides' | 'settings';

interface CmsFormState<T> {
  editing: boolean;
  editingId: number | null;
  data: T;
}

const emptyNewsForm = { title: '', slug: '', summary: '', content: '', coverImage: '', published: true };
const emptyAnnouncementForm = { title: '', description: '', content: '', published: true };
const emptyProjectForm = { name: '', description: '', budget: 0, status: 'planned', startDate: '', endDate: '', location: '', coverImage: '', fundingSource: '', contractor: '', category: '' };
const emptyDeptForm = { name: '', description: '', head: '', phone: '', email: '', office: '', image: '' };
const emptyDocForm = { title: '', description: '', fileUrl: '', category: '' };
const emptyInvestmentForm = { title: '', description: '', content: '', category: 'opportunity', coverImage: '', location: '', contactPhone: '', contactEmail: '', published: true };

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
  const [documents, setDocuments] = useState<Document[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>('messages');

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

  // Documents CMS
  const [docForm, setDocForm] = useState<CmsFormState<typeof emptyDocForm>>({ editing: false, editingId: null, data: { ...emptyDocForm } });
  const [docSubmitting, setDocSubmitting] = useState(false);

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
      documentsApi.getAll(),
      investmentsApi.getAll(),
      heroSlidesApi.getAll(),
      settingsApi.getAll(),
    ])
      .then(([msgs, adms, n, a, p, d, docs, i, slides, sets]) => {
        setMessages(msgs); setAdmins(adms); setNews(n); setAnnouncements(a); setProjects(p); setDepartments(d); setDocuments(docs); setInvestments(i);
        setHeroSlides(slides); setSiteSettings(sets);
        // Build settings form from fetched data
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

  // Messages
  const handleMarkRead = async (id: number) => {
    if (!token) return;
    try { await contactAdminApi.markRead(token, id); setMessages((p) => p.map((m) => (m.id === id ? { ...m, isRead: true } : m))); } catch {}
  };
  const handleDeleteMsg = async (id: number) => {
    if (!token) return;
    try { await contactAdminApi.delete(token, id); setMessages((p) => p.filter((m) => m.id !== id)); } catch {}
  };

  // News CRUD
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

  // Announcements CRUD
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

  // Projects CRUD
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

  // Departments CRUD
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

  // Documents CRUD
  const handleSaveDoc = async (e: React.FormEvent) => {
    e.preventDefault(); if (!token) return;
    setDocSubmitting(true);
    try {
      if (docForm.editingId) {
        const updated = await documentsApi.update(token, docForm.editingId, docForm.data);
        setDocuments((p) => p.map((d) => (d.id === docForm.editingId ? updated : d)));
      } else {
        const created = await documentsApi.create(token, docForm.data);
        setDocuments((p) => [created, ...p]);
      }
      setDocForm({ editing: false, editingId: null, data: { ...emptyDocForm } });
    } catch {} finally { setDocSubmitting(false); }
  };
  const handleDeleteDoc = async (id: number) => {
    if (!token) return;
    try { await documentsApi.remove(token, id); setDocuments((p) => p.filter((d) => d.id !== id)); } catch {}
  };

  // Investment CRUD
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

  // Hero Slides CRUD
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

  // Settings CRUD
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

  // Admin CRUD
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
          <button onClick={() => setTab('documents')} className={tabClasses('documents')}>{t.admin.cmsDocuments} ({documents.length})</button>
          <button onClick={() => setTab('investments')} className={tabClasses('investments')}>{t.admin.cmsInvestments} ({investments.length})</button>
          <button onClick={() => setTab('admins')} className={tabClasses('admins')}>{t.admin.admins} ({admins.length})</button>
          <button onClick={() => setTab('hero-slides')} className={tabClasses('hero-slides')}>{t.admin.cmsHeroSlides} ({heroSlides.length})</button>
          <button onClick={() => setTab('settings')} className={tabClasses('settings')}>{t.admin.cmsSettings}</button>
        </div>

        {loading ? (
          <div className="animate-pulse space-y-4">
            {[1,2,3].map((i) => (                <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-2" /><div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : tab === 'messages' ? <MessagesTab /> :
          tab === 'news' ? <NewsTab /> :
          tab === 'announcements' ? <AnnouncementsTab /> :
          tab === 'projects' ? <ProjectsTab /> :
          tab === 'departments' ? <DepartmentsTab /> :
          tab === 'documents' ? <DocumentsTab /> :
          tab === 'investments' ? <InvestmentsTab /> :
          tab === 'hero-slides' ? <HeroSlidesTab /> :
          tab === 'settings' ? <SettingsTab /> :
          <AdminsTab />}
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
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-slate-800 rounded-lg hover:bg-slate-700 transition disabled:opacity-50">
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
        <div className="flex gap-2 mb-4">
          {(['all', 'unread', 'read'] as const).map((f) => (
            <button key={f} onClick={() => setMsgFilter(f)}
              className={`text-xs px-3 py-1.5 rounded-full transition font-medium ${msgFilter === f ? 'bg-gray-800 text-white' : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-200'}`}>
              {f === 'all' ? t.admin.allMessages : f === 'unread' ? `${t.admin.unread} (${unreadCount})` : t.admin.read}
            </button>
          ))}
        </div>
        {filteredMessages.length === 0 ? (
          <p className="text-center text-gray-500 py-12">{t.admin.noMessages}</p>
        ) : (
          <div className="space-y-3">
            {filteredMessages.map((msg) => (
              <div key={msg.id} className={`bg-white rounded-xl shadow-sm border transition ${msg.isRead ? 'border-gray-100' : 'border-l-4 border-l-green-500 border-gray-200'}`}>
                <button onClick={() => setExpandedMsg(expandedMsg === msg.id ? null : msg.id)} className="w-full text-left p-5">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        {!msg.isRead && <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />}
                        <h3 className="font-semibold text-gray-900 truncate">{msg.subject}</h3>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{msg.name} &lt;{msg.email}&gt;</p>
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap ml-4">{new Date(msg.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  {expandedMsg === msg.id && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-sm text-gray-600 whitespace-pre-wrap">{msg.message}</p>
                      <div className="flex gap-2 mt-4">
                        {!msg.isRead && <button onClick={(e) => { e.stopPropagation(); handleMarkRead(msg.id); }}
                          className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition font-medium">{t.admin.markRead}</button>}
                        <button onClick={(e) => { e.stopPropagation(); handleDeleteMsg(msg.id); }}
                          className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition font-medium">{t.admin.delete}</button>
                      </div>
                    </div>
                  )}
                  {expandedMsg !== msg.id && <p className="text-sm text-gray-400 mt-1 truncate">{msg.message}</p>}
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
    if (newsForm.editing) return <NewsForm />;
    return (
      <>
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-gray-500">{news.length} article{news.length !== 1 ? 's' : ''}</p>
          <button onClick={() => setNewsForm({ editing: true, editingId: null, data: { ...emptyNewsForm } })}
            className="bg-slate-800 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-700 transition">{t.admin.createItem}</button>
        </div>
        {news.length === 0 ? <p className="text-center text-gray-500 py-12">{t.admin.noItems}</p> : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left p-4 font-semibold text-gray-600">{t.admin.titleField}</th>
                <th className="text-left p-4 font-semibold text-gray-600">{t.admin.statusField}</th>
                <th className="text-left p-4 font-semibold text-gray-600 hidden md:table-cell">{t.admin.authorField}</th>
                <th className="text-left p-4 font-semibold text-gray-600 hidden md:table-cell">{t.admin.dateField}</th>
                <th className="text-right p-4 font-semibold text-gray-600">{t.admin.editItem}</th>
              </tr></thead>
              <tbody>
                {news.map((item) => (
                  <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                    <td className="p-4 font-medium text-gray-900 max-w-xs truncate">{item.title}</td>
                    <td className="p-4">
                      <button onClick={() => handleToggleNews(item)} className="hover:opacity-80">{badge(item.published)}</button>
                    </td>
                    <td className="p-4 text-gray-500 text-xs hidden md:table-cell">{item.createdBy?.fullName}</td>
                    <td className="p-4 text-gray-400 text-xs hidden md:table-cell">{new Date(item.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => setNewsForm({ editing: true, editingId: item.id, data: { title: item.title, slug: item.slug, summary: item.summary, content: item.content, coverImage: item.coverImage || '', published: item.published } })}
                          className="text-xs text-blue-600 hover:text-blue-800 transition font-medium">{t.admin.editItem}</button>
                        <button onClick={() => { if (window.confirm(t.admin.confirmDeleteItemTitle)) handleDeleteNews(item.id); }}
                          className="text-xs text-red-500 hover:text-red-700 transition font-medium">{t.admin.deleteItem}</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </>
    );
  }
  function NewsForm() {
    const d = newsForm.data;
    return (
      <form onSubmit={handleSaveNews} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4 max-w-2xl">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-bold text-gray-900">{newsForm.editingId ? t.admin.editItem : t.admin.createItem} {t.admin.cmsNews}</h2>
          <button type="button" onClick={() => setNewsForm({ editing: false, editingId: null, data: { ...emptyNewsForm } })}
            className="text-sm text-gray-500 hover:text-gray-700 transition">{t.admin.cancelEdit}</button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 sm:col-span-1">                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">{t.admin.titleField} *</label>
            <input type="text" required value={d.title} onChange={(e) => setNewsForm((p) => ({ ...p, data: { ...p.data, title: e.target.value } }))}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none bg-white dark:bg-slate-800" />
          </div>
          <div className="col-span-2 sm:col-span-1">                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">{t.admin.slugField}</label>
            <input type="text" value={d.slug} onChange={(e) => setNewsForm((p) => ({ ...p, data: { ...p.data, slug: e.target.value } }))}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none bg-white dark:bg-slate-800" placeholder="Auto-generated from title if empty" />
          </div>
          <div className="col-span-2">                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">{t.admin.summaryField} *</label>
            <textarea required value={d.summary} onChange={(e) => setNewsForm((p) => ({ ...p, data: { ...p.data, summary: e.target.value } }))}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none bg-white dark:bg-slate-800" rows={2} />
          </div>
          <div className="col-span-2">                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">{t.admin.contentField} *</label>
            <textarea required value={d.content} onChange={(e) => setNewsForm((p) => ({ ...p, data: { ...p.data, content: e.target.value } }))}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none font-mono bg-white dark:bg-slate-800" rows={8} />
          </div>
          <div className="col-span-2 sm:col-span-1">                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">{t.admin.coverImageField}</label>
            <FileUpload
              existingUrl={d.coverImage}
              onUpload={(url) => setNewsForm((p) => ({ ...p, data: { ...p.data, coverImage: url } }))}
              label="Upload Cover Image"
            />
          </div>
          <div className="col-span-2 sm:col-span-1">                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">{t.admin.statusField}</label>
            <select value={d.published ? 'true' : 'false'} onChange={(e) => setNewsForm((p) => ({ ...p, data: { ...p.data, published: e.target.value === 'true' } }))}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none bg-white dark:bg-slate-800">
              <option value="true">{t.admin.publishedBadge}</option>
              <option value="false">{t.admin.draftBadge}</option>
            </select>
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={newsSubmitting}
            className="bg-slate-800 text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-slate-700 transition disabled:opacity-50">
            {newsSubmitting ? t.admin.saving : t.admin.saveItem}
          </button>
        </div>
      </form>
    );
  }

  // ====== Announcements Tab ======
  function AnnouncementsTab() {
    if (annForm.editing) return <AnnouncementsForm />;
    return (
      <>
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-gray-500">{announcements.length} announcement{announcements.length !== 1 ? 's' : ''}</p>
          <button onClick={() => setAnnForm({ editing: true, editingId: null, data: { ...emptyAnnouncementForm } })}
            className="bg-slate-800 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-700 transition">{t.admin.createItem}</button>
        </div>
        {announcements.length === 0 ? <p className="text-center text-gray-500 py-12">{t.admin.noItems}</p> : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left p-4 font-semibold text-gray-600">{t.admin.titleField}</th>
                <th className="text-left p-4 font-semibold text-gray-600">{t.admin.statusField}</th>
                <th className="text-left p-4 font-semibold text-gray-600 hidden md:table-cell">{t.admin.authorField}</th>
                <th className="text-left p-4 font-semibold text-gray-600 hidden md:table-cell">{t.admin.dateField}</th>
                <th className="text-right p-4 font-semibold text-gray-600">{t.admin.editItem}</th>
              </tr></thead>
              <tbody>
                {announcements.map((item) => (
                  <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                    <td className="p-4 font-medium text-gray-900 max-w-xs truncate">{item.title}</td>
                    <td className="p-4">
                      <button onClick={() => handleToggleAnn(item)} className="hover:opacity-80">{badge(item.published)}</button>
                    </td>
                    <td className="p-4 text-gray-500 text-xs hidden md:table-cell">{item.createdBy?.fullName}</td>
                    <td className="p-4 text-gray-400 text-xs hidden md:table-cell">{new Date(item.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => setAnnForm({ editing: true, editingId: item.id, data: { title: item.title, description: item.description, content: item.content, published: item.published } })}
                          className="text-xs text-blue-600 hover:text-blue-800 transition font-medium">{t.admin.editItem}</button>
                        <button onClick={() => { if (window.confirm(t.admin.confirmDeleteItemTitle)) handleDeleteAnn(item.id); }}
                          className="text-xs text-red-500 hover:text-red-700 transition font-medium">{t.admin.deleteItem}</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </>
    );
  }
  function AnnouncementsForm() {
    const d = annForm.data;
    return (
      <form onSubmit={handleSaveAnn} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4 max-w-2xl">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-bold text-gray-900">{annForm.editingId ? t.admin.editItem : t.admin.createItem} {t.admin.cmsAnnouncements}</h2>
          <button type="button" onClick={() => setAnnForm({ editing: false, editingId: null, data: { ...emptyAnnouncementForm } })}
            className="text-sm text-gray-500 hover:text-gray-700 transition">{t.admin.cancelEdit}</button>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">{t.admin.titleField} *</label>
          <input type="text" required value={d.title} onChange={(e) => setAnnForm((p) => ({ ...p, data: { ...p.data, title: e.target.value } }))}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none bg-white dark:bg-slate-800" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">{t.admin.summaryField} *</label>
          <textarea required value={d.description} onChange={(e) => setAnnForm((p) => ({ ...p, data: { ...p.data, description: e.target.value } }))}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none bg-white dark:bg-slate-800" rows={2} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">{t.admin.contentField} *</label>
          <textarea required value={d.content} onChange={(e) => setAnnForm((p) => ({ ...p, data: { ...p.data, content: e.target.value } }))}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none font-mono bg-white dark:bg-slate-800" rows={8} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">{t.admin.statusField}</label>
          <select value={d.published ? 'true' : 'false'} onChange={(e) => setAnnForm((p) => ({ ...p, data: { ...p.data, published: e.target.value === 'true' } }))}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none bg-white dark:bg-slate-800">
            <option value="true">{t.admin.publishedBadge}</option>
            <option value="false">{t.admin.draftBadge}</option>
          </select>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={annSubmitting}
            className="bg-slate-800 text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-slate-700 transition disabled:opacity-50">
            {annSubmitting ? t.admin.saving : t.admin.saveItem}
          </button>
        </div>
      </form>
    );
  }

  // ====== Projects Tab ======
  function ProjectsTab() {
    if (projForm.editing) return <ProjectsForm />;
    return (
      <>
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-gray-500">{projects.length} project{projects.length !== 1 ? 's' : ''}</p>
          <button onClick={() => setProjForm({ editing: true, editingId: null, data: { ...emptyProjectForm } })}
            className="bg-slate-800 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-700 transition">{t.admin.createItem}</button>
        </div>
        {projects.length === 0 ? <p className="text-center text-gray-500 py-12">{t.admin.noItems}</p> : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left p-4 font-semibold text-gray-600">{t.admin.nameField}</th>
                <th className="text-left p-4 font-semibold text-gray-600">{t.admin.statusField}</th>
                <th className="text-left p-4 font-semibold text-gray-600 hidden md:table-cell">{t.admin.budgetField}</th>
                <th className="text-left p-4 font-semibold text-gray-600 hidden md:table-cell">Date</th>
                <th className="text-right p-4 font-semibold text-gray-600">{t.admin.editItem}</th>
              </tr></thead>
              <tbody>
                {projects.map((item) => (
                  <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                    <td className="p-4 font-medium text-gray-900 max-w-xs truncate">{item.name}</td>
                    <td className="p-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        item.status === 'completed' ? 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200' :
                        item.status === 'ongoing' ? 'bg-blue-100 text-blue-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>{item.status}</span>
                    </td>
                    <td className="p-4 text-gray-500 text-xs hidden md:table-cell">{item.budget ? `$${Number(item.budget).toLocaleString()}` : '-'}</td>
                    <td className="p-4 text-gray-400 text-xs hidden md:table-cell">{new Date(item.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => setProjForm({ editing: true, editingId: item.id, data: { name: item.name, description: item.description, budget: Number(item.budget) || 0, status: item.status, startDate: item.startDate || '', endDate: item.endDate || '', location: item.location || '', coverImage: item.coverImage || '', fundingSource: item.fundingSource || '', contractor: item.contractor || '', category: item.category || '' } })}
                          className="text-xs text-blue-600 hover:text-blue-800 transition font-medium">{t.admin.editItem}</button>
                        <button onClick={() => { if (window.confirm(t.admin.confirmDeleteItemTitle)) handleDeleteProject(item.id); }}
                          className="text-xs text-red-500 hover:text-red-700 transition font-medium">{t.admin.deleteItem}</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </>
    );
  }
  function ProjectsForm() {
    const d = projForm.data;
    return (
      <form onSubmit={handleSaveProject} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4 max-w-2xl">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-bold text-gray-900">{projForm.editingId ? t.admin.editItem : t.admin.createItem} {t.admin.cmsProjects}</h2>
          <button type="button" onClick={() => setProjForm({ editing: false, editingId: null, data: { ...emptyProjectForm } })}
            className="text-sm text-gray-500 hover:text-gray-700 transition">{t.admin.cancelEdit}</button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 sm:col-span-1">                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">{t.admin.nameField} *</label>
            <input type="text" required value={d.name} onChange={(e) => setProjForm((p) => ({ ...p, data: { ...p.data, name: e.target.value } }))}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none bg-white dark:bg-slate-800" />
          </div>
          <div className="col-span-2 sm:col-span-1">                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">{t.admin.statusField}</label>
            <select value={d.status} onChange={(e) => setProjForm((p) => ({ ...p, data: { ...p.data, status: e.target.value } }))}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none bg-white dark:bg-slate-800">
              <option value="planned">Planned</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="on-hold">On Hold</option>
            </select>
          </div>
          <div className="col-span-2">                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">{t.admin.descriptionField} *</label>
            <textarea required value={d.description} onChange={(e) => setProjForm((p) => ({ ...p, data: { ...p.data, description: e.target.value } }))}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none bg-white dark:bg-slate-800" rows={3} />
          </div>
          <div>                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">{t.admin.budgetField}</label>
            <input type="number" value={d.budget} onChange={(e) => setProjForm((p) => ({ ...p, data: { ...p.data, budget: Number(e.target.value) } }))}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none bg-white dark:bg-slate-800" />
          </div>
          <div>                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">{t.admin.categoryField}</label>
            <input type="text" value={d.category} onChange={(e) => setProjForm((p) => ({ ...p, data: { ...p.data, category: e.target.value } }))}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none bg-white dark:bg-slate-800" />
          </div>
          <div>                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">{t.admin.locationField}</label>
            <input type="text" value={d.location} onChange={(e) => setProjForm((p) => ({ ...p, data: { ...p.data, location: e.target.value } }))}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none bg-white dark:bg-slate-800" />
          </div>
          <div>                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">{t.admin.fundingSourceField}</label>
            <input type="text" value={d.fundingSource} onChange={(e) => setProjForm((p) => ({ ...p, data: { ...p.data, fundingSource: e.target.value } }))}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none bg-white dark:bg-slate-800" />
          </div>
          <div>                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">{t.admin.contractorField}</label>
            <input type="text" value={d.contractor} onChange={(e) => setProjForm((p) => ({ ...p, data: { ...p.data, contractor: e.target.value } }))}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none bg-white dark:bg-slate-800" />
          </div>
          <div>                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">{t.admin.startDateField}</label>
            <input type="date" value={d.startDate} onChange={(e) => setProjForm((p) => ({ ...p, data: { ...p.data, startDate: e.target.value } }))}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none bg-white dark:bg-slate-800" />
          </div>
          <div>                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">{t.admin.endDateField}</label>
            <input type="date" value={d.endDate} onChange={(e) => setProjForm((p) => ({ ...p, data: { ...p.data, endDate: e.target.value } }))}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none bg-white dark:bg-slate-800" />
          </div>
          <div className="col-span-2">                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">{t.admin.coverImageField}</label>
            <FileUpload
              existingUrl={d.coverImage}
              onUpload={(url) => setProjForm((p) => ({ ...p, data: { ...p.data, coverImage: url } }))}
              label="Upload Project Image"
            />
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={projSubmitting}
            className="bg-slate-800 text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-slate-700 transition disabled:opacity-50">
            {projSubmitting ? t.admin.saving : t.admin.saveItem}
          </button>
        </div>
      </form>
    );
  }

  // ====== Departments Tab ======
  function DepartmentsTab() {
    if (deptForm.editing) return <DepartmentsForm />;
    return (
      <>
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-gray-500">{departments.length} department{departments.length !== 1 ? 's' : ''}</p>
          <button onClick={() => setDeptForm({ editing: true, editingId: null, data: { ...emptyDeptForm } })}
            className="bg-slate-800 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-700 transition">{t.admin.createItem}</button>
        </div>
        {departments.length === 0 ? <p className="text-center text-gray-500 py-12">{t.admin.noItems}</p> : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left p-4 font-semibold text-gray-600">{t.admin.nameField}</th>
                <th className="text-left p-4 font-semibold text-gray-600">{t.admin.headField}</th>
                <th className="text-left p-4 font-semibold text-gray-600 hidden md:table-cell">{t.admin.phoneField}</th>
                <th className="text-left p-4 font-semibold text-gray-600 hidden md:table-cell">{t.admin.email}</th>
                <th className="text-right p-4 font-semibold text-gray-600">{t.admin.editItem}</th>
              </tr></thead>
              <tbody>
                {departments.map((item) => (
                  <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                    <td className="p-4 font-medium text-gray-900 max-w-xs truncate">{item.name}</td>
                    <td className="p-4 text-gray-700">{item.head}</td>
                    <td className="p-4 text-gray-500 text-xs hidden md:table-cell">{item.phone}</td>
                    <td className="p-4 text-gray-500 text-xs hidden md:table-cell">{item.email}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => setDeptForm({ editing: true, editingId: item.id, data: { name: item.name, description: item.description, head: item.head, phone: item.phone, email: item.email, office: item.office, image: item.image || '' } })}
                          className="text-xs text-blue-600 hover:text-blue-800 transition font-medium">{t.admin.editItem}</button>
                        <button onClick={() => { if (window.confirm(t.admin.confirmDeleteItemTitle)) handleDeleteDept(item.id); }}
                          className="text-xs text-red-500 hover:text-red-700 transition font-medium">{t.admin.deleteItem}</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </>
    );
  }
  function DepartmentsForm() {
    const d = deptForm.data;
    return (
      <form onSubmit={handleSaveDept} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4 max-w-2xl">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-bold text-gray-900">{deptForm.editingId ? t.admin.editItem : t.admin.createItem} {t.admin.cmsDepartments}</h2>
          <button type="button" onClick={() => setDeptForm({ editing: false, editingId: null, data: { ...emptyDeptForm } })}
            className="text-sm text-gray-500 hover:text-gray-700 transition">{t.admin.cancelEdit}</button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 sm:col-span-1">                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">{t.admin.nameField} *</label>
            <input type="text" required value={d.name} onChange={(e) => setDeptForm((p) => ({ ...p, data: { ...p.data, name: e.target.value } }))}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none bg-white dark:bg-slate-800" />
          </div>
          <div className="col-span-2 sm:col-span-1">                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">{t.admin.headField} *</label>
            <input type="text" required value={d.head} onChange={(e) => setDeptForm((p) => ({ ...p, data: { ...p.data, head: e.target.value } }))}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none bg-white dark:bg-slate-800" />
          </div>
          <div className="col-span-2">                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">{t.admin.descriptionField} *</label>
            <textarea required value={d.description} onChange={(e) => setDeptForm((p) => ({ ...p, data: { ...p.data, description: e.target.value } }))}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none bg-white dark:bg-slate-800" rows={3} />
          </div>
          <div>                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">{t.admin.phoneField} *</label>
            <input type="text" required value={d.phone} onChange={(e) => setDeptForm((p) => ({ ...p, data: { ...p.data, phone: e.target.value } }))}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none bg-white dark:bg-slate-800" placeholder="+251 47 XXX XXXX" />
          </div>
          <div>                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">{t.admin.email} *</label>
            <input type="email" required value={d.email} onChange={(e) => setDeptForm((p) => ({ ...p, data: { ...p.data, email: e.target.value } }))}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none bg-white dark:bg-slate-800" />
          </div>
          <div>                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">{t.admin.officeField} *</label>
            <input type="text" required value={d.office} onChange={(e) => setDeptForm((p) => ({ ...p, data: { ...p.data, office: e.target.value } }))}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none bg-white dark:bg-slate-800" />
          </div>
          <div className="col-span-2">                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">{t.admin.imageField}</label>
            <FileUpload
              existingUrl={d.image}
              onUpload={(url) => setDeptForm((p) => ({ ...p, data: { ...p.data, image: url } }))}
              label="Upload Department Image"
            />
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={deptSubmitting}
            className="bg-slate-800 text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-slate-700 transition disabled:opacity-50">
            {deptSubmitting ? t.admin.saving : t.admin.saveItem}
          </button>
        </div>
      </form>
    );
  }

  // ====== Documents Tab ======
  function DocumentsTab() {
    if (docForm.editing) return <DocumentsForm />;
    return (
      <>
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-gray-500">{documents.length} document{documents.length !== 1 ? 's' : ''}</p>
          <button onClick={() => setDocForm({ editing: true, editingId: null, data: { ...emptyDocForm } })}
            className="bg-slate-800 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-700 transition">{t.admin.createItem}</button>
        </div>
        {documents.length === 0 ? <p className="text-center text-gray-500 py-12">{t.admin.noItems}</p> : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left p-4 font-semibold text-gray-600">{t.admin.titleField}</th>
                <th className="text-left p-4 font-semibold text-gray-600 hidden md:table-cell">{t.admin.documentCategoryField}</th>
                <th className="text-left p-4 font-semibold text-gray-600 hidden md:table-cell">{t.admin.descriptionField}</th>
                <th className="text-left p-4 font-semibold text-gray-600 hidden md:table-cell">{t.admin.dateField}</th>
                <th className="text-right p-4 font-semibold text-gray-600">{t.admin.editItem}</th>
              </tr></thead>
              <tbody>
                {documents.map((item) => (
                  <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                    <td className="p-4 font-medium text-gray-900 max-w-xs truncate">{item.title}</td>
                    <td className="p-4 text-gray-500 text-xs hidden md:table-cell">
                      <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium">{item.category}</span>
                    </td>
                    <td className="p-4 text-gray-400 text-xs truncate max-w-[200px] hidden md:table-cell">{item.description}</td>
                    <td className="p-4 text-gray-400 text-xs hidden md:table-cell">{new Date(item.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {item.fileUrl && (
                          <a href={item.fileUrl} target="_blank" rel="noopener noreferrer"
                            className="text-xs text-green-600 hover:text-green-800 transition font-medium">View</a>
                        )}
                        <button onClick={() => setDocForm({ editing: true, editingId: item.id, data: { title: item.title, description: item.description, fileUrl: item.fileUrl, category: item.category } })}
                          className="text-xs text-blue-600 hover:text-blue-800 transition font-medium">{t.admin.editItem}</button>
                        <button onClick={() => { if (window.confirm(t.admin.confirmDeleteItemTitle)) handleDeleteDoc(item.id); }}
                          className="text-xs text-red-500 hover:text-red-700 transition font-medium">{t.admin.deleteItem}</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </>
    );
  }
  function DocumentsForm() {
    const d = docForm.data;
    return (
      <form onSubmit={handleSaveDoc} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4 max-w-2xl">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-bold text-gray-900">{docForm.editingId ? t.admin.editItem : t.admin.createItem} {t.admin.cmsDocuments}</h2>
          <button type="button" onClick={() => setDocForm({ editing: false, editingId: null, data: { ...emptyDocForm } })}
            className="text-sm text-gray-500 hover:text-gray-700 transition">{t.admin.cancelEdit}</button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 sm:col-span-1">                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">{t.admin.titleField} *</label>
            <input type="text" required value={d.title} onChange={(e) => setDocForm((p) => ({ ...p, data: { ...p.data, title: e.target.value } }))}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none bg-white dark:bg-slate-800" />
          </div>
          <div className="col-span-2 sm:col-span-1">                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">{t.admin.documentCategoryField} *</label>
            <select required value={d.category} onChange={(e) => setDocForm((p) => ({ ...p, data: { ...p.data, category: e.target.value } }))}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none bg-white dark:bg-slate-800">
              <option value="" disabled className="text-gray-400">Select a category</option>
              <option value="policy">Policy</option>
              <option value="report">Report</option>
              <option value="form">Form</option>
              <option value="regulation">Regulation</option>
              <option value="minutes">Minutes</option>
              <option value="budget">Budget</option>
              <option value="plan">Plan</option>
              <option value="notice">Notice</option>
            </select>
          </div>
          <div className="col-span-2">                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">{t.admin.descriptionField} *</label>
            <textarea required value={d.description} onChange={(e) => setDocForm((p) => ({ ...p, data: { ...p.data, description: e.target.value } }))}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none bg-white dark:bg-slate-800" rows={3} />
          </div>
          <div className="col-span-2">                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">{t.admin.documentFileUrlField} *</label>
            <FileUpload
              existingUrl={d.fileUrl}
              onUpload={(url) => setDocForm((p) => ({ ...p, data: { ...p.data, fileUrl: url } }))}
              label="Upload Document"
              accept=".pdf,.doc,.docx,.xls,.xlsx"
            />
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={docSubmitting}
            className="bg-slate-800 text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-slate-700 transition disabled:opacity-50">
            {docSubmitting ? t.admin.saving : t.admin.saveItem}
          </button>
        </div>
      </form>
    );
  }

  // ====== Investments Tab ======
  function InvestmentsTab() {
    if (invForm.editing) return <InvestmentsForm />;
    return (
      <>
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-gray-500">{investments.length} investment{investments.length !== 1 ? 's' : ''}</p>
          <button onClick={() => setInvForm({ editing: true, editingId: null, data: { ...emptyInvestmentForm } })}
            className="bg-slate-800 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-700 transition">{t.admin.createItem}</button>
        </div>
        {investments.length === 0 ? <p className="text-center text-gray-500 py-12">{t.admin.noItems}</p> : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left p-4 font-semibold text-gray-600">{t.admin.titleField}</th>
                <th className="text-left p-4 font-semibold text-gray-600">{t.admin.categoryField}</th>
                <th className="text-left p-4 font-semibold text-gray-600">{t.admin.statusField}</th>
                <th className="text-left p-4 font-semibold text-gray-600 hidden md:table-cell">{t.admin.locationField}</th>
                <th className="text-right p-4 font-semibold text-gray-600">{t.admin.editItem}</th>
              </tr></thead>
              <tbody>
                {investments.map((item) => (
                  <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                    <td className="p-4 font-medium text-gray-900 max-w-xs truncate">{item.title}</td>
                    <td className="p-4">
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-indigo-100 text-indigo-700">{item.category}</span>
                    </td>
                    <td className="p-4">
                      <button onClick={() => handleToggleInvestment(item)} className="hover:opacity-80">{badge(item.published)}</button>
                    </td>
                    <td className="p-4 text-gray-500 text-xs hidden md:table-cell">{item.location || '-'}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => setInvForm({ editing: true, editingId: item.id, data: { title: item.title, description: item.description, content: item.content, category: item.category, coverImage: item.coverImage || '', location: item.location || '', contactPhone: item.contactPhone || '', contactEmail: item.contactEmail || '', published: item.published } })}
                          className="text-xs text-blue-600 hover:text-blue-800 transition font-medium">{t.admin.editItem}</button>
                        <button onClick={() => { if (window.confirm(t.admin.confirmDeleteItemTitle)) handleDeleteInvestment(item.id); }}
                          className="text-xs text-red-500 hover:text-red-700 transition font-medium">{t.admin.deleteItem}</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </>
    );
  }
  function InvestmentsForm() {
    const d = invForm.data;
    return (
      <form onSubmit={handleSaveInvestment} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4 max-w-2xl">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-bold text-gray-900">{invForm.editingId ? t.admin.editItem : t.admin.createItem} Investment</h2>
          <button type="button" onClick={() => setInvForm({ editing: false, editingId: null, data: { ...emptyInvestmentForm } })}
            className="text-sm text-gray-500 hover:text-gray-700 transition">{t.admin.cancelEdit}</button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 sm:col-span-1">                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">{t.admin.titleField} *</label>
            <input type="text" required value={d.title} onChange={(e) => setInvForm((p) => ({ ...p, data: { ...p.data, title: e.target.value } }))}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none bg-white dark:bg-slate-800" />
          </div>
          <div className="col-span-2 sm:col-span-1">                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Category *</label>
            <select value={d.category} onChange={(e) => setInvForm((p) => ({ ...p, data: { ...p.data, category: e.target.value } }))}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none bg-white dark:bg-slate-800">
              <option value="opportunity">Opportunity</option>
              <option value="incentive">Incentive</option>
              <option value="attraction">Attraction</option>
              <option value="accommodation">Accommodation</option>
              <option value="culture">Culture</option>
              <option value="local-product">Local Product</option>
            </select>
          </div>
          <div className="col-span-2">                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">{t.admin.descriptionField} *</label>
            <textarea required value={d.description} onChange={(e) => setInvForm((p) => ({ ...p, data: { ...p.data, description: e.target.value } }))}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none bg-white dark:bg-slate-800" rows={3} />
          </div>
          <div className="col-span-2">                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">{t.admin.contentField} *</label>
            <textarea required value={d.content} onChange={(e) => setInvForm((p) => ({ ...p, data: { ...p.data, content: e.target.value } }))}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none font-mono bg-white dark:bg-slate-800" rows={8} />
          </div>
          <div>                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">{t.admin.locationField}</label>
            <input type="text" value={d.location} onChange={(e) => setInvForm((p) => ({ ...p, data: { ...p.data, location: e.target.value } }))}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none bg-white dark:bg-slate-800" />
          </div>
          <div>                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">{t.admin.statusField}</label>
            <select value={d.published ? 'true' : 'false'} onChange={(e) => setInvForm((p) => ({ ...p, data: { ...p.data, published: e.target.value === 'true' } }))}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none bg-white dark:bg-slate-800">
              <option value="true">{t.admin.publishedBadge}</option>
              <option value="false">{t.admin.draftBadge}</option>
            </select>
          </div>
          <div>                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Contact Phone</label>
            <input type="text" value={d.contactPhone} onChange={(e) => setInvForm((p) => ({ ...p, data: { ...p.data, contactPhone: e.target.value } }))}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none bg-white dark:bg-slate-800" />
          </div>
          <div>                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Contact Email</label>
            <input type="email" value={d.contactEmail} onChange={(e) => setInvForm((p) => ({ ...p, data: { ...p.data, contactEmail: e.target.value } }))}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none bg-white dark:bg-slate-800" />
          </div>
          <div className="col-span-2">                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">{t.admin.coverImageField}</label>
            <FileUpload
              existingUrl={d.coverImage}
              onUpload={(url) => setInvForm((p) => ({ ...p, data: { ...p.data, coverImage: url } }))}
              label="Upload Cover Image"
            />
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={invSubmitting}
            className="bg-slate-800 text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-slate-700 transition disabled:opacity-50">
            {invSubmitting ? t.admin.saving : t.admin.saveItem}
          </button>
        </div>
      </form>
    );
  }

  // ====== Admins Tab ======
  // ====== Hero Slides Tab ======
  function HeroSlidesTab() {
    if (slideForm.editing) return <HeroSlidesForm />;
    return (
      <>
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-gray-500">{heroSlides.length} slide{heroSlides.length !== 1 ? 's' : ''}</p>
          <button onClick={() => setSlideForm({ editing: true, editingId: null, data: { imageUrl: '', description: '', sortOrder: heroSlides.length, isActive: true } })}
            className="bg-slate-800 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-700 transition">{t.admin.createItem}</button>
        </div>
        {heroSlides.length === 0 ? <p className="text-center text-gray-500 py-12">{t.admin.noItems}</p> : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left p-4 font-semibold text-gray-600">Image</th>
                <th className="text-left p-4 font-semibold text-gray-600">Description</th>
                <th className="text-left p-4 font-semibold text-gray-600">Order</th>
                <th className="text-left p-4 font-semibold text-gray-600">Active</th>
                <th className="text-right p-4 font-semibold text-gray-600">{t.admin.editItem}</th>
              </tr></thead>
              <tbody>
                {heroSlides.map((slide) => (
                  <tr key={slide.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                    <td className="p-4">
                      <img src={slide.imageUrl} alt="" className="w-16 h-10 object-cover rounded" />
                    </td>
                    <td className="p-4 text-gray-700 text-xs max-w-xs truncate">{slide.description}</td>
                    <td className="p-4 text-gray-500 text-xs">{slide.sortOrder}</td>
                    <td className="p-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${slide.isActive ? 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200' : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'}`}>
                        {slide.isActive ? t.admin.publishedBadge : t.admin.draftBadge}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => setSlideForm({ editing: true, editingId: slide.id, data: { imageUrl: slide.imageUrl, description: slide.description, sortOrder: slide.sortOrder, isActive: slide.isActive } })}
                          className="text-xs text-blue-600 hover:text-blue-800 transition font-medium">{t.admin.editItem}</button>
                        <button onClick={() => { if (window.confirm(t.admin.confirmDeleteItemTitle)) handleDeleteSlide(slide.id); }}
                          className="text-xs text-red-500 hover:text-red-700 transition font-medium">{t.admin.deleteItem}</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </>
    );
  }
  function HeroSlidesForm() {
    const d = slideForm.data;
    return (
      <form onSubmit={handleSaveSlide} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4 max-w-2xl">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-bold text-gray-900">{slideForm.editingId ? t.admin.editItem : t.admin.createItem} Hero Slide</h2>
          <button type="button" onClick={() => setSlideForm({ editing: false, editingId: null, data: { imageUrl: '', description: '', sortOrder: 0, isActive: true } })}
            className="text-sm text-gray-500 hover:text-gray-700 transition">{t.admin.cancelEdit}</button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Image URL *</label>
            <input type="text" required value={d.imageUrl} onChange={(e) => setSlideForm((p) => ({ ...p, data: { ...p.data, imageUrl: e.target.value } }))}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none bg-white dark:bg-slate-800" placeholder="https://example.com/image.jpg" />
          </div>
          <div className="col-span-2">                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Description *</label>
            <textarea required value={d.description} onChange={(e) => setSlideForm((p) => ({ ...p, data: { ...p.data, description: e.target.value } }))}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none bg-white dark:bg-slate-800" rows={3} placeholder="Slide caption text" />
          </div>
          <div>                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Sort Order</label>
            <input type="number" value={d.sortOrder} onChange={(e) => setSlideForm((p) => ({ ...p, data: { ...p.data, sortOrder: parseInt(e.target.value) || 0 } }))}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none bg-white dark:bg-slate-800" />
          </div>
          <div>                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Active</label>
            <select value={d.isActive ? 'true' : 'false'} onChange={(e) => setSlideForm((p) => ({ ...p, data: { ...p.data, isActive: e.target.value === 'true' } }))}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none bg-white dark:bg-slate-800">
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={slideSubmitting}
            className="bg-slate-800 text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-slate-700 transition disabled:opacity-50">
            {slideSubmitting ? t.admin.saving : t.admin.saveItem}
          </button>
        </div>
      </form>
    );
  }

  // ====== Site Settings Tab ======
  function SettingsTab() {
    const settingFields = [
      { key: 'contact_phone_main', label: 'Main Office Phone', placeholder: '+251 47 XXX XXXX' },
      { key: 'contact_phone_pr', label: 'Public Relations Phone', placeholder: '+251 47 XXX XXXX' },
      { key: 'contact_email_main', label: 'Main Email', placeholder: 'info@goreworeda.gov.et' },
      { key: 'contact_email_support', label: 'Support Email', placeholder: 'support@goreworeda.gov.et' },
      { key: 'contact_hours_weekday', label: 'Weekday Hours', placeholder: 'Mon–Fri: 8:00 AM – 5:00 PM' },
      { key: 'contact_hours_saturday', label: 'Saturday Hours', placeholder: 'Sat: 8:00 AM – 12:00 PM' },
      { key: 'contact_address', label: 'Address', placeholder: 'Main Municipal Building...' },
      { key: 'footer_tagline1', label: 'Footer Tagline 1', placeholder: 'Gore Woreda' },
      { key: 'footer_tagline2', label: 'Footer Tagline 2', placeholder: 'Illubabor Zone' },
      { key: 'footer_tagline3', label: 'Footer Tagline 3', placeholder: 'Oromia' },
      // --- About Page Content ---
      { key: 'about_mayor_name', label: 'Mayor Name', placeholder: 'Ato Tessema Abebe' },
      { key: 'about_mayor_bio', label: 'Mayor Biography', placeholder: 'Mayor biography text...', textarea: true },
      { key: 'about_vice_mayor_name', label: 'Vice Mayor Name', placeholder: 'W/ro Genet Mekonnen' },
      { key: 'about_vice_mayor_bio', label: 'Vice Mayor Biography', placeholder: 'Vice mayor biography text...', textarea: true },
      { key: 'about_council_members', label: 'Council Members (JSON)', placeholder: '[{"name":"...","role":"...","desc":"..."},...]', textarea: true },
      { key: 'about_history_desc', label: 'History Description', placeholder: 'History text...', textarea: true },
      { key: 'about_geography_desc', label: 'Geography Description', placeholder: 'Geography text...', textarea: true },
      { key: 'about_vision_text', label: 'Vision Text', placeholder: 'Vision statement...', textarea: true },
      { key: 'about_mission_text', label: 'Mission Text', placeholder: 'Mission statement...', textarea: true },
      // --- News Quick Facts ---
      { key: 'news_quickfacts_title', label: 'Quick Facts Section Title', placeholder: 'Gore Quick Facts' },
      { key: 'news_quickfact_1_value', label: 'Quick Fact 1 — Value', placeholder: 'Gore Town (Capital of Gore Woreda...)' },
      { key: 'news_quickfact_2_value', label: 'Quick Fact 2 — Value', placeholder: 'Founded in the late 19th Century...' },
      { key: 'news_quickfact_3_value', label: 'Quick Fact 3 — Value', placeholder: 'Renowned for coffee trade legacy...' },
      // --- Stats Grid ---
      { key: 'stats_label_1', label: 'Stat 1 — Label', placeholder: 'Total Population' },
      { key: 'stats_detail_1', label: 'Stat 1 — Detail', placeholder: 'Urban & rural settlements combined' },
      { key: 'stats_label_2', label: 'Stat 2 — Label', placeholder: 'Total Area Coverage' },
      { key: 'stats_detail_2', label: 'Stat 2 — Detail', placeholder: 'Rich highland forest geography' },
      { key: 'stats_label_3', label: 'Stat 3 — Label', placeholder: 'Administrative Division' },
      { key: 'stats_detail_3', label: 'Stat 3 — Detail', placeholder: 'Governed municipal sectors' },
      { key: 'stats_label_4', label: 'Stat 4 — Label', placeholder: 'Primary Economic Engine' },
      { key: 'stats_detail_4', label: 'Stat 4 — Detail', placeholder: 'Premium Tea, Coffee, & Apiculture' },
    ];
    return (
      <form onSubmit={handleSaveSettings} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-5 max-w-2xl">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-bold text-gray-900">{t.admin.cmsSettings}</h2>
        </div>
        <p className="text-xs text-gray-500 -mt-3">
          {t.admin.settingsDescription}
        </p>
        {settingFields.map((field) => (
          <div key={field.key}>                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">{field.label}</label>
            {'textarea' in field && field.textarea ? (
              <textarea
                rows={field.key === 'about_council_members' ? 6 : 4}
                value={settingsForm[field.key] || ''}
                onChange={(e) => setSettingsForm((p) => ({ ...p, [field.key]: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none font-mono bg-white dark:bg-slate-800"
                placeholder={field.placeholder}
              />
            ) : (
              <input
                type="text"
                value={settingsForm[field.key] || ''}
                onChange={(e) => setSettingsForm((p) => ({ ...p, [field.key]: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none bg-white dark:bg-slate-800"
                placeholder={field.placeholder}
              />
            )}
          </div>
        ))}
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={settingsSaving}
            className="bg-slate-800 text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-slate-700 transition disabled:opacity-50">
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
          <p className="text-sm text-gray-500">{admins.length} {t.admin.registered}</p>
          <button onClick={() => setShowAdminModal(true)}
            className="bg-slate-800 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-700 transition">+ {t.admin.addAdmin}</button>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left p-4 font-semibold text-gray-600">{t.admin.fullNameLabel}</th>
              <th className="text-left p-4 font-semibold text-gray-600">{t.admin.email}</th>
              <th className="text-left p-4 font-semibold text-gray-600">{t.admin.statusField}</th>
              <th className="text-left p-4 font-semibold text-gray-600">Created</th>
              <th className="text-right p-4 font-semibold text-gray-600">{t.admin.editItem}</th>
            </tr></thead>
            <tbody>
              {admins.map((admin) => (
                <tr key={admin.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                  <td className="p-4 font-medium text-gray-900">{admin.fullName}</td>
                  <td className="p-4 text-gray-500">{admin.email}</td>
                  <td className="p-4">
                    <button onClick={() => handleToggleActive(admin)} disabled={togglingId === admin.id}
                      className={`text-xs px-2.5 py-1 rounded-full font-medium transition ${togglingId === admin.id ? 'opacity-50 cursor-not-allowed' : admin.isActive ? 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600' : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'}`}>
                      {admin.isActive ? t.admin.activeBadge : t.admin.disabledBadge}
                    </button>
                  </td>
                  <td className="p-4 text-gray-400 text-xs">{new Date(admin.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 text-right">
                    {confirmDelete === admin.id ? (
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-xs text-gray-500">{t.admin.deleteConfirm}</span>
                        <button onClick={() => handleDeleteAdmin(admin.id)}
                          className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition">{t.admin.yes}</button>
                        <button onClick={() => setConfirmDelete(null)}
                          className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300 transition">{t.admin.no}</button>
                      </div>
                    ) : (
                      <button onClick={() => setConfirmDelete(admin.id)}
                        className="text-xs text-red-500 hover:text-red-700 transition font-medium">{t.admin.deleteItem}</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    );
  }
}
