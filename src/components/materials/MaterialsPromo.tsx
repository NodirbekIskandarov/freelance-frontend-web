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
import { Link } from '@/i18n/Link';
import { useEffect, useState } from 'react';

import type { Messages } from '@/i18n/messages/uz';
import { useT } from '@/i18n/useT';
import { cn } from '@/lib/cn';

type SlideId = 'upload' | 'earn';

const ROTATE_MS = 6000;

interface Feature {
  icon: LucideIcon;
  /* Matn TARJIMADAN: konfiguratsiya modul yuklanganda tuziladi va
     o'sha paytda qaysi til tanlanganini bilib bo'lmaydi. */
  label: (messages: Messages) => string;
  description: (messages: Messages) => string;
}

interface SlideConfig {
  badge: (messages: Messages) => string;
  badgeIcon: LucideIcon;
  titleLead: (messages: Messages) => string;
  titleAccent: (messages: Messages) => string;
  subtitle: (messages: Messages) => string;
  cta: (messages: Messages) => string;
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
    badge: (m) => m.promo.uploadBadge,
    badgeIcon: HelpCircle,
    titleLead: (m) => m.promo.uploadTitleLead,
    titleAccent: (m) => m.promo.uploadTitleAccent,
    subtitle: (m) => m.promo.uploadSubtitle,
    cta: (m) => m.promo.uploadCta,
    ctaIcon: CloudUpload,
    ctaHref: '/requests',
    image: '/materials/promo/upload-character.png',
    imageAlt: '',
    features: [
      {
        icon: Shield,
        label: (m) => m.promo.uploadFeature1,
        description: (m) => m.promo.uploadFeature1Desc,
      },
      {
        icon: Clock,
        label: (m) => m.promo.uploadFeature2,
        description: (m) => m.promo.uploadFeature2Desc,
      },
      {
        icon: CheckCircle2,
        label: (m) => m.promo.uploadFeature3,
        description: (m) => m.promo.uploadFeature3Desc,
      },
    ],
    shell:
      'border-emerald-500/20 bg-gradient-to-br from-emerald-50/90 via-background to-emerald-50/50 dark:from-emerald-950/30 dark:via-zinc-950 dark:to-emerald-950/20',
    accent: 'text-emerald-600 dark:text-emerald-400',
    badgeBg: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
    orbit: 'border-emerald-500/25',
    button: 'bg-emerald-600 text-white hover:bg-emerald-700',
    dotActive: 'bg-emerald-600',
  },
  earn: {
    badge: (m) => m.promo.earnBadge,
    badgeIcon: Star,
    titleLead: (m) => m.promo.earnTitleLead,
    titleAccent: (m) => m.promo.earnTitleAccent,
    subtitle: (m) => m.promo.earnSubtitle,
    cta: (m) => m.promo.earnCta,
    ctaIcon: ArrowUpRight,
    ctaHref: '/freelance/apply',
    image: '/materials/promo/earn-character.png',
    imageAlt: '',
    features: [
      {
        icon: Users,
        label: (m) => m.promo.earnFeature1,
        description: (m) => m.promo.earnFeature1Desc,
      },
      {
        icon: DollarSign,
        label: (m) => m.promo.earnFeature2,
        description: (m) => m.promo.earnFeature2Desc,
      },
      {
        icon: TrendingUp,
        label: (m) => m.promo.earnFeature3,
        description: (m) => m.promo.earnFeature3Desc,
      },
    ],
    shell:
      'border-amber-500/20 bg-gradient-to-br from-amber-50/90 via-background to-orange-50/50 dark:from-amber-950/25 dark:via-zinc-950 dark:to-orange-950/15',
    accent: 'text-amber-600 dark:text-amber-400',
    badgeBg: 'bg-amber-500/10 text-amber-800 dark:text-amber-300',
    orbit: 'border-amber-500/25',
    button: 'bg-amber-500 text-white hover:bg-amber-600',
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
  const { m } = useT();
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
          {config.badge(m)}
        </span>

        <h2 className="mt-4 text-2xl leading-tight font-bold tracking-tight text-foreground sm:text-3xl">
          {config.titleLead(m)} <span className={config.accent}>{config.titleAccent(m)}</span>
        </h2>

        <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
          {config.subtitle(m)}
        </p>

        <Link
          href={config.ctaHref}
          className={cn(
            'mt-5 inline-flex h-11 items-center gap-2 rounded-xl px-5 text-sm font-semibold transition-colors',
            config.button,
          )}
        >
          <CtaIcon className="size-4" />
          {config.cta(m)}
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
          className="drop- relative z-10 h-[88%] w-auto object-contain object-bottom"
        />
      </div>

      <ul className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
        {config.features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <span
              className={cn('grid size-10 shrink-0 place-items-center rounded-xl', config.badgeBg)}
            >
              <feature.icon className={cn('size-5', config.accent)} />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground">{feature.label(m)}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                {feature.description(m)}
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
  const { t } = useT();
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
      className={cn('relative overflow-hidden rounded-2xl border transition-shadow', config.shell)}
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
            aria-label={t((x) => x.materials.slideNumber, { index: position + 1 })}
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
