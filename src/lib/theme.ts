export type ThemeMode = 'light' | 'dark' | 'auto';

/**
 * `layout.tsx` dagi inline skript `window.__setThemeMode`ni globalga
 * yozib qo'yadi — bu yerda faqat tipini beramiz, qayta yozmaymiz.
 * Ikkita joyda bir xil mantiq (localStorage, soat bo'yicha hisoblash)
 * bo'lmasligi uchun ataylab shunday: mantiq FOUC oldini olish uchun
 * `<head>`da, boshqarish esa shu yordamchi orqali.
 */
declare global {
  interface Window {
    __setThemeMode?: (mode: ThemeMode) => void;
    __getThemeMode?: () => ThemeMode;
  }
}

export function setThemeMode(mode: ThemeMode): void {
  window.__setThemeMode?.(mode);
  notifyThemeChanged();
}

export function getThemeMode(): ThemeMode {
  return window.__getThemeMode?.() ?? 'auto';
}

/**
 * Tema o'zgarishini kuzatish uchun obuna.
 *
 * `useSyncExternalStore` talab qiladigan shakl. Hodisani `setThemeMode`
 * ning o'zi tarqatadi: tema `<head>`dagi skript bilan boshqariladi va
 * uni kuzatadigan tayyor brauzer hodisasi yo'q.
 */
const THEME_EVENT = 'yopamiz:theme';

export function subscribeToThemeMode(onChange: () => void): () => void {
  window.addEventListener(THEME_EVENT, onChange);
  // Boshqa yorliqdagi o'zgarish ham yetib kelsin.
  window.addEventListener('storage', onChange);
  return () => {
    window.removeEventListener(THEME_EVENT, onChange);
    window.removeEventListener('storage', onChange);
  };
}

export function notifyThemeChanged(): void {
  window.dispatchEvent(new Event(THEME_EVENT));
}
