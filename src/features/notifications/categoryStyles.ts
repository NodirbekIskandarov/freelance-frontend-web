import {
  Bell,
  Briefcase,
  LifeBuoy,
  ShieldCheck,
  ShoppingBag,
  UserRound,
  Wallet,
  type LucideIcon,
} from 'lucide-react';

import type { NotificationCategory } from '@/shared/types/notifications';

/**
 * Kategoriya → ikonka va rang.
 *
 * Alohida faylda: bitta qator ham, yig'ilgan guruh kartasi ham shuni
 * ishlatadi va ikki nusxa bo'lsa ular vaqt o'tib bir-biridan
 * uzoqlashardi — bitta kategoriya ikki joyda ikki xil ko'rinardi.
 */
export const categoryStyles: Record<NotificationCategory, { icon: LucideIcon; tone: string }> = {
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

/** Noma'lum kategoriya uchun — hech bo'lmasa qo'ng'iroq chizilsin. */
export const fallbackStyle = { icon: Bell, tone: 'bg-muted text-muted-foreground' } as const;
