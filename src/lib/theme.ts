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
}

export function getThemeMode(): ThemeMode {
  return window.__getThemeMode?.() ?? 'auto';
}
