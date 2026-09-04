'use client';

import {
  Banknote,
  ChevronRight,
  Lock,
  Minus,
  Plus,
  RotateCcw,
  Search,
  SearchX,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Upload,
  Wallet,
  type LucideIcon,
} from 'lucide-react';
import { useMemo, useState } from 'react';

import { siteConfig } from '@/config/site';
import type { HelpSection } from '@/content/help';
import type { Messages } from '@/i18n/messages/uz';
import { AppealModal } from '@/features/account/AppealModal';
import { Link } from '@/i18n/Link';
import { useT } from '@/i18n/useT';
import { cn } from '@/lib/cn';
import type { AppealTopic } from '@/shared/types/account';

/**
 * Bo'lim belgilari — mazmun faylida emas, shu yerda.
 *
 * `content/help.ts` matn saqlaydi va uni ikki tilda yozadigan odam React
 * komponentlarini import qilishi kerak emas. Bog'lovchi kalit — bo'lim `id` si.
 */
const SECTION_ICONS: Record<string, LucideIcon> = {
  start: Sparkles,
  buying: Wallet,
  guarantee: ShieldCheck,
  selling: TrendingUp,
  account: Lock,
};

/**
 * Yuqoridagi to'rtta karta — eng ko'p kerak bo'ladigan to'rtta javob.
 *
 * Ular qidiruvni to'ldirmaydi, to'g'ridan-to'g'ri javobni ochadi: "pulni
 * qanday qaytaraman" degan odam ro'yxatni emas, javobni ko'rmoqchi.
 *
 * Yorliq savolning O'ZI emas, qisqa nomi: savol matni kartaga sig'maydi
 * va to'rttasi ham yarmidan kesilgan holda turardi.
 */
const SHORTCUTS: {
  section: string;
  item: number;
  icon: LucideIcon;
  tone: string;
  label: (m: Messages) => string;
  note: (m: Messages) => string;
}[] = [
  {
    section: 'guarantee',
    item: 0,
    icon: RotateCcw,
    tone: 'bg-amber-500/10 text-warning',
    label: (m) => m.help.shortcutRefund,
    note: (m) => m.help.shortcutRefundNote,
  },
  {
    section: 'selling',
    item: 0,
    icon: Upload,
    tone: 'bg-emerald-500/10 text-brand',
    label: (m) => m.help.shortcutUpload,
    note: (m) => m.help.shortcutUploadNote,
  },
  {
    section: 'buying',
    item: 0,
    icon: Wallet,
    tone: 'bg-sky-500/10 text-sky-500',
    label: (m) => m.help.shortcutBalance,
    note: (m) => m.help.shortcutBalanceNote,
  },
  {
    section: 'selling',
    item: 1,
    icon: Banknote,
    tone: 'bg-violet-500/10 text-violet-500',
    label: (m) => m.help.shortcutWithdraw,
    note: (m) => m.help.shortcutWithdrawNote,
  },
];

/**
 * «Ko'p so'raladi» yorliqlari — qidiruvni to'ldiradi.
 *
 * So'zlar javob matnida HAQIQATAN bor: bosilgan yorliq bo'sh ro'yxat
 * ochsa, u yordam emas, boshi berk ko'cha bo'lardi.
 */
const POPULAR: ((m: Messages) => string)[] = [
  (m) => m.help.popularRefund,
  (m) => m.help.popularBalance,
  (m) => m.help.popularUpload,
  (m) => m.help.popularVariant,
  (m) => m.help.popularWithdraw,
];

function itemKey(sectionId: string, index: number): string {
  return `${sectionId}:${index}`;
}

export function HelpCenter({
  sections,
  attachmentLimit,
}: {
  sections: HelpSection[];
  attachmentLimit: number;
}) {
  const { t, m } = useT();

  const [query, setQuery] = useState('');
  const [activeId, setActiveId] = useState(sections[0]?.id ?? '');
  const [open, setOpen] = useState<Set<string>>(
    () => new Set(sections[0] ? [itemKey(sections[0].id, 0)] : []),
  );
  const [feedback, setFeedback] = useState<Record<string, 'yes' | 'no'>>({});
  const [appealTopic, setAppealTopic] = useState<AppealTopic | null>(null);

  const active = sections.find((section) => section.id === activeId) ?? sections[0];

  /*
   * Qidiruv BARCHA bo'limlar bo'ylab yuradi va savolni ham, javobni ham
   * ko'radi: odam savolni ko'pincha bizning so'zimiz bilan emas, o'z
   * so'zi bilan yozadi («pul qaytarish», «hold», «variant»).
   *
   * So'zlar ALOHIDA tekshiriladi, butun ibora sifatida emas. «pulni
   * qaytarish» deb yozgan odam «pulni to'liq qaytarish» degan javobni
   * ko'rishi kerak — ibora bo'yicha qidiruv esa uni topa olmasdi va
   * yorliqning o'zi bo'sh ro'yxat ochardi.
   */
  const matches = useMemo(() => {
    const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (!words.length) return null;

    const found: { section: HelpSection; index: number }[] = [];
    for (const section of sections) {
      section.items.forEach((item, index) => {
        const haystack =
          `${item.q} ${item.a} ${(item.steps ?? []).join(' ')} ${section.title}`.toLowerCase();
        if (words.every((word) => haystack.includes(word))) found.push({ section, index });
      });
    }
    return found;
  }, [query, sections]);

  const visible =
    matches ?? (active ? active.items.map((_, index) => ({ section: active, index })) : []);
  const allOpen =
    visible.length > 0 && visible.every((row) => open.has(itemKey(row.section.id, row.index)));

  function toggle(key: string) {
    setOpen((current) => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function toggleAll() {
    setOpen((current) => {
      const next = new Set(current);
      for (const row of visible) {
        const key = itemKey(row.section.id, row.index);
        if (allOpen) next.delete(key);
        else next.add(key);
      }
      return next;
    });
  }

  function jumpTo(sectionId: string, index: number) {
    setQuery('');
    setActiveId(sectionId);
    setOpen((current) => new Set([...current, itemKey(sectionId, index)]));
  }

  return (
    <>
      <header className="mx-auto max-w-2xl text-center">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
          {m.help.heading}
        </h1>
        <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground sm:text-base">
          {m.help.lead}
        </p>

        <div className="relative mt-5">
          <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
          <label className="sr-only" htmlFor="help-search">
            {m.help.searchLabel}
          </label>
          <input
            id="help-search"
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={m.help.searchPlaceholder}
            className="h-12 w-full rounded-2xl border border-border bg-card pr-4 pl-11 text-sm text-foreground transition-colors outline-none focus-visible:border-emerald-500/60 focus-visible:ring-3 focus-visible:ring-emerald-500/20"
          />
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs text-muted-foreground">{m.help.popular}</span>
          {POPULAR.map((term) => (
            <button
              key={term(m)}
              type="button"
              onClick={() => setQuery(term(m))}
              className="h-8 rounded-full border border-border px-3 text-xs font-medium text-foreground transition-colors hover:bg-muted"
            >
              {term(m)}
            </button>
          ))}
        </div>
      </header>

      <div className="mt-8 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
        {SHORTCUTS.map((shortcut) => {
          const section = sections.find((item) => item.id === shortcut.section);
          const item = section?.items[shortcut.item];
          if (!section || !item) return null;

          return (
            <button
              key={`card-${shortcut.section}-${shortcut.item}`}
              type="button"
              onClick={() => jumpTo(section.id, shortcut.item)}
              className="group flex items-center gap-3 rounded-2xl border border-border bg-card px-3.5 py-3 text-left transition-colors hover:border-emerald-500/40"
            >
              <span
                className={cn('grid size-9 shrink-0 place-items-center rounded-xl', shortcut.tone)}
              >
                <shortcut.icon className="size-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-foreground">
                  {shortcut.label(m)}
                </span>
                <span className="block truncate text-[11px] text-muted-foreground">
                  {shortcut.note(m)}
                </span>
              </span>
              <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </button>
          );
        })}
      </div>

      <div className="mt-6 grid gap-3 sm:mt-8 sm:gap-4 lg:grid-cols-[15rem_minmax(0,1fr)] lg:items-start">
        <div className="min-w-0 lg:sticky lg:top-20">
          <nav
            aria-label={m.help.sectionsLabel}
            className="overflow-hidden rounded-2xl border border-border bg-card p-2"
          >
            <p className="px-1.5 pt-1 pb-2 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
              {m.help.sectionsLabel}
            </p>
            <ul className="flex snap-x snap-mandatory [scrollbar-width:thin] gap-2 overflow-x-auto lg:snap-none lg:flex-col lg:gap-1 lg:overflow-visible">
              {sections.map((section) => {
                const Icon = SECTION_ICONS[section.id] ?? Sparkles;
                const current = !query && section.id === activeId;

                return (
                  <li key={section.id} className="shrink-0 snap-start lg:shrink lg:snap-align-none">
                    <button
                      type="button"
                      onClick={() => {
                        setQuery('');
                        setActiveId(section.id);
                      }}
                      aria-current={current}
                      className={cn(
                        'flex w-full items-center gap-2.5 rounded-xl border px-2.5 py-2.5 text-left whitespace-nowrap transition-colors lg:py-2',
                        current
                          ? 'border-emerald-500/50 bg-emerald-500/10'
                          : 'border-transparent hover:bg-muted/60',
                      )}
                    >
                      <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground">
                        <Icon className="size-3.5" />
                      </span>
                      <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
                        {section.title}
                      </span>
                      <span className="shrink-0 rounded-md bg-muted px-1.5 py-0.5 text-[11px] font-semibold text-muted-foreground tabular-nums">
                        {section.items.length}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          <section className="mt-3 rounded-2xl border border-border bg-card p-3.5">
            <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <span className="size-2 rounded-full bg-emerald-500" aria-hidden />
              {m.help.operatorsTitle}
            </p>
            <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
              {t((x) => x.help.operatorsHours, { hours: siteConfig.support.hours })}
            </p>
            <button
              type="button"
              onClick={() => setAppealTopic('other')}
              className="mt-3 inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-xl bg-emerald-500 text-sm font-semibold text-emerald-950 transition-colors hover:bg-emerald-400"
            >
              {m.help.writeToOperator}
            </button>
          </section>
        </div>

        <section className="min-w-0">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="min-w-0">
              <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                {query ? m.help.searchResults : active?.title}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {query ? t((x) => x.help.searchCount, { count: visible.length }) : active?.lead}
              </p>
            </div>

            {visible.length > 0 && (
              <button
                type="button"
                onClick={toggleAll}
                className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-xl border border-border px-3 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {allOpen ? <Minus className="size-3.5" /> : <Plus className="size-3.5" />}
                {allOpen ? m.help.collapseAll : m.help.expandAll}
              </button>
            )}
          </div>

          <div className="mt-4 space-y-2.5">
            {visible.length === 0 ? (
              <div className="flex flex-col items-center rounded-2xl border border-dashed border-border px-6 py-14 text-center">
                <SearchX className="size-8 text-muted-foreground" />
                <p className="mt-3 text-sm font-medium text-foreground">{m.help.nothingFound}</p>
                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                  {m.help.nothingFoundLead}
                </p>
                <button
                  type="button"
                  onClick={() => setAppealTopic('other')}
                  className="mt-4 inline-flex h-10 items-center rounded-xl bg-emerald-500 px-4 text-sm font-semibold text-emerald-950 transition-colors hover:bg-emerald-400"
                >
                  {m.appeals.newAppeal}
                </button>
              </div>
            ) : (
              visible.map(({ section, index }) => {
                const item = section.items[index]!;
                const key = itemKey(section.id, index);
                const isOpen = open.has(key);
                const vote = feedback[key];

                return (
                  <article
                    key={key}
                    className={cn(
                      'overflow-hidden rounded-2xl border bg-card transition-colors',
                      isOpen ? 'border-emerald-500/30' : 'border-border',
                    )}
                  >
                    <h3>
                      <button
                        type="button"
                        onClick={() => toggle(key)}
                        aria-expanded={isOpen}
                        className="flex w-full items-start gap-3 px-3.5 py-3.5 text-left sm:px-4"
                      >
                        <span
                          className={cn(
                            'mt-0.5 grid size-6 shrink-0 place-items-center rounded-md text-[11px] font-bold tabular-nums',
                            isOpen
                              ? 'bg-emerald-500/15 text-brand'
                              : 'bg-muted text-muted-foreground',
                          )}
                        >
                          {String(index + 1).padStart(2, '0')}
                        </span>

                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-semibold text-foreground sm:text-[15px]">
                            {item.q}
                          </span>
                          {/* Yopiq holatda javobning boshi ko'rinadi: bir
                              necha o'xshash sarlavha orasidan keraklisini
                              topish uchun sarlavhaning o'zi yetmaydi. */}
                          {!isOpen && (
                            <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                              {item.a}
                            </span>
                          )}
                          {query && (
                            <span className="mt-1 block text-[11px] text-brand">
                              {section.title}
                            </span>
                          )}
                        </span>

                        <span className="mt-0.5 shrink-0 text-muted-foreground">
                          {isOpen ? <Minus className="size-4" /> : <Plus className="size-4" />}
                        </span>
                      </button>
                    </h3>

                    {isOpen && (
                      <div className="px-3.5 pb-3.5 sm:px-4 sm:pb-4">
                        <div className="sm:pl-9">
                          <p className="text-sm leading-relaxed text-muted-foreground">{item.a}</p>

                          {item.steps && (
                            <ol className="mt-3 space-y-2 rounded-xl bg-muted/40 p-3">
                              {item.steps.map((step, stepIndex) => (
                                <li key={step} className="flex items-start gap-2.5">
                                  <span className="grid size-5 shrink-0 place-items-center rounded-md bg-emerald-500/15 text-[10px] font-bold text-brand tabular-nums">
                                    {stepIndex + 1}
                                  </span>
                                  <span className="text-xs leading-relaxed text-muted-foreground">
                                    {step}
                                  </span>
                                </li>
                              ))}
                            </ol>
                          )}

                          <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3">
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] text-muted-foreground">
                                {vote ? m.help.thanks : m.help.helpful}
                              </span>
                              {!vote &&
                                (['yes', 'no'] as const).map((value) => (
                                  <button
                                    key={value}
                                    type="button"
                                    onClick={() =>
                                      setFeedback((current) => ({ ...current, [key]: value }))
                                    }
                                    className="h-7 rounded-lg border border-border px-2.5 text-[11px] font-medium text-foreground transition-colors hover:bg-muted"
                                  >
                                    {value === 'yes' ? m.common.yes : m.common.no}
                                  </button>
                                ))}
                            </div>

                            {/* «Yo'q» — savol javobsiz qolgani. Operatorga
                                yozish taklifi aynan shu yerda chiqadi,
                                sahifa oxirida emas. */}
                            {vote === 'no' ? (
                              <button
                                type="button"
                                onClick={() => setAppealTopic('other')}
                                className="text-xs font-semibold text-brand"
                              >
                                {m.help.askOperator} →
                              </button>
                            ) : (
                              item.link && (
                                <Link
                                  href={item.link.href}
                                  className="text-xs font-semibold text-brand"
                                >
                                  {item.link.label} →
                                </Link>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </article>
                );
              })
            )}
          </div>

          <section className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground">{m.help.stillStuck}</p>
              <p className="mt-1 max-w-md text-xs leading-relaxed text-muted-foreground">
                {m.help.stillStuckLead}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setAppealTopic('other')}
              className="inline-flex h-10 shrink-0 items-center rounded-xl bg-emerald-500 px-4 text-sm font-semibold text-emerald-950 transition-colors hover:bg-emerald-400"
            >
              {m.appeals.newAppeal}
            </button>
          </section>
        </section>
      </div>

      <AppealModal
        open={appealTopic !== null}
        topic={appealTopic ?? 'other'}
        attachmentLimit={attachmentLimit}
        onClose={() => setAppealTopic(null)}
      />
    </>
  );
}
