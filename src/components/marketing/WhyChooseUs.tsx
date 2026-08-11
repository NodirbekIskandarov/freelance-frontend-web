import { Bot, Clock, ShieldCheck, Sparkles, Users } from 'lucide-react';

import { Container } from '@/components/ui/Container';

const reasons = [
  { title: "Xavfsiz to'lov", desc: "To'lovlar 100% himoyalangan va xavfsiz.", icon: ShieldCheck },
  {
    title: 'Tezkor bajarish',
    desc: 'Topshiriqlar belgilangan muddatda bajariladi.',
    icon: Sparkles,
  },
  {
    title: 'AI tekshiruvi',
    desc: 'Barcha ishlar AI va ekspertlar tomonidan tekshiriladi.',
    icon: Bot,
  },
  {
    title: 'Ishonchli freelancerlar',
    desc: 'Topshirilgan va tajribali freelancerlar.',
    icon: Users,
  },
  {
    title: "24/7 qo'llab-quvvatlash",
    desc: 'Har doim sizga yordam berishga tayyormiz.',
    icon: Clock,
  },
] as const;

export function WhyChooseUs() {
  return (
    <section className="pb-[40px]">
      <Container>
        <h2 className="text-center text-2xl font-bold tracking-tight text-foreground sm:text-[1.75rem]">
          Nega bizni tanlashadi?
        </h2>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5 lg:gap-3 xl:gap-4">
          {reasons.map((reason) => (
            <div
              key={reason.title}
              className="rounded-2xl border border-border/60 bg-background p-5 shadow-[0_2px_16px_rgba(0,0,0,0.04)] dark:border-zinc-800 dark:bg-zinc-900/70 dark:shadow-[0_8px_20px_rgba(0,0,0,0.35)]"
            >
              <div className="grid size-11 place-items-center rounded-xl border border-emerald-500/25 bg-emerald-500/10 text-emerald-500 dark:border-emerald-500/35 dark:bg-emerald-500/15 dark:text-emerald-300">
                <reason.icon className="size-5" />
              </div>
              <h3 className="mt-4 text-[15px] leading-snug font-bold text-foreground">
                {reason.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{reason.desc}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
