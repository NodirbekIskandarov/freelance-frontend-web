'use client';

import { BookOpen, ClipboardList, FileText, GraduationCap, PenTool } from 'lucide-react';

import { Container } from '@/components/ui/Container';
import type { Messages } from '@/i18n/messages/uz';
import { useT } from '@/i18n/useT';
import { formatCount } from '@/lib/format';

/**
 * Xizmatlar bo'limi — VERSTKA.
 *
 * Konspekt, chizmachilik, spravka va diplom ishlari hali katalogda
 * alohida modellashtirilmagan: ular freelance orqali bajariladi va
 * ularning soni ham, narxi ham API'da yo'q. Shuning uchun bu yerdagi
 * qiymatlar shu faylda turadi va ular BIR JOYDA — narx siyosati
 * o'zgarganda sayt bo'ylab qidirish kerak bo'lmasin.
 *
 * Yagona istisno — birinchi kartaning soni: tayyor yechimlar soni
 * allaqachon shu sahifada («Katalogda hozir») jonli ko'rsatiladi va uni
 * bu yerda qo'lda yozib qo'yish bitta sahifada ikki xil raqam
 * ko'rsatish bo'lardi.
 */
const services = [
  {
    title: (m: Messages) => m.home.service1,
    desc: (m: Messages) => m.home.service1Desc,
    price: (m: Messages) => m.home.service1Price,
    icon: ClipboardList,
    tone: 'bg-emerald-500/12 text-emerald-400',
    price_tone: 'text-emerald-500 dark:text-emerald-400',
    count: null,
  },
  {
    title: (m: Messages) => m.home.service2,
    desc: (m: Messages) => m.home.service2Desc,
    price: (m: Messages) => m.home.service2Price,
    icon: BookOpen,
    tone: 'bg-violet-500/12 text-violet-400',
    price_tone: 'text-violet-500 dark:text-violet-400',
    count: '5K+',
  },
  {
    title: (m: Messages) => m.home.service3,
    desc: (m: Messages) => m.home.service3Desc,
    price: (m: Messages) => m.home.service3Price,
    icon: PenTool,
    tone: 'bg-teal-500/12 text-teal-400',
    price_tone: 'text-teal-500 dark:text-teal-400',
    count: '3K+',
  },
  {
    title: (m: Messages) => m.home.service4,
    desc: (m: Messages) => m.home.service4Desc,
    price: (m: Messages) => m.home.service4Price,
    icon: FileText,
    tone: 'bg-rose-500/12 text-rose-400',
    price_tone: 'text-rose-500 dark:text-rose-400',
    count: '2K+',
  },
  {
    title: (m: Messages) => m.home.service5,
    desc: (m: Messages) => m.home.service5Desc,
    price: (m: Messages) => m.home.service5Price,
    icon: GraduationCap,
    tone: 'bg-amber-500/12 text-amber-400',
    price_tone: 'text-amber-500 dark:text-amber-400',
    count: '1K+',
  },
] as const;

export function ServicesOverview({ solutionCount }: { solutionCount: number }) {
  const { t, m } = useT();

  return (
    <section className="border-y border-border/60 bg-muted/20 py-10 sm:py-14" id="xizmatlar">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {m.home.servicesTitle}
          </h2>
          <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {m.home.servicesLead}
          </p>
        </div>

        <div className="mt-8 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {services.map((service) => (
            <article
              key={service.title(m)}
              className="flex flex-col rounded-2xl border border-border/70 bg-card p-4"
            >
              <div className="flex items-start justify-between gap-2">
                <span
                  className={`grid size-9 shrink-0 place-items-center rounded-xl ${service.tone}`}
                >
                  <service.icon className="size-4" />
                </span>
                <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground tabular-nums">
                  {service.count ??
                    t((x) => x.home.serviceReadyCount, { count: formatCount(solutionCount) })}
                </span>
              </div>

              <h3 className="mt-3.5 text-[15px] font-bold text-foreground">{service.title(m)}</h3>
              <p className="mt-1.5 flex-1 text-xs leading-relaxed text-muted-foreground">
                {service.desc(m)}
              </p>

              <div className="mt-4 flex items-center justify-between gap-2 border-t border-border/50 pt-3">
                <span className="text-[11px] text-muted-foreground">{m.home.servicePrice}</span>
                <span className={`text-[13px] font-bold ${service.price_tone}`}>
                  {service.price(m)}
                </span>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
