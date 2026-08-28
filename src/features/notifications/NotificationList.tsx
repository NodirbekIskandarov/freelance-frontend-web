'use client';

import { useState } from 'react';

import { ErrorNotice } from '@/components/ui/ErrorNotice';
import { cn } from '@/lib/cn';
import {
  NOTIFICATION_CATEGORIES,
  notificationCategoryLabel,
  type NotificationCategory,
} from '@/shared/types/notifications';

import { NotificationRow } from './NotificationRow';
import {
  useGetNotificationsQuery,
  useGetNotificationSummaryQuery,
  useMarkAllNotificationsReadMutation,
} from './notificationsApi';
import { useT } from '@/i18n/useT';

export function NotificationList() {
  const { m } = useT();
  const [category, setCategory] = useState<NotificationCategory | 'all'>('all');
  const [unreadOnly, setUnreadOnly] = useState(false);

  const query = {
    page_size: 50,
    ...(category !== 'all' ? { category } : {}),
    ...(unreadOnly ? { is_read: false } : {}),
  };

  const { data, isLoading, error } = useGetNotificationsQuery(query);
  const { data: summary } = useGetNotificationSummaryQuery();
  const [markAll, markAllState] = useMarkAllNotificationsReadMutation();

  if (error) return <ErrorNotice error={error} />;

  const unread = summary?.unread ?? 0;

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        {(['all', ...NOTIFICATION_CATEGORIES] as const).map((item) => {
          // Kategoriya sanoqlari faqat O'QILMAGANLARni beradi —
          // nol bo'lsa raqam ko'rsatilmaydi, aks holda "0" shovqin qiladi.
          const count = item === 'all' ? unread : (summary?.unread_by_category[item] ?? 0);

          return (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              aria-pressed={category === item}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
                category === item
                  ? 'bg-emerald-600 text-white'
                  : 'border border-border bg-background text-muted-foreground hover:text-foreground',
              )}
            >
              {item === 'all' ? m.common.all : notificationCategoryLabel(item, m)}
              {count > 0 && (
                <span
                  className={cn(
                    'rounded-full px-1.5 text-[10px] leading-4 font-bold',
                    category === item ? 'bg-white/25' : 'bg-emerald-500/15 text-emerald-600',
                  )}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <label className="inline-flex items-center gap-2 text-sm text-muted-foreground">
          <input
            type="checkbox"
            checked={unreadOnly}
            onChange={(event) => setUnreadOnly(event.target.checked)}
            className="size-4 accent-emerald-600"
          />
          {m.notifications.unreadOnly}
        </label>

        {unread > 0 && (
          <button
            type="button"
            disabled={markAllState.isLoading}
            onClick={() => void markAll()}
            className="text-sm font-medium text-emerald-600 hover:underline disabled:opacity-50 dark:text-emerald-400"
          >
            {m.notifications.markAllLong}
          </button>
        )}
      </div>

      {isLoading || !data ? (
        <div className="mt-4 grid gap-2">
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className="h-20 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      ) : data.results.length === 0 ? (
        <div className="mt-4 rounded-xl border border-dashed border-border px-6 py-16 text-center">
          <p className="text-sm font-medium text-foreground">{m.notifications.empty}</p>
          <p className="mt-1 text-sm text-muted-foreground">{m.notifications.emptyHint}</p>
        </div>
      ) : (
        <ul className="mt-4 divide-y divide-border overflow-hidden rounded-xl border border-border/60 bg-background dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-900/70">
          {data.results.map((item) => (
            <li key={item.id}>
              <NotificationRow notification={item} query={query} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
