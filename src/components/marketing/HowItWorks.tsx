import { BadgeCheck, ChevronRight, CreditCard, Upload, Users } from 'lucide-react';
import { Fragment } from 'react';

import { Container } from '@/components/ui/Container';

const steps = [
  {
    title: 'Topshiriq yuklash',
    desc: 'Topshiriqni saytga joylang va talablaringizni yozing',
    icon: Upload,
  },
  { title: 'Freelancer tanlash', desc: 'Mos freelancerni tanlang va kelishib oling', icon: Users },
  {
    title: "To'lov qilish",
    desc: "Xavfsiz to'lov tizimi orqali to'lov amalga oshiring",
    icon: CreditCard,
  },
  {
    title: 'Natijani olish',
    desc: 'Topshiriqni oling va baholang. Siz uchun muhim fikrimiz!',
    icon: BadgeCheck,
  },
] as const;

export function HowItWorks() {
  return (
    <section id="qanday-ishlaydi" className="pb-[40px]" aria-label="Qanday ishlaydi">
      <Container>
        <div className="overflow-hidden rounded-3xl bg-zinc-950 px-6 py-10 shadow-sm sm:px-8 sm:py-12 lg:px-10">
          <h2 className="text-center text-2xl font-bold tracking-tight text-white sm:text-[1.75rem]">
            Qanday ishlaydi?
          </h2>

          <div className="mt-10 flex flex-col gap-8 lg:mt-12 lg:flex-row lg:items-start lg:gap-0">
            {steps.map((step, index) => (
              <Fragment key={step.title}>
                <div className="flex-1 lg:px-2 xl:px-3">
                  <div className="flex items-center gap-3">
                    <div className="grid size-8 shrink-0 place-items-center rounded-full bg-emerald-500 text-sm font-bold text-white">
                      {index + 1}
                    </div>
                    <div className="grid size-12 place-items-center rounded-xl bg-zinc-800/90 ring-1 ring-white/10">
                      <step.icon className="size-5 text-emerald-400" />
                    </div>
                  </div>

                  <h3 className="mt-5 text-base font-bold text-white">{step.title}</h3>
                  <p className="mt-2 max-w-[220px] text-sm leading-relaxed text-zinc-400">
                    {step.desc}
                  </p>
                </div>

                {index < steps.length - 1 ? (
                  <div className="hidden shrink-0 items-center self-start pt-5 lg:flex lg:w-10 xl:w-14">
                    <div className="h-px flex-1 border-t border-dashed border-zinc-600" />
                    <ChevronRight className="size-4 shrink-0 text-zinc-600" />
                  </div>
                ) : null}
              </Fragment>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
