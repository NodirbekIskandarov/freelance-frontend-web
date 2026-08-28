import { GraduationCap, HeartHandshake, ShieldCheck, Sparkles } from 'lucide-react';

import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { siteConfig } from '@/config/site';
import { DEFAULT_LOCALE, isLocale } from '@/i18n/config';
import { getMessages } from '@/i18n/messages';
import type { Messages } from '@/i18n/messages/uz';
import { absoluteUrl, breadcrumbJsonLd, buildMetadata, JsonLd } from '@/lib/seo';

export async function generateMetadata({ params }: PageProps<'/[locale]'>) {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : DEFAULT_LOCALE;
  const seo = (await getMessages(locale)).seo.about;

  return buildMetadata({ title: seo.title, description: seo.description, path: '/about', locale });
}

/* Matn TARJIMADAN: ro'yxat modul yuklanganda tuziladi va o'sha paytda
   qaysi til tanlanganini bilib bo'lmaydi. */
const values = [
  {
    icon: ShieldCheck,
    title: (m: Messages) => m.about.value1,
    body: (m: Messages) => m.about.value1Body,
  },
  {
    icon: GraduationCap,
    title: (m: Messages) => m.about.value2,
    body: (m: Messages) => m.about.value2Body,
  },
  {
    icon: Sparkles,
    title: (m: Messages) => m.about.value3,
    body: (m: Messages) => m.about.value3Body,
  },
  {
    icon: HeartHandshake,
    title: (m: Messages) => m.about.value4,
    body: (m: Messages) => m.about.value4Body,
  },
];

export default async function AboutPage({ params }: PageProps<'/[locale]'>) {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : DEFAULT_LOCALE;
  const messages = await getMessages(locale);
  const m = messages.about;

  const crumbs = [
    { name: messages.materials.breadcrumbHome, path: '/' },
    { name: m.crumb, path: '/about' },
  ];

  const stats = [
    { value: '10', label: m.statUniversities },
    { value: '47', label: m.statSubjects },
    { value: '500+', label: m.statFreelancers },
    { value: '98%', label: m.statSuccess },
  ];

  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: m.crumb,
    url: absoluteUrl('/about'),
    mainEntity: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: absoluteUrl(),
      email: siteConfig.contact.email,
      telephone: siteConfig.contact.phone,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Toshkent',
        addressCountry: 'UZ',
      },
    },
  };

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd data={organizationJsonLd} />

      <Container className="py-8 sm:py-12">
        <Breadcrumbs items={crumbs} />

        <header className="mt-6 max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {m.heading}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">{m.lead}</p>
        </header>

        <dl className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-border/60 bg-background p-4 dark:border-zinc-800 dark:bg-zinc-900/70"
            >
              <dd className="text-2xl font-bold text-emerald-600 tabular-nums dark:text-emerald-400">
                {stat.value}
              </dd>
              <dt className="mt-1 text-xs text-muted-foreground">{stat.label}</dt>
            </div>
          ))}
        </dl>

        <section className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">{m.valuesTitle}</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {values.map((value, index) => (
              <article
                key={index}
                className="rounded-2xl border border-border/60 bg-background p-5 dark:border-zinc-800 dark:bg-zinc-900/70"
              >
                <span className="grid size-10 place-items-center rounded-lg bg-emerald-500/12 text-emerald-600 dark:text-emerald-400">
                  <value.icon className="size-5" />
                </span>
                <h3 className="mt-3 text-base font-bold text-foreground">
                  {value.title(messages)}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {value.body(messages)}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-12 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 sm:p-8">
          <h2 className="text-xl font-bold tracking-tight text-foreground">{m.joinTitle}</h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
            {m.joinBody}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <ButtonLink href="/freelance/apply" variant="emerald">
              {m.joinAction}
            </ButtonLink>
            <ButtonLink href="/materials" variant="outline">
              {m.browseMaterials}
            </ButtonLink>
          </div>
        </section>
      </Container>
    </>
  );
}
