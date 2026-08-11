import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Container } from '@/components/ui/Container';
import { FreelancerDirectory } from '@/features/freelance/FreelancerDirectory';
import { absoluteUrl, breadcrumbJsonLd, buildMetadata, JsonLd } from '@/lib/seo';
import { getFreelancerInstitutes, getFreelancers } from '@/server/freelance/directory';

export const metadata = buildMetadata({
  title: 'Freelancer qidirish — ishonchli mutaxassislar',
  description:
    "Yopamiz.uz'da tasdiqlangan freelancerlar: dasturlash, chizmachilik, kurs ishlari va tarjima. Reyting, narx va institut bo'yicha tanlang.",
  path: '/freelance',
});

const crumbs = [
  { name: 'Bosh sahifa', path: '/' },
  { name: 'Freelancerlar', path: '/freelance' },
];

export default async function FreelancePage() {
  const [freelancers, institutes] = await Promise.all([
    getFreelancers(),
    getFreelancerInstitutes(),
  ]);

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
        name: freelancer.name,
        jobTitle: freelancer.primarySkill,
        description: freelancer.bio,
        knowsAbout: freelancer.skills,
        alumniOf: {
          '@type': 'CollegeOrUniversity',
          name: freelancer.universityFullName,
        },
        url: absoluteUrl('/freelance'),
      },
    })),
  };

  const averageRating =
    freelancers.reduce((sum, item) => sum + item.rating, 0) / freelancers.length;

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
          <FreelancerDirectory freelancers={freelancers} institutes={institutes} />
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
