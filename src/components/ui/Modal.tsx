'use client';

import { X } from 'lucide-react';
import { useEffect, useRef, type ReactNode } from 'react';

import { cn } from '@/lib/cn';

/**
 * Native `<dialog>` ustiga qurilgan.
 *
 * Sabab: fokus tuzog'i, Esc bilan yopilish va orqa fonni o'chirish
 * brauzerdan tekinga keladi. Qo'lda yozilgan modalda bularning har biri
 * alohida xato manbai bo'ladi.
 */
export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  className,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      // Esc bosilganda brauzer `cancel` yuboradi — holatni tashqarida
      // yangilash uchun ushlab olamiz.
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClose={onClose}
      // Fon bosilganda yopiladi: `<dialog>` butun ekranni egallaydi,
      // shuning uchun bosish nishoni aynan dialog bo'lsa — bu fon.
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
      className={cn(
        'm-auto w-[min(34rem,calc(100vw-2rem))] rounded-2xl border border-border bg-card p-0 text-card-foreground backdrop:bg-black/50 backdrop:backdrop-blur-sm',
        className,
      )}
    >
      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-foreground">{title}</h2>
            {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Yopish"
            className="-mt-1 -mr-1 grid size-8 shrink-0 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>

        {/*
          Uzun forma modal ichida aylanadi. Ochiladigan ro'yxatlar
          (`ui/Select`) portal orqali `document.body` ga chiqadi, shuning
          uchun bu `overflow` ularni qirqmaydi.
        */}
        <div className="scrollbar-slim mt-5 -mr-2 max-h-[70vh] overflow-y-auto pr-2">
          {children}
        </div>

        {footer && <div className="mt-6 flex flex-wrap justify-end gap-2">{footer}</div>}
      </div>
    </dialog>
  );
}
