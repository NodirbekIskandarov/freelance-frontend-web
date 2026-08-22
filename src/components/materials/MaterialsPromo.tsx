'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  ArrowUpRight,
  CheckCircle2,
  Clock,
  CloudUpload,
  DollarSign,
  HelpCircle,
  Shield,
  Star,
  TrendingUp,
  Users,
  type LucideIcon,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { cn } from '@/lib/cn';

type SlideId = 'upload' | 'earn';

const ROTATE_MS = 6000;

interface Feature {
  icon: LucideIcon;
  label: string;
  description: string;
}

interface SlideConfig {
  badge: string;
  badgeIcon: LucideIcon;
  titleLead: string;
  titleAccent: string;
  subtitle: string;
  cta: string;
  ctaIcon: LucideIcon;
  ctaHref: string;
  image: string;
  imageAlt: string;
  features: Feature[];
  shell: string;
  accent: string;
  badgeBg: string;
  orbit: string;
  button: string;
  dotActive: string;
}

const SLIDES: Record<SlideId, SlideConfig> = {
  upload: {
    badge: 'Kerakli topshiriqni topa olmadingizmi?',
    badgeIcon: HelpCircle,
    titleLead: 'Aniq izlayotgan topshiriqni',
    titleAccent: 'topa olmadingizmi?',
    subtitle: 'Uni bizga yuklang va biz unga yechim beramiz.',
    cta: 'Topshiriqni yuklash',
    ctaIcon: CloudUpload,
    ctaHref: '/requests',
    image: '/materials/promo/upload-character.png',
    imageAlt: '',
    features: [
      {
        icon: Shield,
        label: 'Xavfsiz va ishonchli',
        description: "Ma'lumotlaringiz maxfiy va himoyalangan.",
      },
      {
        icon: Clock,
        label: 'Tezkor yechim',
        description: 'Mutaxassislarimiz tez orada yordam beradi.',
      },
      {
        icon: CheckCircle2,
        label: 'Sifatli natija',
        description: "Topshirig'ingizga mukammal yechim topamiz.",
      },
    ],
    shell:
      'border-emerald-500/20 bg-gradient-to-br from-emerald-50/90 via-background to-emerald-50/50 dark:from-emerald-950/30 dark:via-zinc-950 dark:to-emerald-950/20',
    accent: 'text-emerald-600 dark:text-emerald-400',
    badgeBg: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
    orbit: 'border-emerald-500/25',
    button: 'bg-emerald-600 text-white shadow-emerald-600/25 hover:bg-emerald-700',
    dotActive: 'bg-emerald-600',
  },
  earn: {
    badge: 'Online daromad qilishni xohlaysizmi?',
    badgeIcon: Star,
    titleLead: 'Javobsiz topshiriqlarni bajaring va',
    titleAccent: 'daromad qiling!',
    subtitle: "Bilimingizni baham ko'ring va uni daromad manbaiga aylantiring.",
    cta: 'Daromad qilishni boshlash',
    ctaIcon: ArrowUpRight,
    ctaHref: '/freelance/apply',
    image: '/materials/promo/earn-character.png',
    imageAlt: '',
    features: [
      {
        icon: Users,
        label: "Ko'proq bajaring",
        description: 'Javobsiz topshiriqlarni toping va yeching.',
      },
      {
        icon: DollarSign,
        label: 'Daromad qiling',
        description: 'Yechimlaringiz uchun adolatli daromad oling.',
      },
      {
        icon: TrendingUp,
        label: "O'sishda davom eting",
        description: 'Reyting va tajribangizni oshirib boring.',
      },
    ],
    shell:
      'border-amber-500/20 bg-gradient-to-br from-amber-50/90 via-background to-orange-50/50 dark:from-amber-950/25 dark:via-zinc-950 dark:to-orange-950/15',
    accent: 'text-amber-600 dark:text-amber-400',
    badgeBg: 'bg-amber-500/10 text-amber-800 dark:text-amber-300',
    orbit: 'border-amber-500/25',
    button: 'bg-amber-500 text-white shadow-amber-500/25 hover:bg-amber-600',
    dotActive: 'bg-amber-500',
  },
};

const ORDER: SlideId[] = ['upload', 'earn'];

/** Aylanuvchi punktir halqalar — illyustratsiya ortidagi bezak. */
function OrbitRings({ orbit, still }: { orbit: string; still: boolean }) {
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-0 grid place-items-center"
      animate={still ? undefined : { rotate: 360 }}
      transition={still ? undefined : { duration: 32, repeat: Infinity, ease: 'linear' }}
    >
      <div className={cn('size-[92%] rounded-full border border-dashed opacity-50', orbit)} />
      <div
        className={cn('absolute size-[72%] rounded-full border border-dashed opacity-30', orbit)}
      />
    </motion.div>
  );
}

function Slide({ id, still }: { id: SlideId; still: boolean }) {
  const config = SLIDES[id];
  const BadgeIcon = config.badgeIcon;
  const CtaIcon = config.ctaIcon;

  return (
    <div className="grid items-center gap-6 p-5 sm:p-7 lg:grid-cols-[1.1fr_0.9fr_1fr] lg:gap-8 lg:p-9">
      <div className="min-w-0">
        <span
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-medium sm:text-xs',
            config.badgeBg,
          )}
        >
          <BadgeIcon className="size-3.5" />
          {config.badge}
        </span>

        <h2 className="mt-4 text-2xl leading-tight font-bold tracking-tight text-foreground sm:text-3xl">
          {config.titleLead} <span className={config.accent}>{config.titleAccent}</span>
        </h2>

        <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
          {config.subtitle}
        </p>

        <Link
          href={config.ctaHref}
          className={cn(
            'mt-5 inline-flex h-11 items-center gap-2 rounded-xl px-5 text-sm font-semibold shadow-lg transition-colors',
            config.button,
          )}
        >
          <CtaIcon className="size-4" />
          {config.cta}
        </Link>
      </div>

      {/* Illyustratsiya o'rta ustunda — tor ekranda birinchi bo'lib yashiriladi. */}
      <div className="relative mx-auto hidden h-[220px] w-full max-w-[280px] items-end justify-center sm:h-[240px] lg:flex">
        <OrbitRings orbit={config.orbit} still={still} />
        <Image
          src={config.image}
          alt={config.imageAlt}
          width={320}
          height={320}
          priority={id === 'upload'}
          className="relative z-10 h-[88%] w-auto object-contain object-bottom drop-shadow-xl"
        />
      </div>

      <ul className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
        {config.features.map((feature) => (
          <li key={feature.label} className="flex items-start gap-3">
            <span
              className={cn('grid size-10 shrink-0 place-items-center rounded-xl', config.badgeBg)}
            >
              <feature.icon className={cn('size-5', config.accent)} />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground">{feature.label}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Materiallar sahifasining yuqori banneri.
 *
 * Ikki slayd o'zi almashadi, lekin foydalanuvchi nuqtani bosgach
 * avtomatik aylanish TO'XTAYDI: u tanlagan slayd ko'z oldidan
 * o'z-o'zidan ketib qolmasin.
 */
export function MaterialsPromo() {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || reduceMotion) return;

    const timer = setInterval(() => setIndex((value) => (value + 1) % ORDER.length), ROTATE_MS);
    return () => clearInterval(timer);
  }, [paused, reduceMotion]);

  const current = ORDER[index]!;
  const config = SLIDES[current];
  const still = Boolean(reduceMotion);

  return (
    <section
      className={cn(
        'relative overflow-hidden rounded-2xl border shadow-sm transition-shadow',
        config.shell,
      )}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={still ? false : { opacity: 0, y: 12 }}
          animate={still ? undefined : { opacity: 1, y: 0 }}
          exit={still ? undefined : { opacity: 0, y: -12 }}
          transition={{ duration: 0.35 }}
        >
          <Slide id={current} still={still} />
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center justify-center gap-1.5 pb-4">
        {ORDER.map((id, position) => (
          <button
            key={id}
            type="button"
            aria-label={`${position + 1}-slayd`}
            aria-current={position === index}
            onClick={() => {
              setIndex(position);
              setPaused(true);
            }}
            className={cn(
              'h-1.5 rounded-full transition-all',
              position === index ? cn('w-6', config.dotActive) : 'w-1.5 bg-foreground/20',
            )}
          />
        ))}
      </div>
    </section>
  );
}
