'use client';

import { Mail, Phone } from 'lucide-react';

import { cn } from '@/lib/cn';

export type AuthMethod = 'phone' | 'email';

/**
 * Telefon / Email tanlagichi.
 *
 * Email hozircha O'CHIRILGAN: backend `phone` ni majburiy maydon deb
 * biladi (`POST /auth/register/` va `/auth/login/` ikkalasi ham), ya'ni
 * email bilan hisob ochib ham, kirib ham bo'lmaydi. Tab ko'rinib turibdi,
 * chunki bu rejalashtirilgan imkoniyat — lekin bosilib, keyin xato
 * qaytargandan ko'ra ochiq «tez orada» deb turgani halolroq.
 */
export function AuthMethodTabs({
  value,
  onChange,
  emailEnabled = false,
}: {
  value: AuthMethod;
  onChange: (method: AuthMethod) => void;
  emailEnabled?: boolean;
}) {
  const tabs = [
    { id: 'phone' as const, label: 'Telefon', icon: Phone, disabled: false },
    { id: 'email' as const, label: 'Email', icon: Mail, disabled: !emailEnabled },
  ];

  return (
    <div>
      <div
        role="tablist"
        aria-label="Kirish usuli"
        className="grid grid-cols-2 gap-1 rounded-xl border border-border/70 bg-muted/40 p-1 dark:border-white/10 dark:bg-white/[0.04]"
      >
        {tabs.map((tab) => {
          const active = value === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={active}
              disabled={tab.disabled}
              onClick={() => onChange(tab.id)}
              className={cn(
                'inline-flex h-10 items-center justify-center gap-2 rounded-lg text-sm font-medium transition-colors',
                active
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
                tab.disabled && 'cursor-not-allowed opacity-50 hover:text-muted-foreground',
              )}
            >
              <tab.icon className="size-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {!emailEnabled && (
        <p className="mt-2 text-center text-[11px] text-muted-foreground">
          Email orqali kirish tez orada qo&apos;shiladi.
        </p>
      )}
    </div>
  );
}
