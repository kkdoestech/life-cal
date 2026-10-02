import { en } from './en';
import { vi } from './vi';
import { Language } from '../state/types';

export type TranslationKey = keyof typeof en;

const dictionaries = {
  en,
  vi,
};

export function t(lang: Language, key: TranslationKey, params?: Record<string, string | number>): string {
  const dict = dictionaries[lang] || dictionaries.en;
  let text: string = dict[key] || en[key] || (key as string);

  if (params) {
    for (const [k, v] of Object.entries(params)) {
      text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
    }
  }

  return text;
}
