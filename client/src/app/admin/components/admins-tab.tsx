'use client';

import React from 'react';
import { useAdmin } from './admin-context';
import { Spinner } from './spinner';

export function AdminsTab() {
  const { t, admins, showAdminModal, setShowAdminModal, adminForm, setAdminForm, handleCreateAdmin, handleToggleActive, handleDeleteAdmin, submitting, adminError, togglingId, confirmDelete, setConfirmDelete } = useAdmin();
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

      {/* Admin Create Modal */}
      {showAdminModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setShowAdminModal(false)}>
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
    </>
  );
}
