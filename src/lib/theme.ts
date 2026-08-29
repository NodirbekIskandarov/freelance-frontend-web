export type ThemeMode = 'light' | 'dark' | 'auto';

const KEY = 'theme-mode';

/**
 * Tema boshqaruvi.
 *
 * Mantiq SHU YERDA, `layout.tsx` dagi inline skriptda emas.
 *
 * Ilgari teskari edi: skript `window.__setThemeMode` va `__applyTheme` ni
 * globalga yozardi, bu modul esa faqat ularni chaqirardi. U ishlaydi —
 * skript ishga tushgan sahifada. 404 da esa tushmaydi: Next o'zining xato
 * qobig'ini (`<html id="__next_error__">`) yuboradi, bizning layout esa
 * uning ustidan brauzerda chiziladi va `dangerouslySetInnerHTML` bilan
 * qo'yilgan `<script>` bunday holatda BAJARILMAYDI. Natijada
 * `window.__applyTheme` umuman yo'q edi, `?.` uni jimgina yutardi va 404
 * doim oq fonda chiqardi — tema tugmasi ham u yerda ishlamasdi.
 *
 * Endi skript faqat BIRINCHI CHIZISHNI tezlashtiradi (FOUC bo'lmasin),
 * ishning o'zi esa shu modulda. Mantiq ikki joyda takrorlanadi va bu
 * ataylab: skript modul yuklanguncha, `<head>` chizilishi bilan ishlashi
 * kerak, ya'ni u import qila olmaydi.
 */

function isNightByHour(): boolean {
  const hour = new Date().getHours();
  return hour >= 20 || hour < 8;
}

function read(): ThemeMode {
  try {
    const stored = window.localStorage.getItem(KEY);
    if (stored === 'light' || stored === 'dark' || stored === 'auto') return stored;
  } catch {
    // Private rejim yoki storage o'chirilgan — sukut bo'yicha `auto`.
  }
  return 'auto';
}

/** Saqlangan tanlovni DOM'ga qo'llaydi. */
export function applyTheme(mode?: ThemeMode): void {
  if (typeof document === 'undefined') return;

  const resolvedMode = mode ?? read();
  const root = document.documentElement;
  const resolved = resolvedMode === 'auto' ? (isNightByHour() ? 'dark' : 'light') : resolvedMode;
  root.classList.toggle('dark', resolved === 'dark');
  root.dataset.themeMode = resolvedMode;
}

export function setThemeMode(mode: ThemeMode): void {
  try {
    window.localStorage.setItem(KEY, mode);
  } catch {
    // Saqlab bo'lmasa ham joriy sahifada tema o'zgarsin.
  }
  applyTheme(mode);
  notifyThemeChanged();
}

export function getThemeMode(): ThemeMode {
  if (typeof window === 'undefined') return 'auto';
  return read();
}

/**
 * Tema o'zgarishini kuzatish uchun obuna.
 *
 * `useSyncExternalStore` talab qiladigan shakl. Hodisani `setThemeMode`
 * ning o'zi tarqatadi: temani kuzatadigan tayyor brauzer hodisasi yo'q.
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
