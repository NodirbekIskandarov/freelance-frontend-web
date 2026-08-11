'use client';

import { Download, FileText } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { getApiErrorMessage } from '@/shared/api';

import { useGetStudentDownloadsQuery } from './studentApi';

export function StudentDownloads() {
  const { data, isLoading, error } = useGetStudentDownloadsQuery();

  if (error) {
    return (
      <p className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
        {getApiErrorMessage(error)}
      </p>
    );
  }

  if (isLoading || !data) {
    return (
      <div className="grid gap-3">
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className="h-20 animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border px-6 py-16 text-center">
        <p className="text-sm font-medium text-foreground">Yuklamalar yo&apos;q</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Sotib olingan materiallar shu yerda saqlanadi.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {data.map((item) => (
        <article
          key={item.id}
          className="flex flex-wrap items-center gap-4 rounded-xl border border-border/60 bg-background p-4 dark:border-zinc-800 dark:bg-zinc-900/70"
        >
          <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-emerald-500/12 text-emerald-600 dark:text-emerald-400">
            <FileText className="size-5" />
          </span>

          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-bold text-foreground">{item.title}</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              {item.universityShort} &middot; {item.subjectName}
            </p>
            <p className="mt-1 text-xs text-muted-foreground/80">
              {item.fileName} &middot; {item.fileSize} &middot; {item.purchasedAt}
            </p>
          </div>

          <Button variant="outline" size="sm">
            <Download className="size-4" />
            Yuklab olish
          </Button>
        </article>
      ))}
    </div>
  );
}
