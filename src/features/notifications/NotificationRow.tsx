'use client';

import {
  Bell,
  Briefcase,
  Check,
  LifeBuoy,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  UserRound,
  Wallet,
  type LucideIcon,
} from 'lucide-react';
import { Link } from '@/i18n/Link';
import { useRef, useState } from 'react';

import { cn } from '@/lib/cn';
import type { Notification, NotificationsQuery } from '@/shared/types/notifications';

import { categoryStyles, fallbackStyle } from './categoryStyles';
import { useDeleteNotificationMutation, useMarkNotificationReadMutation } from './notificationsApi';
import { interpolate } from '@/i18n/interpolate';
import type { Messages } from '@/i18n/messages/uz';
import { useT } from '@/i18n/useT';

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

  /*
    Bir haftagacha — «3 kun oldin». Undan keyin aniq sana: «12 kun
    oldin» degan gap odamga hech nima aytmaydi, u kalendarga qaraydi.
  */
  const diffDays = Math.round(diffMinutes / (60 * 24));
  if (diffDays <= 7) return interpolate(m.daysAgo, { count: diffDays });

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

  /*
    Surish — FAQAT «o'qildi», o'chirish emas.

    Brif ikkalasini ham taklif qiladi, lekin o'chirishni qaytarish yo'li
    yo'q: bexosdan surilgan barmoq xabarni butunlay yo'q qilardi va
    odam nima yo'qolganini ham bilmasdi. O'qilgan deb belgilash esa
    zararsiz — xato bo'lsa ham hech narsa yo'qolmaydi.

    O'chirish o'z tugmasida qoladi.
  */
  const [offset, setOffset] = useState(0);
  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const SWIPE_THRESHOLD = 64;

  function onPointerDown(event: React.PointerEvent) {
    // Faqat barmoq: sichqoncha bilan surish tasodifan matn tanlashga
    // aylanadi va u yerda tugmalar baribir yaqin.
    if (event.pointerType !== 'touch' || notification.is_read) return;
    dragStart.current = { x: event.clientX, y: event.clientY };
  }

  function onPointerMove(event: React.PointerEvent) {
    if (!dragStart.current) return;

    const dx = event.clientX - dragStart.current.x;
    const dy = event.clientY - dragStart.current.y;

    // Vertikal harakat — bu sahifani aylantirish, surish emas.
    if (Math.abs(dy) > Math.abs(dx)) {
      dragStart.current = null;
      setOffset(0);
      return;
    }

    // Faqat o'ngga: chapga surish brauzerning «orqaga» ishorasi bilan
    // to'qnashadi.
    setOffset(Math.max(0, Math.min(dx, 96)));
  }

  function onPointerEnd() {
    if (offset >= SWIPE_THRESHOLD && !notification.is_read) {
      void markRead({ id: notification.id, query });
    }
    dragStart.current = null;
    setOffset(0);
  }

  const style = categoryStyles[notification.category] ?? fallbackStyle;
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
              aria-label={m.ui.unread}
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

  /*
    O'qilgan va o'qilmagan orasidagi farq SEZILARLI bo'lishi kerak.

    Ilgari fon 4% yashil edi — qorong'i mavzuda uni umuman ajratib
    bo'lmasdi va yagona belgi o'ngdagi kichkina nuqta bo'lib qolardi.
    Endi uchta belgi birga ishlaydi: kuchliroq fon, chap chetdagi yashil
    chiziq va nuqta. Ulardan bittasi ko'rinmay qolsa ham (rang ko'rish
    xususiyati, chop etish) qolgani javob beradi.
  */
  const className = cn(
    'flex w-full items-start gap-3 py-3 pr-4 pl-4 text-left transition-colors hover:bg-muted/60',
    !notification.is_read && 'bg-emerald-500/[0.09] pl-3.5 border-l-[3px] border-emerald-500',
  );

  // O'qilgan deb belgilash bosishning YON TA'SIRI: alohida tugma qo'yilsa
  // foydalanuvchi har bildirishnomani ikki marta bosishi kerak bo'lardi.
  function onOpen() {
    if (!notification.is_read) void markRead({ id: notification.id, query });
  }

  return (
    <div className="group relative overflow-hidden">
      {/* Surilganda ortidan chiqadigan belgi — nima bo'layotganini
          aytadi, aks holda qator sababsiz siljigandek ko'rinardi. */}
      {offset > 0 && (
        <span className="absolute inset-y-0 left-0 flex items-center gap-1.5 bg-emerald-500/15 px-4 text-xs font-medium text-emerald-700 dark:text-emerald-300">
          <Check className="size-4" />
        </span>
      )}

      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
        style={{ transform: offset ? `translateX(${offset}px)` : undefined }}
        className={cn('relative bg-card', offset === 0 && 'transition-transform')}
      >
        {href ? (
          <Link href={href} onClick={onOpen} className={className}>
            {body}
          </Link>
        ) : (
          <button type="button" onClick={onOpen} className={className}>
            {body}
          </button>
        )}
      </div>

      <button
        type="button"
        aria-label={m.ui.remove}
        disabled={removeState.isLoading}
        onClick={() => void remove({ id: notification.id, query })}
        className="absolute top-2 right-2 grid size-7 place-items-center rounded-lg text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:bg-muted hover:text-destructive focus-visible:opacity-100 disabled:opacity-50"
      >
        <Trash2 className="size-3.5" />
      </button>
    </div>
  );
}
