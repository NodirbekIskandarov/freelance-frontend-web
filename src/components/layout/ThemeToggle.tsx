'use client';

import { Monitor, Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

import { cn } from '@/lib/cn';
import { getThemeMode, setThemeMode, type ThemeMode } from '@/lib/theme';

const options: { mode: ThemeMode; label: string; icon: typeof Sun }[] = [
  { mode: 'light', label: "Yorug'", icon: Sun },
  { mode: 'auto', label: 'Avtomatik', icon: Monitor },
  { mode: 'dark', label: "Qorong'i", icon: Moon },
];

/**
 * Uch holatli tema tanlagich: yorug' / avtomatik (soat bo'yicha) / qorong'i.
 * Faqat mount bo'lgandan keyin haqiqiy qiymatni o'qiydi — server va
 * mijoz bir xil boshlang'ich HTML chiqarishi kerak (hydration mos kelishi).
 */
export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const [mode, setMode] = useState<ThemeMode>('auto');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMode(getThemeMode());
    setMounted(true);
  }, []);

  if (compact) {
    const current = options.find((option) => option.mode === mode) ?? options[1]!;
    const next = options[(options.indexOf(current) + 1) % options.length]!;

    return (
      <button
        type="button"
        aria-label={`Tema: ${current.label}. ${next.label}ga almashtirish`}
        onClick={() => {
          setMode(next.mode);
          setThemeMode(next.mode);
        }}
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
            onClick={() => {
              setMode(option.mode);
              setThemeMode(option.mode);
            }}
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
