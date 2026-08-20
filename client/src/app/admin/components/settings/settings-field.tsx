'use client';

import React, { useEffect, useRef } from 'react';
import type { SettingField } from './settings-config';
import { AlertCircle } from 'lucide-react';

interface Props {
  field: SettingField;
  value: string;
  onChange: (key: string, value: string) => void;
  error?: string;
  onValidate?: (key: string, error: string) => void;
}

export function SettingsField({ field, value, onChange, error, onValidate }: Props) {
  const id = `setting-${field.key}`;
  const prevValue = useRef(value);

  const baseClass =
    'w-full px-3 py-2 border rounded-md text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-600 outline-none bg-white dark:bg-slate-800 transition';
  const borderClass = error
    ? 'border-red-400 dark:border-red-500'
    : 'border-slate-300 dark:border-slate-600';

  const validate = (val: string): string => {
    if (field.required && !val.trim()) {
      return `${field.label} is required`;
    }
    if (val && field.pattern && !new RegExp(field.pattern).test(val)) {
      return field.patternMessage || `Invalid format for ${field.label}`;
    }
    if (val && field.maxLength && val.length > field.maxLength) {
      return `${field.label} must be ${field.maxLength} characters or less`;
    }
    return '';
  };

  const handleChange = (newVal: string) => {
    onChange(field.key, newVal);
    // If field already has an error, re-validate as user types
    if (error) {
      onValidate?.(field.key, validate(newVal));
    }
  };

  const handleBlur = () => {
    const msg = validate(value);
    if (msg) onValidate?.(field.key, msg);
  };

  // Re-validate when value changes externally (e.g. reset)
  useEffect(() => {
    if (prevValue.current !== value) {
      prevValue.current = value;
      if (error) {
        onValidate?.(field.key, validate(value));
      }
    }
  }, [value, error, field.key, onValidate, field]);

  return (
    <div>
      <label htmlFor={id} className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {field.type === 'textarea' || field.type === 'json' ? (
        <textarea
          id={id}
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={handleBlur}
          placeholder={field.placeholder}
          rows={field.type === 'json' ? 5 : 3}
          maxLength={field.maxLength}
          className={`${baseClass} ${borderClass} resize-y`}
        />
      ) : (
        <input
          id={id}
          type={field.type === 'tel' ? 'text' : field.type}
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={handleBlur}
          placeholder={field.placeholder}
          maxLength={field.maxLength}
          className={`${baseClass} ${borderClass}`}
        />
      )}
      {error && (
        <p className="flex items-center gap-1 mt-1 text-[11px] text-red-600 dark:text-red-400">
          <AlertCircle className="w-3 h-3 shrink-0" />
          {error}
        </p>
      )}
      {field.helpText && !error && (
        <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">{field.helpText}</p>
      )}
    </div>
  );
}
