import {
  format,
  formatDistanceToNow,
  formatRelative,
  isToday,
  isYesterday,
  parseISO,
} from 'date-fns';
import { enUS, ptBR } from 'date-fns/locale';

/**
 * Date and number formatting utilities
 */

const locales = {
  en: enUS,
  pt: ptBR,
};

type LocaleKey = keyof typeof locales;

/**
 * Format a timestamp to relative time (e.g., "5 minutes ago")
 */
export function formatRelativeTime(
  timestamp: number | Date,
  locale: LocaleKey = 'en'
): string {
  const date = typeof timestamp === 'number' ? new Date(timestamp * 1000) : timestamp;
  return formatDistanceToNow(date, {
    addSuffix: true,
    locale: locales[locale],
  });
}

/**
 * Format a timestamp to date/time string
 */
export function formatDateTime(
  timestamp: number | Date,
  locale: LocaleKey = 'en'
): string {
  const date = typeof timestamp === 'number' ? new Date(timestamp * 1000) : timestamp;
  return format(date, 'PPp', { locale: locales[locale] });
}

/**
 * Format a timestamp to date only
 */
export function formatDate(timestamp: number | Date, locale: LocaleKey = 'en'): string {
  const date = typeof timestamp === 'number' ? new Date(timestamp * 1000) : timestamp;
  return format(date, 'PP', { locale: locales[locale] });
}

/**
 * Format a timestamp to time only
 */
export function formatTime(timestamp: number | Date, locale: LocaleKey = 'en'): string {
  const date = typeof timestamp === 'number' ? new Date(timestamp * 1000) : timestamp;
  return format(date, 'p', { locale: locales[locale] });
}

export interface FormatSmartDateLabels {
  todayAt: string; // e.g. "Today at {{time}}"
  yesterdayAt: string; // e.g. "Yesterday at {{time}}"
}

/**
 * Format timestamp with smart relative display
 * - Today: "Today at 2:30 PM" (or translated)
 * - Yesterday: "Yesterday at 2:30 PM" (or translated)
 * - This week: "Monday at 2:30 PM"
 * - Older: "Jan 15, 2024"
 */
export function formatSmartDate(
  timestamp: number | Date,
  locale: LocaleKey = 'en',
  labels?: FormatSmartDateLabels
): string {
  const date = typeof timestamp === 'number' ? new Date(timestamp * 1000) : timestamp;
  const timeStr = formatTime(date, locale);

  if (isToday(date)) {
    return labels
      ? labels.todayAt.replace('{{time}}', timeStr)
      : `Today at ${timeStr}`;
  }

  if (isYesterday(date)) {
    return labels
      ? labels.yesterdayAt.replace('{{time}}', timeStr)
      : `Yesterday at ${timeStr}`;
  }

  const now = new Date();
  const daysDiff = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysDiff < 7) {
    return formatRelative(date, now, { locale: locales[locale] });
  }

  return formatDate(date, locale);
}

/**
 * Format a number with locale-aware separators
 */
export function formatNumber(
  value: number,
  options: Intl.NumberFormatOptions = {},
  locale = 'en-US'
): string {
  return new Intl.NumberFormat(locale, options).format(value);
}

/**
 * Format a large number with K/M/B suffixes
 */
export function formatCompactNumber(value: number, locale = 'en-US'): string {
  return new Intl.NumberFormat(locale, {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
}

/**
 * Format hashrate with appropriate unit
 */
export function formatHashrate(hashesPerSecond: number): string {
  const units = ['H/s', 'KH/s', 'MH/s', 'GH/s', 'TH/s', 'PH/s'];
  let unitIndex = 0;
  let value = hashesPerSecond;

  while (value >= 1000 && unitIndex < units.length - 1) {
    value /= 1000;
    unitIndex++;
  }

  return `${value.toFixed(2)} ${units[unitIndex]}`;
}

/**
 * Format difficulty with appropriate unit
 */
export function formatDifficulty(difficulty: number): string {
  const units = ['', 'K', 'M', 'G', 'T', 'P', 'E'];
  let unitIndex = 0;
  let value = difficulty;

  while (value >= 1000 && unitIndex < units.length - 1) {
    value /= 1000;
    unitIndex++;
  }

  const formattedValue = unitIndex === 0 ? value.toFixed(0) : value.toFixed(2);
  return `${formattedValue}${units[unitIndex]}`;
}

/**
 * Format percentage
 */
export function formatPercentage(
  value: number,
  decimals = 2,
  locale = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value / 100);
}

/**
 * Format block height with commas
 */
export function formatBlockHeight(height: number, locale = 'en-US'): string {
  return new Intl.NumberFormat(locale).format(height);
}
