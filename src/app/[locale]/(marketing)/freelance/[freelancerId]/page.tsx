import { Briefcase, CircleCheck, MapPin, Star, Wallet } from 'lucide-react';
import { notFound } from 'next/navigation';

import { FreelancerReviews } from '@/components/freelance/FreelancerReviews';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { formatSom } from '@/lib/format';
import { absoluteUrl, breadcrumbJsonLd, buildMetadata, JsonLd } from '@/lib/seo';
import { getFreelancer, getFreelancerReviews } from '@/server/freelance/directory';
import {
  availabilityLabel,
  experienceLevelLabel,
  workDirectionLabel,
} from '@/shared/types/publicFreelance';
import { DEFAULT_LOCALE, isLocale } from '@/i18n/config';
import { interpolate } from '@/i18n/interpolate';
import { getMessages } from '@/i18n/messages';
import { setRequestLocale } from '@/i18n/requestLocale';

export async function generateMetadata(props: PageProps<'/[locale]/freelance/[freelancerId]'>) {
  const { locale: raw, freelancerId } = await props.params;
  const locale = isLocale(raw) ? raw : DEFAULT_LOCALE;
  setRequestLocale(locale);

  const m = await getMessages(locale);
  const freelancer = await getFreelancer(freelancerId);

  if (!freelancer) {
    return buildMetadata({
      title: m.seo.freelancerNotFound.title,
      description: m.seo.freelancerNotFound.description,
      path: `/freelance/${freelancerId}`,
      locale,
      noIndex: true,
    });
  }

  const direction = workDirectionLabel(freelancer.direction, m) ?? freelancer.direction;

  return buildMetadata({
    title: interpolate(m.seo.freelancer.title, { name: freelancer.full_name, direction }),
    description:
      freelancer.bio ||
      interpolate(m.seo.freelancer.description, {
        name: freelancer.full_name,
        direction,
        jobs: freelancer.completed_jobs,
        rating: freelancer.rating,
      }),
    path: `/freelance/${freelancerId}`,
    locale,
  });
}

export default async function FreelancerProfilePage(
  props: PageProps<'/[locale]/freelance/[freelancerId]'>,
) {
  const { locale: raw, freelancerId } = await props.params;
  const locale = isLocale(raw) ? raw : DEFAULT_LOCALE;
  setRequestLocale(locale);

  const m = await getMessages(locale);
  const freelancer = await getFreelancer(freelancerId);

  if (!freelancer) notFound();

  const reviews = await getFreelancerReviews(freelancerId);
  const direction = workDirectionLabel(freelancer.direction, m) ?? freelancer.direction;
  const rating = Number(freelancer.rating);

  const crumbs = [
    { name: m.materials.breadcrumbHome, path: '/' },
    { name: m.nav.freelancers, path: '/freelance' },
    { name: freelancer.full_name, path: `/freelance/${freelancerId}` },
  ];

  /*
   * `aggregateRating` faqat sharh BORLIGIDA qo'shiladi: nol sharh bilan
   * uni e'lon qilish Google'ning strukturaviy ma'lumot qoidasini buzadi.
   */
  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: freelancer.full_name,
    jobTitle: direction,
    description: freelancer.bio,
    knowsAbout: freelancer.skills,
    url: absoluteUrl(`/freelance/${freelancerId}`),
    ...(freelancer.city ? { homeLocation: freelancer.city } : {}),
    ...(reviews.length > 0
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: rating.toFixed(1),
            reviewCount: reviews.length,
            bestRating: 5,
          },
        }
      : {}),
  };

  return (
    <Container className="py-8 sm:py-10">
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd data={personJsonLd} />

      <Breadcrumbs items={crumbs} />

      <header className="mt-6 flex flex-wrap items-start gap-5 rounded-2xl border border-border bg-background p-5 sm:p-6 dark:border-zinc-800 dark:bg-zinc-900/70">
        {freelancer.avatar ? (
          // Backend rasm domenlari oldindan noma'lum — `next/image` emas.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={freelancer.avatar}
            alt=""
            className="size-20 shrink-0 rounded-full object-cover"
          />
        ) : (
          <span className="grid size-20 shrink-0 place-items-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-xl font-bold text-white">
            {freelancer.full_name.trim().charAt(0).toUpperCase() || '—'}
          </span>
        )}

        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {freelancer.full_name || 'Freelancer'}
          </h1>
          <p className="mt-1 text-sm font-semibold text-brand">
            {direction}
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Star className="size-3.5 fill-amber-400 text-amber-400" />
              <span className="font-bold text-foreground">
                {Number.isNaN(rating) ? '—' : rating.toFixed(1)}
              </span>
              ({reviews.length} sharh)
            </span>
            <span className="inline-flex items-center gap-1">
              <Briefcase className="size-3.5" />
              {freelancer.completed_jobs} ta ish
            </span>
            {freelancer.city && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="size-3.5" />
                {freelancer.city}
              </span>
            )}
            <span className="inline-flex items-center gap-1">
              <CircleCheck className="size-3.5" />
              {availabilityLabel(freelancer.availability, m)}
            </span>
            <span className="inline-flex items-center gap-1">
              <Wallet className="size-3.5" />
              {freelancer.price_from ? formatSom(Number(freelancer.price_from)) : 'Kelishuv'}
            </span>
          </div>

          {freelancer.skills.length > 0 && (
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {freelancer.skills.map((skill) => (
                <li
                  key={skill}
                  className="rounded-md border border-border bg-muted/50 px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
                >
                  {skill}
                </li>
              ))}
            </ul>
          )}
        </div>

        <ButtonLink href="/freelance/exchange" variant="emerald">
          Topshiriq joylash
        </ButtonLink>
      </header>

      {freelancer.bio && (
        <section className="mt-6">
          <h2 className="text-lg font-bold text-foreground">Men haqimda</h2>
          <p className="mt-2 text-sm leading-relaxed whitespace-pre-line text-muted-foreground">
            {freelancer.bio}
          </p>
        </section>
      )}

      <section className="mt-8">
        <h2 className="text-lg font-bold text-foreground">
          Tajriba:{' '}
          {experienceLevelLabel(freelancer.experience_level, m) ?? freelancer.experience_level}
        </h2>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-bold text-foreground">Sharhlar ({reviews.length})</h2>
        <div className="mt-4">
          <FreelancerReviews reviews={reviews} />
        </div>
      </section>
    </Container>
  );
}
