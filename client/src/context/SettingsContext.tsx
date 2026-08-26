'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { settingsApi, type SiteSetting } from '@/lib/api';

interface SettingsContextType {
  settings: Record<string, string>;
  rawSettings: SiteSetting[];
  loading: boolean;
}

const SettingsContext = createContext<SettingsContextType>({
  settings: {},
  rawSettings: [],
  loading: true,
});

export function useSettings() {
  return useContext(SettingsContext);
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [rawSettings, setRawSettings] = useState<SiteSetting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    settingsApi
      .getAll()
      .then((data) => {
        const map: Record<string, string> = {};
        data.forEach((s: SiteSetting) => {
          map[s.settingKey] = s.settingValue;
        });
        setSettings(map);
        setRawSettings(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, rawSettings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
}
