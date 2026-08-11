import type { Metadata } from 'next';

import { Hero } from '@/components/marketing/Hero';
import { HowItWorks } from '@/components/marketing/HowItWorks';
import { LandingBottomGrid } from '@/components/marketing/LandingBottomGrid';
import { ServicesOverview } from '@/components/marketing/ServicesOverview';
import { Testimonials } from '@/components/marketing/Testimonials';
import { WhyChooseUs } from '@/components/marketing/WhyChooseUs';
import { siteConfig } from '@/config/site';
import { faqJsonLd, LANDING_FAQ } from '@/content/faq';
import { JsonLd } from '@/lib/seo';

/**
 * Bosh sahifa uchun `title` ataylab shablon (`%s | Yopamiz.uz`) orqali
 * emas — `absolute` bilan beriladi. Aks holda "Yopamiz.uz — ... | Yopamiz.uz"
 * kabi ismning o'zi takrorlanib chiqadi.
 */
export const metadata: Metadata = {
  title: { absolute: siteConfig.title },
  description: siteConfig.description,
  alternates: { canonical: '/' },
};

export default function LandingPage() {
  return (
    <>
      <JsonLd data={faqJsonLd(LANDING_FAQ)} />
      <Hero />
      <ServicesOverview />
      <HowItWorks />
      <WhyChooseUs />
      <Testimonials />
      <LandingBottomGrid />
    </>
  );
}
