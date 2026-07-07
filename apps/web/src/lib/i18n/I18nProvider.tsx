'use client';
import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { DEFAULT_LOCALE, DICTIONARIES, isLocaleCode, isRtlLocale } from './locales';
import type { LocaleCode } from './types';

type Params = Record<string, string | number>;
type I18nContextValue = { locale: LocaleCode; setLocale: (locale: LocaleCode) => void; t: (key: string, params?: Params) => string; dir: 'ltr' | 'rtl' };
export const I18nContext = createContext<I18nContextValue | null>(null);
const STORAGE_KEY = 'mirror.locale';

function format(value: string, params?: Params) {
  if (!params) return value;
  return Object.entries(params).reduce((text, [key, param]) => text.replaceAll('{' + key + '}', String(param)), value);
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<LocaleCode>(DEFAULT_LOCALE);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && isLocaleCode(stored)) setLocaleState(stored);
  }, []);

  const setLocale = useCallback((next: LocaleCode) => {
    setLocaleState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = isRtlLocale(locale) ? 'rtl' : 'ltr';
  }, [locale]);

  const value = useMemo<I18nContextValue>(() => {
    const dir = isRtlLocale(locale) ? 'rtl' : 'ltr';
    return {
      locale,
      setLocale,
      dir,
      t: (key, params) => format(DICTIONARIES[locale][key] ?? DICTIONARIES.ja[key] ?? key, params),
    };
  }, [locale, setLocale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
