'use client';

import { ErrorNotice } from '@/components/ui/ErrorNotice';

import { useGetMeQuery } from '../auth/authApi';

/**
 * Profil kartasi — talaba va freelancer uchun bir xil.
 *
 * Ma'lumot `/auth/me` dan keladi va roldan qat'i nazar bir xil
 * maydonlardan iborat, shuning uchun ikki nusxa saqlashning ma'nosi
 * yo'q: rol farqi faqat "Holat" qatorida ko'rinadi.
 */
function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 py-3.5">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium text-foreground">{value}</dd>
    </div>
  );
}

export function AccountProfile() {
  const { data, isLoading, error } = useGetMeQuery();

  if (error) return <ErrorNotice error={error} />;

  if (isLoading || !data) {
    return <div className="h-64 animate-pulse rounded-xl bg-muted" />;
  }

  return (
    <div className="rounded-xl border border-border/60 bg-background p-5 dark:border-zinc-800 dark:bg-zinc-900/70">
      <dl className="divide-y divide-border">
        <Row label="Ism familiya" value={data.fullName} />
        <Row label="Telefon raqam" value={data.phone} />
        <Row label="Email" value={data.email ?? '—'} />
        <Row label="Foydalanuvchi ID" value={data.publicId} />
        <Row label="Holat" value={data.status === 'freelancer' ? 'Freelancer' : 'Talaba'} />
      </dl>
    </div>
  );
}
