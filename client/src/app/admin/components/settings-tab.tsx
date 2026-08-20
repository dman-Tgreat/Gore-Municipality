'use client';

import React, { useState, useCallback } from 'react';
import { Phone, FileText, BookOpen, Newspaper, BarChart3 } from 'lucide-react';
import { useAdmin } from './admin-context';
import { Spinner } from './spinner';
import { FormError } from './form-error';
import { SettingsGroupSection } from './settings/section-group';
import { SETTINGS_GROUPS } from './settings/settings-config';

export function SettingsTab() {
  const { t, settingsForm, setSettingsForm, handleSaveSettings, settingsSaving, settingsError } = useAdmin();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleChange = (key: string, value: string) => {
    setSettingsForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleFieldValidate = useCallback((key: string, error: string) => {
    setFieldErrors((prev) => {
      if (error) return { ...prev, [key]: error };
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  const validateAll = (): boolean => {
    const errors: Record<string, string> = {};
    for (const group of SETTINGS_GROUPS) {
      for (const field of group.fields) {
        const value = settingsForm[field.key] || '';
        if (field.required && !value.trim()) {
          errors[field.key] = `${field.label} is required`;
        } else if (value && field.pattern && !new RegExp(field.pattern).test(value)) {
          errors[field.key] = field.patternMessage || `Invalid format for ${field.label}`;
        } else if (value && field.maxLength && value.length > field.maxLength) {
          errors[field.key] = `${field.label} must be ${field.maxLength} characters or less`;
        }
      }
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateAll()) {
      handleSaveSettings(e);
    }
  };

  const groupConfig: Record<string, { icon: React.ReactNode; colorClass: string }> = {
    contact: { icon: <Phone className="w-4 h-4 text-blue-600 dark:text-blue-400" />, colorClass: 'bg-blue-100 dark:bg-blue-900/30' },
    footer:  { icon: <FileText className="w-4 h-4 text-purple-600 dark:text-purple-400" />, colorClass: 'bg-purple-100 dark:bg-purple-900/30' },
    about:   { icon: <BookOpen className="w-4 h-4 text-amber-600 dark:text-amber-400" />, colorClass: 'bg-amber-100 dark:bg-amber-900/30' },
    news:    { icon: <Newspaper className="w-4 h-4 text-green-600 dark:text-green-400" />, colorClass: 'bg-green-100 dark:bg-green-900/30' },
    stats:   { icon: <BarChart3 className="w-4 h-4 text-rose-600 dark:text-rose-400" />, colorClass: 'bg-rose-100 dark:bg-rose-900/30' },
  };

  const hasErrors = Object.keys(fieldErrors).length > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-1">{t.admin.cmsSettings}</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">Manage site-wide labels and text content</p>
      </div>

      {/* Validation summary */}
      {hasErrors && (
        <FormError message={`Please fix ${Object.keys(fieldErrors).length} field(s) before saving.`} />
      )}

      {/* Grouped Sections */}
      {SETTINGS_GROUPS.map((group) => (
        <SettingsGroupSection
          key={group.id}
          group={group}
          settingsForm={settingsForm}
          onChange={handleChange}
          icon={groupConfig[group.id]?.icon}
          colorClass={groupConfig[group.id]?.colorClass ?? ''}
          errors={fieldErrors}
          onValidate={handleFieldValidate}
        />
      ))}

      {/* Save Button */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <FormError message={settingsError} className="mb-4" />
        <button type="submit" disabled={settingsSaving}
          className="bg-slate-800 text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-slate-700 transition disabled:opacity-50 flex items-center gap-2">
          {settingsSaving && <Spinner className="w-4 h-4" />}
          {settingsSaving ? t.admin.saving : t.admin.saveAllSettings}
        </button>
      </div>
    </form>
  );
}
