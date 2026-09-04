'use client';

import { BookOpen, Compass, LifeBuoy, MessageCircleQuestion, Users } from 'lucide-react';

import { Header } from '@/components/layout/Header';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Link } from '@/i18n/Link';
import { useT } from '@/i18n/useT';

/**
 * 404 — topilmagan sahifa.
 *
 * `[locale]` ostida: shu sababli tepasidagi qobiq (til, tema, do'kon)
 * o'z joyida ishlaydi va sahifa foydalanuvchi tanlagan tilda chiqadi.
 * Ilgari bu yerda Next'ning o'z sahifasi turardi — oq fonda inglizcha
 * bitta qator, saytga hech qanday aloqasi yo'q.
 *
 * Sarlavha bilan birga MENYU ham chiziladi: 404 ko'pincha eski havola
 * yoki xato yozilgan manzildan kelinadi va odamga ketadigan joy kerak.
 * Shu sababli pastda tez-tez ochiladigan bo'limlar ro'yxati bor.
 */
const LINKS = [
  { href: '/materials', icon: BookOpen, key: 'linkMaterials' as const },
  { href: '/freelance', icon: Users, key: 'linkFreelancers' as const },
  { href: '/faq', icon: MessageCircleQuestion, key: 'linkFaq' as const },
  { href: '/appeals', icon: LifeBuoy, key: 'linkAppeals' as const },
];

export default function NotFound() {
  const { m } = useT();

  return (
    <>
      <Header />

      <main className="flex flex-1 items-center">
        <Container className="py-14 sm:py-20">
          <div className="mx-auto max-w-xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-brand">
              <Compass className="size-3.5" />
              {m.notFound.badge}
            </span>

            {/*
              Raqamning o'zi rasm o'rnida: 404 sahifaga alohida illyustratsiya
              chizdirish shu bitta ekran uchun ortiqcha yuk bo'lardi.
            */}
            <p
              aria-hidden
              className="mt-6 bg-gradient-to-b from-emerald-500 to-emerald-700 bg-clip-text text-[5.5rem] leading-none font-bold tracking-tight text-transparent sm:text-[7rem] dark:from-emerald-300 dark:to-emerald-600"
            >
              404
            </p>

            <h1 className="mt-4 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {m.notFound.title}
            </h1>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
              {m.notFound.text}
            </p>

            <div className="mt-7 flex flex-col gap-2 sm:flex-row sm:justify-center">
              <ButtonLink href="/" variant="emerald" size="lg">
                {m.notFound.home}
              </ButtonLink>
              <ButtonLink href="/materials" variant="outline" size="lg">
                {m.notFound.materials}
              </ButtonLink>
            </div>

            <div className="mt-10 border-t border-border pt-6">
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                {m.notFound.lookingFor}
              </p>

              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {LINKS.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="flex items-center gap-2.5 rounded-lg border border-border bg-card px-3 py-2.5 text-left text-sm text-foreground transition-colors hover:border-emerald-500/40 hover:bg-muted/40"
                    >
                      <item.icon className="size-4 shrink-0 text-brand" />
                      {m.notFound[item.key]}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </main>
    </>
  );
}
