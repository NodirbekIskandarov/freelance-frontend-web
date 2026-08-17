import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Container } from '@/components/ui/Container';
import { ApplyWizard } from '@/features/freelance/apply/ApplyWizard';
import { breadcrumbJsonLd, buildMetadata, JsonLd } from '@/lib/seo';

export const metadata = buildMetadata({
  title: "Freelancer bo'lish — ariza yuborish",
  description:
    "Yopamiz.uz'da freelancer bo'ling: talabalarga akademik ishlarda yordam bering va daromad qiling. Ariza 1–3 ish kunida ko'rib chiqiladi.",
  path: '/freelance/apply',
});

const crumbs = [
  { name: 'Bosh sahifa', path: '/' },
  { name: 'Freelancerlar', path: '/freelance' },
  { name: "Freelancer bo'lish", path: '/freelance/apply' },
];

/*
 * Sahifa ochiq va indekslanadi: tanishtiruv qismi Server Component'da
 * render qilinadi, shuning uchun bot to'liq matnni ko'radi. Interaktiv
 * ariza esa kirishni talab qiladi va uni `ApplyWizard` o'zi hal qiladi —
 * butun sahifani qo'riqchi ostiga olish SEO'ni yo'q qilardi.
 */
export default function FreelanceApplyPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />

      <Container className="py-8 sm:py-12">
        <Breadcrumbs items={crumbs} />

        <header className="mt-6 max-w-2xl">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Freelancer bo&apos;lish uchun ariza yuborish
          </h1>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            Ma&apos;lumotlaringizni to&apos;ldiring. Arizangiz admin tomonidan tekshiriladi va 1–3
            ish kuni ichida javob beriladi. Tasdiqlangach birjadagi ochiq ishlarga taklif
            yuborishingiz mumkin bo&apos;ladi.
          </p>
        </header>

        <div className="mt-8">
          <ApplyWizard />
        </div>
      </Container>
    </>
  );
}
