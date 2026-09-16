import { getLocales } from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import de from './locales/de.json';
import en from './locales/en.json';
import fr from './locales/fr.json';
import it from './locales/it.json';
import nl from './locales/nl.json';

/** All locales the string layer knows. de/fr fall back to en until translated. */
export const LOCALES = ['en', 'nl', 'it', 'de', 'fr'] as const;
export type Locale = (typeof LOCALES)[number];
/** Locales offered in the language picker (translated). */
export const PICKER_LOCALES: Locale[] = ['en', 'nl', 'it'];

export const resources = {
  en: { translation: en },
  nl: { translation: nl },
  it: { translation: it },
  de: { translation: de },
  fr: { translation: fr },
} as const;

export function isLocale(v: unknown): v is Locale {
  return typeof v === 'string' && (LOCALES as readonly string[]).includes(v);
}

/** Device language when it is one we translate, else English. */
export function deviceLocale(): Locale {
  const code = getLocales()[0]?.languageCode ?? 'en';
  return PICKER_LOCALES.includes(code as Locale) ? (code as Locale) : 'en';
}

i18n.use(initReactI18next).init({
  resources,
  lng: deviceLocale(),
  fallbackLng: 'en',
  // PWA strings use {name}; keep them verbatim
  interpolation: { prefix: '{', suffix: '}', escapeValue: false },
  returnNull: false,
});

export function setLocale(locale: Locale) {
  if (i18n.language !== locale) void i18n.changeLanguage(locale);
}

export function currentLocale(): Locale {
  return isLocale(i18n.language) ? i18n.language : 'en';
}

export default i18n;
