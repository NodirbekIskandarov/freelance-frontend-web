'use client';

import { getApiErrorMessage } from '@/shared/api';

import { useGetMeQuery } from '../auth/authApi';

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 py-3.5">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium text-foreground">{value}</dd>
    </div>
  );
}

export function StudentProfile() {
  const { data, isLoading, error } = useGetMeQuery();

  if (error) {
    return (
      <p className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
        {getApiErrorMessage(error)}
      </p>
    );
  }

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
        <Row
          label="Holat"
          value={data.status === 'freelancer' ? 'Freelancer' : 'Talaba'}
        />
      </dl>
    </div>
  );
}
