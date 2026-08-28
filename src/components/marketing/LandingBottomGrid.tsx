'use client';

import { Container } from '@/components/ui/Container';
import { useT } from '@/i18n/useT';
import { landingFaq } from '@/content/faq';

import { FAQ } from './FAQ';
import { PopularSubjects } from './PopularSubjects';

export function LandingBottomGrid() {
  const { m, locale } = useT();

  return (
    <section className="pt-10 pb-[40px] sm:pt-12" aria-label={m.home.bottomAria}>
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-10 xl:gap-14">
          <PopularSubjects />
          <FAQ items={landingFaq(locale)} />
        </div>
      </Container>
    </section>
  );
}
