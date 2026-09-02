'use client';

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

import { interpolate } from '@/i18n/interpolate';
import type { Messages } from '@/i18n/messages/uz';
import { useT } from '@/i18n/useT';
import { cn } from '@/lib/cn';
import { usePrefersReducedMotion } from '@/lib/motion';

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
  /* Javobsiz variantlar soni — «earn» slaydi uni matnining ichida
     aytadi, «upload» esa ishlatmaydi. */
  subtitle: (messages: Messages, awaiting: number) => string;
  cta: (messages: Messages) => string;
  ctaIcon: LucideIcon;
  ctaHref: string;
  /** Ikkinchi darajali havola — asosiy tugmadan BOSHQA joyga. */
  secondaryHref: string;
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
    secondaryHref: '/faq',
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
    // Qora yorliq: oq matn bu yashillar ustida 3.77:1 va 2.15:1
    // berardi, ya'ni ikkalasi ham o'qish chegarasidan past. Sayt
    // bo'ylab asosiy tugma bilan bir xil yechim.
    button: 'bg-emerald-500 text-emerald-950 hover:bg-emerald-400',
    dotActive: 'bg-emerald-600',
  },
  earn: {
    badge: (m) => m.promo.earnBadge,
    badgeIcon: Star,
    titleLead: (m) => m.promo.earnTitleLead,
    titleAccent: (m) => m.promo.earnTitleAccent,
    /* Sanoq nol bo'lsa boshqa gap: «Hozir 0 ta variantda yechim yo'q»
       yechim yozmoqchi bo'lgan odamni ishontirmaydi, aksincha. */
    subtitle: (m, awaiting) =>
      awaiting > 0
        ? interpolate(m.promo.earnSubtitle, { count: awaiting })
        : m.promo.earnSubtitleEmpty,
    cta: (m) => m.promo.earnCta,
    ctaIcon: ArrowUpRight,
    ctaHref: '/freelance/apply',
    secondaryHref: '/faq',
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
    button: 'bg-amber-500 text-amber-950 hover:bg-amber-400',
    dotActive: 'bg-amber-500',
  },
};

/*
 * «Daromad qilish» BIRINCHI.
 *
 * Materiallar sahifasiga kelgan odam allaqachon katalogni ko'rmoqchi;
 * unga birinchi bo'lib «topa olmadingizmi?» deb savol berish sahifani
 * hali ochilmasidan muammo bilan boshlash edi. Yechim yozadigan odamga
 * qilingan taklif esa katalogning o'zi bilan bir xil paytda foydali.
 */
const ORDER: SlideId[] = ['earn', 'upload'];

/** Aylanuvchi punktir halqalar — illyustratsiya ortidagi bezak. */
function OrbitRings({ orbit }: { orbit: string }) {
  return (
    <div
      aria-hidden
      className="promo-orbit pointer-events-none absolute inset-0 grid place-items-center"
    >
      <div className={cn('size-[92%] rounded-full border border-dashed opacity-50', orbit)} />
      <div
        className={cn('absolute size-[72%] rounded-full border border-dashed opacity-30', orbit)}
      />
    </div>
  );
}

function Slide({ id, awaiting }: { id: SlideId; awaiting: number }) {
  const { m } = useT();
  const config = SLIDES[id];
  const BadgeIcon = config.badgeIcon;
  const CtaIcon = config.ctaIcon;

  return (
    <div className="grid items-center gap-5 p-4 sm:gap-6 sm:p-7 lg:grid-cols-[1.1fr_0.9fr_1fr] lg:gap-8 lg:p-9">
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
          {config.subtitle(m, awaiting)}
        </p>

        {/* Telefonda ikkalasi BIR QATORDA: ustma-ust qo'yilganda ular
            banner balandligiga yuz piksel qo'shardi, holbuki bannerdan
            keyin darhol katalog boshlanishi kerak. Shuning uchun tor
            ekranda matn ham, ichki bo'shliq ham kichrayadi. */}
        <div className="mt-4 flex flex-wrap items-center gap-2 sm:mt-5 sm:gap-2.5">
          <Link
            href={config.ctaHref}
            className={cn(
              'inline-flex h-10 items-center gap-1.5 rounded-xl px-3.5 text-[13px] font-semibold transition-colors sm:h-11 sm:gap-2 sm:px-5 sm:text-sm',
              config.button,
            )}
          >
            <CtaIcon className="size-4" />
            {config.cta(m)}
          </Link>

          {/* Ikkinchi tugma boshqa savolga javob beradi — «bu qanday
              ishlaydi?». Asosiy tugma bilan bir joyga olib borsa, u
              shunchaki takrorlangan tugma bo'lardi. */}
          <Link
            href={config.secondaryHref}
            className="inline-flex h-10 items-center rounded-xl border border-foreground/15 px-3.5 text-[13px] font-medium text-foreground transition-colors hover:bg-foreground/5 sm:h-11 sm:px-4 sm:text-sm"
          >
            {m.promo.secondaryCta}
          </Link>
        </div>
      </div>

      {/* Illyustratsiya o'rta ustunda — tor ekranda birinchi bo'lib yashiriladi. */}
      <div className="relative mx-auto hidden h-[220px] w-full max-w-[280px] items-end justify-center sm:h-[240px] lg:flex">
        <OrbitRings orbit={config.orbit} />
        {/*
          `priority` ATAYLAB YO'Q.
          
          Illyustratsiya `lg` dan pastda umuman ko'rinmaydi (yuqoridagi
          `hidden lg:flex`), `priority` esa `<head>` ga preload qo'yadi va
          uni VIEWPORTGA QARAMASDAN yuklaydi — ya'ni har bir telefon
          tashrifi hech qachon chizilmaydigan rasm uchun to'lardi.
          Kechiktirilgan yuklashda esa brauzer `display:none` elementni
          umuman so'ramaydi.
        */}
        <Image
          src={config.image}
          alt={config.imageAlt}
          width={320}
          height={320}
          className="drop- relative z-10 h-[88%] w-auto object-contain object-bottom"
        />
      </div>

      {/*
        Telefonda uchta afzallik — bitta qatorga sig'adigan mayda
        yorliqlar, izohlarsiz. Izohlar («Javobsiz topshiriqlarni toping va
        yeching») sarlavhaning boshqacha aytilishi bo'lib, tor ekranda
        yana yuz piksel egallardi va ularni hech kim o'qimasdi.
      */}
      <ul className="flex flex-wrap gap-1.5 sm:grid sm:grid-cols-3 sm:gap-4 lg:grid-cols-1">
        {config.features.map((feature, index) => (
          <li
            key={index}
            className="flex items-center gap-1.5 rounded-lg border border-foreground/10 px-2 py-1 sm:items-start sm:gap-3 sm:rounded-none sm:border-0 sm:px-0 sm:py-0"
          >
            <span
              className={cn(
                'grid size-6 shrink-0 place-items-center rounded-md sm:size-10 sm:rounded-xl',
                config.badgeBg,
              )}
            >
              <feature.icon className={cn('size-3.5 sm:size-5', config.accent)} />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-foreground sm:text-sm">
                {feature.label(m)}
              </p>
              <p className="mt-0.5 hidden text-xs leading-relaxed text-muted-foreground sm:block">
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
export function MaterialsPromo({ awaitingVariants }: { awaitingVariants: number }) {
  const { t } = useT();
  /* Animatsiyalarni CSS o'zi o'chiradi; bu yerda kerak bo'lgani —
     slaydlarning O'ZI ALMASHISHINI to'xtatish, uni CSS qila olmaydi. */
  const reduceMotion = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || reduceMotion) return;

    const timer = setInterval(() => setIndex((value) => (value + 1) % ORDER.length), ROTATE_MS);
    return () => clearInterval(timer);
  }, [paused, reduceMotion]);

  const current = ORDER[index]!;
  const config = SLIDES[current];

  return (
    <section
      className={cn('relative overflow-hidden rounded-2xl border transition-shadow', config.shell)}
    >
      {/* `key` — slayd almashganda element qaytadan yaratiladi va CSS
          animatsiyasi o'zi boshidan ishga tushadi. Chiqib ketish
          animatsiyasi YO'Q: uning uchun ikkala slaydni bir vaqtda daraxtda
          ushlab turish kerak edi, foydasi esa bir necha yuz
          millisekundlik bezak. */}
      <div key={current} className="promo-slide-in">
        <Slide id={current} awaiting={awaitingVariants} />
      </div>

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
