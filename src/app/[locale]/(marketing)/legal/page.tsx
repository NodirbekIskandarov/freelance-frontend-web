import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Container } from '@/components/ui/Container';
import { siteConfig } from '@/config/site';
import { legalSections } from '@/content/legal';
import { DEFAULT_LOCALE, isLocale } from '@/i18n/config';
import { getMessages } from '@/i18n/messages';
import { breadcrumbJsonLd, buildMetadata, JsonLd } from '@/lib/seo';

export async function generateMetadata({ params }: PageProps<'/[locale]'>) {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : DEFAULT_LOCALE;
  const seo = (await getMessages(locale)).seo.legal;

  return buildMetadata({ title: seo.title, description: seo.description, path: '/legal', locale });
}

export default async function LegalPage({ params }: PageProps<'/[locale]'>) {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : DEFAULT_LOCALE;

  const m = (await getMessages(locale)).materials;
  const sections = legalSections(locale);

  const crumbs = [
    { name: m.breadcrumbHome, path: '/' },
    { name: m.legalCrumb, path: '/legal' },
  ];

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />

      <Container className="py-8 sm:py-12">
        <Breadcrumbs items={crumbs} />

        <header className="mt-6 max-w-2xl">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {m.legalHeading}
          </h1>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">{m.legalLead}</p>
        </header>

        <div className="mt-10 flex flex-col gap-10 lg:flex-row">
          {/*
            Mundarija `<nav>` ichida: uzun huquqiy matnda kerakli bo'limga
            o'tish klaviatura va skrinrider bilan ham oson bo'lishi kerak.
          */}
          <nav aria-label={m.contents} className="lg:order-2 lg:w-60 lg:shrink-0">
            <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              {m.contents}
            </p>
            <ul className="mt-3 space-y-2 lg:sticky lg:top-24">
              {sections.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="max-w-2xl min-w-0 flex-1 space-y-8 lg:order-1">
            {sections.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-24">
                <h2 className="text-lg font-bold tracking-tight text-foreground">
                  {section.title}
                </h2>
                {section.paragraphs.map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 40)}
                    className="mt-3 text-sm leading-relaxed text-muted-foreground"
                  >
                    {paragraph}
                  </p>
                ))}
              </section>
            ))}

            <p className="border-t border-border pt-6 text-sm text-muted-foreground">
              {m.questionsAt}{' '}
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="font-medium text-emerald-600 hover:underline dark:text-emerald-400"
              >
                {siteConfig.contact.email}
              </a>
            </p>
          </div>
        </div>
      </Container>
    </>
  );
}
