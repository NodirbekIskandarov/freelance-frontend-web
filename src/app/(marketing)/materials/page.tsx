import { UniversityCard } from '@/components/materials/UniversityCard';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Container } from '@/components/ui/Container';
import { breadcrumbJsonLd, buildMetadata, JsonLd } from '@/lib/seo';
import { getSubjectsByUniversity, getUniversities, universitySlug } from '@/server/catalogue';

export const metadata = buildMetadata({
  title: 'Tayyor materiallar — universitetlar bo‘yicha topshiriqlar',
  description:
    "O'zbekiston universitetlari bo'yicha tayyor topshiriqlar, mustaqil va laboratoriya ishlari. Fan va kurs bo'yicha qidiring, darhol yuklab oling.",
  path: '/materials',
});

const crumbs = [
  { name: 'Bosh sahifa', path: '/' },
  { name: 'Tayyor materiallar', path: '/materials' },
];

export default async function MaterialsPage() {
  const universities = await getUniversities();

  // Har bir universitet uchun fanlar soni — kartada ko'rsatiladi.
  // Universitetlar kam, shuning uchun parallel so'rov yetarli.
  const subjectCounts = await Promise.all(
    universities.map(async (university) => (await getSubjectsByUniversity(university.id)).length),
  );

  const totalSubjects = subjectCounts.reduce((sum, count) => sum + count, 0);

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />

      <Container className="py-8 sm:py-12">
        <Breadcrumbs items={crumbs} />

        <header className="mt-6">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Tayyor materiallar
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
            {universities.length} ta universitet va {totalSubjects} ta fan. Universitetni tanlang va
            fanlar ro&apos;yxatiga o&apos;ting.
          </p>
        </header>

        {universities.length === 0 ? (
          <p className="mt-8 rounded-xl border border-dashed border-border px-6 py-16 text-center text-sm text-muted-foreground">
            Katalog hozircha to&apos;ldirilmoqda. Tez orada bu yerda universitetlar paydo
            bo&apos;ladi.
          </p>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {universities.map((university, index) => (
              <UniversityCard
                key={university.id}
                university={university}
                href={`/materials/${universitySlug(university)}`}
                subjectCount={subjectCounts[index]}
              />
            ))}
          </div>
        )}
      </Container>
    </>
  );
}
