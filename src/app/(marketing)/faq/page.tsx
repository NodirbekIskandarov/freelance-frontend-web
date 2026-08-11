import { FaqList } from '@/components/marketing/FAQ';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Container } from '@/components/ui/Container';
import { ALL_FAQ_ITEMS, FAQ_GROUPS, faqJsonLd } from '@/content/faq';
import { breadcrumbJsonLd, buildMetadata, JsonLd } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Savol-javob — tez-tez beriladigan savollar',
  description:
    "Yopamiz.uz haqida savollar: topshiriq joylash, to'lov, kafolat, freelancer bo'lish va komissiya. Barcha javoblar bir sahifada.",
  path: '/faq',
});

const crumbs = [
  { name: 'Bosh sahifa', path: '/' },
  { name: 'Savol-javob', path: '/faq' },
];

export default function FaqPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd data={faqJsonLd(ALL_FAQ_ITEMS)} />

      <Container className="py-8 sm:py-12">
        <Breadcrumbs items={crumbs} />

        <header className="mt-6 max-w-2xl">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Savol-javob
          </h1>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            Eng ko&apos;p beriladigan savollarga javoblar. Kerakli javobni topmasangiz,
            qo&apos;llab-quvvatlash jamoasiga murojaat qiling.
          </p>
        </header>

        <div className="mt-10 max-w-3xl space-y-10">
          {FAQ_GROUPS.map((group) => (
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
