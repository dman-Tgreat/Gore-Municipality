'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from '@/context/LocaleContext';
import { contactAdminApi, adminApi, type ContactMessage, type AdminUser } from '@/lib/api';

export default function AdminDashboardPage() {
  const { t } = useLocale();
  const router = useRouter();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'messages' | 'admins'>('messages');

  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;

  useEffect(() => {
    if (!token) {
      router.push('/admin/login');
      return;
    }

    Promise.all([
      contactAdminApi.getAll(token),
      adminApi.getAll(token),
    ])
      .then(([msgs, adms]) => {
        setMessages(msgs);
        setAdmins(adms);
      })
      .catch(() => {
        localStorage.removeItem('admin_token');
        router.push('/admin/login');
      })
      .finally(() => setLoading(false));
  }, [token, router]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    router.push('/admin/login');
  };

  const handleMarkRead = async (id: number) => {
    if (!token) return;
    try {
      await contactAdminApi.markRead(token, id);
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, isRead: true } : m)));
    } catch {}
  };

  const handleDelete = async (id: number) => {
    if (!token) return;
    try {
      await contactAdminApi.delete(token, id);
      setMessages((prev) => prev.filter((m) => m.id !== id));
    } catch {}
  };

  if (!token) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">{t.admin.dashboard}</h1>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-500 hover:text-red-600 transition"
          >
            {t.admin.logout}
          </button>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        {/* Tabs */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setTab('messages')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
              tab === 'messages' ? 'bg-green-700 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            {t.admin.messages} ({messages.length})
          </button>
          <button
            onClick={() => setTab('admins')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
              tab === 'admins' ? 'bg-green-700 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            {t.admin.admins} ({admins.length})
          </button>
        </div>

        {loading ? (
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : tab === 'messages' ? (
          messages.length === 0 ? (
            <p className="text-center text-gray-500 py-12">{t.admin.noMessages}</p>
          ) : (
            <div className="space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`bg-white p-6 rounded-xl shadow-sm border transition ${
                  msg.isRead ? 'border-gray-100' : 'border-green-300 bg-green-50/30'
                }`}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">{msg.subject}</h3>
                      <p className="text-xs text-gray-500">{msg.name} — {msg.email}</p>
                    </div>
                    <span className="text-xs text-gray-400">{new Date(msg.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{msg.message}</p>
                  <div className="flex space-x-2 mt-3">
                    {!msg.isRead && (
                      <button
                        onClick={() => handleMarkRead(msg.id)}
                        className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-200 transition"
                      >
                        {t.admin.markRead}
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(msg.id)}
                      className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded-full hover:bg-red-200 transition"
                    >
                      {t.admin.delete}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left p-4 font-semibold text-gray-600">Name</th>
                  <th className="text-left p-4 font-semibold text-gray-600">Email</th>
                  <th className="text-left p-4 font-semibold text-gray-600">Status</th>
                  <th className="text-left p-4 font-semibold text-gray-600">Created</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((admin) => (
                  <tr key={admin.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="p-4 font-medium">{admin.fullName}</td>
                    <td className="p-4 text-gray-500">{admin.email}</td>
                    <td className="p-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        admin.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {admin.isActive ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="p-4 text-gray-400 text-xs">
                      {new Date(admin.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
