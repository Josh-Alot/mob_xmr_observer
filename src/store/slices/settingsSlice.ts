import { StateCreator } from 'zustand';
import { Sidechain } from '@api/endpoints';

/**
 * Theme mode options
 */
export type ThemeMode = 'light' | 'dark' | 'system';

/**
 * Supported languages
 */
export type Language = 'en' | 'pt';

/**
 * Settings state slice
 * Manages user preferences
 */
export interface SettingsSlice {
  settings: {
    sidechain: Sidechain;
    theme: ThemeMode;
    language: Language;
    refreshInterval: number; // minutes
    notificationsEnabled: boolean;
    hapticFeedbackEnabled: boolean;
    payoutLimit: number;
  };
  setSidechain: (sidechain: Sidechain) => void;
  setTheme: (theme: ThemeMode) => void;
  setLanguage: (language: Language) => void;
  setRefreshInterval: (minutes: number) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  setHapticFeedbackEnabled: (enabled: boolean) => void;
  setPayoutLimit: (limit: number) => void;
  resetSettings: () => void;
}

const DEFAULT_SETTINGS: SettingsSlice['settings'] = {
  sidechain: 'main',
  theme: 'system',
  language: 'en',
  refreshInterval: 5,
  notificationsEnabled: false,
  hapticFeedbackEnabled: true,
  payoutLimit: 20,
};

export const createSettingsSlice: StateCreator<SettingsSlice, [], [], SettingsSlice> = (set) => ({
  settings: DEFAULT_SETTINGS,

  setSidechain: (sidechain: Sidechain) =>
    set((state) => ({
      settings: { ...state.settings, sidechain },
    })),

  setTheme: (theme: ThemeMode) =>
    set((state) => ({
      settings: { ...state.settings, theme },
    })),

  setLanguage: (language: Language) =>
    set((state) => ({
      settings: { ...state.settings, language },
    })),

  setRefreshInterval: (refreshInterval: number) =>
    set((state) => ({
      settings: { ...state.settings, refreshInterval },
    })),

  setNotificationsEnabled: (notificationsEnabled: boolean) =>
    set((state) => ({
      settings: { ...state.settings, notificationsEnabled },
    })),

  setHapticFeedbackEnabled: (hapticFeedbackEnabled: boolean) =>
    set((state) => ({
      settings: { ...state.settings, hapticFeedbackEnabled },
    })),

  setPayoutLimit: (payoutLimit: number) =>
    set((state) => ({
      settings: { ...state.settings, payoutLimit },
    })),

  resetSettings: () =>
    set({
      settings: DEFAULT_SETTINGS,
    }),
});
