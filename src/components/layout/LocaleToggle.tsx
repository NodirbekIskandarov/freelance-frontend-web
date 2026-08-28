'use client';

import { Globe } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

import { cn } from '@/lib/cn';
import { rememberLocale } from '@/lib/locale';
import {
  LOCALES,
  LOCALE_LABELS,
  LOCALE_SHORT_LABELS,
  localizeHref,
  stripLocale,
  type Locale,
} from '@/i18n/config';
import { useI18n } from '@/i18n/I18nProvider';
import { interpolate } from '@/i18n/interpolate';

/**
 * Til tanlagich — UZ / RU.
 *
 * Til MANZILNING bir qismi, shuning uchun almashtirish = boshqa manzilga
 * o'tish. Ilgari u faqat brauzer xotirasida saqlanardi: sahifa
 * o'zgarmasdi, havolani boshqa odamga yuborganda esa u butunlay boshqa
 * tilda ochilardi.
 *
 * Joriy sahifada QOLAMIZ — faqat til bo'lagi almashadi va so'rov
 * parametrlari (filtr, sahifa raqami) saqlanadi. Bosh sahifaga otib
 * yuborish odamning ishini yo'qotardi.
 */
export function LocaleToggle({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const { locale, messages } = useI18n();

  function switchTo(next: Locale) {
    rememberLocale(next);

    /*
     * So'rov parametrlari `window` dan o'qiladi, `useSearchParams` dan
     * emas: u hook statik chizishni buzadi va katalog sahifalari ISR
     * o'rniga har so'rovda qayta hisoblanardi. Bu yerda kod faqat
     * bosilganda ishlaydi, ya'ni brauzer albatta bor.
     */
    const query = window.location.search;
    const target = localizeHref(stripLocale(pathname ?? '/'), next);
    router.push(`${target}${query}`);
  }

  if (compact) {
    // Ikkitagina til bor — siqiq holatda tugma navbatdagisiga almashtiradi.
    // Ochiladigan ro'yxat ikki element uchun ortiqcha.
    const next = LOCALES[(LOCALES.indexOf(locale) + 1) % LOCALES.length]!;

    return (
      <button
        type="button"
        aria-label={interpolate(messages.locale.ariaSwitch, {
          from: LOCALE_LABELS[locale],
          to: LOCALE_LABELS[next],
        })}
        onClick={() => switchTo(next)}
        className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg border border-border px-2.5 text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <Globe className="size-4" />
        {/* Endi qiymat serverda ham ma'lum (u manzilda), shuning uchun
            yorliq darhol chiziladi — mount kutilmaydi. */}
        <span className="min-w-[1.5rem]">{LOCALE_SHORT_LABELS[locale]}</span>
      </button>
    );
  }

  return (
    <div
      role="radiogroup"
      aria-label={messages.locale.switcherLabel}
      className="inline-flex items-center gap-0.5 rounded-lg border border-border p-0.5"
    >
      {LOCALES.map((item) => (
        <button
          key={item}
          type="button"
          role="radio"
          aria-checked={locale === item}
          onClick={() => switchTo(item)}
          className={cn(
            'rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors',
            locale === item
              ? 'bg-emerald-500/12 text-emerald-700 dark:text-emerald-300'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          {LOCALE_SHORT_LABELS[item]}
        </button>
      ))}
    </div>
  );
}
