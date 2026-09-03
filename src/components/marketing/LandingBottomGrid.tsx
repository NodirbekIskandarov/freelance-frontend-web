'use client';

import { Check } from 'lucide-react';

import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { landingFaq } from '@/content/faq';
import { useT } from '@/i18n/useT';

import { FAQ } from './FAQ';

/**
 * Sahifaning oxiri: savol-javob va ro'yxatdan o'tish taklifi.
 *
 * «Mashhur yo'nalishlar» bu yerdan OLIB TASHLANDI — u qo'lda yozilgan
 * o'n bitta so'z edi, endi esa «Katalogda hozir» bo'limida haqiqiy
 * toifalar sanoqlari bilan turibdi. Ikkitasini yonma-yon qoldirish
 * bitta ro'yxatning eskisini ham ko'rsatib turish bo'lardi.
 */
export function LandingBottomGrid() {
  const { m, locale } = useT();

  const perks = [m.home.signupPerk1, m.home.signupPerk2, m.home.signupPerk3];

  return (
    <section className="pt-10 pb-14 sm:pt-12" aria-label={m.home.bottomAria}>
      <Container>
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10">
          <FAQ items={landingFaq(locale)} />

          <aside className="rounded-2xl border border-border/70 bg-card p-5 lg:self-start">
            <h2 className="text-lg font-bold tracking-tight text-foreground">
              {m.home.signupTitle}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {m.home.signupLead}
            </p>

            <ButtonLink href="/register" variant="emerald" className="mt-5 w-full rounded-xl">
              {m.home.signupAction}
            </ButtonLink>

            <ul className="mt-4 space-y-2">
              {perks.map((perk) => (
                <li key={perk} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <Check className="mt-0.5 size-3.5 shrink-0 text-emerald-500" />
                  {perk}
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </Container>
    </section>
  );
}
