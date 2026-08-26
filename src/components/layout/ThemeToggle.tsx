'use client';

import { Monitor, Moon, Sun } from 'lucide-react';
import { useSyncExternalStore } from 'react';

import { cn } from '@/lib/cn';
import { getThemeMode, setThemeMode, subscribeToThemeMode, type ThemeMode } from '@/lib/theme';

const options: { mode: ThemeMode; label: string; icon: typeof Sun }[] = [
  { mode: 'light', label: "Yorug'", icon: Sun },
  { mode: 'auto', label: 'Avtomatik', icon: Monitor },
  { mode: 'dark', label: "Qorong'i", icon: Moon },
];

/**
 * Uch holatli tema tanlagich: yorug' / avtomatik (soat bo'yicha) / qorong'i.
 *
 * Haqiqiy qiymat faqat mijozda mavjud (u `<head>`dagi skript va
 * `localStorage` da), server esa uni bilmaydi — shuning uchun serverda
 * `null` qaytariladi va hydration mos keladi.
 *
 * `useSyncExternalStore`, effekt emas: brauzerdagi qiymatni effektda
 * o'qib, holatga yozish qo'shimcha render tug'diradi va React buni
 * "kaskad" deb belgilaydi. Bu hook aynan shu holat uchun — tashqi
 * manbadan o'qish.
 */
export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const stored = useSyncExternalStore<ThemeMode | null>(
    subscribeToThemeMode,
    getThemeMode,
    // Server snapshot: tema noma'lum. Ikonka shu sababli chizilmaydi.
    () => null,
  );

  const mounted = stored !== null;
  const mode: ThemeMode = stored ?? 'auto';

  if (compact) {
    const current = options.find((option) => option.mode === mode) ?? options[1]!;
    const next = options[(options.indexOf(current) + 1) % options.length]!;

    return (
      <button
        type="button"
        aria-label={`Tema: ${current.label}. ${next.label}ga almashtirish`}
        // `setThemeMode` o'zgarishni e'lon qiladi va tanlagich uni
        // obuna orqali oladi — mahalliy nusxasini saqlash shart emas.
        onClick={() => setThemeMode(next.mode)}
        className="grid size-9 shrink-0 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        {mounted && <current.icon className="size-4" />}
      </button>
    );
  }

  return (
    <div
      role="radiogroup"
      aria-label="Tema"
      className="inline-flex rounded-lg border border-border p-0.5"
    >
      {options.map((option) => {
        const isActive = mounted && mode === option.mode;
        return (
          <button
            key={option.mode}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => setThemeMode(option.mode)}
            className={cn(
              'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
              isActive ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <option.icon className="size-4" />
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
