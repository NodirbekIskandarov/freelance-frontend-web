import {
  ArrowRight,
  BookOpen,
  ClipboardList,
  FileText,
  GraduationCap,
  PenTool,
} from 'lucide-react';
import { Link } from '@/i18n/Link';
import type { ComponentType } from 'react';

import { Container } from '@/components/ui/Container';
import { cn } from '@/lib/cn';

const services = [
  {
    title: 'Tayyor topshiriqlar',
    desc: "Fanlar bo'yicha tayyor topshiriqlar bazasi",
    icon: ClipboardList,
    count: '50K+',
    href: '/materials',
    theme: {
      card: 'from-emerald-50 via-white to-teal-50/80 border-emerald-200/60 hover:border-emerald-300/80 dark:from-emerald-950/35 dark:via-zinc-900 dark:to-teal-950/30 dark:border-emerald-800/40',
      icon: 'from-emerald-500 to-teal-500 shadow-emerald-500/30',
      badge: 'bg-emerald-500/15 text-emerald-700 ring-emerald-500/20 dark:text-emerald-300',
      link: 'text-emerald-600 hover:text-emerald-700 dark:text-emerald-400',
      accent: 'bg-emerald-500',
    },
  },
  {
    title: 'Konspekt',
    desc: 'Konspekt yozdirish xizmati',
    icon: BookOpen,
    count: '5K+',
    href: '/#xizmatlar',
    theme: {
      card: 'from-violet-50 via-white to-purple-50/80 border-violet-200/60 hover:border-violet-300/80 dark:from-violet-950/35 dark:via-zinc-900 dark:to-purple-950/30 dark:border-violet-800/40',
      icon: 'from-violet-500 to-purple-500 shadow-violet-500/30',
      badge: 'bg-violet-500/15 text-violet-700 ring-violet-500/20 dark:text-violet-300',
      link: 'text-violet-600 hover:text-violet-700 dark:text-violet-400',
      accent: 'bg-violet-500',
    },
  },
  {
    title: 'Chizmachilik',
    desc: 'Chizma ishlari (AutoCAD va h.k.)',
    icon: PenTool,
    count: '3K+',
    href: '/#xizmatlar',
    theme: {
      card: 'from-orange-50 via-white to-amber-50/80 border-orange-200/60 hover:border-orange-300/80 dark:from-orange-950/35 dark:via-zinc-900 dark:to-amber-950/30 dark:border-orange-800/40',
      icon: 'from-orange-500 to-amber-500 shadow-orange-500/30',
      badge: 'bg-orange-500/15 text-orange-700 ring-orange-500/20 dark:text-orange-300',
      link: 'text-orange-600 hover:text-orange-700 dark:text-orange-400',
      accent: 'bg-orange-500',
    },
  },
  {
    title: 'Spravka',
    desc: 'Talaba va shifokorlar uchun spravkalar',
    icon: FileText,
    count: '2K+',
    href: '/#xizmatlar',
    theme: {
      card: 'from-pink-50 via-white to-rose-50/80 border-pink-200/60 hover:border-pink-300/80 dark:from-pink-950/35 dark:via-zinc-900 dark:to-rose-950/30 dark:border-pink-800/40',
      icon: 'from-pink-500 to-rose-500 shadow-pink-500/30',
      badge: 'bg-pink-500/15 text-pink-700 ring-pink-500/20 dark:text-pink-300',
      link: 'text-pink-600 hover:text-pink-700 dark:text-pink-400',
      accent: 'bg-pink-500',
    },
  },
  {
    title: 'Diplom ishlari',
    desc: 'Diplom va malakaviy ishlar bajarish',
    icon: GraduationCap,
    count: '1K+',
    href: '/#xizmatlar',
    theme: {
      card: 'from-blue-50 via-white to-sky-50/80 border-blue-200/60 hover:border-blue-300/80 dark:from-blue-950/35 dark:via-zinc-900 dark:to-sky-950/30 dark:border-blue-800/40',
      icon: 'from-blue-500 to-sky-500 shadow-blue-500/30',
      badge: 'bg-blue-500/15 text-blue-700 ring-blue-500/20 dark:text-blue-300',
      link: 'text-blue-600 hover:text-blue-700 dark:text-blue-400',
      accent: 'bg-blue-500',
    },
  },
] satisfies {
  title: string;
  desc: string;
  icon: ComponentType<{ className?: string }>;
  count: string;
  href: string;
  theme: Record<'card' | 'icon' | 'badge' | 'link' | 'accent', string>;
}[];

export function ServicesOverview() {
  return (
    <section id="xizmatlar" className="pt-14 pb-16 sm:pt-16 sm:pb-20">
      <Container>
        <h2 className="text-center text-2xl font-bold tracking-tight text-foreground sm:text-[1.75rem]">
          Xizmatlarimiz
        </h2>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5 lg:gap-3 xl:gap-4">
          {services.map((service) => (
            <div
              key={service.title}
              className={cn(
                'group relative flex flex-col overflow-hidden rounded-2xl border bg-gradient-to-br p-4 shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.1)] sm:p-5 dark:shadow-[0_8px_24px_rgba(0,0,0,0.45)]',
                service.theme.card,
              )}
            >
              <div
                className={cn('absolute inset-x-0 top-0 h-1 opacity-80', service.theme.accent)}
                aria-hidden
              />

              <div className="relative flex items-start justify-between gap-2">
                <div
                  className={cn(
                    'grid size-11 place-items-center rounded-xl bg-gradient-to-br text-white shadow-lg transition-transform duration-300 group-hover:scale-105',
                    service.theme.icon,
                  )}
                >
                  <service.icon className="size-5" />
                </div>
                <span
                  className={cn(
                    'rounded-full px-2.5 py-1 text-xs font-bold ring-1 ring-inset',
                    service.theme.badge,
                  )}
                >
                  {service.count}
                </span>
              </div>

              <h3 className="relative mt-4 text-[15px] leading-snug font-bold text-foreground">
                {service.title}
              </h3>
              <p className="relative mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                {service.desc}
              </p>

              <Link
                href={service.href}
                className={cn(
                  'relative mt-4 inline-flex items-center gap-1 text-sm font-semibold transition-all group-hover:gap-2',
                  service.theme.link,
                )}
              >
                Batafsil
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
