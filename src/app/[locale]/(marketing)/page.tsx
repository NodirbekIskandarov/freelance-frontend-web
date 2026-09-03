import type { Metadata } from 'next';

import { CatalogueNow } from '@/components/marketing/CatalogueNow';
import { Guarantee } from '@/components/marketing/Guarantee';
import { Hero } from '@/components/marketing/Hero';
import { HowItWorks } from '@/components/marketing/HowItWorks';
import { LandingBottomGrid } from '@/components/marketing/LandingBottomGrid';
import { SellerCta } from '@/components/marketing/SellerCta';
import { ServicesOverview } from '@/components/marketing/ServicesOverview';
import { Testimonials } from '@/components/marketing/Testimonials';
import { siteConfig } from '@/config/site';
import { faqJsonLd, landingFaq } from '@/content/faq';
import { DEFAULT_LOCALE, isLocale, LOCALES, LOCALE_TAGS } from '@/i18n/config';
import { interpolate } from '@/i18n/interpolate';
import { getMessages, type Messages } from '@/i18n/messages';
import { setRequestLocale } from '@/i18n/requestLocale';
import { absoluteUrl, JsonLd } from '@/lib/seo';
import { getLandingHighlights } from '@/server/landing/highlights';
import { getSupportTermsSafe } from '@/server/support';

/**
 * Bosh sahifa uchun `title` ataylab shablon (`%s | Yopamiz.uz`) orqali
 * emas — `absolute` bilan beriladi. Aks holda "Yopamiz.uz — ... | Yopamiz.uz"
 * kabi ismning o'zi takrorlanib chiqadi.
 */
export async function generateMetadata({ params }: PageProps<'/[locale]'>): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : DEFAULT_LOCALE;

  return {
    title: { absolute: siteConfig.title },
    description: siteConfig.description,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        ...Object.fromEntries(LOCALES.map((item) => [LOCALE_TAGS[item], absoluteUrl(`/${item}`)])),
        'x-default': absoluteUrl(`/${DEFAULT_LOCALE}`),
      },
    },
  };
}

/**
 * Muddatni odam o'qiydigan holga keltiradi — yordam sahifasi bilan bir
 * xil qoida: bir kundan uzun bo'lsa kunda aytiladi, chunki «168 soat»ni
 * o'quvchi o'zi bo'lishga majbur bo'lardi.
 */
function hoursLabel(hours: number, m: Messages): string {
  return hours >= 48
    ? interpolate(m.help.days, { count: Math.round(hours / 24) })
    : interpolate(m.help.hours, { count: hours });
}

export default async function LandingPage({ params }: PageProps<'/[locale]'>) {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : DEFAULT_LOCALE;
  setRequestLocale(locale);

  const m = await getMessages(locale);
  /* Ikkalasi parallel: biri ikkinchisiga bog'liq emas va bosh sahifa
     eng ko'p ochiladigan sahifa. */
  const [highlights, terms] = await Promise.all([getLandingHighlights(), getSupportTermsSafe()]);

  const windowLabel = terms
    ? hoursLabel(terms.dispute_window_hours, m)
    : m.home.guaranteeGeneric.toLowerCase();
  const authorLabel = terms ? hoursLabel(terms.dispute_author_response_hours, m) : '';

  return (
    <>
      <JsonLd data={faqJsonLd(landingFaq(locale))} />

      <Hero
        highlights={highlights}
        guaranteeLabel={
          terms
            ? interpolate(m.home.promiseRefund, { window: windowLabel })
            : m.home.guaranteeGeneric
        }
      />
      <CatalogueNow highlights={highlights} />
      <ServicesOverview />
      <HowItWorks />
      <Guarantee windowLabel={windowLabel} authorLabel={authorLabel} />

      {/* Mukofotlar sozlamadan keladi — shartlar kelmasa bo'lim
          umuman chizilmaydi, chunki uning yarmi raqamlardan iborat. */}
      {terms && <SellerCta terms={terms} awaitingVariants={highlights.stats.awaiting_variants} />}

      <Testimonials highlights={highlights} />
      <LandingBottomGrid />
    </>
  );
}
