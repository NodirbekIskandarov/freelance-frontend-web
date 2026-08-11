export interface PublicNavItem {
  label: string;
  href: string;
  /** Xizmat hali ishga tushmagan — ko'rinadi, lekin bosilmaydi. */
  comingSoon?: boolean;
}

export const PUBLIC_NAV_ITEMS: PublicNavItem[] = [
  { label: 'Bosh sahifa', href: '/' },
  { label: 'Diplom ishlari', href: '/#xizmatlar', comingSoon: true },
  { label: 'Spravka', href: '/#xizmatlar', comingSoon: true },
  { label: 'Konspekt', href: '/#xizmatlar', comingSoon: true },
  { label: 'Tayyor materiallar', href: '/materials' },
  { label: 'Freelancerlar', href: '/freelance' },
  { label: 'Yordam', href: '/faq' },
];
