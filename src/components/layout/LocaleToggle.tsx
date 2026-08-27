'use client';

import { Globe } from 'lucide-react';
import { useSyncExternalStore } from 'react';

import { cn } from '@/lib/cn';
import {
  getLocale,
  LOCALES,
  LOCALE_LABELS,
  LOCALE_SHORT,
  setLocale,
  subscribeToLocale,
  type Locale,
} from '@/lib/locale';

/**
 * Til tanlagich — UZ / RU.
 *
 * Tanlov `Accept-Language` sarlavhasi bo'lib har API so'roviga ilashadi
 * va backend tarjima qilingan nomlarni (fan, institut, topshiriq) o'sha
 * tilda qaytaradi.
 *
 * `useSyncExternalStore`, effekt emas: qiymat brauzerda (localStorage'da)
 * va serverda noma'lum. Effektda o'qib holatga yozish qo'shimcha render
 * tug'diradi; server tomonda esa `null` qaytariladi va hydration mos
 * keladi — bu tema tanlagichdagi bilan bir xil yondashuv.
 */
export function LocaleToggle({ compact = false }: { compact?: boolean }) {
  const stored = useSyncExternalStore<Locale | null>(subscribeToLocale, getLocale, () => null);

  const mounted = stored !== null;
  const locale: Locale = stored ?? 'uz';

  if (compact) {
    // Ikkitagina til bor, shuning uchun siqiq holatda tugma navbatdagisiga
    // almashtiradi — ochiladigan ro'yxat ikki element uchun ortiqcha.
    const next = LOCALES[(LOCALES.indexOf(locale) + 1) % LOCALES.length]!;

    return (
      <button
        type="button"
        aria-label={`Til: ${LOCALE_LABELS[locale]}. ${LOCALE_LABELS[next]}ga almashtirish`}
        onClick={() => setLocale(next)}
        className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg border border-border px-2.5 text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <Globe className="size-4" />
        {/* Mount bo'lgunicha yorliq chizilmaydi: server qaysi til
            tanlanganini bilmaydi va noto'g'ri qiymat bir kadr ko'rinardi. */}
        <span className="min-w-[1.5rem]">{mounted ? LOCALE_SHORT[locale] : ''}</span>
      </button>
    );
  }

  return (
    <div
      role="radiogroup"
      aria-label="Tizim tili"
      className="inline-flex items-center gap-0.5 rounded-lg border border-border p-0.5"
    >
      {LOCALES.map((item) => {
        const isActive = mounted && locale === item;

        return (
          <button
            key={item}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => setLocale(item)}
            className={cn(
              'rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors',
              isActive
                ? 'bg-emerald-500/12 text-emerald-700 dark:text-emerald-300'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {LOCALE_SHORT[item]}
          </button>
        );
      })}
    </div>
  );
}
