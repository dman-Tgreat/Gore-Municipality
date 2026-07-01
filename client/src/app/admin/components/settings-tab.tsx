'use client';

import React from 'react';
import { Phone, FileText, BookOpen, Newspaper, BarChart3 } from 'lucide-react';
import { useAdmin } from './admin-context';
import { Spinner } from './spinner';
import { SettingsGroupSection } from './settings/section-group';
import { SETTINGS_GROUPS } from './settings/settings-config';

export function SettingsTab() {
  const { t, settingsForm, setSettingsForm, handleSaveSettings, settingsSaving } = useAdmin();

  const handleChange = (key: string, value: string) => {
    setSettingsForm((prev) => ({ ...prev, [key]: value }));
  };

  const groupConfig: Record<string, { icon: React.ReactNode; colorClass: string }> = {
    contact: { icon: <Phone className="w-4 h-4 text-blue-600 dark:text-blue-400" />, colorClass: 'bg-blue-100 dark:bg-blue-900/30' },
    footer:  { icon: <FileText className="w-4 h-4 text-purple-600 dark:text-purple-400" />, colorClass: 'bg-purple-100 dark:bg-purple-900/30' },
    about:   { icon: <BookOpen className="w-4 h-4 text-amber-600 dark:text-amber-400" />, colorClass: 'bg-amber-100 dark:bg-amber-900/30' },
    news:    { icon: <Newspaper className="w-4 h-4 text-green-600 dark:text-green-400" />, colorClass: 'bg-green-100 dark:bg-green-900/30' },
    stats:   { icon: <BarChart3 className="w-4 h-4 text-rose-600 dark:text-rose-400" />, colorClass: 'bg-rose-100 dark:bg-rose-900/30' },
  };

  return (
    <form onSubmit={handleSaveSettings} className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-1">{t.admin.cmsSettings}</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">Manage site-wide labels and text content</p>
      </div>

      {/* Grouped Sections */}
      {SETTINGS_GROUPS.map((group) => (
        <SettingsGroupSection
          key={group.id}
          group={group}
          settingsForm={settingsForm}
          onChange={handleChange}
          icon={groupConfig[group.id]?.icon}
          colorClass={groupConfig[group.id]?.colorClass ?? ''}
        />
      ))}

      {/* Save Button */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <button type="submit" disabled={settingsSaving}
          className="bg-slate-800 text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-slate-700 transition disabled:opacity-50 flex items-center gap-2">
          {settingsSaving && <Spinner className="w-4 h-4" />}
          {settingsSaving ? t.admin.saving : t.admin.saveAllSettings}
        </button>
      </div>
    </form>
  );
}
