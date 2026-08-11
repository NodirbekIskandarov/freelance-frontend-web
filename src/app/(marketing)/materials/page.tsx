import { UniversityCard } from '@/components/materials/UniversityCard';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Container } from '@/components/ui/Container';
import { breadcrumbJsonLd, buildMetadata, JsonLd } from '@/lib/seo';
import { getUniversities } from '@/server/materials/catalog';

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

  const totalSubjects = universities.reduce((sum, item) => sum + item.subjectCount, 0);
  const totalTasks = universities.reduce((sum, item) => sum + item.taskCount, 0);

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
            {universities.length} ta universitet, {totalSubjects} ta fan va{' '}
            {totalTasks.toLocaleString('ru-RU').replace(/ /g, ' ')} dan ortiq topshiriq.
            Universitetni tanlang va fanlar ro&apos;yxatiga o&apos;ting.
          </p>
        </header>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {universities.map((university) => (
            <UniversityCard key={university.id} university={university} />
          ))}
        </div>
      </Container>
    </>
  );
}
