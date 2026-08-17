'use client';

import { FREELANCER_STATUS_LABELS, displayName, type AppUser } from '@/shared/types/auth';
import { useAppSelector } from '@/store/hooks';
import { selectAuthHydrated, selectCurrentUser } from '@/store/slices/authSlice';

/**
 * Profil kartasi — talaba va freelancer uchun bir xil.
 *
 * Ma'lumot store'dan olinadi, alohida so'rovdan emas: backendda "joriy
 * foydalanuvchi" endpoint'i yo'q va yozuv login javobidan saqlanadi.
 * Rol farqi faqat "Holat" qatorida ko'rinadi.
 */
function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 py-3.5">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium text-foreground">{value}</dd>
    </div>
  );
}

function rows(user: AppUser): { label: string; value: string }[] {
  const profile = user.profile;

  return [
    { label: 'Ism familiya', value: displayName(user) },
    { label: 'Telefon raqam', value: user.phone ?? '—' },
    { label: 'Email', value: user.email || '—' },
    { label: 'Universitet', value: profile?.university_display || '—' },
    { label: 'Kurs', value: profile?.course ? `${profile.course}-kurs` : '—' },
    { label: 'Telegram', value: profile?.telegram || '—' },
    {
      label: 'Holat',
      value: FREELANCER_STATUS_LABELS[user.freelancer_profile?.status ?? 'none'],
    },
  ];
}

export function AccountProfile() {
  const hydrated = useAppSelector(selectAuthHydrated);
  const user = useAppSelector(selectCurrentUser);

  if (!hydrated) {
    return <div className="h-64 animate-pulse rounded-xl bg-muted" />;
  }

  if (!user) {
    return (
      <p className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
        Seans topilmadi. Qaytadan kiring.
      </p>
    );
  }

  return (
    <div className="rounded-xl border border-border/60 bg-background p-5 dark:border-zinc-800 dark:bg-zinc-900/70">
      <dl className="divide-y divide-border">
        {rows(user).map((row) => (
          <Row key={row.label} label={row.label} value={row.value} />
        ))}
      </dl>
    </div>
  );
}
