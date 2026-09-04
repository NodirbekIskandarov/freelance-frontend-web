'use client';

import { ArrowRight, ArrowUpDown, Plus } from 'lucide-react';

import { useT } from '@/i18n/useT';
import { cn } from '@/lib/cn';
import { formatCount } from '@/lib/format';
import { useMoney } from '@/lib/useMoney';
import type { University } from '@/shared/types/catalogue';

import { UniversityBadge } from './CatalogueCards';

export interface InstituteEntry {
  university: University;
  slug: string;
  /** Joriy filtrga mos fanlar soni — qidiruv toraysa qator ham torayadi. */
  subjectCount: number;
}

/**
 * Chapdagi institutlar ro'yxati.
 *
 * Ro'yxat, tanlagich emas: institut tanlash — bu sahifadagi ASOSIY amal
 * va uni ochiladigan ro'yxat ichiga yashirish har safar ikki bosish
 * degani edi. Yonidagi rozetka esa tanlashdan oldin javob beradi:
 * "bu institutda umuman material bormi?".
 *
 * Telefonda ro'yxat gorizontal lentaga aylanadi — vertikal ro'yxat
 * ekranning yarmini egallab, fanlar birinchi qarashda ko'rinmasdi.
 */
export function InstituteList({
  institutes,
  selectedId,
  onSelect,
  alphabetical,
  onToggleAlphabetical,
  onRequestUniversity,
  className,
}: {
  institutes: InstituteEntry[];
  selectedId: string | null;
  onSelect: (universityId: string) => void;
  alphabetical: boolean;
  onToggleAlphabetical: () => void;
  onRequestUniversity: () => void;
  className?: string;
}) {
  const { t, m } = useT();

  return (
    <div className={cn('min-w-0', className)}>
      <section className="overflow-hidden rounded-2xl border border-border bg-card">
        <header className="flex items-center justify-between gap-2 border-b border-border px-3.5 py-3">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">{m.materials.institutes}</p>
            <p className="text-[11px] text-muted-foreground tabular-nums">
              {t((x) => x.materials.institutesListed, { count: institutes.length })}
            </p>
          </div>

          {/* Alifbo — tezkor almashtirgich, yuqoridagi «Materiali ko'p»
              tanlagichining o'sha holati. Ikkalasi bitta qiymatni
              boshqaradi, ya'ni ular hech qachon bir-biriga zid
              ko'rinmaydi. */}
          <button
            type="button"
            onClick={onToggleAlphabetical}
            aria-pressed={alphabetical}
            className={cn(
              'inline-flex h-7 shrink-0 items-center gap-1 rounded-lg border px-2 text-[11px] font-medium transition-colors',
              alphabetical
                ? 'border-emerald-500/40 bg-emerald-500/10 text-brand'
                : 'border-border text-muted-foreground hover:text-foreground',
            )}
          >
            <ArrowUpDown className="size-3" />
            {m.materials.alphabetical}
          </button>
        </header>

        {institutes.length === 0 ? (
          <p className="px-3.5 py-6 text-center text-sm text-muted-foreground">
            {m.materials.noInstitutes}
          </p>
        ) : (
          <ul
            className={cn(
              // Telefonda gorizontal lenta: `snap` bilan surilganda karta
              // yarmi ko'rinib to'xtamaydi, oxiridagi bo'sh joy esa lenta
              // tugaganini ko'rsatadi.
              //
              // `scrollbar-slim`, `[scrollbar-width:thin]` EMAS: ikkinchisi
              // faqat Firefox'ni bilardi va Chrome'da brauzerning o'z
              // yo'g'on, oq chizig'i qorong'i panelda turib qolardi.
              // Utilita ikkala dvigatelni ham qamraydi.
              'scrollbar-slim flex snap-x snap-mandatory gap-2 overflow-x-auto p-2 pr-6',
              'lg:max-h-[26rem] lg:snap-none lg:flex-col lg:gap-1 lg:overflow-x-visible lg:overflow-y-auto lg:pr-2',
            )}
          >
            {institutes.map((entry) => {
              const active = entry.university.id === selectedId;
              const solutions = entry.university.solution_count ?? 0;

              return (
                <li
                  key={entry.university.id}
                  className="min-w-[13rem] shrink-0 snap-start lg:min-w-0"
                >
                  <button
                    type="button"
                    onClick={() => onSelect(entry.university.id)}
                    aria-current={active}
                    className={cn(
                      // Telefonda 44px'ga yaqin nishon: 36px qatorga barmoq
                      // bilan tushish qiyin.
                      'flex w-full items-center gap-2.5 rounded-xl border px-2.5 py-2.5 text-left transition-colors lg:py-2',
                      active
                        ? 'border-emerald-500/50 bg-emerald-500/10'
                        : 'border-transparent hover:bg-muted/60',
                    )}
                  >
                    <UniversityBadge university={entry.university} />

                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-foreground">
                        {entry.university.short_name || entry.university.name}
                      </span>
                      <span className="block truncate text-[11px] text-muted-foreground">
                        {entry.university.city ? `${entry.university.city} · ` : ''}
                        {t((x) => x.materials.instituteSubjects, {
                          count: formatCount(entry.subjectCount),
                        })}
                      </span>
                    </span>

                    {/* Rozetka — sotuvdagi yechimlar. Noli kulrang: nol ham
                        raqam, lekin uni yashilda ko'rsatish "material bor"
                        degan taassurot berardi. */}
                    <span
                      className={cn(
                        'shrink-0 rounded-md px-1.5 py-0.5 text-[11px] font-semibold tabular-nums',
                        solutions > 0
                          ? 'bg-emerald-500/12 text-brand'
                          : 'bg-muted text-muted-foreground',
                      )}
                    >
                      {formatCount(solutions)}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        <button
          type="button"
          onClick={onRequestUniversity}
          className="flex w-full items-center justify-center gap-1.5 border-t border-border px-3.5 py-3 text-xs font-medium text-brand transition-colors hover:bg-emerald-500/[0.06]"
        >
          {m.materials.instituteMissing}
          <ArrowRight className="size-3.5" />
        </button>
      </section>
    </div>
  );
}

/**
 * "Fan topilmadimi?" — tanlangan institutga fan qo'shish arizasi.
 *
 * Institutlar ro'yxatidan AJRATILGAN. Keng ekranda ikkalasi ham chap
 * ustunda turadi, telefonda esa u fanlar ro'yxatining OSTIGA tushadi:
 * ro'yxat bilan fanlar orasida turgan karta har bir tashrifchini kerakli
 * narsagacha yana bir ekran aylantirishga majbur qilardi — holbuki ariza
 * kerak bo'ladigan payt aynan ro'yxatda hech nima topilmagandan KEYIN.
 */
export function SubjectRequestCard({
  onRequestSubject,
  canRequestSubject,
  subjectRequestReward,
  className,
}: {
  onRequestSubject: () => void;
  /**
   * Fan arizasi TANLANGAN institutga yoziladi, ya'ni filtr hech nima
   * qoldirmaganda yuboriladigan joy yo'q — tugma o'shanda o'chiriladi,
   * bosilganda hech nima qilmaydigan tugma qoldirilmaydi.
   */
  canRequestSubject: boolean;
  /** 0 — mukofot o'chirilgan, matn summani umuman aytmaydi. */
  subjectRequestReward: number;
  className?: string;
}) {
  const { t, m } = useT();
  const money = useMoney();

  return (
    <div className={cn('min-w-0', className)}>
      <section className="rounded-2xl border border-border bg-card p-3.5">
        <p className="text-sm font-semibold text-foreground">{m.materials.subjectMissing}</p>
        {/*
          Tushuntirish HAR DOIM ko'rinadi, mukofot esa QO'SHIMCHA qator.

          Ilgari mukofot bo'lganda u tushuntirishni almashtirardi va
          kartada faqat «hisobingizga X tushadi» qolardi — nima qilish
          kerakligi umuman aytilmasdi.
        */}
        <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
          {m.materials.subjectMissingBonus}
        </p>
        {subjectRequestReward > 0 && (
          <p className="mt-1 text-[11px] leading-relaxed text-brand">
            {t((x) => x.materials.subjectMissingReward, {
              amount: money.som(subjectRequestReward),
            })}
          </p>
        )}

        <button
          type="button"
          onClick={onRequestSubject}
          disabled={!canRequestSubject}
          className="mt-3 inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-xl bg-emerald-500 text-sm font-semibold text-emerald-950 transition-colors hover:bg-emerald-400 disabled:opacity-40"
        >
          <Plus className="size-4" />
          {m.materials.addSubject}
        </button>
      </section>
    </div>
  );
}
