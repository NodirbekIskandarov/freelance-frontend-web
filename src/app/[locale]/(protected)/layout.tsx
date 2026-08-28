import type { Metadata } from 'next';

import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { RequireAuth } from '@/features/auth/RequireAuth';

/**
 * Kirish talab qiladigan, lekin kabinet qobig'iga sig'maydigan sahifalar.
 *
 * Birja — to'liq kenglikdagi master/detail ekran; uni kabinetning tor
 * ustuniga siqish kartalar va takliflar panelini yeb qo'yardi. Shu bois
 * `(cabinet)` guruhidan ajratilgan, ammo himoya va `noindex` bir xil.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function ProtectedLayout({ children, params }: LayoutProps<'/[locale]'>) {
  const { locale } = await params;

  return (
    <>
      <Header />
      <main className="flex-1">
        <RequireAuth>{children}</RequireAuth>
      </main>
      <Footer locale={locale} />
    </>
  );
}
