import type { Messages } from '@/i18n/messages/uz';

export interface PublicNavItem {
  /** Yorliq TARJIMADAN olinadi — bu yerda faqat qaysi kalit ekani turadi. */
  label: (messages: Messages) => string;
  href: string;
  /** Xizmat hali ishga tushmagan — ko'rinadi, lekin bosilmaydi. */
  comingSoon?: boolean;
}

/**
 * Yuqori menyu.
 *
 * Yorliqlar matn emas, TANLOVCHI funksiya: ro'yxat modul yuklanganda bir
 * marta hisoblanadi va o'sha paytda qaysi til tanlanganini bilib
 * bo'lmaydi. Funksiya esa chizish paytida, joriy lug'at bilan
 * chaqiriladi.
 */
export const PUBLIC_NAV_ITEMS: PublicNavItem[] = [
  { label: (m) => m.nav.home, href: '/' },
  { label: (m) => m.nav.notes, href: '/#xizmatlar', comingSoon: true },
  { label: (m) => m.nav.materials, href: '/materials' },
  { label: (m) => m.nav.freelancers, href: '/freelance' },
  { label: (m) => m.nav.help, href: '/faq' },
];
