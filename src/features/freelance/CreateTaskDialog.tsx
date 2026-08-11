'use client';

import { X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/Field';
import { getApiErrorMessage } from '@/shared/api/errors';
import {
  DEADLINE_OPTIONS,
  WORK_DIRECTIONS,
  formatDeadlineDays,
  type WorkDirectionValue,
} from '@/shared/types/freelance';

import { useCreateExchangeTaskMutation } from './exchangeApi';

/**
 * Native `<dialog>` — fokus tuzog'i, Esc bilan yopilish va orqa fonni
 * o'chirish brauzerdan tekin keladi. Bularni React'da qo'lda yozish
 * ~150 satr va bir nechta a11y xatosi degani.
 */
export function CreateTaskDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [createTask, { isLoading, error }] = useCreateExchangeTaskMutation();

  const [title, setTitle] = useState('');
  const [direction, setDirection] = useState<WorkDirectionValue>('programming');
  const [deadline, setDeadline] = useState<string>('7');
  const [comment, setComment] = useState('');
  const [fileName, setFileName] = useState('');

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    try {
      await createTask({
        title: title.trim(),
        direction,
        deadline,
        comment: comment.trim() || undefined,
        fileName: fileName.trim() || undefined,
      }).unwrap();
    } catch {
      // Xato quyida `error` orqali ko'rsatiladi; forma to'ldirilgancha qoladi.
      return;
    }

    setTitle('');
    setComment('');
    setFileName('');
    onClose();
  }

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(event) => {
        // Fon bosilganda yopiladi: `<dialog>` o'zi butun ekranni egallaydi,
        // shuning uchun bosish nishoni aynan dialog bo'lsa — bu fon.
        if (event.target === dialogRef.current) onClose();
      }}
      className="m-auto w-[min(38rem,calc(100vw-2rem))] rounded-2xl border border-border bg-card p-0 text-card-foreground backdrop:bg-black/50 backdrop:backdrop-blur-sm"
    >
      <form onSubmit={handleSubmit} className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-foreground">Topshiriq yaratish</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Fayl, muddat va izoh — freelancerlar taklif yuboradi.
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Yopish">
            <X className="size-4" />
          </Button>
        </div>

        <div className="mt-5 space-y-4">
          <TextField
            label="Topshiriq nomi"
            required
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Masalan: Kurs ishi — ma'lumotlar bazasi loyihasi"
            maxLength={120}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-foreground">Yo&apos;nalish</span>
              <select
                value={direction}
                onChange={(event) => setDirection(event.target.value as WorkDirectionValue)}
                className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-emerald-500/60"
              >
                {WORK_DIRECTIONS.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-foreground">Muddat</span>
              <select
                value={deadline}
                onChange={(event) => setDeadline(event.target.value)}
                className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-emerald-500/60"
              >
                {DEADLINE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {formatDeadlineDays(option)}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <TextField
            label="Fayl nomi"
            value={fileName}
            onChange={(event) => setFileName(event.target.value)}
            placeholder="topshiriq.pdf"
            hint="Backend ulangach bu yerda haqiqiy fayl yuklash bo'ladi."
          />

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-foreground">Izoh</span>
            <textarea
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              rows={4}
              maxLength={500}
              placeholder="Talablar, hajm, format va boshqa tafsilotlar..."
              className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-emerald-500/60"
            />
            <span className="mt-1 block text-right text-xs text-muted-foreground">
              {comment.length}/500
            </span>
          </label>
        </div>

        {error && (
          <p role="alert" className="mt-4 text-sm text-destructive">
            {getApiErrorMessage(error)}
          </p>
        )}

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Bekor qilish
          </Button>
          <Button type="submit" variant="emerald" disabled={isLoading || !title.trim()}>
            {isLoading ? 'Yuborilmoqda...' : 'Joylashtirish'}
          </Button>
        </div>
      </form>
    </dialog>
  );
}
