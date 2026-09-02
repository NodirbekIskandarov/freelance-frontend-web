'use client';

import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

import { useT } from '@/i18n/useT';
import { cn } from '@/lib/cn';
import type { NotificationsQuery } from '@/shared/types/notifications';

import { categoryStyles } from './categoryStyles';
import type { NotificationGroup } from './groupNotifications';
import { NotificationRow } from './NotificationRow';

/**
 * Bir xil turdagi bildirishnomalar to'plami — yig'ilgan holda bitta qator.
 *
 * Sarlavha o'ylab topilmaydi, eng yangisinikini oladi: backend bir xil
 * tur uchun bir xil sarlavha yozadi («Yechim tasdiqlandi»), ya'ni u
 * allaqachon guruhning nomi. O'ylab topilgan yig'ma gap («4 ta yangi
 * tasdiq») esa haqiqiy sarlavhadan farq qilib qolishi mumkin edi.
 */
export function NotificationGroupCard({
  group,
  query,
}: {
  group: NotificationGroup;
  query: NotificationsQuery;
}) {
  const { t, m } = useT();
  const [open, setOpen] = useState(false);

  const newest = group.items[0]!;
  const style = categoryStyles[newest.category];
  const Icon = style.icon;

  if (open) {
    return (
      <div>
        {group.items.map((item) => (
          <NotificationRow key={item.id} notification={item} query={query} />
        ))}

        <button
          type="button"
          onClick={() => setOpen(false)}
          className="flex w-full items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          {m.notifications.groupCollapse}
          <ChevronDown className="size-3.5 rotate-180" />
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className={cn(
        'flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/60',
        // O'qilmagani bo'lsa yig'ilgan karta ham shuni ko'rsatadi —
        // aks holda yangi xabar guruh ortida ko'rinmay qolardi.
        group.unread > 0 && 'border-l-[3px] border-emerald-500 bg-emerald-500/[0.09] pl-3.5',
      )}
    >
      {/*
        Oddiy qatordagi bilan BIR XIL ikonka, ortida esa ikkinchi
        kvadratcha — bu bitta xabar emas, to'plam ekanini shu aytadi.
        Sonni ikonkaga ham qo'yish ortiqcha edi: u o'ngdagi belgida
        allaqachon bor va ikkita raqam bir-birini takrorlardi.
      */}
      <span className="relative size-9 shrink-0">
        <span className="absolute top-0 right-0 size-8 rounded-lg border border-border bg-muted/50" />
        <span
          className={cn(
            'absolute bottom-0 left-0 grid size-8 place-items-center rounded-lg',
            style.tone,
          )}
        >
          <Icon className="size-4" />
        </span>
      </span>

      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-bold text-foreground">{newest.title}</span>
        <span className="mt-0.5 block text-xs text-muted-foreground">
          {t((x) => x.notifications.groupCount, { count: group.items.length })}
        </span>
      </span>

      {/* O'qilmaganlar soni — «hammasi yangi» va «bittasi yangi» boshqa
          holat va ular bir xil ko'rinmasligi kerak. */}
      {group.unread > 0 && (
        <span className="shrink-0 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
          {group.unread}
        </span>
      )}

      <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
    </button>
  );
}
