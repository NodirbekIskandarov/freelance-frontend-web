import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Container } from '@/components/ui/Container';
import { FreelancerDirectory } from '@/features/freelance/FreelancerDirectory';
import { DEFAULT_LOCALE, isLocale } from '@/i18n/config';
import { getMessages } from '@/i18n/messages';
import { setRequestLocale } from '@/i18n/requestLocale';
import { absoluteUrl, breadcrumbJsonLd, buildMetadata, JsonLd } from '@/lib/seo';
import { getFreelancerCities, getFreelancers } from '@/server/freelance/directory';
import { workDirectionLabel } from '@/shared/types/publicFreelance';
import { interpolate } from '@/i18n/interpolate';

export async function generateMetadata({ params }: PageProps<'/[locale]'>) {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : DEFAULT_LOCALE;
  const seo = (await getMessages(locale)).seo.freelance;

  return buildMetadata({
    title: seo.title,
    description: seo.description,
    path: '/freelance',
    locale,
  });
}

export default async function FreelancePage({ params }: PageProps<'/[locale]'>) {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : DEFAULT_LOCALE;
  setRequestLocale(locale);

  const m = await getMessages(locale);
  const crumbs = [
    { name: m.materials.breadcrumbHome, path: '/' },
    { name: m.nav.freelancers, path: '/freelance' },
  ];

  const [freelancers, cities] = await Promise.all([getFreelancers(), getFreelancerCities()]);

  /*
   * ItemList — ro'yxatning TO'LIQ nusxasi, sahifada esa avvaliga 8 tasi
   * ko'rinadi. Qidiruv tizimi "yana ko'rsatish" tugmasini bosmaydi, shuning
   * uchun qolgan mutaxassislar faqat shu yerda ko'rinadi.
   */
  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: m.pages.freelancerListName,
    numberOfItems: freelancers.length,
    itemListElement: freelancers.map((freelancer, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Person',
        name: freelancer.full_name,
        jobTitle: workDirectionLabel(freelancer.direction, m) ?? freelancer.direction,
        description: freelancer.bio,
        knowsAbout: freelancer.skills,
        ...(freelancer.city ? { homeLocation: freelancer.city } : {}),
        url: absoluteUrl(`/freelance/${freelancer.id}`),
      },
    })),
  };

  /* Katalog bo'sh bo'lsa 0/0 = NaN chiqardi — nolga tushamiz. */
  const averageRating =
    freelancers.length > 0
      ? freelancers.reduce((sum, item) => sum + Number(item.rating), 0) / freelancers.length
      : 0;

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd data={itemListJsonLd} />

      <Container className="py-8 sm:py-12">
        <Breadcrumbs items={crumbs} />

        <header className="mt-6 overflow-hidden rounded-2xl border border-panel-border bg-panel p-6 sm:p-8">
          <p className="text-xs font-semibold tracking-wider text-panel-accent uppercase">
            {interpolate(m.pages.verifiedFreelancers, { count: freelancers.length })}
          </p>
          <h1 className="mt-2 text-2xl leading-tight font-bold text-panel-foreground sm:text-3xl">
            {m.pages.findLead}{' '}
            <span className="bg-gradient-to-r from-emerald-300 to-emerald-500 bg-clip-text text-transparent">
              {m.pages.findAccent}
            </span>{' '}
            {m.pages.findTail}
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-panel-muted">
            {m.pages.freelanceLead}
          </p>

          <dl className="mt-5 flex flex-wrap gap-2">
            <Stat value={`${freelancers.length}`} label={m.pages.statFreelancer} />
            <Stat value={averageRating.toFixed(1)} label={m.pages.averageRating} />
            <Stat value="98%" label={m.pages.statSuccess} />
          </dl>
        </header>

        <div className="mt-8">
          <FreelancerDirectory freelancers={freelancers} cities={cities} />
        </div>
      </Container>
    </>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="inline-flex items-baseline gap-2 rounded-xl border border-emerald-500/25 bg-black/40 px-3.5 py-2">
      <dt className="order-2 text-xs text-panel-dim">{label}</dt>
      <dd className="order-1 text-base font-bold text-panel-accent tabular-nums sm:text-lg">
        {value}
      </dd>
    </div>
  );
}
