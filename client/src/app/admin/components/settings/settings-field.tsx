'use client';

import React from 'react';
import type { SettingField } from './settings-config';

interface Props {
  field: SettingField;
  value: string;
  onChange: (key: string, value: string) => void;
}

export function SettingsField({ field, value, onChange }: Props) {
  const id = `setting-${field.key}`;

  const baseClass =
    'w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none bg-white dark:bg-slate-800 transition';

  return (
    <div>
      <label htmlFor={id} className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
        {field.label}
      </label>
      {field.type === 'textarea' || field.type === 'json' ? (
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange(field.key, e.target.value)}
          placeholder={field.placeholder}
          rows={field.type === 'json' ? 5 : 3}
          className={`${baseClass} resize-y`}
        />
      ) : (
        <input
          id={id}
          type={field.type === 'tel' ? 'text' : field.type}
          value={value}
          onChange={(e) => onChange(field.key, e.target.value)}
          placeholder={field.placeholder}
          className={baseClass}
        />
      )}
      {field.helpText && (
        <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">{field.helpText}</p>
      )}
    </div>
  );
}
