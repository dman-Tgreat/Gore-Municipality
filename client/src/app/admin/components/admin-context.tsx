'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from '@/context/LocaleContext';
import { type Messages } from '@/i18n/messages';
import {
  contactAdminApi, adminApi, newsApi, announcementsApi, projectsApi, departmentsApi, investmentsApi,
  heroSlidesApi, settingsApi,
  type ContactMessage, type AdminUser, type NewsArticle, type Announcement, type Project, type Department, type Investment,
  type HeroSlide, type SiteSetting,
} from '@/lib/api';

export type Tab = 'messages' | 'news' | 'announcements' | 'projects' | 'departments' | 'investments' | 'admins' | 'hero-slides' | 'settings';

export interface CmsFormState<T> {
  editing: boolean;
  editingId: number | null;
  data: T;
}

export const emptyNewsForm = { title: '', titleAm: '', titleOm: '', slug: '', summary: '', summaryAm: '', summaryOm: '', content: '', contentAm: '', contentOm: '', coverImage: '', published: true };
export const emptyAnnouncementForm = { title: '', titleAm: '', titleOm: '', description: '', descriptionAm: '', descriptionOm: '', content: '', contentAm: '', contentOm: '', published: true };
export const emptyProjectForm = { name: '', nameAm: '', nameOm: '', description: '', descriptionAm: '', descriptionOm: '', budget: 0, status: 'planned', startDate: '', endDate: '', location: '', coverImage: '', fundingSource: '', contractor: '', category: '' };
export const emptyDeptForm = { name: '', nameAm: '', nameOm: '', description: '', descriptionAm: '', descriptionOm: '', head: '', phone: '', email: '', office: '', image: '' };
export const emptyInvestmentForm = { title: '', titleAm: '', titleOm: '', description: '', descriptionAm: '', descriptionOm: '', content: '', contentAm: '', contentOm: '', category: 'opportunity', coverImage: '', location: '', contactPhone: '', contactEmail: '', published: true };

interface AdminContextType {
  t: Messages;
  token: string | null;
  messages: ContactMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ContactMessage[]>>;
  admins: AdminUser[];
  setAdmins: React.Dispatch<React.SetStateAction<AdminUser[]>>;
  news: NewsArticle[];
  setNews: React.Dispatch<React.SetStateAction<NewsArticle[]>>;
  announcements: Announcement[];
  setAnnouncements: React.Dispatch<React.SetStateAction<Announcement[]>>;
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  departments: Department[];
  setDepartments: React.Dispatch<React.SetStateAction<Department[]>>;
  investments: Investment[];
  setInvestments: React.Dispatch<React.SetStateAction<Investment[]>>;
  heroSlides: HeroSlide[];
  setHeroSlides: React.Dispatch<React.SetStateAction<HeroSlide[]>>;
  siteSettings: SiteSetting[];
  setSiteSettings: React.Dispatch<React.SetStateAction<SiteSetting[]>>;
  loading: boolean;
  tab: Tab;
  setTab: React.Dispatch<React.SetStateAction<Tab>>;
  formLang: 'en' | 'am' | 'om';
  setFormLang: React.Dispatch<React.SetStateAction<'en' | 'am' | 'om'>>;
  msgFilter: 'all' | 'unread' | 'read';
  setMsgFilter: React.Dispatch<React.SetStateAction<'all' | 'unread' | 'read'>>;
  msgSearch: string;
  setMsgSearch: React.Dispatch<React.SetStateAction<string>>;
  msgDateFrom: string;
  setMsgDateFrom: React.Dispatch<React.SetStateAction<string>>;
  msgDateTo: string;
  setMsgDateTo: React.Dispatch<React.SetStateAction<string>>;
  expandedMsg: number | null;
  setExpandedMsg: React.Dispatch<React.SetStateAction<number | null>>;
  newsSearch: string;
  setNewsSearch: React.Dispatch<React.SetStateAction<string>>;
  newsStatusFilter: 'all' | 'published' | 'draft';
  setNewsStatusFilter: React.Dispatch<React.SetStateAction<'all' | 'published' | 'draft'>>;
  filteredNews: NewsArticle[];
  annSearch: string;
  setAnnSearch: React.Dispatch<React.SetStateAction<string>>;
  annStatusFilter: 'all' | 'published' | 'draft';
  setAnnStatusFilter: React.Dispatch<React.SetStateAction<'all' | 'published' | 'draft'>>;
  filteredAnnouncements: Announcement[];
  deptSearch: string;
  setDeptSearch: React.Dispatch<React.SetStateAction<string>>;
  filteredDepartments: Department[];
  projSearch: string;
  setProjSearch: React.Dispatch<React.SetStateAction<string>>;
  projStatusFilter: 'all' | 'planned' | 'ongoing' | 'completed';
  setProjStatusFilter: React.Dispatch<React.SetStateAction<'all' | 'planned' | 'ongoing' | 'completed'>>;
  filteredProjects: Project[];
  invSearch: string;
  setInvSearch: React.Dispatch<React.SetStateAction<string>>;
  invStatusFilter: 'all' | 'published' | 'draft';
  setInvStatusFilter: React.Dispatch<React.SetStateAction<'all' | 'published' | 'draft'>>;
  invCategoryFilter: string;
  setInvCategoryFilter: React.Dispatch<React.SetStateAction<string>>;
  filteredInvestments: Investment[];
  adminSearch: string;
  setAdminSearch: React.Dispatch<React.SetStateAction<string>>;
  adminStatusFilter: 'all' | 'active' | 'inactive';
  setAdminStatusFilter: React.Dispatch<React.SetStateAction<'all' | 'active' | 'inactive'>>;
  filteredAdmins: AdminUser[];
  filteredHeroSlides: HeroSlide[];
  newsForm: CmsFormState<typeof emptyNewsForm>;
  setNewsForm: React.Dispatch<React.SetStateAction<CmsFormState<typeof emptyNewsForm>>>;
  newsSubmitting: boolean;
  setNewsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  newsError: string;
  setNewsError: React.Dispatch<React.SetStateAction<string>>;
  annForm: CmsFormState<typeof emptyAnnouncementForm>;
  setAnnForm: React.Dispatch<React.SetStateAction<CmsFormState<typeof emptyAnnouncementForm>>>;
  annSubmitting: boolean;
  setAnnSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  annError: string;
  setAnnError: React.Dispatch<React.SetStateAction<string>>;
  projForm: CmsFormState<typeof emptyProjectForm>;
  setProjForm: React.Dispatch<React.SetStateAction<CmsFormState<typeof emptyProjectForm>>>;
  projSubmitting: boolean;
  setProjSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  projError: string;
  setProjError: React.Dispatch<React.SetStateAction<string>>;
  deptForm: CmsFormState<typeof emptyDeptForm>;
  setDeptForm: React.Dispatch<React.SetStateAction<CmsFormState<typeof emptyDeptForm>>>;
  deptSubmitting: boolean;
  setDeptSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  deptError: string;
  setDeptError: React.Dispatch<React.SetStateAction<string>>;
  invForm: CmsFormState<typeof emptyInvestmentForm>;
  setInvForm: React.Dispatch<React.SetStateAction<CmsFormState<typeof emptyInvestmentForm>>>;
  invSubmitting: boolean;
  setInvSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  invError: string;
  setInvError: React.Dispatch<React.SetStateAction<string>>;
  slideForm: CmsFormState<{ imageUrl: string; description: string; sortOrder: number; isActive: boolean }>;
  setSlideForm: React.Dispatch<React.SetStateAction<CmsFormState<{ imageUrl: string; description: string; sortOrder: number; isActive: boolean }>>>;
  slideSubmitting: boolean;
  setSlideSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  slideError: string;
  setSlideError: React.Dispatch<React.SetStateAction<string>>;
  settingsForm: Record<string, string>;
  setSettingsForm: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  settingsSaving: boolean;
  setSettingsSaving: React.Dispatch<React.SetStateAction<boolean>>;
  settingsError: string;
  setSettingsError: React.Dispatch<React.SetStateAction<string>>;
  showAdminModal: boolean;
  setShowAdminModal: React.Dispatch<React.SetStateAction<boolean>>;
  adminForm: { fullName: string; email: string; password: string };
  setAdminForm: React.Dispatch<React.SetStateAction<{ fullName: string; email: string; password: string }>>;
  submitting: boolean;
  setSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  adminError: string;
  setAdminError: React.Dispatch<React.SetStateAction<string>>;
  confirmDelete: number | null;
  setConfirmDelete: React.Dispatch<React.SetStateAction<number | null>>;
  togglingId: number | null;
  setTogglingId: React.Dispatch<React.SetStateAction<number | null>>;
  handleLogout: () => void;
  handleMarkRead: (id: number) => Promise<void>;
  handleDeleteMsg: (id: number) => Promise<void>;
  handleSaveNews: (e: React.FormEvent) => Promise<void>;
  handleDeleteNews: (id: number) => Promise<void>;
  handleToggleNews: (item: NewsArticle) => Promise<void>;
  handleSaveAnn: (e: React.FormEvent) => Promise<void>;
  handleDeleteAnn: (id: number) => Promise<void>;
  handleToggleAnn: (item: Announcement) => Promise<void>;
  handleSaveProject: (e: React.FormEvent) => Promise<void>;
  handleDeleteProject: (id: number) => Promise<void>;
  handleSaveDept: (e: React.FormEvent) => Promise<void>;
  handleDeleteDept: (id: number) => Promise<void>;
  handleSaveInvestment: (e: React.FormEvent) => Promise<void>;
  handleDeleteInvestment: (id: number) => Promise<void>;
  handleToggleInvestment: (item: Investment) => Promise<void>;
  handleSaveSlide: (e: React.FormEvent) => Promise<void>;
  handleDeleteSlide: (id: number) => Promise<void>;
  handleSaveSettings: (e: React.FormEvent) => Promise<void>;
  handleCreateAdmin: (e: React.FormEvent) => Promise<void>;
  handleToggleActive: (admin: AdminUser) => Promise<void>;
  handleDeleteAdmin: (id: number) => Promise<void>;
  unreadCount: number;
  filteredMessages: ContactMessage[];
  tabClasses: (tabName: Tab) => string;
  badge: (published: boolean) => React.ReactNode;
  emptyNewsForm: typeof emptyNewsForm;
  emptyAnnouncementForm: typeof emptyAnnouncementForm;
  emptyProjectForm: typeof emptyProjectForm;
  emptyDeptForm: typeof emptyDeptForm;
  emptyInvestmentForm: typeof emptyInvestmentForm;
  fetchData: () => void;
}

const AdminContext = createContext<AdminContextType | null>(null);

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
}

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const { t } = useLocale();
  const router = useRouter();
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;

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
  const [formLang, setFormLang] = useState<'en' | 'am' | 'om'>('en');
  const [msgFilter, setMsgFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [msgSearch, setMsgSearch] = useState('');
  const [msgDateFrom, setMsgDateFrom] = useState('');
  const [msgDateTo, setMsgDateTo] = useState('');
  const [expandedMsg, setExpandedMsg] = useState<number | null>(null);
  const [newsSearch, setNewsSearch] = useState('');
  const [newsStatusFilter, setNewsStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [annSearch, setAnnSearch] = useState('');
  const [annStatusFilter, setAnnStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [deptSearch, setDeptSearch] = useState('');
  const [projSearch, setProjSearch] = useState('');
  const [projStatusFilter, setProjStatusFilter] = useState<'all' | 'planned' | 'ongoing' | 'completed'>('all');
  const [invSearch, setInvSearch] = useState('');
  const [invStatusFilter, setInvStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [invCategoryFilter, setInvCategoryFilter] = useState('');
  const [adminSearch, setAdminSearch] = useState('');
  const [adminStatusFilter, setAdminStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const [newsForm, setNewsForm] = useState<CmsFormState<typeof emptyNewsForm>>({ editing: false, editingId: null, data: { ...emptyNewsForm } });
  const [newsSubmitting, setNewsSubmitting] = useState(false);
  const [newsError, setNewsError] = useState('');
  const [annForm, setAnnForm] = useState<CmsFormState<typeof emptyAnnouncementForm>>({ editing: false, editingId: null, data: { ...emptyAnnouncementForm } });
  const [annSubmitting, setAnnSubmitting] = useState(false);
  const [annError, setAnnError] = useState('');
  const [projForm, setProjForm] = useState<CmsFormState<typeof emptyProjectForm>>({ editing: false, editingId: null, data: { ...emptyProjectForm } });
  const [projSubmitting, setProjSubmitting] = useState(false);
  const [projError, setProjError] = useState('');
  const [deptForm, setDeptForm] = useState<CmsFormState<typeof emptyDeptForm>>({ editing: false, editingId: null, data: { ...emptyDeptForm } });
  const [deptSubmitting, setDeptSubmitting] = useState(false);
  const [deptError, setDeptError] = useState('');
  const [invForm, setInvForm] = useState<CmsFormState<typeof emptyInvestmentForm>>({ editing: false, editingId: null, data: { ...emptyInvestmentForm } });
  const [invSubmitting, setInvSubmitting] = useState(false);
  const [invError, setInvError] = useState('');
  const [slideForm, setSlideForm] = useState<CmsFormState<{ imageUrl: string; description: string; sortOrder: number; isActive: boolean }>>({
    editing: false, editingId: null, data: { imageUrl: '', description: '', sortOrder: 0, isActive: true },
  });
  const [slideSubmitting, setSlideSubmitting] = useState(false);
  const [slideError, setSlideError] = useState('');
  const [settingsForm, setSettingsForm] = useState<Record<string, string>>({});
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsError, setSettingsError] = useState('');
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminForm, setAdminForm] = useState({ fullName: '', email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const [adminError, setAdminError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [togglingId, setTogglingId] = useState<number | null>(null);

  const fetchData = useCallback(() => {
    if (!token) { router.push('/admin/login'); return; }
    Promise.all([
      contactAdminApi.getAll(token), adminApi.getAll(token), newsApi.getAll(token), announcementsApi.getAll(token),
      projectsApi.getAll(), departmentsApi.getAll(), investmentsApi.getAll(token), heroSlidesApi.getAll(), settingsApi.getAll(),
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

  const handleLogout = () => { localStorage.removeItem('admin_token'); router.push('/admin/login'); };

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
    setNewsSubmitting(true); setNewsError('');
    try {
      if (newsForm.editingId) {
        const updated = await newsApi.update(token, newsForm.editingId, newsForm.data);
        setNews((p) => p.map((n) => (n.id === newsForm.editingId ? updated : n)));
      } else {
        const created = await newsApi.create(token, newsForm.data);
        setNews((p) => [created, ...p]);
      }
      setNewsForm({ editing: false, editingId: null, data: { ...emptyNewsForm } });
    } catch (err: unknown) { setNewsError(err instanceof Error ? err.message : 'Failed to save news'); } finally { setNewsSubmitting(false); }
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
    setAnnSubmitting(true); setAnnError('');
    try {
      if (annForm.editingId) {
        const updated = await announcementsApi.update(token, annForm.editingId, annForm.data);
        setAnnouncements((p) => p.map((a) => (a.id === annForm.editingId ? updated : a)));
      } else {
        const created = await announcementsApi.create(token, annForm.data);
        setAnnouncements((p) => [created, ...p]);
      }
      setAnnForm({ editing: false, editingId: null, data: { ...emptyAnnouncementForm } });
    } catch (err: unknown) { setAnnError(err instanceof Error ? err.message : 'Failed to save announcement'); } finally { setAnnSubmitting(false); }
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
    setProjSubmitting(true); setProjError('');
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
    } catch (err: unknown) { setProjError(err instanceof Error ? err.message : 'Failed to save project'); } finally { setProjSubmitting(false); }
  };
  const handleDeleteProject = async (id: number) => {
    if (!token) return;
    try { await projectsApi.remove(token, id); setProjects((p) => p.filter((pr) => pr.id !== id)); } catch {}
  };

  const handleSaveDept = async (e: React.FormEvent) => {
    e.preventDefault(); if (!token) return;
    setDeptSubmitting(true); setDeptError('');
    try {
      if (deptForm.editingId) {
        const updated = await departmentsApi.update(token, deptForm.editingId, deptForm.data);
        setDepartments((p) => p.map((d) => (d.id === deptForm.editingId ? updated : d)));
      } else {
        const created = await departmentsApi.create(token, deptForm.data);
        setDepartments((p) => [created, ...p]);
      }
      setDeptForm({ editing: false, editingId: null, data: { ...emptyDeptForm } });
    } catch (err: unknown) { setDeptError(err instanceof Error ? err.message : 'Failed to save department'); } finally { setDeptSubmitting(false); }
  };
  const handleDeleteDept = async (id: number) => {
    if (!token) return;
    try { await departmentsApi.remove(token, id); setDepartments((p) => p.filter((d) => d.id !== id)); } catch {}
  };

  const handleSaveInvestment = async (e: React.FormEvent) => {
    e.preventDefault(); if (!token) return;
    setInvSubmitting(true); setInvError('');
    try {
      if (invForm.editingId) {
        const updated = await investmentsApi.update(token, invForm.editingId, invForm.data);
        setInvestments((p) => p.map((inv) => (inv.id === invForm.editingId ? updated : inv)));
      } else {
        const created = await investmentsApi.create(token, invForm.data);
        setInvestments((p) => [created, ...p]);
      }
      setInvForm({ editing: false, editingId: null, data: { ...emptyInvestmentForm } });
    } catch (err: unknown) { setInvError(err instanceof Error ? err.message : 'Failed to save investment'); } finally { setInvSubmitting(false); }
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
    setSlideSubmitting(true); setSlideError('');
    try {
      if (slideForm.editingId) {
        const updated = await heroSlidesApi.update(token, slideForm.editingId, slideForm.data);
        setHeroSlides((p) => p.map((s) => (s.id === slideForm.editingId ? updated : s)));
      } else {
        const created = await heroSlidesApi.create(token, slideForm.data);
        setHeroSlides((p) => [...p, created]);
      }
      setSlideForm({ editing: false, editingId: null, data: { imageUrl: '', description: '', sortOrder: 0, isActive: true } });
    } catch (err: unknown) { setSlideError(err instanceof Error ? err.message : 'Failed to save slide'); } finally { setSlideSubmitting(false); }
  };
  const handleDeleteSlide = async (id: number) => {
    if (!token) return;
    try { await heroSlidesApi.remove(token, id); setHeroSlides((p) => p.filter((s) => s.id !== id)); } catch {}
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault(); if (!token) return;
    setSettingsSaving(true);
    setSettingsError('');
    try {
      const entries = Object.entries(settingsForm).map(([settingKey, settingValue]) => ({ settingKey, settingValue }));
      await settingsApi.upsertMany(token, entries);
      const fresh = await settingsApi.getAll();
      setSiteSettings(fresh);
    } catch (err: unknown) {
      setSettingsError(err instanceof Error ? err.message : 'Failed to save settings');
    } finally { setSettingsSaving(false); }
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

  const unreadCount = messages.filter((m) => !m.isRead).length;
  const filteredMessages = useMemo(() => {
    return messages.filter((m) => {
      if (msgFilter === 'unread' && m.isRead) return false;
      if (msgFilter === 'read' && !m.isRead) return false;
      if (msgDateFrom) {
        const from = new Date(msgDateFrom);
        from.setHours(0, 0, 0, 0);
        if (new Date(m.createdAt) < from) return false;
      }
      if (msgDateTo) {
        const to = new Date(msgDateTo);
        to.setHours(23, 59, 59, 999);
        if (new Date(m.createdAt) > to) return false;
      }
      if (msgSearch) {
        const q = msgSearch.toLowerCase();
        return (
          m.subject.toLowerCase().includes(q) ||
          m.name.toLowerCase().includes(q) ||
          m.email.toLowerCase().includes(q) ||
          m.message.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [messages, msgFilter, msgSearch, msgDateFrom, msgDateTo]);

  const filteredNews = useMemo(() => {
    return news.filter((n) => {
      if (newsStatusFilter === 'published' && !n.published) return false;
      if (newsStatusFilter === 'draft' && n.published) return false;
      if (newsSearch) {
        const q = newsSearch.toLowerCase();
        return (
          n.title.toLowerCase().includes(q) ||
          (n.titleAm || '').toLowerCase().includes(q) ||
          (n.titleOm || '').toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [news, newsSearch, newsStatusFilter]);

  const filteredAnnouncements = useMemo(() => {
    return announcements.filter((a) => {
      if (annStatusFilter === 'published' && !a.published) return false;
      if (annStatusFilter === 'draft' && a.published) return false;
      if (annSearch) {
        const q = annSearch.toLowerCase();
        return (
          a.title.toLowerCase().includes(q) ||
          (a.titleAm || '').toLowerCase().includes(q) ||
          (a.titleOm || '').toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [announcements, annSearch, annStatusFilter]);

  const filteredDepartments = useMemo(() => {
    return departments.filter((d) => {
      if (deptSearch) {
        const q = deptSearch.toLowerCase();
        return (
          d.name.toLowerCase().includes(q) ||
          (d.head || '').toLowerCase().includes(q) ||
          (d.email || '').toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [departments, deptSearch]);

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      if (projStatusFilter !== 'all' && p.status !== projStatusFilter) return false;
      if (projSearch) {
        const q = projSearch.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          (p.nameAm || '').toLowerCase().includes(q) ||
          (p.nameOm || '').toLowerCase().includes(q) ||
          (p.location || '').toLowerCase().includes(q) ||
          (p.contractor || '').toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [projects, projSearch, projStatusFilter]);

  const filteredInvestments = useMemo(() => {
    return investments.filter((inv) => {
      if (invStatusFilter === 'published' && !inv.published) return false;
      if (invStatusFilter === 'draft' && inv.published) return false;
      if (invCategoryFilter && inv.category !== invCategoryFilter) return false;
      if (invSearch) {
        const q = invSearch.toLowerCase();
        return (
          inv.title.toLowerCase().includes(q) ||
          (inv.titleAm || '').toLowerCase().includes(q) ||
          (inv.titleOm || '').toLowerCase().includes(q) ||
          (inv.location || '').toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [investments, invSearch, invStatusFilter, invCategoryFilter]);

  const filteredAdmins = useMemo(() => {
    return admins.filter((a) => {
      if (adminStatusFilter === 'active' && !a.isActive) return false;
      if (adminStatusFilter === 'inactive' && a.isActive) return false;
      if (adminSearch) {
        const q = adminSearch.toLowerCase();
        return (
          a.fullName.toLowerCase().includes(q) ||
          a.email.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [admins, adminSearch, adminStatusFilter]);



  const tabClasses = (tabName: Tab) =>
    `px-4 py-2 text-sm font-medium rounded-lg transition ${
      tab === tabName ? 'bg-slate-800 text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700'
    }`;

  const badge = (published: boolean) =>
    published
      ? <span className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-2 py-0.5 rounded-full font-medium">{t.admin.publishedBadge}</span>
      : <span className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full font-medium">{t.admin.draftBadge}</span>;

  const value: AdminContextType = {
    t, token, messages, setMessages, admins, setAdmins, news, setNews, announcements, setAnnouncements,
    projects, setProjects, departments, setDepartments, investments, setInvestments, heroSlides, setHeroSlides,
    siteSettings, setSiteSettings, loading, tab, setTab, formLang, setFormLang,
    msgFilter, setMsgFilter, msgSearch, setMsgSearch, msgDateFrom, setMsgDateFrom, msgDateTo, setMsgDateTo, expandedMsg, setExpandedMsg,
    newsSearch, setNewsSearch, newsStatusFilter, setNewsStatusFilter, filteredNews,
    annSearch, setAnnSearch, annStatusFilter, setAnnStatusFilter, filteredAnnouncements,
    deptSearch, setDeptSearch, filteredDepartments,
    projSearch, setProjSearch, projStatusFilter, setProjStatusFilter, filteredProjects,
    invSearch, setInvSearch, invStatusFilter, setInvStatusFilter, invCategoryFilter, setInvCategoryFilter, filteredInvestments,
    adminSearch, setAdminSearch, adminStatusFilter, setAdminStatusFilter, filteredAdmins,
    filteredHeroSlides: heroSlides,
    newsForm, setNewsForm, newsSubmitting, setNewsSubmitting, newsError, setNewsError,
    annForm, setAnnForm, annSubmitting, setAnnSubmitting, annError, setAnnError,
    projForm, setProjForm, projSubmitting, setProjSubmitting, projError, setProjError,
    deptForm, setDeptForm, deptSubmitting, setDeptSubmitting, deptError, setDeptError,
    invForm, setInvForm, invSubmitting, setInvSubmitting, invError, setInvError,
    slideForm, setSlideForm, slideSubmitting, setSlideSubmitting, slideError, setSlideError,
    settingsForm, setSettingsForm, settingsSaving, setSettingsSaving, settingsError, setSettingsError,
    showAdminModal, setShowAdminModal, adminForm, setAdminForm, submitting, setSubmitting, adminError, setAdminError,
    confirmDelete, setConfirmDelete, togglingId, setTogglingId,
    handleLogout, handleMarkRead, handleDeleteMsg,
    handleSaveNews, handleDeleteNews, handleToggleNews,
    handleSaveAnn, handleDeleteAnn, handleToggleAnn,
    handleSaveProject, handleDeleteProject,
    handleSaveDept, handleDeleteDept,
    handleSaveInvestment, handleDeleteInvestment, handleToggleInvestment,
    handleSaveSlide, handleDeleteSlide,
    handleSaveSettings, handleCreateAdmin, handleToggleActive, handleDeleteAdmin,
    unreadCount, filteredMessages, tabClasses, badge, fetchData,
    emptyNewsForm, emptyAnnouncementForm, emptyProjectForm, emptyDeptForm, emptyInvestmentForm,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}
