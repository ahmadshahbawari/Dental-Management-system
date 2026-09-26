/**
 * Shared preferences hook.
 * Reads/writes a single JSON blob from localStorage so every component
 * that calls usePreferences() sees the same values.
 */
import { useState, useCallback } from 'react';

const PREF_KEY = 'dental_lab_preferences';

export interface Prefs {
  // Appearance
  theme: 'light' | 'dark' | 'system';
  sidebarCollapsed: boolean;
  compactMode: boolean;
  // Notifications
  desktopNotifications: boolean;
  soundAlerts: boolean;
  caseAlerts: boolean;
  inventoryAlerts: boolean;
  paymentAlerts: boolean;
  // Dashboard
  showCharts: boolean;
  showRecentActivity: boolean;
  defaultDashboardView: 'all' | 'my-work';
  // Language / Region
  language: string;
  dateFormat: string;
  timeFormat: '12h' | '24h';
}

export const defaultPrefs: Prefs = {
  theme: 'system',
  sidebarCollapsed: false,
  compactMode: false,
  desktopNotifications: true,
  soundAlerts: false,
  caseAlerts: true,
  inventoryAlerts: true,
  paymentAlerts: true,
  showCharts: true,
  showRecentActivity: true,
  defaultDashboardView: 'all',
  language: 'en',
  dateFormat: 'MM/DD/YYYY',
  timeFormat: '12h',
};

function readFromStorage(): Prefs {
  try {
    const raw = localStorage.getItem(PREF_KEY);
    if (raw) return { ...defaultPrefs, ...JSON.parse(raw) } as Prefs;
  } catch { /* ignore parse errors */ }
  return { ...defaultPrefs };
}

export function usePreferences() {
  const [prefs, setPrefsState] = useState<Prefs>(readFromStorage);

  const setPrefs = useCallback((next: Prefs) => {
    localStorage.setItem(PREF_KEY, JSON.stringify(next));
    setPrefsState(next);
  }, []);

  const update = useCallback(<K extends keyof Prefs>(key: K, value: Prefs[K]) => {
    setPrefsState(prev => {
      const next = { ...prev, [key]: value };
      localStorage.setItem(PREF_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { prefs, setPrefs, update };
}

/** One-shot read for the sidebar collapse preference (used at Sidebar mount). */
export function readSidebarPref(): boolean {
  try {
    const raw = localStorage.getItem(PREF_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<Prefs>;
      return parsed.sidebarCollapsed ?? false;
    }
  } catch { /* ignore */ }
  return false;
}
