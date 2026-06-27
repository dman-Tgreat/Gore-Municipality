const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(error.message || `Request failed: ${res.status}`);
  }

  return res.json();
}

function authHeaders(token: string): Record<string, string> {
  return { Authorization: `Bearer ${token}` };
}

// --- Public endpoints ---

export interface NewsArticle {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  coverImage?: string;
  published: boolean;
  createdBy: { id: number; fullName: string; email: string };
  createdAt: string;
  updatedAt: string;
}

export const newsApi = {
  getAll: () => request<NewsArticle[]>('/news'),
  getOne: (id: number) => request<NewsArticle>(`/news/${id}`),
};

export interface Announcement {
  id: number;
  title: string;
  description: string;
  content: string;
  published: boolean;
  createdBy: { id: number; fullName: string; email: string };
  createdAt: string;
  updatedAt: string;
}

export const announcementsApi = {
  getAll: () => request<Announcement[]>('/announcements'),
  getOne: (id: number) => request<Announcement>(`/announcements/${id}`),
};

export interface Department {
  id: number;
  name: string;
  description: string;
  head: string;
  phone: string;
  email: string;
  office: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export const departmentsApi = {
  getAll: () => request<Department[]>('/departments'),
  getOne: (id: number) => request<Department>(`/departments/${id}`),
};

export interface Project {
  id: number;
  name: string;
  description: string;
  budget?: number;
  status: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  coverImage?: string;
  fundingSource?: string;
  contractor?: string;
  category?: string;
  createdBy: { id: number; fullName: string; email: string };
  createdAt: string;
  updatedAt: string;
}

export const projectsApi = {
  getAll: () => request<Project[]>('/projects'),
  getOne: (id: number) => request<Project>(`/projects/${id}`),
};

// --- Contact (public POST) ---

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export const contactApi = {
  submit: (data: { name: string; email: string; subject: string; message: string }) =>
    request<ContactMessage>('/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// --- Auth ---

export interface LoginResponse {
  success: boolean;
  message: string;
  accessToken: string;
}

export const authApi = {
  login: (email: string, password: string) =>
    request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
};

// --- Admin (JWT required) ---

export interface AdminUser {
  id: number;
  fullName: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const adminApi = {
  getAll: (token: string) =>
    request<AdminUser[]>('/admin', { headers: authHeaders(token) }),
  getOne: (token: string, id: number) =>
    request<AdminUser>(`/admin/${id}`, { headers: authHeaders(token) }),
};

export const contactAdminApi = {
  getAll: (token: string) =>
    request<ContactMessage[]>('/contact', { headers: authHeaders(token) }),
  markRead: (token: string, id: number) =>
    request<ContactMessage>(`/contact/${id}`, {
      method: 'PATCH',
      headers: authHeaders(token),
      body: JSON.stringify({ isRead: true }),
    }),
  delete: (token: string, id: number) =>
    request<{ message: string }>(`/contact/${id}`, {
      method: 'DELETE',
      headers: authHeaders(token),
    }),
};
