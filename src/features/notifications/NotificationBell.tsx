'use client';

import { Bell } from 'lucide-react';
import { Link } from '@/i18n/Link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/cn';

import { NotificationRow } from './NotificationRow';
import {
  useGetNotificationsQuery,
  useGetNotificationSummaryQuery,
  useMarkAllNotificationsReadMutation,
} from './notificationsApi';
import { useNotificationSocket } from './useNotificationSocket';
import { useT } from '@/i18n/useT';

/** Ochilgan panelda faqat oxirgilari ko'rsatiladi — qolgani sahifada. */
const PREVIEW_QUERY = { page_size: 6 } as const;

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Jonli ulanish shu yerda: qo'ng'iroq har sahifada turadi.
  useNotificationSocket();

  const { data: summary } = useGetNotificationSummaryQuery();
  const { data, isLoading } = useGetNotificationsQuery(PREVIEW_QUERY, { skip: !open });
  const [markAll, markAllState] = useMarkAllNotificationsReadMutation();

  /*
   * Sahifa almashsa panel yopiladi — render paytida, effektda emas: aks
   * holda yangi sahifa bir kadr davomida ochiq panel bilan chizilardi.
   */
  const [lastPathname, setLastPathname] = useState(pathname);
  if (lastPathname !== pathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: PointerEvent) {
      if (!panelRef.current?.contains(event.target as Node)) setOpen(false);
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const { t, m } = useT();
  const unread = summary?.unread ?? 0;

  return (
    <div ref={panelRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label={
          unread > 0
            ? t((x) => x.notifications.withUnread, { count: unread })
            : m.notifications.title
        }
        className="relative grid size-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <Bell className="size-5" />
        {unread > 0 && (
          <span className="absolute top-1 right-1 grid min-w-4 place-items-center rounded-full bg-emerald-600 px-1 text-[10px] leading-4 font-bold text-white">
            {unread > 99 ? '99+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-xl border border-border bg-background shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 dark:border-zinc-800">
            <h2 className="text-sm font-bold text-foreground">{m.notifications.title}</h2>
            {unread > 0 && (
              <button
                type="button"
                disabled={markAllState.isLoading}
                onClick={() => void markAll()}
                className="text-xs font-medium text-emerald-600 hover:underline disabled:opacity-50 dark:text-emerald-400"
              >
                {m.notifications.markAll}
              </button>
            )}
          </div>

          <div className="max-h-[60vh] overflow-y-auto">
            {isLoading ? (
              <div className="flex flex-col gap-2 p-3">
                {Array.from({ length: 4 }, (_, index) => (
                  <div key={index} className="h-16 animate-pulse rounded-lg bg-muted" />
                ))}
              </div>
            ) : !data || data.results.length === 0 ? (
              <p className="px-4 py-10 text-center text-sm text-muted-foreground">
                {m.notifications.emptyShort}
              </p>
            ) : (
              <ul className={cn('divide-y divide-border dark:divide-zinc-800')}>
                {data.results.map((item) => (
                  <li key={item.id}>
                    <NotificationRow notification={item} query={PREVIEW_QUERY} compact />
                  </li>
                ))}
              </ul>
            )}
          </div>

          <Link
            href="/notifications"
            className="block border-t border-border py-3 text-center text-sm font-medium text-emerald-600 hover:bg-muted dark:border-zinc-800 dark:text-emerald-400"
          >
            {m.notifications.seeAll}
          </Link>
        </div>
      )}
    </div>
  );
}
