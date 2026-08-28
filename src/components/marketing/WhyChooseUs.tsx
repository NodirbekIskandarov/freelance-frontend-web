'use client';

import { Bot, Clock, ShieldCheck, Sparkles, Users } from 'lucide-react';

import { Container } from '@/components/ui/Container';
import type { Messages } from '@/i18n/messages/uz';
import { useT } from '@/i18n/useT';

const reasons = [
  {
    title: (m: Messages) => m.home.why1,
    desc: (m: Messages) => m.home.why1Desc,
    icon: ShieldCheck,
  },
  { title: (m: Messages) => m.home.why2, desc: (m: Messages) => m.home.why2Desc, icon: Sparkles },
  { title: (m: Messages) => m.home.why3, desc: (m: Messages) => m.home.why3Desc, icon: Bot },
  { title: (m: Messages) => m.home.why4, desc: (m: Messages) => m.home.why4Desc, icon: Users },
  { title: (m: Messages) => m.home.why5, desc: (m: Messages) => m.home.why5Desc, icon: Clock },
] as const;

export function WhyChooseUs() {
  const { m } = useT();

  return (
    <section className="pb-[40px]">
      <Container>
        <h2 className="text-center text-2xl font-bold tracking-tight text-foreground sm:text-[1.75rem]">
          {m.home.whyTitle}
        </h2>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5 lg:gap-3 xl:gap-4">
          {reasons.map((reason, index) => (
            <div
              key={index}
              className="rounded-2xl border border-border/60 bg-background p-5 shadow-[0_2px_16px_rgba(0,0,0,0.04)] dark:border-zinc-800 dark:bg-zinc-900/70 dark:shadow-[0_8px_20px_rgba(0,0,0,0.35)]"
            >
              <div className="grid size-11 place-items-center rounded-xl border border-emerald-500/25 bg-emerald-500/10 text-emerald-500 dark:border-emerald-500/35 dark:bg-emerald-500/15 dark:text-emerald-300">
                <reason.icon className="size-5" />
              </div>
              <h3 className="mt-4 text-[15px] leading-snug font-bold text-foreground">
                {reason.title(m)}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{reason.desc(m)}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
