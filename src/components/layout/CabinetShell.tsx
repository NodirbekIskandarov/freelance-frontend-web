'use client';

import {
  Bell,
  Bookmark,
  Briefcase,
  ClipboardList,
  Coins,
  Download,
  FilePlus2,
  LayoutDashboard,
  LifeBuoy,
  Send,
  ShoppingBag,
  UserRound,
  Wallet,
  type LucideIcon,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

import { Container } from '@/components/ui/Container';
import { cn } from '@/lib/cn';
import { isFreelancer } from '@/shared/types/auth';
import { selectCurrentUser } from '@/store/slices/authSlice';
import { useAppSelector } from '@/store/hooks';

interface CabinetNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

/*
 * Navigatsiya SHU YERDA, mijoz chegarasi ichida e'lon qilingan.
 *
 * Ilgari u alohida faylda edi va server layout'dan prop sifatida
 * uzatilardi — Next buni rad etadi: `icon` maydonidagi React komponenti
 * funksiya, funksiyalar esa server→mijoz chegarasidan o'ta olmaydi
 * ("Functions cannot be passed directly to Client Components").
 * Konfiguratsiyani mijoz tomonida saqlash bu chegarani butunlay yo'q qiladi.
 */
/** Ikkala rolda ham bir xil bo'lgan, rolga bog'liq bo'lmagan bo'limlar. */
const SHARED_NAV: CabinetNavItem[] = [
  { label: 'Bildirishnomalar', href: '/notifications', icon: Bell },
  { label: 'Arizalarim', href: '/requests', icon: FilePlus2 },
  { label: 'Saqlanganlar', href: '/saved', icon: Bookmark },
  { label: 'Hamyon', href: '/wallet', icon: Wallet },
  { label: 'Murojaatlar', href: '/appeals', icon: LifeBuoy },
];

const NAV: Record<CabinetVariant, { title: string; items: CabinetNavItem[] }> = {
  student: {
    title: 'Talaba kabineti',
    items: [
      { label: 'Bosh sahifa', href: '/student/dashboard', icon: LayoutDashboard },
      { label: 'Buyurtmalar', href: '/student/orders', icon: ShoppingBag },
      { label: 'Yuklamalar', href: '/student/downloads', icon: Download },
      { label: 'Profil', href: '/student/profile', icon: UserRound },
      ...SHARED_NAV,
    ],
  },
  freelancer: {
    title: 'Freelancer kabineti',
    items: [
      { label: 'Bosh sahifa', href: '/freelancer/dashboard', icon: LayoutDashboard },
      { label: 'Ochiq topshiriqlar', href: '/freelancer/board', icon: ClipboardList },
      { label: 'Takliflarim', href: '/freelancer/offers', icon: Send },
      { label: 'Ishlarim', href: '/freelancer/orders', icon: Briefcase },
      { label: 'Daromad', href: '/freelancer/earnings', icon: Coins },
      { label: 'Profil', href: '/freelancer/profile', icon: UserRound },
      ...SHARED_NAV,
    ],
  },
};

export type CabinetVariant = 'student' | 'freelancer';

/**
 * Talaba va freelancer kabinetlari uchun umumiy qobiq: chapda navigatsiya,
 * o'ngda kontent. Ikkalasi bir xil tuzilishga ega, faqat menyu farq qiladi.
 *
 * Variant prop orqali emas, kirgan foydalanuvchidan olinadi. Ilgari uni
 * har bir rol layout'i uzatardi, ammo `/saved`, `/wallet` va `/appeals`
 * ikkala rolga ham tegishli — ular uchun qaysi variantni uzatish
 * kerakligi noaniq edi va natijada bu sahifalar qobiqsiz qolgandi.
 */
export function CabinetShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const user = useAppSelector(selectCurrentUser);

  const variant: CabinetVariant = user && isFreelancer(user) ? 'freelancer' : 'student';
  const { title, items } = NAV[variant];

  return (
    <Container className="py-8 sm:py-10">
      <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>

      <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:gap-8">
        <nav aria-label={title} className="lg:w-56 lg:shrink-0">
          <ul className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible [&::-webkit-scrollbar]:hidden">
            {items.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive ? 'page' : undefined}
                    className={cn(
                      'flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium whitespace-nowrap transition-colors',
                      isActive
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                    )}
                  >
                    <item.icon className="size-4 shrink-0" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </Container>
  );
}
