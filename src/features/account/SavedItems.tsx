'use client';

import { BookmarkX, FileText, UserRound } from 'lucide-react';
import Link from 'next/link';

import { ErrorNotice } from '@/components/ui/ErrorNotice';
import { SAVED_ITEM_TYPE_LABELS, type SavedItemType } from '@/shared/types/account';

import { useGetSavedItemsQuery, useRemoveSavedItemMutation } from './accountApi';

const icons: Record<SavedItemType, typeof FileText> = {
  material: FileText,
  freelancer: UserRound,
};

export function SavedItems() {
  const { data, isLoading, error } = useGetSavedItemsQuery();
  const [removeItem] = useRemoveSavedItemMutation();

  if (error) return <ErrorNotice error={error} />;

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
        <p className="text-sm font-medium text-foreground">Saqlanganlar bo&apos;sh</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Materiallar va freelancerlarni saqlab qo&apos;ying — ular shu yerda to&apos;planadi.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {data.map((item) => {
        const Icon = icons[item.type];

        return (
          <article
            key={item.id}
            className="flex items-center gap-4 rounded-xl border border-border/60 bg-background p-4 dark:border-zinc-800 dark:bg-zinc-900/70"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-emerald-500/12 text-emerald-600 dark:text-emerald-400">
              <Icon className="size-5" />
            </span>

            <div className="min-w-0 flex-1">
              <h2 className="truncate text-sm font-bold text-foreground">
                <Link href={item.href} className="hover:underline">
                  {item.title}
                </Link>
              </h2>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">{item.subtitle}</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground/80">
                {SAVED_ITEM_TYPE_LABELS[item.type]} &middot; {item.savedAt}
              </p>
            </div>

            <button
              type="button"
              onClick={() => void removeItem(item.id)}
              aria-label={`${item.title} — saqlanganlardan olib tashlash`}
              className="grid size-9 shrink-0 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            >
              <BookmarkX className="size-4" />
            </button>
          </article>
        );
      })}
    </div>
  );
}
