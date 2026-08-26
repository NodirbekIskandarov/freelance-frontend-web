'use client';

import { Check, ChevronDown } from 'lucide-react';
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
}) {
  const autoId = useId();
  const listId = `${autoId}-list`;
  const [open, setOpen] = useState(false);
  const [menuWidth, setMenuWidth] = useState<number | undefined>();
  const rootRef = useRef<HTMLDivElement>(null);

  const selected = options.find((option) => option.value === value);
  const label = selected?.label ?? placeholder;

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  /*
   * Ro'yxatning ENG KAM kengligi tugmaga tenglashtiriladi.
   *
   * Qat'iy `width` bermaymiz: ro'yxat elementida tugmada yo'q belgi
   * (galochka) ham bor, shuning uchun bir xil kenglikda matn qirqilib
   * "Barcha kursl…" bo'lib qolardi. O'sishi `max-w` bilan cheklangan —
   * uzun yo'nalish nomi menyuni ekrandan chiqarib yubormaydi.
   */
  useLayoutEffect(() => {
    if (!open) return;
    setMenuWidth(rootRef.current?.offsetWidth);
  }, [open, options.length]);

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
        onClick={() => !disabled && setOpen((prev) => !prev)}
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

      {open ? (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-200 mt-1 max-h-60 w-max max-w-[min(20rem,80vw)] overflow-auto rounded-xl border border-border/80 bg-popover py-1 text-popover-foreground shadow-lg ring-1 ring-black/5"
          style={menuWidth ? { minWidth: menuWidth } : undefined}
        >
          {options.map((option) => {
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
                    setOpen(false);
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
      ) : null}
    </div>
  );
}
