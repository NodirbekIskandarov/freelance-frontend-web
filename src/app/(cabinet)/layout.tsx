import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { CabinetShell } from '@/components/layout/CabinetShell';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { RequireAuth } from '@/features/auth/RequireAuth';

/**
 * Kabinet sahifalari — shaxsiy, indekslanmasligi kerak.
 *
 * `robots.ts` ham bu yo'llarni taqiqlaydi, lekin meta-teg qo'shimcha
 * himoya: `robots.txt` faqat sahifani SKANERLASHNI to'xtatadi; agar
 * boshqa saytda havola bo'lsa, sahifa baribir indeksga tushishi mumkin.
 * `noindex` meta-tegi esa indeksdan aniq chiqarib tashlaydi.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function CabinetLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex-1">
        <RequireAuth>
          <CabinetShell>{children}</CabinetShell>
        </RequireAuth>
      </main>
      <Footer />
    </>
  );
}
