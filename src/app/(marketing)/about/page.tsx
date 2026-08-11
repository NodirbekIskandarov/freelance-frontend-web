import { GraduationCap, HeartHandshake, ShieldCheck, Sparkles } from 'lucide-react';

import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { siteConfig } from '@/config/site';
import { absoluteUrl, breadcrumbJsonLd, buildMetadata, JsonLd } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Biz haqimizda',
  description:
    "Yopamiz.uz — O'zbekiston talabalari uchun akademik yordam platformasi. Tayyor materiallar, tekshirilgan freelancerlar va himoyalangan to'lov.",
  path: '/about',
});

const crumbs = [
  { name: 'Bosh sahifa', path: '/' },
  { name: 'Biz haqimizda', path: '/about' },
];

const values = [
  {
    icon: ShieldCheck,
    title: 'Ishonch',
    body: "Har bir freelancer hujjatlari bilan tasdiqlanadi. To'lov ish topshirilgunicha platformada saqlanadi.",
  },
  {
    icon: GraduationCap,
    title: 'Akademik halollik',
    body: "Freelancerlar ishni o'zlari bajaradi — tayyor nusxa sotish taqiqlanadi. Materiallar tekshiruvdan o'tadi.",
  },
  {
    icon: Sparkles,
    title: 'Tezlik',
    body: "Tayyor materialni darhol yuklab olasiz, birjaga joylangan topshiriqqa esa odatda bir necha soatda taklif keladi.",
  },
  {
    icon: HeartHandshake,
    title: 'Qo‘llab-quvvatlash',
    body: "Nizo chiqsa jamoa masalani ko'rib chiqadi: pul qaytarish yoki ishni qayta bajartirish imkoniyati bor.",
  },
];

const stats = [
  { value: '10', label: 'universitet' },
  { value: '47', label: 'fan' },
  { value: '500+', label: 'freelancer' },
  { value: '98%', label: 'muvaffaqiyatli ish' },
];

export default function AboutPage() {
  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'Biz haqimizda',
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
            Talabalar uchun bitta ishonchli joy
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Yopamiz.uz — O&apos;zbekiston talabalari uchun akademik yordam platformasi. Bu yerda
            tayyor materiallarni topasiz yoki o&apos;z topshirig&apos;ingizni birjaga joylab,
            tekshirilgan mutaxassisdan yordam olasiz. Maqsadimiz — talabani ishonchsiz e&apos;lonlar
            va noaniq kelishuvlardan xalos qilish.
          </p>
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
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Nimaga tayanamiz</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {values.map((value) => (
              <article
                key={value.title}
                className="rounded-2xl border border-border/60 bg-background p-5 dark:border-zinc-800 dark:bg-zinc-900/70"
              >
                <span className="grid size-10 place-items-center rounded-lg bg-emerald-500/12 text-emerald-600 dark:text-emerald-400">
                  <value.icon className="size-5" />
                </span>
                <h3 className="mt-3 text-base font-bold text-foreground">{value.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{value.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-12 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 sm:p-8">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Bizga qo&apos;shilishni xohlaysizmi?
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Agar biror sohada kuchli bo&apos;lsangiz — freelancer bo&apos;lib, talabalarga yordam
            bering va daromad qiling. Ariza 1–3 ish kunida ko&apos;rib chiqiladi.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <ButtonLink href="/freelance/apply" variant="emerald">
              Freelancer bo&apos;lish
            </ButtonLink>
            <ButtonLink href="/materials" variant="outline">
              Materiallarni ko&apos;rish
            </ButtonLink>
          </div>
        </section>
      </Container>
    </>
  );
}
