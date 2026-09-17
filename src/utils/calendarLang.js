export const LANG_STORAGE_KEY = 'dc-calendar-lang';

export function getStoredLang(defaultLang) {
  if (typeof window === 'undefined') return defaultLang;
  return localStorage.getItem(LANG_STORAGE_KEY) || defaultLang;
}
