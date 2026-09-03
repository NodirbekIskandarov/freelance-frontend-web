'use client';

import { CircleCheck, Paperclip, X } from 'lucide-react';
import { useRef, useState, type ChangeEvent, type DragEvent } from 'react';

import { Button, ButtonLink } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useT } from '@/i18n/useT';
import { cn } from '@/lib/cn';
import { getApiErrorMessage } from '@/shared/api/errors';
import { appealTopicLabel, APPEAL_TOPICS, type AppealTopic } from '@/shared/types/account';
import { useAppSelector } from '@/store/hooks';
import { selectIsAuthenticated } from '@/store/slices/authSlice';

import { useCreateAppealMutation } from './accountApi';

/** Xabar uzunligi — backend chegarasi bilan bir xil. */
const MAX_MESSAGE = 5000;

/**
 * Skrinshot uchun bemalol yetadigan chegara.
 *
 * Server 50 MB gacha qabul qiladi, lekin murojaatga 10 MB'dan katta
 * rasm biriktirilishi deyarli har doim xato — foydalanuvchi buni
 * yuborishdan OLDIN bilgani yaxshi.
 */
const MAX_FILE_BYTES = 10 * 1024 * 1024;

const ACCEPT = 'image/png,image/jpeg,application/pdf';

/**
 * Mavzu — sarlavhaning O'RNIGA.
 *
 * Backend `subject` talab qiladi, forma esa uni so'ramaydi: odam
 * muammoni bir marta yozadi, ikki marta emas. Navbatda qator o'qilishi
 * uchun sarlavha xabarning birinchi satridan olinadi — bu operatorga
 * mavzu nomining o'nlab marta takrorlanishidan ko'ra ko'proq narsa
 * aytadi.
 */
function subjectFrom(message: string, fallback: string): string {
  const firstLine = message.trim().split('\n')[0]?.trim() ?? '';
  if (!firstLine) return fallback;
  return firstLine.length > 80 ? `${firstLine.slice(0, 77)}…` : firstLine;
}

export function AppealModal({
  open,
  onClose,
  topic: initialTopic = 'other',
  attachmentLimit,
}: {
  open: boolean;
  onClose: () => void;
  /** Yordam bo'limidan ochilganda mavzu oldindan tanlangan bo'ladi. */
  topic?: AppealTopic;
  attachmentLimit: number;
}) {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const { t, m } = useT();
  const [createAppeal, { isLoading, error, reset }] = useCreateAppealMutation();
  const fileInput = useRef<HTMLInputElement>(null);

  const [topic, setTopic] = useState<AppealTopic>(initialTopic);
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState('');
  const [reference, setReference] = useState('');

  function close() {
    reset();
    setReference('');
    onClose();
  }

  function addFiles(incoming: FileList | null) {
    if (!incoming?.length) return;

    const accepted: File[] = [];
    let rejected = '';

    for (const file of Array.from(incoming)) {
      if (file.size > MAX_FILE_BYTES) {
        rejected = t((x) => x.appeals.fileTooBig, { name: file.name });
        continue;
      }
      accepted.push(file);
    }

    setFileError(rejected);
    setFiles((current) => [...current, ...accepted].slice(0, attachmentLimit));
  }

  function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    addFiles(event.dataTransfer.files);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const body = message.trim();
    if (!body) return;

    try {
      const appeal = await createAppeal({
        topic,
        subject: subjectFrom(body, appealTopicLabel(topic, m)),
        message: body,
        ...(files.length ? { attachments: files } : {}),
      }).unwrap();

      setReference(appeal.reference);
    } catch {
      // Xato quyida ko'rsatiladi; yozilgan matn formada qoladi.
      return;
    }

    setMessage('');
    setFiles([]);
    setFileError('');
  }

  return (
    <Modal
      open={open}
      onClose={close}
      title={m.appeals.newAppeal}
      description={m.appeals.modalLead}
      footer={
        reference ? (
          <Button variant="emerald" onClick={close}>
            {m.common.close}
          </Button>
        ) : isAuthenticated ? (
          <>
            <Button variant="outline" onClick={close}>
              {m.common.cancel}
            </Button>
            <Button
              type="submit"
              form="appeal-form"
              variant="emerald"
              disabled={isLoading || !message.trim()}
            >
              {isLoading ? m.requests.submitting : m.appeals.send}
            </Button>
          </>
        ) : undefined
      }
    >
      {reference ? (
        <div className="flex flex-col items-center py-4 text-center">
          <CircleCheck className="size-10 text-emerald-600 dark:text-emerald-400" />
          <p className="mt-3 text-sm font-medium text-foreground">{m.appeals.sentTitle}</p>
          {/* Raqam FAQAT yuborilgandan keyin: uni oldindan ko'rsatish
              hali mavjud bo'lmagan murojaatning nomerini aytish bo'lardi. */}
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            {t((x) => x.appeals.sentText, { reference })}
          </p>
          <ButtonLink href="/appeals" variant="outline" className="mt-4">
            {m.appeals.myAppeals}
          </ButtonLink>
        </div>
      ) : !isAuthenticated ? (
        <div className="py-2">
          <p className="text-sm text-muted-foreground">{m.appeals.loginRequired}</p>
          <ButtonLink href="/login" variant="emerald" className="mt-4">
            {m.header.login}
          </ButtonLink>
        </div>
      ) : (
        <form id="appeal-form" onSubmit={handleSubmit} className="space-y-5">
          <fieldset>
            <legend className="mb-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              {m.appeals.topicKind}
            </legend>
            <div className="flex flex-wrap gap-2">
              {APPEAL_TOPICS.map((value) => {
                const active = topic === value;

                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setTopic(value)}
                    aria-pressed={active}
                    className={cn(
                      'inline-flex h-10 items-center rounded-xl border px-3 text-sm font-medium transition-colors',
                      active
                        ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                        : 'border-border/70 text-muted-foreground hover:text-foreground',
                    )}
                  >
                    {appealTopicLabel(value, m)}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div>
            <div className="mb-2 flex items-baseline justify-between gap-2">
              <label
                htmlFor="appeal-message"
                className="text-xs font-semibold tracking-wider text-muted-foreground uppercase"
              >
                {m.appeals.describe}
              </label>
              <span className="text-[11px] text-muted-foreground tabular-nums">
                {message.length} / {MAX_MESSAGE}
              </span>
            </div>
            <textarea
              id="appeal-message"
              required
              rows={5}
              maxLength={MAX_MESSAGE}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder={m.appeals.describePlaceholder}
              className="w-full resize-none rounded-xl border border-border/70 bg-background px-3 py-2.5 text-sm text-foreground transition-colors outline-none placeholder:text-muted-foreground/70 focus-visible:border-emerald-500/60 focus-visible:ring-3 focus-visible:ring-emerald-500/20"
            />
            <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
              {m.appeals.describeHint}
            </p>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              {m.appeals.attach}
            </p>

            <div
              onDrop={onDrop}
              onDragOver={(event) => event.preventDefault()}
              className="rounded-xl border border-dashed border-border/80 px-4 py-5 text-center"
            >
              <button
                type="button"
                onClick={() => fileInput.current?.click()}
                disabled={files.length >= attachmentLimit}
                className="text-sm font-semibold text-foreground disabled:opacity-40"
              >
                {m.appeals.attachAction}
              </button>
              <p className="mt-1 text-[11px] text-muted-foreground">
                {t((x) => x.appeals.attachHint, { limit: attachmentLimit })}
              </p>
              <input
                ref={fileInput}
                type="file"
                accept={ACCEPT}
                multiple
                className="hidden"
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  addFiles(event.target.files);
                  // Bir xil faylni ikkinchi marta tanlash ham `change`
                  // hodisasini bersin.
                  event.target.value = '';
                }}
              />
            </div>

            {files.length > 0 && (
              <ul className="mt-2 space-y-1.5">
                {files.map((file, index) => (
                  <li
                    key={`${file.name}-${index}`}
                    className="flex items-center gap-2 rounded-lg bg-muted/50 px-2.5 py-1.5"
                  >
                    <Paperclip className="size-3.5 shrink-0 text-muted-foreground" />
                    <span className="min-w-0 flex-1 truncate text-xs text-foreground">
                      {file.name}
                    </span>
                    <button
                      type="button"
                      aria-label={m.appeals.removeFile}
                      onClick={() => setFiles((current) => current.filter((_, i) => i !== index))}
                      className="grid size-6 shrink-0 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      <X className="size-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {fileError && (
              <p role="alert" className="mt-2 text-xs text-destructive">
                {fileError}
              </p>
            )}
          </div>

          {error && (
            <p role="alert" className="text-sm text-destructive">
              {getApiErrorMessage(error)}
            </p>
          )}
        </form>
      )}
    </Modal>
  );
}
