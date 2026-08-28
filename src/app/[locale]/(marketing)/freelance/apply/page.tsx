import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Container } from '@/components/ui/Container';
import { ApplyWizard } from '@/features/freelance/apply/ApplyWizard';
import { breadcrumbJsonLd, buildMetadata, JsonLd } from '@/lib/seo';
import { DEFAULT_LOCALE, isLocale } from '@/i18n/config';
import { getMessages } from '@/i18n/messages';

export async function generateMetadata({ params }: PageProps<'/[locale]'>) {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : DEFAULT_LOCALE;
  const m = (await getMessages(locale)).pages;

  return buildMetadata({
    title: m.applySeoTitle,
    description: m.applySeoDescription,
    path: '/freelance/apply',
    locale,
  });
}

/*
 * Sahifa ochiq va indekslanadi: tanishtiruv qismi Server Component'da
 * render qilinadi, shuning uchun bot to'liq matnni ko'radi. Interaktiv
 * ariza esa kirishni talab qiladi va uni `ApplyWizard` o'zi hal qiladi —
 * butun sahifani qo'riqchi ostiga olish SEO'ni yo'q qilardi.
 */
export default async function FreelanceApplyPage({ params }: PageProps<'/[locale]'>) {
  const { locale: raw } = await params;
  const messages = await getMessages(isLocale(raw) ? raw : DEFAULT_LOCALE);
  const m = messages.pages;

  const crumbs = [
    { name: messages.materials.breadcrumbHome, path: '/' },
    { name: messages.nav.freelancers, path: '/freelance' },
    { name: m.applyCrumb, path: '/freelance/apply' },
  ];

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />

      <Container className="py-8 sm:py-12">
        <Breadcrumbs items={crumbs} />

        <header className="mt-6 max-w-2xl">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {m.applyTitle}
          </h1>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">{m.applyPageLead}</p>
        </header>

        <div className="mt-8">
          <ApplyWizard />
        </div>
      </Container>
    </>
  );
}
