'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from '@/context/LocaleContext';
import FileUpload from '@/component/FileUpload';
import {
  contactAdminApi, adminApi, newsApi, announcementsApi, projectsApi, departmentsApi, documentsApi,
  type ContactMessage, type AdminUser, type NewsArticle, type Announcement, type Project, type Department, type Document,
} from '@/lib/api';

type Tab = 'messages' | 'news' | 'announcements' | 'projects' | 'departments' | 'documents' | 'admins';

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
    ])
      .then(([msgs, adms, n, a, p, d, docs]) => {
        setMessages(msgs); setAdmins(adms); setNews(n); setAnnouncements(a); setProjects(p); setDepartments(d); setDocuments(docs);
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
      tab === tabName ? 'bg-green-700 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
    }`;

  const badge = (published: boolean) =>
    published
      ? <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">{t.admin.publishedBadge}</span>
      : <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">{t.admin.draftBadge}</span>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-gray-900">{t.admin.dashboard}</h1>
            {unreadCount > 0 && <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{unreadCount}</span>}
          </div>
          <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-red-600 transition">{t.admin.logout}</button>
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
          <button onClick={() => setTab('admins')} className={tabClasses('admins')}>{t.admin.admins} ({admins.length})</button>
        </div>

        {loading ? (
          <div className="animate-pulse space-y-4">
            {[1,2,3].map((i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" /><div className="h-3 bg-gray-200 rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : tab === 'messages' ? <MessagesTab /> :
          tab === 'news' ? <NewsTab /> :
          tab === 'announcements' ? <AnnouncementsTab /> :
          tab === 'projects' ? <ProjectsTab /> :
          tab === 'departments' ? <DepartmentsTab /> :
          tab === 'documents' ? <DocumentsTab /> :
          <AdminsTab />}
      </div>

      {/* Admin Create Modal */}
      {showAdminModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setShowAdminModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-gray-900 mb-2">{t.admin.addAdmin}</h2>
            <p className="text-sm text-gray-500 mb-6">{t.admin.createAdmin}</p>
            <form onSubmit={handleCreateAdmin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">{t.admin.fullNameLabel}</label>
                <input type="text" required value={adminForm.fullName} onChange={(e) => setAdminForm((p) => ({ ...p, fullName: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none text-sm text-gray-900 placeholder-gray-400" placeholder="e.g. John Doe" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">{t.admin.email}</label>
                <input type="email" required value={adminForm.email} onChange={(e) => setAdminForm((p) => ({ ...p, email: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none text-sm text-gray-900 placeholder-gray-400" placeholder="admin@example.com" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">{t.admin.password}</label>
                <input type="password" required minLength={8} value={adminForm.password} onChange={(e) => setAdminForm((p) => ({ ...p, password: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none text-sm text-gray-900 placeholder-gray-400" placeholder="Min. 8 characters" />
              </div>
              {adminError && <p className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">{adminError}</p>}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowAdminModal(false)}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition">{t.admin.cancel}</button>
                <button type="submit" disabled={submitting}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-green-700 rounded-lg hover:bg-green-600 transition disabled:opacity-50">
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
                          className="text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition font-medium">{t.admin.markRead}</button>}
                        <button onClick={(e) => { e.stopPropagation(); handleDeleteMsg(msg.id); }}
                          className="text-xs bg-red-50 text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-100 transition font-medium">{t.admin.delete}</button>
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
            className="bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-green-600 transition">{t.admin.createItem}</button>
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
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-xs font-semibold text-gray-600 mb-1">{t.admin.titleField} *</label>
            <input type="text" required value={d.title} onChange={(e) => setNewsForm((p) => ({ ...p, data: { ...p.data, title: e.target.value } }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:ring-2 focus:ring-green-600 outline-none" />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-xs font-semibold text-gray-600 mb-1">{t.admin.slugField} *</label>
            <input type="text" required value={d.slug} onChange={(e) => setNewsForm((p) => ({ ...p, data: { ...p.data, slug: e.target.value } }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:ring-2 focus:ring-green-600 outline-none" />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-semibold text-gray-600 mb-1">{t.admin.summaryField} *</label>
            <textarea required value={d.summary} onChange={(e) => setNewsForm((p) => ({ ...p, data: { ...p.data, summary: e.target.value } }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:ring-2 focus:ring-green-600 outline-none" rows={2} />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-semibold text-gray-600 mb-1">{t.admin.contentField} *</label>
            <textarea required value={d.content} onChange={(e) => setNewsForm((p) => ({ ...p, data: { ...p.data, content: e.target.value } }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:ring-2 focus:ring-green-600 outline-none font-mono" rows={8} />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-xs font-semibold text-gray-600 mb-1">{t.admin.coverImageField}</label>
            <FileUpload
              existingUrl={d.coverImage}
              onUpload={(url) => setNewsForm((p) => ({ ...p, data: { ...p.data, coverImage: url } }))}
              label="Upload Cover Image"
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-xs font-semibold text-gray-600 mb-1">{t.admin.statusField}</label>
            <select value={d.published ? 'true' : 'false'} onChange={(e) => setNewsForm((p) => ({ ...p, data: { ...p.data, published: e.target.value === 'true' } }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:ring-2 focus:ring-green-600 outline-none">
              <option value="true">{t.admin.publishedBadge}</option>
              <option value="false">{t.admin.draftBadge}</option>
            </select>
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={newsSubmitting}
            className="bg-green-700 text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-green-600 transition disabled:opacity-50">
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
            className="bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-green-600 transition">{t.admin.createItem}</button>
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:ring-2 focus:ring-green-600 outline-none" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">{t.admin.summaryField} *</label>
          <textarea required value={d.description} onChange={(e) => setAnnForm((p) => ({ ...p, data: { ...p.data, description: e.target.value } }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:ring-2 focus:ring-green-600 outline-none" rows={2} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">{t.admin.contentField} *</label>
          <textarea required value={d.content} onChange={(e) => setAnnForm((p) => ({ ...p, data: { ...p.data, content: e.target.value } }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:ring-2 focus:ring-green-600 outline-none font-mono" rows={8} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">{t.admin.statusField}</label>
          <select value={d.published ? 'true' : 'false'} onChange={(e) => setAnnForm((p) => ({ ...p, data: { ...p.data, published: e.target.value === 'true' } }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:ring-2 focus:ring-green-600 outline-none">
            <option value="true">{t.admin.publishedBadge}</option>
            <option value="false">{t.admin.draftBadge}</option>
          </select>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={annSubmitting}
            className="bg-green-700 text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-green-600 transition disabled:opacity-50">
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
            className="bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-green-600 transition">{t.admin.createItem}</button>
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
                        item.status === 'completed' ? 'bg-green-100 text-green-700' :
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
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-xs font-semibold text-gray-600 mb-1">{t.admin.nameField} *</label>
            <input type="text" required value={d.name} onChange={(e) => setProjForm((p) => ({ ...p, data: { ...p.data, name: e.target.value } }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:ring-2 focus:ring-green-600 outline-none" />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-xs font-semibold text-gray-600 mb-1">{t.admin.statusField}</label>
            <select value={d.status} onChange={(e) => setProjForm((p) => ({ ...p, data: { ...p.data, status: e.target.value } }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:ring-2 focus:ring-green-600 outline-none">
              <option value="planned">Planned</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="on-hold">On Hold</option>
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-semibold text-gray-600 mb-1">{t.admin.descriptionField} *</label>
            <textarea required value={d.description} onChange={(e) => setProjForm((p) => ({ ...p, data: { ...p.data, description: e.target.value } }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:ring-2 focus:ring-green-600 outline-none" rows={3} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">{t.admin.budgetField}</label>
            <input type="number" value={d.budget} onChange={(e) => setProjForm((p) => ({ ...p, data: { ...p.data, budget: Number(e.target.value) } }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:ring-2 focus:ring-green-600 outline-none" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">{t.admin.categoryField}</label>
            <input type="text" value={d.category} onChange={(e) => setProjForm((p) => ({ ...p, data: { ...p.data, category: e.target.value } }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:ring-2 focus:ring-green-600 outline-none" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">{t.admin.locationField}</label>
            <input type="text" value={d.location} onChange={(e) => setProjForm((p) => ({ ...p, data: { ...p.data, location: e.target.value } }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:ring-2 focus:ring-green-600 outline-none" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">{t.admin.fundingSourceField}</label>
            <input type="text" value={d.fundingSource} onChange={(e) => setProjForm((p) => ({ ...p, data: { ...p.data, fundingSource: e.target.value } }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:ring-2 focus:ring-green-600 outline-none" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">{t.admin.contractorField}</label>
            <input type="text" value={d.contractor} onChange={(e) => setProjForm((p) => ({ ...p, data: { ...p.data, contractor: e.target.value } }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:ring-2 focus:ring-green-600 outline-none" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">{t.admin.startDateField}</label>
            <input type="date" value={d.startDate} onChange={(e) => setProjForm((p) => ({ ...p, data: { ...p.data, startDate: e.target.value } }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:ring-2 focus:ring-green-600 outline-none" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">{t.admin.endDateField}</label>
            <input type="date" value={d.endDate} onChange={(e) => setProjForm((p) => ({ ...p, data: { ...p.data, endDate: e.target.value } }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:ring-2 focus:ring-green-600 outline-none" />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-semibold text-gray-600 mb-1">{t.admin.coverImageField}</label>
            <FileUpload
              existingUrl={d.coverImage}
              onUpload={(url) => setProjForm((p) => ({ ...p, data: { ...p.data, coverImage: url } }))}
              label="Upload Project Image"
            />
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={projSubmitting}
            className="bg-green-700 text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-green-600 transition disabled:opacity-50">
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
            className="bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-green-600 transition">{t.admin.createItem}</button>
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
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-xs font-semibold text-gray-600 mb-1">{t.admin.nameField} *</label>
            <input type="text" required value={d.name} onChange={(e) => setDeptForm((p) => ({ ...p, data: { ...p.data, name: e.target.value } }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:ring-2 focus:ring-green-600 outline-none" />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-xs font-semibold text-gray-600 mb-1">{t.admin.headField} *</label>
            <input type="text" required value={d.head} onChange={(e) => setDeptForm((p) => ({ ...p, data: { ...p.data, head: e.target.value } }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:ring-2 focus:ring-green-600 outline-none" />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-semibold text-gray-600 mb-1">{t.admin.descriptionField} *</label>
            <textarea required value={d.description} onChange={(e) => setDeptForm((p) => ({ ...p, data: { ...p.data, description: e.target.value } }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:ring-2 focus:ring-green-600 outline-none" rows={3} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">{t.admin.phoneField} *</label>
            <input type="text" required value={d.phone} onChange={(e) => setDeptForm((p) => ({ ...p, data: { ...p.data, phone: e.target.value } }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:ring-2 focus:ring-green-600 outline-none" placeholder="+251 47 XXX XXXX" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">{t.admin.email} *</label>
            <input type="email" required value={d.email} onChange={(e) => setDeptForm((p) => ({ ...p, data: { ...p.data, email: e.target.value } }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:ring-2 focus:ring-green-600 outline-none" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">{t.admin.officeField} *</label>
            <input type="text" required value={d.office} onChange={(e) => setDeptForm((p) => ({ ...p, data: { ...p.data, office: e.target.value } }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:ring-2 focus:ring-green-600 outline-none" />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-semibold text-gray-600 mb-1">{t.admin.imageField}</label>
            <FileUpload
              existingUrl={d.image}
              onUpload={(url) => setDeptForm((p) => ({ ...p, data: { ...p.data, image: url } }))}
              label="Upload Department Image"
            />
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={deptSubmitting}
            className="bg-green-700 text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-green-600 transition disabled:opacity-50">
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
            className="bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-green-600 transition">{t.admin.createItem}</button>
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
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-xs font-semibold text-gray-600 mb-1">{t.admin.titleField} *</label>
            <input type="text" required value={d.title} onChange={(e) => setDocForm((p) => ({ ...p, data: { ...p.data, title: e.target.value } }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:ring-2 focus:ring-green-600 outline-none" />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-xs font-semibold text-gray-600 mb-1">{t.admin.documentCategoryField} *</label>
            <input type="text" required value={d.category} onChange={(e) => setDocForm((p) => ({ ...p, data: { ...p.data, category: e.target.value } }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:ring-2 focus:ring-green-600 outline-none" placeholder="e.g. Policy, Report, Form" />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-semibold text-gray-600 mb-1">{t.admin.descriptionField} *</label>
            <textarea required value={d.description} onChange={(e) => setDocForm((p) => ({ ...p, data: { ...p.data, description: e.target.value } }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:ring-2 focus:ring-green-600 outline-none" rows={3} />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-semibold text-gray-600 mb-1">{t.admin.documentFileUrlField} *</label>
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
            className="bg-green-700 text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-green-600 transition disabled:opacity-50">
            {docSubmitting ? t.admin.saving : t.admin.saveItem}
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
            className="bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-green-600 transition">+ {t.admin.addAdmin}</button>
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
                      className={`text-xs px-2.5 py-1 rounded-full font-medium transition ${togglingId === admin.id ? 'opacity-50 cursor-not-allowed' : admin.isActive ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}>
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
