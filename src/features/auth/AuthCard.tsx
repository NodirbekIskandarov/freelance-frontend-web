'use client';

import type { InputHTMLAttributes, ReactNode } from 'react';

import { useT } from '@/i18n/useT';
import { cn } from '@/lib/cn';

/**
 * Kirish va ro'yxatdan o'tish formalarining umumiy ko'rinishi.
 *
 * Dizaynda bu oyna qora shishasimon: `bg-zinc-900/92` + blur. Bu yerda
 * ranglar tokenlar orqali beriladi, chunki sayt kunduzgi rejimni ham
 * qo'llab-quvvatlaydi — o'lchamlar, radiuslar va joylashuv dizayndagidek
 * qoldi, faqat rang temaga moslashadi.
 */
export function AuthCard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'relative w-full max-w-[540px] overflow-hidden rounded-[24px] border border-border/70 bg-card p-6 shadow-[0_24px_80px_rgba(0,0,0,0.12)] sm:p-8 dark:border-white/10 dark:bg-zinc-900/92 dark:shadow-[0_24px_80px_rgba(0,0,0,0.55)] dark:backdrop-blur-2xl',
        className,
      )}
    >
      {/* Yuqoridan tushadigan yashil yorug'lik — dizayndagi urg'u. */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(600px_280px_at_50%_-20%,rgba(16,185,129,0.18),transparent_65%)]"
        aria-hidden
      />
      <div className="relative">{children}</div>
    </div>
  );
}

export function AuthCardHeader({
  icon,
  title,
  subtitle,
}: {
  icon: ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-6 text-center">
      <div className="mx-auto mb-4 grid size-14 place-items-center rounded-2xl border border-emerald-500/25 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
        {icon}
      </div>
      <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">{title}</h1>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{subtitle}</p>
    </div>
  );
}

/** «yoki» ajratgichi — ijtimoiy tugma bilan forma orasida. */
export function AuthSeparator() {
  const { m } = useT();

  return (
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-border/70 dark:border-white/10" />
      </div>
      <div className="relative flex justify-center text-xs tracking-wider uppercase">
        <span className="bg-card px-3 text-muted-foreground dark:bg-transparent">{m.auth.or}</span>
      </div>
    </div>
  );
}

export function AuthFieldLabel({ htmlFor, children }: { htmlFor: string; children: ReactNode }) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1.5 block text-sm font-medium text-foreground dark:text-zinc-300"
    >
      {children}
    </label>
  );
}

export function AuthInput({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        'h-12 w-full rounded-xl border border-border/70 bg-background px-4 text-sm text-foreground transition-colors outline-none',
        'placeholder:text-muted-foreground/70 focus:border-emerald-500/40 focus:ring-2 focus:ring-emerald-500/20',
        'dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:placeholder:text-zinc-500',
        className,
      )}
    />
  );
}

export function AuthPrimaryButton({
  children,
  loading,
  disabled,
  type = 'button',
  onClick,
}: {
  children: ReactNode;
  loading?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit';
  onClick?: () => void;
}) {
  return (
    <button
      type={type}
      disabled={loading || disabled}
      onClick={onClick}
      className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25 transition-all hover:from-emerald-400 hover:to-emerald-500 disabled:opacity-60"
    >
      {children}
    </button>
  );
}

export function AuthError({ message }: { message: string | null }) {
  if (!message) return null;

  return (
    <p
      role="alert"
      className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-700 dark:text-red-300"
    >
      {message}
    </p>
  );
}

/** Kartaning pastidagi «hisobingiz bormi?» qatori. */
export function AuthCardFooter({ children }: { children: ReactNode }) {
  return <p className="mt-6 text-center text-sm text-muted-foreground">{children}</p>;
}
