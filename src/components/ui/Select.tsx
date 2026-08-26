'use client';

import { Check, ChevronDown, Search, SearchX } from 'lucide-react';
import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';

import { cn } from '@/lib/cn';

export type SelectOption = {
  value: string;
  label: string;
};

/**
 * Tanlov ro'yxati — brauzerning `<select>` i o'rniga.
 *
 * Sabab: mahalliy `<select>` ochilganda operatsion tizimning o'z oynasini
 * chizadi va uni uslublab bo'lmaydi — tungi rejimda oq ro'yxat chiqib
 * qoladi. Bu yerda ro'yxat oddiy `<ul>`, shuning uchun tema bilan birga
 * o'zgaradi.
 */
export function Select({
  value,
  onChange,
  options,
  className,
  triggerClassName,
  id,
  'aria-label': ariaLabel,
  disabled,
  placeholder = 'Tanlang',
  searchable = false,
  searchPlaceholder = 'Qidirish...',
}: {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  className?: string;
  triggerClassName?: string;
  id?: string;
  'aria-label'?: string;
  disabled?: boolean;
  placeholder?: string;
  /**
   * Ro'yxat ustida qidiruv maydoni. Uzun ro'yxatlar uchun (masalan 21 ta
   * institut) — aylantirib topishdan ko'ra yozib topish tezroq.
   */
  searchable?: boolean;
  searchPlaceholder?: string;
}) {
  const autoId = useId();
  const listId = `${autoId}-list`;
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [anchor, setAnchor] = useState<{ top: number; left: number; width: number } | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const selected = options.find((option) => option.value === value);
  const label = selected?.label ?? placeholder;

  /*
   * Ochish va yopish bitta funksiyada: har ochilishda qidiruv tozalanishi
   * kerak, aks holda oldingi so'rov qolib, ro'yxat sababsiz qisqargandek
   * ko'rinardi. Buni effektda qilish holatni render tsiklidan tashqarida
   * o'zgartirish bo'lardi.
   */
  function setMenuOpen(next: boolean) {
    setOpen(next);
    setQuery('');
  }

  const needle = query.trim().toLowerCase();
  const visibleOptions =
    searchable && needle
      ? options.filter((option) => option.label.toLowerCase().includes(needle))
      : options;

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setMenuOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setMenuOpen(false);
    }

    /*
     * Ro'yxat `position: fixed` bilan chiziladi, ya'ni sahifa yoki modal
     * ichi aylantirilsa u tugmadan ajralib qolardi. Qayta hisoblash
     * o'rniga yopamiz: ro'yxat ochiq turganda aylantirish — bu odatda
     * "boshqa narsaga o'tyapman" degani.
     */
    function onScroll() {
      setMenuOpen(false);
    }

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    // `capture` — ichki aylantiriladigan konteynerlar ham hisobga olinadi.
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', onScroll);

    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', onScroll);
    };
  }, [open]);

  /*
   * Ro'yxat `position: fixed` bilan, ekran koordinatalarida chiziladi.
   *
   * `absolute` bo'lsa, aylantiriladigan konteyner (modal formasi) yoki
   * `overflow: auto` li `<dialog>` uni qirqib qo'yardi. `fixed` esa
   * `overflow` chegaralaridan xoli.
   *
   * `document.body` ga PORTAL QILINMAYDI: `showModal()` bilan ochilgan
   * `<dialog>` top layer'da turadi va body ichidagi element, `z-index`
   * qanday bo'lishidan qat'i nazar, uning ORTIDA qolardi. DOM'da shu
   * yerda qolgani uchun ro'yxat modal bilan bir qatlamda bo'ladi.
   *
   * Cheklov: `transform` yoki `filter` li ota element `fixed` uchun yangi
   * sanoq boshi yaratadi. Hozirgi ishlatilish joylarida bunday ota yo'q.
   *
   * Eng kam kenglik tugmaga tenglashtiriladi, qat'iy emas: ro'yxat
   * elementida tugmada yo'q galochka ham bor va teng kenglikda matn
   * qirqilardi.
   */
  useLayoutEffect(() => {
    if (!open) return;

    const rect = rootRef.current?.getBoundingClientRect();
    if (!rect) return;

    setAnchor({ top: rect.bottom + 4, left: rect.left, width: rect.width });
  }, [open, visibleOptions.length]);

  // Ochilgach fokus qidiruvga o'tadi — bu DOM ta'siri, holat emas.
  useEffect(() => {
    if (open && searchable) searchRef.current?.focus();
  }, [open, searchable]);

  return (
    <div ref={rootRef} className={cn('relative', className)}>
      <button
        type="button"
        id={id}
        disabled={disabled}
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        onClick={() => !disabled && setMenuOpen(!open)}
        className={cn(
          'flex h-11 w-full min-w-[8rem] items-center justify-between gap-2 rounded-xl border border-border/70 bg-background px-3 text-left text-sm text-foreground shadow-sm transition-colors outline-none hover:border-emerald-500/30 focus-visible:border-emerald-500/60 focus-visible:ring-3 focus-visible:ring-emerald-500/20 disabled:opacity-50 dark:border-white/12 dark:bg-[#0a100d] dark:text-white',
          triggerClassName,
        )}
      >
        <span className="truncate">{label}</span>
        <ChevronDown
          className={cn(
            'size-4 shrink-0 text-muted-foreground opacity-70 transition-transform',
            open && 'rotate-180',
          )}
        />
      </button>

      {open && anchor ? (
        <div
          className="fixed z-200 w-max max-w-[min(20rem,80vw)] overflow-hidden rounded-xl border border-border/80 bg-popover text-popover-foreground shadow-lg ring-1 ring-black/5"
          style={{ top: anchor.top, left: anchor.left, minWidth: anchor.width }}
        >
          {searchable ? (
            <div className="border-b border-border/70 p-2">
              <div className="relative">
                <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <input
                  ref={searchRef}
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={searchPlaceholder}
                  aria-label={ariaLabel ? `${ariaLabel} — qidirish` : 'Qidirish'}
                  /*
                   * Ro'yxat bo'ylab yurish tugmalari qidiruv maydonida ham
                   * ishlashi kerak: Escape yopadi, Enter esa birinchi
                   * moslikni tanlaydi — yozib, darrov tasdiqlash uchun.
                   */
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' && visibleOptions[0]) {
                      event.preventDefault();
                      onChange(visibleOptions[0].value);
                      setMenuOpen(false);
                    }
                  }}
                  className="h-9 w-full rounded-lg border border-border/70 bg-background pr-2 pl-8 text-sm text-foreground outline-none placeholder:text-muted-foreground/70 focus:border-emerald-500/40 dark:border-white/10 dark:bg-white/[0.04] dark:text-white"
                />
              </div>
            </div>
          ) : null}

          {visibleOptions.length === 0 ? (
            <p className="flex items-center gap-2 px-3 py-4 text-sm text-muted-foreground">
              <SearchX className="size-4 shrink-0" />
              Hech narsa topilmadi
            </p>
          ) : (
            <ul id={listId} role="listbox" className="scrollbar-slim max-h-60 overflow-auto py-1">
              {visibleOptions.map((option) => {
                const active = option.value === value;

                return (
                  <li key={option.value || '__empty'} role="option" aria-selected={active}>
                    <button
                      type="button"
                      className={cn(
                        'flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-foreground transition-colors hover:bg-emerald-500/10 hover:text-emerald-900 dark:hover:text-emerald-200',
                        active &&
                          'bg-emerald-500/12 font-medium text-emerald-800 dark:text-emerald-200',
                      )}
                      onClick={() => {
                        onChange(option.value);
                        setMenuOpen(false);
                      }}
                    >
                      <Check
                        className={cn('size-4 shrink-0 text-emerald-500', !active && 'opacity-0')}
                      />
                      <span className="truncate">{option.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  );
}
