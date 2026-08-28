import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Container } from '@/components/ui/Container';
import { FreelancerDirectory } from '@/features/freelance/FreelancerDirectory';
import { DEFAULT_LOCALE, isLocale } from '@/i18n/config';
import { getMessages } from '@/i18n/messages';
import { setRequestLocale } from '@/i18n/requestLocale';
import { absoluteUrl, breadcrumbJsonLd, buildMetadata, JsonLd } from '@/lib/seo';
import { getFreelancerCities, getFreelancers } from '@/server/freelance/directory';
import { workDirectionLabel } from '@/shared/types/publicFreelance';

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
    name: 'Yopamiz.uz freelancerlari',
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

        <header className="mt-6 overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-950 via-zinc-950 to-black p-6 sm:p-8">
          <p className="text-xs font-semibold tracking-wider text-emerald-400 uppercase">
            {freelancers.length} ta tasdiqlangan freelancer
          </p>
          <h1 className="mt-2 text-2xl leading-tight font-bold text-white sm:text-3xl">
            Ishonchli{' '}
            <span className="bg-gradient-to-r from-emerald-300 to-emerald-500 bg-clip-text text-transparent">
              freelancer
            </span>{' '}
            toping
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-zinc-400">
            Mutaxassis tanlang, chatda kelishing, shartnoma va to&apos;lov — hammasi bir joyda.
          </p>

          <dl className="mt-5 flex flex-wrap gap-2">
            <Stat value={`${freelancers.length}`} label="Freelancer" />
            <Stat value={averageRating.toFixed(1)} label="O'rtacha reyting" />
            <Stat value="98%" label="Muvaffaqiyat" />
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
      <dt className="order-2 text-xs text-zinc-500">{label}</dt>
      <dd className="order-1 text-base font-bold text-emerald-300 tabular-nums sm:text-lg">
        {value}
      </dd>
    </div>
  );
}
