import type { Locale } from './config';
import { defaultLocale } from './config';

const modules = import.meta.glob('./translations/*.json', { eager: true });

const translations: Record<string, Record<string, unknown>> = {};
for (const [path, mod] of Object.entries(modules)) {
  const locale = path.match(/\/(\w+)\.json$/)?.[1];
  if (locale) translations[locale] = (mod as { default: Record<string, unknown> }).default;
}

export function t(locale: Locale, key: string): string {
  const keys = key.split('.');
  let value: unknown = translations[locale] ?? translations[defaultLocale];
  for (const k of keys) {
    if (value && typeof value === 'object') {
      value = (value as Record<string, unknown>)[k];
    } else {
      return key;
    }
  }
  return typeof value === 'string' ? value : key;
}

export function tArray(locale: Locale, key: string): Record<string, string>[] {
  const keys = key.split('.');
  let value: unknown = translations[locale] ?? translations[defaultLocale];
  for (const k of keys) {
    if (value && typeof value === 'object') {
      value = (value as Record<string, unknown>)[k];
    } else {
      return [];
    }
  }
  return Array.isArray(value) ? value as Record<string, string>[] : [];
}

export function getLocalizedPath(locale: Locale, path: string = '/'): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}/${locale}${cleanPath === '/' ? '/' : cleanPath + '/'}`;
}
