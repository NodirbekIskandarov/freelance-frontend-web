'use client';

import { useState } from 'react';

import { ErrorNotice } from '@/components/ui/ErrorNotice';
import { cn } from '@/lib/cn';
import {
  NOTIFICATION_CATEGORIES,
  notificationCategoryLabel,
  type NotificationCategory,
} from '@/shared/types/notifications';

import { groupNotifications } from './groupNotifications';
import { NotificationGroupCard } from './NotificationGroupCard';
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
      {/*
        Bitta QATOR, o'ralmaydi.

        Ilgari `flex-wrap` edi va oltita pill telefonda uch qatorga
        bo'linib, ekranning uchdan birini egallardi — ro'yxatning o'zi
        esa pastga surilib ketardi. Endi ular gorizontal suriladi.

        `-mx-4 px-4`: pillar konteyner chetigacha borib to'xtamaydi,
        chetdan «yana bor» degan ishora qoladi.
      */}
      <div className="-mx-4 overflow-x-auto px-4 [&::-webkit-scrollbar]:hidden">
        <div className="flex w-max items-center gap-2">
          {(['all', ...NOTIFICATION_CATEGORIES] as const).map((item) => {
            // Kategoriya sanoqlari faqat O'QILMAGANLARni beradi —
            // nol bo'lsa raqam ko'rsatilmaydi, aks holda "0" shovqin qiladi.
            const count = item === 'all' ? unread : (summary?.unread_by_category[item] ?? 0);
            const active = category === item;

            return (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                aria-pressed={active}
                className={cn(
                  'inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors',
                  active
                    ? 'bg-emerald-500 text-emerald-950'
                    : 'border border-border bg-background text-muted-foreground hover:text-foreground',
                )}
              >
                {item === 'all' ? m.common.all : notificationCategoryLabel(item, m)}
                {count > 0 && (
                  <span
                    className={cn(
                      'rounded-full px-1.5 text-[10px] leading-4 font-bold',
                      active ? 'bg-emerald-950/15' : 'bg-emerald-500/15 text-brand',
                    )}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        {/* Kalit ko'rinishidagi checkbox: holat bir qarashda ko'rinadi,
            kvadratcha esa yoqilgan-yoqilmaganini yaqindan qarashni
            talab qilardi. */}
        <button
          type="button"
          role="switch"
          aria-checked={unreadOnly}
          onClick={() => setUnreadOnly((value) => !value)}
          className="inline-flex items-center gap-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <span
            aria-hidden
            className={cn(
              'relative h-5 w-9 shrink-0 rounded-full transition-colors',
              unreadOnly ? 'bg-emerald-500' : 'bg-muted',
            )}
          >
            <span
              className={cn(
                'absolute top-0.5 size-4 rounded-full bg-background shadow-sm transition-[left]',
                unreadOnly ? 'left-[1.125rem]' : 'left-0.5',
              )}
            />
          </span>
          {m.notifications.unreadOnly}
        </button>

        {unread > 0 && (
          <button
            type="button"
            disabled={markAllState.isLoading}
            onClick={() => void markAll()}
            className="text-sm font-medium text-brand hover:underline disabled:opacity-50"
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
        <ul className="mt-4 divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
          {/* Bir xil turdagi ketma-ket xabarlar bitta kartaga yig'iladi —
              sabab `groupNotifications` da. */}
          {groupNotifications(data.results).map((entry) => (
            <li key={entry.key}>
              {entry.kind === 'single' ? (
                <NotificationRow notification={entry.item} query={query} />
              ) : (
                <NotificationGroupCard group={entry.group} query={query} />
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
