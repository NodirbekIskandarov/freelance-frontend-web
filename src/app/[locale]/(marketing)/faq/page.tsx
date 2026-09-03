import { HelpCenter } from '@/components/support/HelpCenter';
import { SupportContacts } from '@/components/support/SupportContacts';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Container } from '@/components/ui/Container';
import { resolvedSections, type HelpFacts } from '@/content/help';
import { DEFAULT_LOCALE, isLocale, type Locale } from '@/i18n/config';
import { interpolate } from '@/i18n/interpolate';
import { getMessages, type Messages } from '@/i18n/messages';
import { setRequestLocale } from '@/i18n/requestLocale';
import { formatSom } from '@/lib/format';
import { breadcrumbJsonLd, buildMetadata, JsonLd } from '@/lib/seo';
import { getSupportTerms } from '@/server/support';
import type { SupportTerms } from '@/shared/types/support';

export async function generateMetadata({ params }: PageProps<'/[locale]'>) {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : DEFAULT_LOCALE;
  const seo = (await getMessages(locale)).seo.faq;

  return buildMetadata({ title: seo.title, description: seo.description, path: '/faq', locale });
}

/**
 * Muddatni odam o'qiydigan holga keltiradi.
 *
 * Bir kundan uzun bo'lsa KUNDA: «168 soat ichida» ni o'quvchi o'zi
 * bo'lishga majbur bo'lardi. Xuddi shu qoida shikoyat oynasida ham
 * ishlatiladi — ikkalasi bir xil muddatni bir xil aytishi kerak.
 */
function hoursLabel(hours: number, m: Messages): string {
  return hours >= 48
    ? interpolate(m.help.days, { count: Math.round(hours / 24) })
    : interpolate(m.help.hours, { count: hours });
}

/** Mukofot yoqilgan bo'lsa gap, o'chirilgan bo'lsa bo'sh satr. */
function rewardClause(amount: number, template: string, currency: string): string {
  return amount > 0 ? interpolate(template, { amount: formatSom(amount, currency) }) : '';
}

function factsFrom(terms: SupportTerms, m: Messages): HelpFacts {
  const currency = m.common.currency;
  const rewards = [
    { amount: terms.subject_request_reward, label: m.help.rewardSubject },
    { amount: terms.assignment_request_reward, label: m.help.rewardAssignment },
    { amount: terms.university_request_reward, label: m.help.rewardUniversity },
  ].filter((reward) => reward.amount > 0);

  return {
    disputeWindow: hoursLabel(terms.dispute_window_hours, m),
    authorHours: hoursLabel(terms.dispute_author_response_hours, m),
    evidenceLimit: String(terms.dispute_evidence_limit),
    maxSolutions: String(terms.max_solutions_per_variant),
    minWithdrawal: formatSom(terms.min_withdrawal, currency),
    openAppeals: String(terms.open_appeal_limit),
    attachmentLimit: String(terms.appeal_attachment_limit),
    subjectRewardClause: rewardClause(terms.subject_request_reward, m.help.rewardClause, currency),
    assignmentRewardClause: rewardClause(
      terms.assignment_request_reward,
      m.help.rewardClause,
      currency,
    ),
    /* Mukofotlar sozlama bilan o'chiriladi — o'chirilgan holda sahifa
       summani umuman aytmaydi, "0 so'm" ham demaydi. */
    rewardSentence: rewards.length
      ? interpolate(m.help.rewardsOn, {
          list: rewards
            .map((reward) => `${reward.label} — ${formatSom(reward.amount, currency)}`)
            .join(', '),
        })
      : m.help.rewardsOff,
  };
}

/** `FAQPage` — bot uchun barcha savol-javob, bo'limlarga qaramasdan. */
function helpJsonLd(sections: ReturnType<typeof resolvedSections>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: sections.flatMap((section) =>
      section.items.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: [item.a, ...(item.steps ?? [])].join(' '),
        },
      })),
    ),
  };
}

export default async function HelpPage({ params }: PageProps<'/[locale]'>) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : DEFAULT_LOCALE;
  setRequestLocale(locale);

  const m = await getMessages(locale);
  const terms = await getSupportTerms();
  const sections = resolvedSections(locale, factsFrom(terms, m));

  const crumbs = [
    { name: m.materials.breadcrumbHome, path: '/' },
    { name: m.help.breadcrumb, path: '/faq' },
  ];

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd data={helpJsonLd(sections)} />

      <Container className="py-6 sm:py-10 lg:py-12">
        <Breadcrumbs items={crumbs} />

        <div className="mt-6 sm:mt-8">
          <HelpCenter sections={sections} attachmentLimit={terms.appeal_attachment_limit} />
        </div>

        <div className="mt-8 sm:mt-10">
          <h2 className="text-base font-semibold text-foreground">{m.help.contactsTitle}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{m.help.contactsLead}</p>
          <div className="mt-4">
            <SupportContacts m={m} />
          </div>
        </div>
      </Container>
    </>
  );
}
