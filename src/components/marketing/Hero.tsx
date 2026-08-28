'use client';

import { motion, useAnimation, useReducedMotion } from 'framer-motion';
import {
  BookOpen,
  CheckCheck,
  ClipboardList,
  FileText,
  GraduationCap,
  Search,
  UserPlus,
} from 'lucide-react';
import { useEffect, type ComponentType } from 'react';

import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { useT } from '@/i18n/useT';
import type { Messages } from '@/i18n/messages/uz';
import { cn } from '@/lib/cn';
import { fadeUpSafe, scaleInSafe, staggerContainer } from '@/lib/motion';

import { HeroUniversitiesBar } from './HeroUniversitiesBar';

/*
 * Eski ilovada bu kartalar markazdagi talaba illyustratsiyasi
 * (`public/landing/hero.png`) atrofida erkin joylashgan edi. Bizda bu
 * rasm yo'q (`design/assets/` bo'sh), shuning uchun kartalar markaziy
 * `HeroCenterBadge` atrofida to'rtburchak simmetriyada joylashtirilgan —
 * bo'sh joy o'rniga o'zi to'liq, ataylab qilingan kompozitsiya.
 */
const floatingCards = [
  {
    title: (m: Messages) => m.home.cardAssignments,
    desc: (m: Messages) => m.home.cardAssignmentsDesc,
    icon: ClipboardList,
    accent: 'bg-emerald-500/20 text-emerald-300',
    className: 'left-0 top-[6%] md:left-[4%]',
  },
  {
    title: (m: Messages) => m.home.cardNotes,
    desc: (m: Messages) => m.home.cardNotesDesc,
    icon: BookOpen,
    accent: 'bg-violet-500/20 text-violet-300',
    className: 'right-0 top-[6%] md:right-[4%]',
  },
  {
    title: (m: Messages) => m.home.cardDrawing,
    desc: (m: Messages) => m.home.cardDrawingDesc,
    icon: FileText,
    accent: 'bg-teal-500/20 text-teal-300',
    className: 'bottom-[6%] left-0 md:left-[4%]',
  },
  {
    title: (m: Messages) => m.home.cardDiploma,
    desc: (m: Messages) => m.home.cardDiplomaDesc,
    icon: GraduationCap,
    accent: 'bg-orange-500/20 text-orange-300',
    className: 'right-0 bottom-[6%] md:right-[4%]',
  },
] as const;

/**
 * Fon rejimida (boshqa tabda) animatsiya to'xtaydi — qaytib kelganda
 * qayta ishga tushirilishi kerak, aks holda kartalar muzlab qoladi.
 */
function useResumeMotionOnVisible(controls: ReturnType<typeof useAnimation>) {
  useEffect(() => {
    void controls.start('animate');

    const resume = () => {
      if (document.visibilityState === 'visible') void controls.start('animate');
    };

    document.addEventListener('visibilitychange', resume);
    window.addEventListener('pageshow', resume);
    return () => {
      document.removeEventListener('visibilitychange', resume);
      window.removeEventListener('pageshow', resume);
    };
  }, [controls]);
}

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-zinc-950 text-white">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_480px_at_70%_20%,rgba(16,185,129,0.18),transparent_60%),radial-gradient(700px_400px_at_20%_80%,rgba(99,102,241,0.12),transparent_55%)]"
        aria-hidden
      />

      <Container className="relative z-10 pt-10 pb-14 sm:pt-14 sm:pb-16 lg:pt-16 lg:pb-20">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20">
          <HeroContent />
          <HeroVisual />
        </div>

        <div className="-mt-[9px] lg:-mt-px">
          <HeroUniversitiesBar variant="hero" />
        </div>
      </Container>
    </section>
  );
}

function HeroContent() {
  const { m } = useT();
  const controls = useAnimation();
  useResumeMotionOnVisible(controls);

  return (
    <motion.div
      className="mx-auto max-w-[600px] text-center lg:mx-0 lg:max-w-[560px] lg:pr-4 lg:text-left"
      variants={staggerContainer}
      initial="initial"
      animate={controls}
    >
      <motion.h1
        className="text-[2rem] leading-[1.1] font-bold tracking-tight sm:text-[2.65rem] lg:text-[3.5rem] lg:leading-[1.06] xl:text-[3.85rem]"
        variants={fadeUpSafe}
      >
        {m.home.heroTitle}{' '}
        <span className="bg-gradient-to-r from-emerald-300 to-emerald-500 bg-clip-text text-transparent">
          {m.home.heroTitleAccent}
        </span>
      </motion.h1>

      <motion.p
        className="mx-auto mt-6 max-w-[480px] text-base leading-relaxed text-zinc-400 sm:text-lg sm:leading-8 lg:mx-0"
        variants={fadeUpSafe}
      >
        {m.home.heroLead}
      </motion.p>

      <motion.div
        className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center lg:justify-start"
        variants={fadeUpSafe}
      >
        <ButtonLink href="/materials" variant="emerald" size="lg" className="rounded-xl">
          <Search className="size-[18px]" />
          {m.home.heroSearch}
        </ButtonLink>
        <ButtonLink
          href="/freelance"
          variant="outline"
          size="lg"
          className="rounded-xl border-white/15 bg-white/5 text-white backdrop-blur hover:bg-white/10"
        >
          <UserPlus className="size-[18px]" />
          {m.home.heroFindFreelancer}
        </ButtonLink>
      </motion.div>
    </motion.div>
  );
}

function HeroVisual() {
  const { m } = useT();
  const controls = useAnimation();
  useResumeMotionOnVisible(controls);

  return (
    <motion.div
      className="relative mx-auto w-full max-w-[640px] lg:max-w-none"
      variants={scaleInSafe}
      initial="initial"
      animate={controls}
    >
      <div className="relative mx-auto aspect-square max-h-[420px] w-full sm:max-h-[500px] lg:max-h-[620px] xl:max-h-[660px]">
        <HeroVisualBackground />
        <HeroCenterBadge />

        {floatingCards.map((card, index) => (
          <FloatingCard
            key={index}
            {...card}
            title={card.title(m)}
            desc={card.desc(m)}
            index={index}
          />
        ))}
      </div>
    </motion.div>
  );
}

/**
 * Markaziy vizual tayanch — illyustratsiya o'rniga.
 * Atrofdagi 4 karta shu nuqtaga nisbatan simmetrik joylashadi.
 */
function HeroCenterBadge() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="absolute top-1/2 left-1/2 z-10 grid -translate-x-1/2 -translate-y-1/2 place-items-center"
      animate={reduceMotion ? undefined : { y: [0, -10, 0] }}
      transition={reduceMotion ? undefined : { duration: 6, repeat: Infinity, ease: 'easeInOut' }}
    >
      <div className="relative grid size-32 place-items-center rounded-[2rem] border border-emerald-400/25 bg-gradient-to-br from-emerald-500/25 via-emerald-500/10 to-transparent shadow-[0_0_60px_rgba(16,185,129,0.25)] backdrop-blur-xl sm:size-40 lg:size-48">
        <GraduationCap
          className="size-12 text-emerald-300 sm:size-16 lg:size-20"
          strokeWidth={1.4}
        />
        <span className="absolute -right-2 -bottom-2 grid size-9 place-items-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/40 sm:size-11">
          <CheckCheck className="size-5" />
        </span>
      </div>
    </motion.div>
  );
}

function HeroVisualBackground() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      <div className="hero-blob hero-blob-1 absolute top-[48%] left-1/2 size-[88%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/20 blur-[80px]" />
      <div className="hero-blob hero-blob-2 absolute top-[28%] left-[58%] size-[58%] -translate-x-1/2 rounded-full bg-emerald-400/10 blur-[70px]" />
      <div className="hero-blob hero-blob-3 absolute right-[8%] bottom-[8%] size-[48%] rounded-full bg-violet-500/15 blur-[72px]" />
      <div className="hero-orbit absolute top-[50%] left-1/2 size-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-400/10" />
      <div className="hero-orbit-reverse absolute top-[50%] left-1/2 size-[62%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-emerald-400/15" />
    </div>
  );
}

function FloatingCard({
  title,
  desc,
  icon: Icon,
  accent,
  className,
  index,
}: {
  title: string;
  desc: string;
  icon: ComponentType<{ className?: string }>;
  accent: string;
  className: string;
  index: number;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={cn(
        'absolute z-20 hidden w-[152px] rounded-2xl border border-white/10 bg-white/[0.06] p-3 shadow-[0_12px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl md:block lg:w-[164px] lg:p-3.5',
        className,
      )}
      initial={{ y: 16, scale: 0.96 }}
      animate={{ y: reduceMotion ? 0 : [0, -5, 0], scale: 1 }}
      transition={{
        scale: { duration: 0.5, delay: 0.25 + index * 0.1 },
        y: reduceMotion
          ? undefined
          : {
              duration: 4.5 + index * 0.4,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: index * 0.35,
            },
      }}
    >
      <div className="flex items-center gap-2.5">
        <div
          className={cn(
            'grid size-9 shrink-0 place-items-center rounded-xl ring-1 ring-white/10',
            accent,
          )}
        >
          <Icon className="size-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[12px] leading-tight font-semibold text-white">{title}</div>
          <div className="mt-0.5 text-[10px] leading-snug text-zinc-400">{desc}</div>
        </div>
      </div>
    </motion.div>
  );
}
