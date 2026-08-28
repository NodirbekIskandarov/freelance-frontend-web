import type { Metadata } from 'next';

import { Hero } from '@/components/marketing/Hero';
import { HowItWorks } from '@/components/marketing/HowItWorks';
import { LandingBottomGrid } from '@/components/marketing/LandingBottomGrid';
import { LandingHighlights } from '@/components/marketing/LandingHighlights';
import { ServicesOverview } from '@/components/marketing/ServicesOverview';
import { Testimonials } from '@/components/marketing/Testimonials';
import { WhyChooseUs } from '@/components/marketing/WhyChooseUs';
import { siteConfig } from '@/config/site';
import { faqJsonLd, landingFaq } from '@/content/faq';
import { DEFAULT_LOCALE, isLocale, LOCALES, LOCALE_TAGS } from '@/i18n/config';
import { setRequestLocale } from '@/i18n/requestLocale';
import { absoluteUrl, JsonLd } from '@/lib/seo';
import { getLandingHighlights } from '@/server/landing/highlights';

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

export default async function LandingPage({ params }: PageProps<'/[locale]'>) {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : DEFAULT_LOCALE;
  setRequestLocale(locale);

  const highlights = await getLandingHighlights();

  return (
    <>
      <JsonLd data={faqJsonLd(landingFaq(locale))} />
      <Hero />
      <LandingHighlights highlights={highlights} />
      <ServicesOverview />
      <HowItWorks />
      <WhyChooseUs />
      <Testimonials />
      <LandingBottomGrid />
    </>
  );
}
