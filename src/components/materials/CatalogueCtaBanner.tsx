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

  /*
   * Yetakchi gap va havola qatori ALOHIDA.
   *
   * Ilgari ular bitta xatboshi edi va telefonda to'rt qator egallardi.
   * Yetakchi gap esa quyidagi uchta yorliq bilan bir xil narsani aytadi
   * («yordam beramiz», «ko'rib chiqiladi», «bonus») — shuning uchun tor
   * ekranda yashiriladi. Havola esa boshqa amal: u yo'qolmasligi kerak.
   */
  const lead = isUniversity
    ? interpolate(m.cta.subtitleSubject, { university: universityShortName })
    : m.cta.subtitleAssignment;

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

      <div className="relative z-10 flex flex-col gap-3 p-3.5 sm:p-5 lg:flex-row lg:items-center lg:gap-4 xl:gap-5">
        {/* Illyustratsiya tor ekranda ham qoladi, lekin kichrayadi. */}
        {/* Illyustratsiya faqat keng ekranda: telefonda u 150px balandlik
            egallab, birinchi ekranni butunlay to'ldirib qo'yardi. */}
        <div className="relative mx-auto hidden w-full max-w-[190px] shrink-0 items-end justify-center lg:mx-0 lg:flex lg:w-[180px] xl:w-[210px]">
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
            {/* `priority` yo'q: illyustratsiya `lg` dan pastda
                ko'rinmaydi, preload esa uni telefonga ham yuklab
                qo'yardi. */}
            <Image
              src="/materials/cta-student.png"
              alt=""
              width={420}
              height={420}
              className="drop- h-auto w-full object-contain object-bottom"
            />
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-center lg:py-2 lg:pl-1">
          {/* Rozetka faqat keng ekranda: uning matni («Kerakli topshiriqni
              topa olmadingizmi?») sarlavhaning deyarli aynan o'zi va
              telefonda bitta savol ikki marta so'ralayotgandek edi. */}
          <span className="hidden w-fit items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-400 lg:inline-flex">
            <HelpCircle className="size-3.5" />
            {isUniversity ? m.cta.badgeSubject : m.cta.badgeAssignment}
          </span>

          <h2 className="text-sm leading-snug font-bold text-white sm:text-base lg:mt-3 lg:text-xl">
            {m.cta.headingLead}{' '}
            <span className="text-emerald-400">
              {isUniversity ? m.cta.headingSubject : m.cta.headingAssignment}
            </span>{' '}
            {m.cta.headingTail}
          </h2>

          <p className="mt-2 hidden max-w-xl text-sm leading-relaxed text-zinc-400 lg:block">
            {lead}
          </p>

          {/*
            Uchta afzallik.

            Telefonda — bitta qatorga sig'adigan mayda yorliqlar: ikkinchi
            darajali izohlar («Moderatsiyadan o'tgach») uch qator egallab,
            hech kim o'qimasdi. Keng ekranda joy bor, izohlar qoladi.
          */}
          <ul className="mt-2.5 flex flex-wrap gap-1 sm:gap-1.5 lg:mt-4 lg:grid lg:grid-cols-3 lg:gap-2">
            {features.map((feature, index) => (
              <li
                key={index}
                className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-1.5 py-1 sm:gap-1.5 sm:px-2 lg:gap-2.5 lg:border-0 lg:bg-transparent lg:p-0"
              >
                <span className="grid shrink-0 place-items-center lg:size-9 lg:rounded-lg lg:border lg:border-white/10 lg:bg-white/5">
                  <feature.icon
                    className={cn('size-3.5 lg:size-4', feature.iconClass)}
                    strokeWidth={2}
                  />
                </span>
                <div className="min-w-0">
                  <p className="text-[10px] leading-tight font-semibold text-white sm:text-[11px] lg:text-xs">
                    {feature.title(m)}
                  </p>
                  <p className="mt-0.5 hidden text-[11px] leading-snug text-zinc-500 lg:block">
                    {feature.subtitle(m)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-2 lg:shrink-0 lg:self-center">
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

          {/* «Fan ro'yxatda yo'q?» — boshqa amal, boshqa sahifa. Ilgari u
              yetakchi gap ichiga ko'milgan edi va tugma yonida turgani
              aniqroq. */}
          {!isUniversity && universityHref && (
            <p className="text-center text-[11px] leading-snug text-zinc-500 lg:text-left">
              <Link href={universityHref} className="font-medium text-emerald-400 hover:underline">
                {m.cta.subjectMissingLink}
              </Link>{' '}
              {m.cta.subjectMissingTail}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
