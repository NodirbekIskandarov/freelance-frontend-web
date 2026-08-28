'use client';

import { Check, KeyRound, X } from 'lucide-react';

import { useT } from '@/i18n/useT';
import { cn } from '@/lib/cn';

import { validatePassword } from './passwordPolicy';

/**
 * Parol qoidalari — yozilayotgan paytda jonli belgilanadi.
 *
 * Oddiy «Kamida 8 ta belgi» eslatmasi o'rniga shu ko'rinish tanlangan:
 * server «parol talablarga javob bermaydi» deb qaytarganda qaysi qoida
 * buzilganini topish foydalanuvchining ishi bo'lib qolardi.
 */
export function PasswordRequirements({
  password,
  className,
}: {
  password: string;
  className?: string;
}) {
  const { m } = useT();
  const { checks, valid } = validatePassword(password);

  const items = [
    { ok: checks.minLength, label: m.password.minLength },
    { ok: checks.hasLetter, label: m.password.hasLetter },
    { ok: checks.hasDigit, label: m.password.hasDigit },
  ];

  const doneCount = items.filter((item) => item.ok).length;

  return (
    <div
      role="group"
      aria-label={m.password.ariaLabel}
      className={cn(
        'overflow-hidden rounded-xl border',
        valid && password
          ? 'border-emerald-500/40 bg-emerald-500/10'
          : 'border-amber-500/25 bg-amber-500/5',
        'dark:border-white/10 dark:bg-white/[0.04]',
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2 border-b border-border/60 px-3 py-2 dark:border-white/10">
        <span className="flex items-center gap-2 text-xs font-semibold text-foreground dark:text-zinc-200">
          <KeyRound className="size-3.5 text-emerald-600 dark:text-emerald-400" />
          {m.password.rulesTitle}
        </span>
        <span
          className={cn(
            'rounded-full px-2 py-0.5 text-[10px] font-medium tabular-nums',
            doneCount === items.length
              ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
              : 'bg-muted text-muted-foreground',
          )}
        >
          {doneCount}/{items.length}
        </span>
      </div>

      <ul className="space-y-1.5 px-3 py-2.5">
        {items.map((item) => (
          <li
            key={item.label}
            className={cn(
              'flex items-start gap-2 text-[11px] leading-snug transition-colors',
              item.ok
                ? 'font-medium text-emerald-700 dark:text-emerald-300'
                : 'text-muted-foreground',
            )}
          >
            <span
              className={cn(
                'mt-0.5 grid size-4 shrink-0 place-items-center rounded-full',
                item.ok ? 'bg-emerald-500/20' : 'bg-muted',
              )}
            >
              {item.ok ? (
                <Check className="size-2.5 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <X className="size-2.5 opacity-50" />
              )}
            </span>
            {item.label}
          </li>
        ))}
      </ul>

      <p className="border-t border-border/60 px-3 py-2 text-[10px] leading-relaxed text-muted-foreground dark:border-white/10">
        <span className="font-medium text-foreground/80 dark:text-zinc-400">
          {m.password.example}
        </span>
        <span className="font-mono text-emerald-700 dark:text-emerald-400">Aliyev2024</span>
        <span className="mx-1">·</span>
        <span className="font-mono text-emerald-700 dark:text-emerald-400">Vali_2024</span>
      </p>
    </div>
  );
}
