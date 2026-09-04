'use client';

import { Mail, Phone } from 'lucide-react';

import { useT } from '@/i18n/useT';
import { cn } from '@/lib/cn';

export type AuthMethod = 'phone' | 'email';

/**
 * Telefon / Email tanlagichi.
 *
 * Email KIRISHDA ishlaydi: tasdiqlangan manzil kirish identifikatori va
 * uni profildagi «Kirish usullari» bo'limidan bog'lanadi.
 *
 * RO'YXATDAN O'TISHDA esa hali yo'q — u yerda `emailEnabled` berilmaydi
 * va tab «tez orada» deb turadi. Sabab: hisob ochish telefon raqamni
 * talab qiladi (`POST /auth/register/`), email esa keyin qo'shiladigan
 * ikkinchi usul. Ishlamaydigan tabni bosilib, keyin xato qaytargandan
 * ko'ra ochiq aytgan halolroq.
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
  const { m } = useT();

  const tabs = [
    { id: 'phone' as const, label: m.auth.methodPhone, icon: Phone, disabled: false },
    { id: 'email' as const, label: m.auth.methodEmail, icon: Mail, disabled: !emailEnabled },
  ];

  return (
    <div>
      <div
        role="tablist"
        aria-label={m.auth.methodTabsLabel}
        className="grid grid-cols-2 gap-1 rounded-xl border border-border bg-muted/40 p-1 dark:border-white/10 dark:bg-white/[0.04]"
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
                  ? 'bg-emerald-500 text-white'
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
          {m.auth.emailComingSoon}
        </p>
      )}
    </div>
  );
}
