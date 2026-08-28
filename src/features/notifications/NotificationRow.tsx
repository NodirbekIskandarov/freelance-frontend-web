'use client';

import {
  Bell,
  Briefcase,
  LifeBuoy,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  UserRound,
  Wallet,
  type LucideIcon,
} from 'lucide-react';
import { Link } from '@/i18n/Link';

import { cn } from '@/lib/cn';
import type {
  Notification,
  NotificationCategory,
  NotificationsQuery,
} from '@/shared/types/notifications';

import { useDeleteNotificationMutation, useMarkNotificationReadMutation } from './notificationsApi';
import { interpolate } from '@/i18n/interpolate';
import type { Messages } from '@/i18n/messages/uz';
import { useT } from '@/i18n/useT';

const categoryStyles: Record<NotificationCategory, { icon: LucideIcon; tone: string }> = {
  marketplace: { icon: ShoppingBag, tone: 'bg-blue-500/12 text-blue-600 dark:text-blue-400' },
  freelance: { icon: Briefcase, tone: 'bg-violet-500/12 text-violet-600 dark:text-violet-400' },
  wallet: { icon: Wallet, tone: 'bg-amber-500/12 text-amber-600 dark:text-amber-400' },
  moderation: {
    icon: ShieldCheck,
    tone: 'bg-emerald-500/12 text-emerald-600 dark:text-emerald-400',
  },
  support: { icon: LifeBuoy, tone: 'bg-cyan-500/12 text-cyan-600 dark:text-cyan-400' },
  account: { icon: UserRound, tone: 'bg-muted text-muted-foreground' },
};

/**
 * `reference_type` → ilova ichidagi sahifa.
 *
 * Backend faqat obyekt turi va UUID beradi, havolani frontend yig'adi.
 * Noma'lum tur uchun havola YO'Q: mavjud bo'lmagan sahifaga olib borish
 * bildirishnomani umuman bosilmaydigan qilishdan yomonroq.
 */
function hrefFor(notification: Notification): string | null {
  switch (notification.reference_type) {
    case 'order':
      return '/student/orders';
    case 'solution':
      return '/student/downloads';
    case 'task':
    case 'offer':
      return '/freelance/exchange';
    case 'withdrawal':
    case 'wallet':
    case 'transaction':
      return '/wallet';
    case 'appeal':
      return '/appeals';
    case 'review':
      return '/freelancer/orders';
    default:
      return null;
  }
}

function formatWhen(value: string, messages: Messages): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  const m = messages.notifications;
  const diffMinutes = Math.round((Date.now() - date.getTime()) / 60_000);

  if (diffMinutes < 1) return m.justNow;
  if (diffMinutes < 60) return interpolate(m.minutesAgo, { count: diffMinutes });
  if (diffMinutes < 24 * 60) {
    return interpolate(m.hoursAgo, { count: Math.round(diffMinutes / 60) });
  }

  return date.toLocaleString('ru-RU').slice(0, 16);
}

export function NotificationRow({
  notification,
  query,
  compact = false,
}: {
  notification: Notification;
  query: NotificationsQuery;
  compact?: boolean;
}) {
  const [markRead] = useMarkNotificationReadMutation();
  const { m } = useT();
  const [remove, removeState] = useDeleteNotificationMutation();

  const style = categoryStyles[notification.category] ?? { icon: Bell, tone: 'bg-muted' };
  const Icon = style.icon;
  const href = hrefFor(notification);

  const body = (
    <>
      <span className={cn('grid size-9 shrink-0 place-items-center rounded-lg', style.tone)}>
        <Icon className="size-4.5" />
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex items-start gap-2">
          <span
            className={cn(
              'block min-w-0 flex-1 text-sm leading-snug',
              notification.is_read ? 'font-medium text-foreground' : 'font-bold text-foreground',
            )}
          >
            {notification.title}
          </span>
          {/* O'qilmaganlik belgisi — matn emas, nuqta: qator tor. */}
          {!notification.is_read && (
            <span
              aria-label="O'qilmagan"
              className="mt-1.5 size-2 shrink-0 rounded-full bg-emerald-500"
            />
          )}
        </span>

        {notification.body && (
          <span
            className={cn(
              'mt-0.5 block text-xs leading-relaxed text-muted-foreground',
              compact && 'line-clamp-2',
            )}
          >
            {notification.body}
          </span>
        )}

        <span className="mt-1 block text-[11px] text-muted-foreground/80">
          {formatWhen(notification.created_at, m)}
        </span>
      </span>
    </>
  );

  const className = cn(
    'flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/60',
    !notification.is_read && 'bg-emerald-500/[0.04]',
  );

  // O'qilgan deb belgilash bosishning YON TA'SIRI: alohida tugma qo'yilsa
  // foydalanuvchi har bildirishnomani ikki marta bosishi kerak bo'lardi.
  function onOpen() {
    if (!notification.is_read) void markRead({ id: notification.id, query });
  }

  return (
    <div className="group relative">
      {href ? (
        <Link href={href} onClick={onOpen} className={className}>
          {body}
        </Link>
      ) : (
        <button type="button" onClick={onOpen} className={className}>
          {body}
        </button>
      )}

      <button
        type="button"
        aria-label="O'chirish"
        disabled={removeState.isLoading}
        onClick={() => void remove({ id: notification.id, query })}
        className="absolute top-2 right-2 grid size-7 place-items-center rounded-lg text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:bg-muted hover:text-destructive focus-visible:opacity-100 disabled:opacity-50"
      >
        <Trash2 className="size-3.5" />
      </button>
    </div>
  );
}
