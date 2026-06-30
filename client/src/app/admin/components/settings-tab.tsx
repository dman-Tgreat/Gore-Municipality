'use client';

import React from 'react';
import { useAdmin } from './admin-context';
import { Spinner } from './spinner';

export function SettingsTab() {
  const { t, settingsForm, setSettingsForm, handleSaveSettings, settingsSaving } = useAdmin();
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
