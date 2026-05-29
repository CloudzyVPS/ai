export const locales = [
  'en_us', 'en_gb', 'en_au', 'en_sg',
  'de_de', 'de_ch', 'nl_nl', 'ar_ae',
] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en_us';

export const localeMetadata: Record<Locale, {
  label: string;
  htmlLang: string;
  dir: 'ltr' | 'rtl';
  flag: string;
  region: string;
}> = {
  en_us: { label: 'English (US)', htmlLang: 'en-US', dir: 'ltr', flag: '\u{1F1FA}\u{1F1F8}', region: 'United States' },
  en_gb: { label: 'English (UK)', htmlLang: 'en-GB', dir: 'ltr', flag: '\u{1F1EC}\u{1F1E7}', region: 'United Kingdom' },
  en_au: { label: 'English (AU)', htmlLang: 'en-AU', dir: 'ltr', flag: '\u{1F1E6}\u{1F1FA}', region: 'Australia' },
  en_sg: { label: 'English (SG)', htmlLang: 'en-SG', dir: 'ltr', flag: '\u{1F1F8}\u{1F1EC}', region: 'Singapore' },
  de_de: { label: 'Deutsch', htmlLang: 'de-DE', dir: 'ltr', flag: '\u{1F1E9}\u{1F1EA}', region: 'Deutschland' },
  de_ch: { label: 'Deutsch (CH)', htmlLang: 'de-CH', dir: 'ltr', flag: '\u{1F1E8}\u{1F1ED}', region: 'Schweiz' },
  nl_nl: { label: 'Nederlands', htmlLang: 'nl-NL', dir: 'ltr', flag: '\u{1F1F3}\u{1F1F1}', region: 'Nederland' },
  ar_ae: { label: '\u{0627}\u{0644}\u{0639}\u{0631}\u{0628}\u{064A}\u{0629}', htmlLang: 'ar-AE', dir: 'rtl', flag: '\u{1F1E6}\u{1F1EA}', region: '\u{0627}\u{0644}\u{0625}\u{0645}\u{0627}\u{0631}\u{0627}\u{062A}' },
};

export function isRtl(locale: Locale): boolean {
  return localeMetadata[locale].dir === 'rtl';
}

export function getLocaleFromPath(path: string): Locale {
  const segment = path.split('/').filter(Boolean).find(s => locales.includes(s as Locale));
  return (segment as Locale) ?? defaultLocale;
}
