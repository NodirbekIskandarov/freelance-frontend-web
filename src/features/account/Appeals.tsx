'use client';

import { MessageSquarePlus } from 'lucide-react';
import { useState, type FormEvent } from 'react';

import { Button } from '@/components/ui/Button';
import { ErrorNotice } from '@/components/ui/ErrorNotice';
import { TextAreaField, TextField } from '@/components/ui/Field';
import { cn } from '@/lib/cn';
import { getApiErrorMessage } from '@/shared/api/errors';
import {
  appealStatusLabel,
  appealTopicLabel,
  APPEAL_TOPICS,
  type AppealStatus,
  type AppealTopic,
} from '@/shared/types/account';

import { useCreateAppealMutation, useGetAppealsQuery } from './accountApi';
import { useT } from '@/i18n/useT';

const statusTones: Record<AppealStatus, string> = {
  open: 'bg-sky-500/12 text-sky-700 dark:text-sky-400',
  in_review: 'bg-amber-500/12 text-amber-700 dark:text-amber-400',
  resolved: 'bg-emerald-500/12 text-emerald-700 dark:text-emerald-400',
};

function formatDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString('ru-RU').slice(0, 16);
}

export function Appeals() {
  const { m } = useT();
  const { data, isLoading, error } = useGetAppealsQuery({ page_size: 30 });
  const [createAppeal, { isLoading: isSending, error: createError }] = useCreateAppealMutation();

  const [topic, setTopic] = useState<AppealTopic>('other');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      await createAppeal({ topic, subject: subject.trim(), message: message.trim() }).unwrap();
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
          {m.appeals.newAppeal}
        </h2>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-foreground">
              {m.appeals.topicKind}
            </span>
            <select
              value={topic}
              onChange={(event) => setTopic(event.target.value as AppealTopic)}
              className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground"
            >
              {APPEAL_TOPICS.map((item) => (
                <option key={item} value={item}>
                  {appealTopicLabel(item, m)}
                </option>
              ))}
            </select>
          </label>

          <TextField
            label={m.appeals.subject}
            required
            maxLength={120}
            placeholder={m.appeals.subjectPlaceholder}
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
          />

          <TextAreaField
            label={m.appeals.message}
            required
            rows={4}
            maxLength={2000}
            placeholder={m.appeals.messagePlaceholder}
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
            {isSending ? m.appeals.sending : m.appeals.send}
          </Button>
        </form>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-bold text-foreground">{m.appeals.mine}</h2>

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
        ) : data.results.length === 0 ? (
          <p className="mt-4 rounded-xl border border-dashed border-border px-6 py-16 text-center text-sm text-muted-foreground">
            {m.appeals.empty}
          </p>
        ) : (
          <div className="mt-4 grid gap-3">
            {data.results.map((appeal) => (
              <article
                key={appeal.id}
                className="rounded-xl border border-border/60 bg-background p-4 dark:border-zinc-800 dark:bg-zinc-900/70"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-foreground">{appeal.subject}</h3>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {appealTopicLabel(appeal.topic, m) ?? appeal.topic}
                    </p>
                    <p className="mt-0.5 font-mono text-xs text-muted-foreground/80">
                      {appeal.reference} &middot; {formatDate(appeal.created_at)}
                    </p>
                  </div>
                  <span
                    className={cn(
                      'inline-flex rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap',
                      statusTones[appeal.status],
                    )}
                  >
                    {appealStatusLabel(appeal.status, m)}
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
