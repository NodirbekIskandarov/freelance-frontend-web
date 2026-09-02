'use client';

import { CircleCheck, TriangleAlert, Upload, X } from 'lucide-react';
import { useRef, useState } from 'react';

import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useT } from '@/i18n/useT';
import { cn } from '@/lib/cn';
import { useDates } from '@/lib/useDates';
import { useMoney } from '@/lib/useMoney';
import { useNow } from '@/lib/useNow';
import { getApiErrorMessage } from '@/shared/api/errors';
import { DISPUTE_REASONS, type DisputeReason } from '@/shared/types/disputes';

import { useGetDisputeStatsQuery, useSubmitDisputeMutation } from './disputesApi';

/** Backenddagi `MAX_DISPUTE_EVIDENCE` bilan bir xil. */
const MAX_FILES = 3;
const MAX_FILE_MB = 10;
/** Backenddagi `DISPUTE_AUTHOR_RESPONSE_HOURS`. */
const AUTHOR_HOURS = 12;

/**
 * Qolgan vaqt.
 *
 * Yetti kunlik oynada `168:00` degan yozuv odamga hech nima aytmaydi —
 * bir kundan oshsa kun bilan ko'rsatiladi, oxirgi kunda esa soat:daqiqa
 * bo'lib, sanoq aniq bo'ladi.
 */
function timeLeftLabel(closesAt: number, now: number): string {
  const left = closesAt - now;
  if (left <= 0) return '00:00';

  const hours = Math.floor(left / 3_600_000);
  if (hours >= 24) {
    const days = Math.floor(hours / 24);
    return `${days} kun ${hours % 24} soat`;
  }

  const minutes = Math.floor((left % 3_600_000) / 60_000);
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

/**
 * Xarid bo'yicha shikoyat.
 *
 * Yechim ustidan shikoyatdan («noto'g'ri kontent») ATAYLAB alohida: bu
 * pulga tegadi. Shu sababli oynada nima bo'lishi oldindan yozib qo'yiladi —
 * odam «shikoyat qilsam nima bo'ladi» degan savol bilan qolmasin.
 *
 * Statistika o'lchangan, bezak emas: «shikoyatlarning 64%i xaridor foydasiga
 * hal bo'ladi» — bu shikoyat yozishga arziydimi degan savolga yagona javob.
 */
export function DisputeModal({
  open,
  orderId,
  solutionTitle,
  variantLabel,
  purchasedAt,
  deadline,
  windowHours,
  price,
  onClose,
}: {
  open: boolean;
  orderId: string;
  solutionTitle: string;
  variantLabel?: string;
  purchasedAt: string;
  /** Oynaning yopilish vaqti — serverdan kelgan sana. */
  deadline: string | null;
  /** Shu xaridga berilgan muddat, soatda. */
  windowHours: number | null;
  price: string;
  onClose: () => void;
}) {
  const { t, m } = useT();
  const money = useMoney();
  const dates = useDates();
  const [submit, { isLoading, error, isSuccess, reset }] = useSubmitDisputeMutation();
  const stats = useGetDisputeStatsQuery(undefined, { skip: !open });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [reason, setReason] = useState<DisputeReason | null>(null);
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [touched, setTouched] = useState(false);

  const now = useNow();
  const closesAt = deadline ? new Date(deadline).getTime() : 0;
  const expired = !deadline || closesAt <= now;

  function close() {
    reset();
    setReason(null);
    setDescription('');
    setFiles([]);
    setTouched(false);
    onClose();
  }

  function addFiles(list: FileList | null) {
    if (!list) return;
    const accepted = Array.from(list).filter((file) => file.size <= MAX_FILE_MB * 1024 * 1024);
    setFiles((current) => [...current, ...accepted].slice(0, MAX_FILES));
    // Bir xil faylni qayta tanlash uchun: qiymat tozalanmasa `change`
    // hodisasi umuman chiqmaydi.
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setTouched(true);
    if (!reason || !description.trim()) return;

    try {
      await submit({
        order: orderId,
        reason,
        description: description.trim(),
        ...(files.length ? { evidence: files } : {}),
      }).unwrap();
    } catch {
      return;
    }
  }

  const reasonError = touched && !reason ? m.dispute.reasonRequired : undefined;
  const commentError = touched && !description.trim() ? m.dispute.commentRequired : undefined;

  const steps = [
    { key: 'hold', ...m.dispute.steps.hold },
    {
      key: 'author',
      title: t((x) => x.dispute.steps.author.title, { hours: AUTHOR_HOURS }),
      text: m.dispute.steps.author.text,
    },
    { key: 'moderator', ...m.dispute.steps.moderator },
    { key: 'result', ...m.dispute.steps.result },
  ];

  return (
    <Modal
      open={open}
      onClose={close}
      title={isSuccess ? m.dispute.sentTitle : m.dispute.title}
      className="w-[min(58rem,calc(100vw-2rem))]"
      footer={
        isSuccess ? (
          <Button variant="emerald" onClick={close}>
            {m.common.close}
          </Button>
        ) : (
          <>
            <Button variant="outline" onClick={close}>
              {m.common.cancel}
            </Button>
            <Button
              type="submit"
              form="dispute-form"
              variant="emerald"
              disabled={isLoading || expired}
            >
              {isLoading ? m.dispute.submitting : m.dispute.submit}
            </Button>
          </>
        )
      }
    >
      {isSuccess ? (
        <div className="flex flex-col items-center py-4 text-center">
          <CircleCheck className="size-10 text-emerald-600 dark:text-emerald-400" />
          <p className="mt-3 text-sm font-medium text-foreground">{solutionTitle}</p>
          <p className="mt-1 max-w-md text-sm text-muted-foreground">{m.dispute.sentText}</p>
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_16rem]">
          <form id="dispute-form" onSubmit={handleSubmit} className="space-y-5">
            {/* Muddat SERVERDAN. Bir kundan uzun bo'lsa kunda aytiladi:
                «168 soat ichida» ni odam o'zi bo'lishga majbur bo'lardi. */}
            <p className="text-sm leading-relaxed text-muted-foreground">
              {windowHours && windowHours >= 48
                ? t((x) => x.dispute.introDays, { days: Math.round(windowHours / 24) })
                : t((x) => x.dispute.intro, { hours: windowHours ?? 24 })}
            </p>

            {/* Qaysi xarid — va qancha vaqt qolgani. Muddat o'tsa forma
                yuborilmaydi va buni bosishdan oldin ko'rsatish kerak. */}
            <div className="flex flex-wrap items-start justify-between gap-3 rounded-xl border border-border/70 bg-muted/20 p-3.5">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">
                  {[solutionTitle, variantLabel].filter(Boolean).join(' · ')}
                </p>
                {/* Sana ham: bir xil yechimni ikki marta olgan odam qaysi
                    xaridga shikoyat qilayotganini shundan ajratadi. */}
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {dates.dateTime(purchasedAt)} · {money.decimalSom(price)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
                  {m.dispute.timeLeft}
                </p>
                <p
                  className={cn(
                    'text-lg font-bold tabular-nums',
                    expired ? 'text-destructive' : 'text-foreground',
                  )}
                >
                  {expired ? m.dispute.windowClosed : timeLeftLabel(closesAt, now)}
                </p>
              </div>
            </div>

            <fieldset>
              <legend className="mb-2 text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
                1 · {m.dispute.reasonSection}
              </legend>

              <div className="space-y-2">
                {DISPUTE_REASONS.map((option) => {
                  const entry = m.dispute.reasons[option];
                  const isSelected = reason === option;
                  return (
                    <label
                      key={option}
                      className={cn(
                        'flex cursor-pointer items-start gap-3 rounded-xl border px-3.5 py-3 transition-colors',
                        isSelected
                          ? 'border-emerald-500/60 bg-emerald-500/[0.06]'
                          : 'border-border/70 hover:bg-muted/50',
                      )}
                    >
                      <input
                        type="radio"
                        name="dispute-reason"
                        className="mt-0.5 accent-emerald-600"
                        checked={isSelected}
                        onChange={() => setReason(option)}
                      />
                      <span className="min-w-0">
                        <span className="block text-sm font-medium text-foreground">
                          {entry.title}
                        </span>
                        <span className="block text-xs text-muted-foreground">{entry.hint}</span>
                      </span>
                    </label>
                  );
                })}
              </div>
              {reasonError && <p className="mt-1.5 text-xs text-destructive">{reasonError}</p>}
            </fieldset>

            <div>
              <label
                htmlFor="dispute-comment"
                className="mb-2 block text-[11px] font-medium tracking-wider text-muted-foreground uppercase"
              >
                2 · {m.dispute.commentSection}
              </label>
              <textarea
                id="dispute-comment"
                rows={4}
                maxLength={2000}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder={m.dispute.commentPlaceholder}
                className="w-full resize-none rounded-xl border border-border/70 bg-background px-3 py-2.5 text-sm text-foreground transition-colors outline-none placeholder:text-muted-foreground/70 focus-visible:border-emerald-500/60 focus-visible:ring-3 focus-visible:ring-emerald-500/20"
              />
              {commentError && <p className="mt-1.5 text-xs text-destructive">{commentError}</p>}
            </div>

            <div>
              <p className="mb-2 text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
                3 · {m.dispute.evidenceSection}
              </p>

              <input
                id="dispute-evidence"
                ref={fileInputRef}
                type="file"
                multiple
                accept=".png,.jpg,.jpeg,.pdf"
                className="sr-only"
                onChange={(event) => addFiles(event.target.files)}
              />

              <label
                htmlFor="dispute-evidence"
                className="flex cursor-pointer flex-col items-center gap-1 rounded-xl border border-dashed border-border/70 px-4 py-6 text-center transition-colors hover:bg-muted/40"
              >
                <Upload className="size-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">
                  {m.dispute.evidenceDrop}
                </span>
                <span className="text-xs text-muted-foreground">
                  {t((x) => x.dispute.evidenceHint, { max: MAX_FILE_MB, count: MAX_FILES })}
                </span>
              </label>

              {files.length > 0 && (
                <ul className="mt-2 space-y-1.5">
                  {files.map((file, index) => (
                    <li
                      key={`${file.name}-${index}`}
                      className="flex items-center gap-2 rounded-lg border border-border/70 px-3 py-2"
                    >
                      <span className="min-w-0 flex-1 truncate text-xs text-foreground">
                        {file.name}
                      </span>
                      <button
                        type="button"
                        aria-label={m.dispute.removeFile}
                        onClick={() =>
                          setFiles((current) => current.filter((_, at) => at !== index))
                        }
                        className="grid size-6 shrink-0 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      >
                        <X className="size-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <p className="flex items-start gap-2 rounded-xl border border-amber-500/40 bg-amber-500/[0.06] px-3.5 py-3 text-xs leading-relaxed text-amber-800 dark:text-amber-300">
              <TriangleAlert className="mt-0.5 size-3.5 shrink-0" />
              {t((x) => x.dispute.warning, { count: 3, days: 30 })}
            </p>

            {error && (
              <p role="alert" className="text-xs text-destructive">
                {getApiErrorMessage(error)}
              </p>
            )}
          </form>

          <aside className="space-y-4">
            <div className="rounded-xl border border-border/70 p-4">
              <p className="text-sm font-semibold text-foreground">{m.dispute.nextTitle}</p>
              <ol className="mt-3 space-y-3">
                {steps.map((step, index) => (
                  <li key={step.key} className="flex gap-2.5">
                    <span
                      className={cn(
                        'grid size-5 shrink-0 place-items-center rounded-full text-[10px] font-bold',
                        index === 0
                          ? 'bg-emerald-600 text-white'
                          : 'bg-muted text-muted-foreground',
                      )}
                    >
                      {index + 1}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-xs font-medium text-foreground">
                        {step.title}
                      </span>
                      <span className="block text-xs leading-relaxed text-muted-foreground">
                        {step.text}
                      </span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Faqat o'lchangan raqamlar bo'lsa chiziladi: bo'sh platformada
                «0.0%» uchtasi hech nima aytmaydi. */}
            {stats.data && stats.data.total > 0 && (
              <div className="rounded-xl bg-foreground p-4 text-background">
                <p className="text-[10px] font-medium tracking-wider uppercase opacity-70">
                  {m.dispute.statsTitle}
                </p>
                <dl className="mt-3 space-y-3">
                  <div>
                    <dt className="text-lg font-bold">{stats.data.dispute_rate}%</dt>
                    <dd className="text-xs opacity-70">{m.dispute.statRate}</dd>
                  </div>
                  <div>
                    <dt className="text-lg font-bold">~{stats.data.average_hours} soat</dt>
                    <dd className="text-xs opacity-70">{m.dispute.statHours}</dd>
                  </div>
                  <div>
                    <dt className="text-lg font-bold">{stats.data.buyer_favoured_percent}%</dt>
                    <dd className="text-xs opacity-70">{m.dispute.statFavour}</dd>
                  </div>
                </dl>
              </div>
            )}
          </aside>
        </div>
      )}
    </Modal>
  );
}
