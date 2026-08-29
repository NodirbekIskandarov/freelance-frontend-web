'use client';

import {
  Building2,
  ChevronRight,
  CircleCheck,
  ClipboardList,
  Clock,
  Gift,
  HelpCircle,
  ShieldCheck,
  Upload,
  type LucideIcon,
} from 'lucide-react';
import Image from 'next/image';
import { Link } from '@/i18n/Link';
import type { ReactNode } from 'react';

import { interpolate } from '@/i18n/interpolate';
import type { Messages } from '@/i18n/messages/uz';
import { useT } from '@/i18n/useT';
import { cn } from '@/lib/cn';

interface Feature {
  icon: LucideIcon;
  iconClass: string;
  /* Matn TARJIMADAN: ro'yxatlar modul yuklanganda tuziladi. */
  title: (messages: Messages) => string;
  subtitle: (messages: Messages) => string;
}

const UNIVERSITY_FEATURES: Feature[] = [
  {
    icon: Building2,
    iconClass: 'text-emerald-400',
    title: (m) => m.cta.uniFeature1,
    subtitle: (m) => m.cta.uniFeature1Sub,
  },
  {
    icon: ClipboardList,
    iconClass: 'text-violet-400',
    title: (m) => m.cta.uniFeature2,
    subtitle: (m) => m.cta.uniFeature2Sub,
  },
  {
    icon: Gift,
    iconClass: 'text-amber-400',
    title: (m) => m.cta.uniFeature3,
    subtitle: (m) => m.cta.uniFeature3Sub,
  },
];

const SUBJECT_FEATURES: Feature[] = [
  {
    icon: ShieldCheck,
    iconClass: 'text-emerald-400',
    title: (m) => m.cta.subjFeature1,
    subtitle: (m) => m.cta.subjFeature1Sub,
  },
  {
    icon: Clock,
    iconClass: 'text-violet-400',
    title: (m) => m.cta.subjFeature2,
    subtitle: (m) => m.cta.subjFeature2Sub,
  },
  {
    icon: CircleCheck,
    iconClass: 'text-sky-400',
    title: (m) => m.cta.subjFeature3,
    subtitle: (m) => m.cta.subjFeature3Sub,
  },
];

/** Illyustratsiya atrofida suzuvchi nuqtalar — faqat bezak. */
const PARTICLES = [
  { top: '18%', left: '12%', size: 6, delay: '0s', duration: '3.2s' },
  { top: '35%', left: '8%', size: 4, delay: '-1s', duration: '2.8s' },
  { top: '55%', left: '18%', size: 5, delay: '-2s', duration: '3.5s' },
  { top: '25%', left: '28%', size: 3, delay: '-0.5s', duration: '2.5s' },
];

/**
 * Katalogdagi "topa olmadingizmi?" banneri.
 *
 * Ikki rejimi bor: institut sahifasida FAN so'raladi, fan sahifasida
 * TOPSHIRIQ. Ikkalasi bir xil ko'rinishda — faqat matn va tugma farq
 * qiladi, shuning uchun bitta komponent.
 */
export function CatalogueCtaBanner({
  mode,
  universityShortName,
  universityHref,
  onAction,
}: {
  mode: 'subject-request' | 'assignment-request';
  universityShortName: string;
  /** Fan rejimida "Fan ro'yxatda yo'q?" havolasi uchun. */
  universityHref?: string;
  onAction: () => void;
}) {
  const { m } = useT();
  const isUniversity = mode === 'subject-request';

  const features = isUniversity ? UNIVERSITY_FEATURES : SUBJECT_FEATURES;
  const PrimaryIcon = isUniversity ? ClipboardList : Upload;

  const subtitle: ReactNode = isUniversity ? (
    interpolate(m.cta.subtitleSubject, { university: universityShortName })
  ) : (
    <>
      {m.cta.subtitleAssignment}
      {universityHref && (
        <>
          {' '}
          <Link href={universityHref} className="font-medium text-emerald-400 hover:underline">
            {m.cta.subjectMissingLink}
          </Link>{' '}
          {m.cta.subjectMissingTail}
        </>
      )}
    </>
  );

  return (
    <div className="relative isolate overflow-hidden rounded-2xl border border-emerald-500/25 bg-[#0a0f0d]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-emerald-950/40 via-transparent to-emerald-950/20"
      />
      <div
        aria-hidden
        className="cta-blob cta-blob-a top-[-30%] left-[-5%] size-[45%] bg-emerald-500/30"
      />
      <div
        aria-hidden
        className="cta-blob cta-blob-b right-[-10%] bottom-[-40%] size-[40%] bg-emerald-600/20"
      />
      <div aria-hidden className="cta-shimmer" />

      <div className="relative z-10 flex flex-col gap-4 p-4 sm:p-5 lg:flex-row lg:items-center lg:gap-4 xl:gap-5">
        {/* Illyustratsiya tor ekranda ham qoladi, lekin kichrayadi. */}
        <div className="relative mx-auto flex w-full max-w-[150px] shrink-0 items-end justify-center sm:max-w-[190px] lg:mx-0 lg:w-[180px] xl:w-[210px]">
          {PARTICLES.map((particle) => (
            <span
              key={particle.left + particle.top}
              aria-hidden
              className="cta-float pointer-events-none absolute rounded-full bg-emerald-400/60 shadow-[0_0_12px_rgba(16,185,129,0.5)]"
              style={{
                top: particle.top,
                left: particle.left,
                width: particle.size,
                height: particle.size,
                animationDelay: particle.delay,
                animationDuration: particle.duration,
              }}
            />
          ))}
          <div aria-hidden className="cta-glow" />
          <div className="cta-float relative z-10 w-full">
            <Image
              src="/materials/cta-student.png"
              alt=""
              width={420}
              height={420}
              priority
              className="drop- h-auto w-full object-contain object-bottom"
            />
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-center py-1 lg:py-2 lg:pl-1">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-400">
            <HelpCircle className="size-3.5" />
            {isUniversity ? m.cta.badgeSubject : m.cta.badgeAssignment}
          </span>

          <h2 className="mt-3 text-base leading-snug font-bold text-white sm:text-lg lg:text-xl">
            {m.cta.headingLead}{' '}
            <span className="text-emerald-400">
              {isUniversity ? m.cta.headingSubject : m.cta.headingAssignment}
            </span>{' '}
            {m.cta.headingTail}
          </h2>

          <p className="mt-2 max-w-xl text-xs leading-relaxed text-zinc-400 sm:text-sm">
            {subtitle}
          </p>

          <ul className="mt-4 grid gap-3 sm:grid-cols-3 sm:gap-2">
            {features.map((feature, index) => (
              <li key={index} className="flex gap-2.5 sm:flex-col sm:gap-2 lg:flex-row">
                <span className="grid size-9 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/5">
                  <feature.icon className={cn('size-4', feature.iconClass)} strokeWidth={2} />
                </span>
                <div className="min-w-0">
                  <p className="text-xs leading-tight font-semibold text-white">
                    {feature.title(m)}
                  </p>
                  <p className="mt-0.5 text-[11px] leading-snug text-zinc-500">
                    {feature.subtitle(m)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center lg:shrink-0 lg:self-center">
          <button
            type="button"
            onClick={onAction}
            className="group inline-flex h-11 w-full items-center gap-2.5 rounded-xl border border-emerald-400/30 bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 text-white transition-all hover:from-emerald-400 hover:to-emerald-500 active:scale-[0.98] sm:h-12 lg:w-auto"
          >
            <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-white/15">
              <PrimaryIcon className="size-4" strokeWidth={2.25} />
            </span>
            <span className="text-left text-sm font-semibold">
              {isUniversity ? m.cta.actionSubject : m.cta.actionAssignment}
            </span>
            <ChevronRight className="size-4 shrink-0 opacity-70 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
