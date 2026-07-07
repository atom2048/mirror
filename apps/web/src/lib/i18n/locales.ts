import type { Dictionary, LocaleCode } from './types';
import { dictionary as ja } from './dictionaries/ja';
import { dictionary as en } from './dictionaries/en';
import { dictionary as zhCN } from './dictionaries/zh-CN';
import { dictionary as hi } from './dictionaries/hi';
import { dictionary as es } from './dictionaries/es';
import { dictionary as ar } from './dictionaries/ar';
import { dictionary as fr } from './dictionaries/fr';
import { dictionary as bn } from './dictionaries/bn';
import { dictionary as pt } from './dictionaries/pt';
import { dictionary as id } from './dictionaries/id';
import { dictionary as ur } from './dictionaries/ur';
import { dictionary as ru } from './dictionaries/ru';
import { dictionary as de } from './dictionaries/de';
import { dictionary as pcm } from './dictionaries/pcm';
import { dictionary as arz } from './dictionaries/arz';
import { dictionary as mr } from './dictionaries/mr';
import { dictionary as vi } from './dictionaries/vi';
import { dictionary as te } from './dictionaries/te';
import { dictionary as ha } from './dictionaries/ha';
import { dictionary as tr } from './dictionaries/tr';
import { dictionary as jv } from './dictionaries/jv';
import { dictionary as yue } from './dictionaries/yue';
import { dictionary as ko } from './dictionaries/ko';
import { dictionary as ta } from './dictionaries/ta';
import { dictionary as pa } from './dictionaries/pa';
import { dictionary as it } from './dictionaries/it';
import { dictionary as fa } from './dictionaries/fa';
import { dictionary as th } from './dictionaries/th';
import { dictionary as tl } from './dictionaries/tl';
import { dictionary as sw } from './dictionaries/sw';

export const DEFAULT_LOCALE: LocaleCode = 'ja';
export const RTL_LOCALES = new Set<LocaleCode>(['ar', 'arz', 'ur', 'fa']);
export const SUPPORTED_LOCALES: { code: LocaleCode; labelKey: string }[] = [
  { code: 'ja', labelKey: 'language.ja' }, { code: 'en', labelKey: 'language.en' }, { code: 'zh-CN', labelKey: 'language.zh-CN' }, { code: 'hi', labelKey: 'language.hi' }, { code: 'es', labelKey: 'language.es' }, { code: 'ar', labelKey: 'language.ar' }, { code: 'fr', labelKey: 'language.fr' }, { code: 'bn', labelKey: 'language.bn' }, { code: 'pt', labelKey: 'language.pt' }, { code: 'id', labelKey: 'language.id' }, { code: 'ur', labelKey: 'language.ur' }, { code: 'ru', labelKey: 'language.ru' }, { code: 'de', labelKey: 'language.de' }, { code: 'pcm', labelKey: 'language.pcm' }, { code: 'arz', labelKey: 'language.arz' }, { code: 'mr', labelKey: 'language.mr' }, { code: 'vi', labelKey: 'language.vi' }, { code: 'te', labelKey: 'language.te' }, { code: 'ha', labelKey: 'language.ha' }, { code: 'tr', labelKey: 'language.tr' }, { code: 'jv', labelKey: 'language.jv' }, { code: 'yue', labelKey: 'language.yue' }, { code: 'ko', labelKey: 'language.ko' }, { code: 'ta', labelKey: 'language.ta' }, { code: 'pa', labelKey: 'language.pa' }, { code: 'it', labelKey: 'language.it' }, { code: 'fa', labelKey: 'language.fa' }, { code: 'th', labelKey: 'language.th' }, { code: 'tl', labelKey: 'language.tl' }, { code: 'sw', labelKey: 'language.sw' },
];
export const DICTIONARIES: Record<LocaleCode, Dictionary> = { ja, en, 'zh-CN': zhCN, hi, es, ar, fr, bn, pt, id, ur, ru, de, pcm, arz, mr, vi, te, ha, tr, jv, yue, ko, ta, pa, it, fa, th, tl, sw };
export function isRtlLocale(locale: LocaleCode): boolean { return RTL_LOCALES.has(locale); }
export function isLocaleCode(value: string): value is LocaleCode { return SUPPORTED_LOCALES.some((locale) => locale.code === value); }
