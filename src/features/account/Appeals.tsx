'use client';

import { MessageSquarePlus } from 'lucide-react';
import { useState, type FormEvent } from 'react';

import { Button } from '@/components/ui/Button';
import { ErrorNotice } from '@/components/ui/ErrorNotice';
import { TextAreaField, TextField } from '@/components/ui/Field';
import { cn } from '@/lib/cn';
import { getApiErrorMessage } from '@/shared/api/errors';
import { APPEAL_STATUS_LABELS, type AppealStatus } from '@/shared/types/account';

import { useCreateAppealMutation, useGetAppealsQuery } from './accountApi';

const statusTones: Record<AppealStatus, string> = {
  open: 'bg-sky-500/12 text-sky-700 dark:text-sky-400',
  in_review: 'bg-amber-500/12 text-amber-700 dark:text-amber-400',
  resolved: 'bg-emerald-500/12 text-emerald-700 dark:text-emerald-400',
};

export function Appeals() {
  const { data, isLoading, error } = useGetAppealsQuery();
  const [createAppeal, { isLoading: isSending, error: createError }] = useCreateAppealMutation();

  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      await createAppeal({ subject: subject.trim(), message: message.trim() }).unwrap();
    } catch {
      // Xato quyida ko'rsatiladi; yozilgan matn formada qoladi.
      return;
    }

    setSubject('');
    setMessage('');
  }

  return (
    <>
      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <h2 className="flex items-center gap-2 text-base font-semibold text-foreground">
          <MessageSquarePlus className="size-4 text-emerald-600 dark:text-emerald-400" />
          Yangi murojaat
        </h2>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <TextField
            label="Mavzu"
            required
            maxLength={120}
            placeholder="Masalan: To'lov tasdiqlanmadi"
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
          />

          <TextAreaField
            label="Xabar"
            required
            rows={4}
            maxLength={1000}
            placeholder="Muammoni batafsil yozing — buyurtma raqami bo'lsa uni ham qo'shing."
            value={message}
            onChange={(event) => setMessage(event.target.value)}
          />

          {createError && (
            <p role="alert" className="text-sm text-destructive">
              {getApiErrorMessage(createError)}
            </p>
          )}

          <Button
            type="submit"
            variant="emerald"
            disabled={isSending || !subject.trim() || !message.trim()}
          >
            {isSending ? 'Yuborilmoqda...' : 'Yuborish'}
          </Button>
        </form>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-bold text-foreground">Murojaatlarim</h2>

        {error ? (
          <div className="mt-4">
            <ErrorNotice error={error} />
          </div>
        ) : isLoading || !data ? (
          <div className="mt-4 grid gap-3">
            {Array.from({ length: 2 }, (_, index) => (
              <div key={index} className="h-28 animate-pulse rounded-xl bg-muted" />
            ))}
          </div>
        ) : data.length === 0 ? (
          <p className="mt-4 rounded-xl border border-dashed border-border px-6 py-16 text-center text-sm text-muted-foreground">
            Hali murojaat yo&apos;q.
          </p>
        ) : (
          <div className="mt-4 grid gap-3">
            {data.map((appeal) => (
              <article
                key={appeal.id}
                className="rounded-xl border border-border/60 bg-background p-4 dark:border-zinc-800 dark:bg-zinc-900/70"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-foreground">{appeal.subject}</h3>
                    <p className="mt-0.5 font-mono text-xs text-muted-foreground/80">
                      {appeal.reference} &middot; {appeal.createdAt}
                    </p>
                  </div>
                  <span
                    className={cn(
                      'inline-flex rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap',
                      statusTones[appeal.status],
                    )}
                  >
                    {APPEAL_STATUS_LABELS[appeal.status]}
                  </span>
                </div>

                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {appeal.message}
                </p>

                {appeal.reply && (
                  <div className="mt-3 rounded-lg border-l-2 border-emerald-500 bg-emerald-500/5 py-2.5 pr-3 pl-3">
                    <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                      Qo&apos;llab-quvvatlash javobi
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {appeal.reply}
                    </p>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
