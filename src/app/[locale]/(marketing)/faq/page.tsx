import { FaqList } from '@/components/marketing/FAQ';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Container } from '@/components/ui/Container';
import { allFaqItems, faqGroups, faqJsonLd } from '@/content/faq';
import { DEFAULT_LOCALE, isLocale } from '@/i18n/config';
import { getMessages } from '@/i18n/messages';
import { breadcrumbJsonLd, buildMetadata, JsonLd } from '@/lib/seo';

export async function generateMetadata({ params }: PageProps<'/[locale]'>) {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : DEFAULT_LOCALE;
  const seo = (await getMessages(locale)).seo.faq;

  return buildMetadata({ title: seo.title, description: seo.description, path: '/faq', locale });
}

export default async function FaqPage({ params }: PageProps<'/[locale]'>) {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : DEFAULT_LOCALE;
  const m = await getMessages(locale);

  const crumbs = [
    { name: m.materials.breadcrumbHome, path: '/' },
    { name: m.home.faqPageTitle, path: '/faq' },
  ];

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd data={faqJsonLd(allFaqItems(locale))} />

      <Container className="py-8 sm:py-12">
        <Breadcrumbs items={crumbs} />

        <header className="mt-6 max-w-2xl">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {m.home.faqPageTitle}
          </h1>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            {m.home.faqPageLead}
          </p>
        </header>

        <div className="mt-10 max-w-3xl space-y-10">
          {faqGroups(locale).map((group) => (
            <section key={group.title}>
              <h2 className="text-lg font-bold tracking-tight text-foreground">{group.title}</h2>
              <div className="mt-3">
                <FaqList items={group.items} />
              </div>
            </section>
          ))}
        </div>
      </Container>
    </>
  );
}
