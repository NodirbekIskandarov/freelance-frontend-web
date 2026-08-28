import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';

/**
 * Ommaviy sayt uchun umumiy qobiq: sarlavha + izohli sahifa + pastki qism.
 * Auth/talaba/freelancer kabinetlari o'z qobig'iga ega bo'ladi (sidebar'li),
 * shuning uchun bu shell faqat `(marketing)` guruhiga tegishli.
 */
export default async function MarketingLayout({ children, params }: LayoutProps<'/[locale]'>) {
  const { locale } = await params;

  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      {/* Footer server komponenti — tarjimalarni o'zi yuklaydi va shu
          sababli tilni parametr sifatida oladi. */}
      <Footer locale={locale} />
    </>
  );
}
