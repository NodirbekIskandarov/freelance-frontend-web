'use client';

import { MessageSquareReply, ShieldAlert } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/Button';
import { useT } from '@/i18n/useT';
import { cn } from '@/lib/cn';
import { useDates } from '@/lib/useDates';
import { useMoney } from '@/lib/useMoney';
import { useNow } from '@/lib/useNow';
import { getApiErrorMessage } from '@/shared/api/errors';
import { disputeReasonLabel, disputeStatusLabel, type Dispute } from '@/shared/types/disputes';

import { useGetDisputesAgainstMeQuery, useRespondToDisputeMutation } from './disputesApi';

/**
 * Muallifga kelgan shikoyatlar — va javob berish joyi.
 *
 * Xaridorga «muallifga 12 soat beriladi» deb va'da qilinadi; o'sha javobni
 * yozadigan ekran bo'lmasa, va'da bajarilmasdi va moderator har doim bir
 * tomonning gapiga qarab qaror qabul qilardi.
 *
 * Muddat o'tgandan keyin ham yozish mumkin: kechikkan javob moderator uchun
 * javobsizlikdan qimmatroq. Faqat qaror chiqqach yopiladi.
 */
export function DisputesAgainstMe() {
  const { t, m } = useT();
  const money = useMoney();
  const dates = useDates();
  const now = useNow();
  const { data } = useGetDisputesAgainstMeQuery();
  const [respond, { isLoading, error }] = useRespondToDisputeMutation();

  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [text, setText] = useState('');

  // Ochilmagan shikoyatlar tepada: qaror chiqqanlari tarix, javob
  // kutayotganlari esa ish.
  const rows = [...(data?.results ?? [])].sort((a, b) => {
    const openA = a.status === 'pending' || a.status === 'answered' ? 0 : 1;
    const openB = b.status === 'pending' || b.status === 'answered' ? 0 : 1;
    return openA - openB;
  });

  if (rows.length === 0) return null;

  async function submit(dispute: Dispute) {
    if (!text.trim()) return;
    try {
      await respond({ id: dispute.id, text: text.trim() }).unwrap();
    } catch {
      return;
    }
    setReplyTo(null);
    setText('');
  }

  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <p className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
        <ShieldAlert className="size-3.5 text-destructive" />
        {m.dispute.againstMeTitle}
      </p>
      <p className="mt-1 max-w-xl text-xs leading-relaxed text-muted-foreground">
        {m.dispute.againstMeIntro}
      </p>

      <ul className="mt-4 space-y-3">
        {rows.map((dispute) => {
          const open = dispute.status === 'pending' || dispute.status === 'answered';
          const overdue = new Date(dispute.respond_deadline).getTime() <= now;

          return (
            <li key={dispute.id} className="rounded-xl border border-border p-3.5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">
                    {dispute.solution_title}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {disputeReasonLabel(dispute.reason, m)} · {money.decimalSom(dispute.unit_price)}
                  </p>
                </div>
                <span
                  className={cn(
                    'shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium',
                    open
                      ? 'bg-amber-500/12 text-amber-700 dark:text-amber-300'
                      : 'bg-muted text-muted-foreground',
                  )}
                >
                  {disputeStatusLabel(dispute.status, m)}
                </span>
              </div>

              <blockquote className="mt-3 border-l-2 border-border pl-3 text-xs leading-relaxed whitespace-pre-line text-muted-foreground">
                {dispute.description}
              </blockquote>

              {dispute.author_response ? (
                <p className="mt-3 rounded-lg bg-muted/40 px-3 py-2 text-xs leading-relaxed whitespace-pre-line text-foreground">
                  {dispute.author_response}
                </p>
              ) : open ? (
                replyTo === dispute.id ? (
                  <div className="mt-3">
                    <textarea
                      rows={3}
                      maxLength={2000}
                      autoFocus
                      value={text}
                      onChange={(event) => setText(event.target.value)}
                      placeholder={m.dispute.replyPlaceholder}
                      className="w-full resize-none rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground transition-colors outline-none placeholder:text-muted-foreground/70 focus-visible:border-emerald-500/60 focus-visible:ring-3 focus-visible:ring-emerald-500/20"
                    />
                    {error && (
                      <p role="alert" className="mt-1.5 text-xs text-destructive">
                        {getApiErrorMessage(error)}
                      </p>
                    )}
                    <div className="mt-2 flex gap-2">
                      <Button
                        variant="emerald"
                        size="sm"
                        disabled={isLoading || !text.trim()}
                        onClick={() => void submit(dispute)}
                      >
                        {isLoading ? m.dispute.replySending : m.dispute.replySend}
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setReplyTo(null)}>
                        {m.common.cancel}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setReplyTo(dispute.id);
                        setText('');
                      }}
                    >
                      <MessageSquareReply className="size-3.5" />
                      {m.dispute.reply}
                    </Button>
                    {/* Muddat o'tgani — javobni to'sish emas, ogohlantirish:
                        moderator endi kutmasdan qaror qabul qilishi mumkin. */}
                    <span
                      className={cn(
                        'text-xs',
                        overdue ? 'text-destructive' : 'text-muted-foreground',
                      )}
                    >
                      {overdue
                        ? m.dispute.replyOverdue
                        : t((x) => x.dispute.replyDeadline, {
                            date: dates.dateTime(dispute.respond_deadline),
                          })}
                    </span>
                  </div>
                )
              ) : null}

              {dispute.resolution && (
                <p className="mt-3 text-xs text-muted-foreground">
                  {t((x) => x.dispute.refunded, {
                    amount: money.decimalSom(dispute.refunded_amount),
                  })}
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
