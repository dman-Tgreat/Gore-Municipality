'use client';

import React from 'react';
import { SettingsField } from './settings-field';
import { type SettingsGroup } from './settings-config';

interface Props {
  group: SettingsGroup;
  settingsForm: Record<string, string>;
  onChange: (key: string, value: string) => void;
  icon: React.ReactNode;
  colorClass: string;
}

export function SettingsGroupSection({ group, settingsForm, onChange, icon, colorClass }: Props) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 space-y-5">
      <div className="flex items-start gap-3 pb-2 border-b border-slate-100 dark:border-slate-700">
        <div className={`w-9 h-9 rounded-lg ${colorClass} flex items-center justify-center shrink-0`}>
          {icon}
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-white">{group.title}</h3>
          {group.description && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{group.description}</p>
          )}
        </div>
      </div>
      <div className="grid gap-4">
        {group.fields.map((field) => (
          <SettingsField key={field.key} field={field} value={settingsForm[field.key] || ''} onChange={onChange} />
        ))}
      </div>
    </div>
  );
}
