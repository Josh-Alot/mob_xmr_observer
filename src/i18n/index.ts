import { I18n } from 'i18n-js';

import en from './locales/en.json';
import pt from './locales/pt.json';

/**
 * Internationalization setup
 */

export const translations = {
  en,
  pt,
} as const;

export type TranslationKey = keyof typeof en;
export type SupportedLocale = keyof typeof translations;

// Initialize i18n instance
const i18n = new I18n(translations);

// Set default locale (actual locale is synced from app settings)
i18n.defaultLocale = 'en';
i18n.locale = 'en';
i18n.enableFallback = true;

/**
 * Get current locale
 */
export function getCurrentLocale(): SupportedLocale {
  return i18n.locale as SupportedLocale;
}

/**
 * Set locale
 */
export function setLocale(locale: SupportedLocale): void {
  i18n.locale = locale;
}

/**
 * Translate a key
 */
export function t(
  key: string,
  options?: Record<string, string | number>
): string {
  return i18n.t(key, options);
}

/**
 * Check if a locale is supported
 */
export function isLocaleSupported(locale: string): locale is SupportedLocale {
  return locale in translations;
}

/**
 * Get all supported locales
 */
export function getSupportedLocales(): SupportedLocale[] {
  return Object.keys(translations) as SupportedLocale[];
}

export { i18n };
export default i18n;
