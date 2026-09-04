'use client';

import { MessageSquare, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { Button, ButtonLink } from '@/components/ui/Button';
import { interpolate } from '@/i18n/interpolate';
import type { Messages } from '@/i18n/messages/uz';
import { useT } from '@/i18n/useT';
import { getApiErrorMessage } from '@/shared/api/errors';
import type { AssignmentComment } from '@/shared/types/catalogue';
import { useAppSelector } from '@/store/hooks';
import { selectIsAuthenticated } from '@/store/slices/authSlice';

import {
  useDeleteAssignmentCommentMutation,
  useGetAssignmentCommentsQuery,
  usePostAssignmentCommentMutation,
} from './commentsApi';

/** Backenddagi `MAX_COMMENT_LENGTH` bilan bir xil. */
const MAX_LENGTH = 2000;

/**
 * "2 kun oldin" ko'rinishidagi nisbiy vaqt.
 *
 * Aniq sana kerak emas: mavzuda muhimi izoh yangimi yoki eskimi. To'liq
 * sana `title` da qoladi, kimga kerak bo'lsa ko'radi.
 */
function relativeTime(value: string, messages: Messages): string {
  const then = new Date(value).getTime();
  if (Number.isNaN(then)) return '';

  const m = messages.comments;
  const minutes = Math.round((Date.now() - then) / 60000);
  if (minutes < 1) return m.justNow;
  if (minutes < 60) return interpolate(m.minutesAgo, { count: minutes });

  const hours = Math.round(minutes / 60);
  if (hours < 24) return interpolate(m.hoursAgo, { count: hours });

  const days = Math.round(hours / 24);
  if (days < 30) return interpolate(m.daysAgo, { count: days });

  return new Date(value).toLocaleDateString('ru-RU');
}

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  return parts
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join('');
}

function CommentRow({
  comment,
  assignmentId,
}: {
  comment: AssignmentComment;
  assignmentId: string;
}) {
  const { m } = useT();
  const [remove, { isLoading }] = useDeleteAssignmentCommentMutation();
  const name = comment.author.full_name?.trim() || m.comments.anonymous;

  return (
    <li className="flex gap-3 border-b border-border py-3.5 last:border-0">
      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-emerald-500/12 text-xs font-bold text-brand">
        {initialsOf(name)}
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
          <span className="text-[13px] font-semibold text-foreground">{name}</span>
          <span className="text-[11px] text-muted-foreground" title={comment.created_at}>
            {relativeTime(comment.created_at, m)}
          </span>
        </div>

        {/* `whitespace-pre-line` — odam qatorlarga bo'lib yozgan bo'lsa
            shundayligicha qolsin; `break-words` uzun havolani qatordan
            chiqarib yubormasin. */}
        <p className="mt-1 text-sm leading-relaxed break-words whitespace-pre-line text-foreground/90">
          {comment.body}
        </p>
      </div>

      {/*
        O'chirish faqat o'z izohida. Serverda ham tekshiriladi — bu yerdagisi
        boshqa odamning izohida foydasiz tugma turmasligi uchun.
      */}
      {comment.is_mine && (
        <button
          type="button"
          aria-label={m.comments.remove}
          disabled={isLoading}
          onClick={() => void remove({ id: comment.id, assignmentId })}
          className="grid size-7 shrink-0 place-items-center self-start rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:opacity-40"
        >
          <Trash2 className="size-3.5" />
        </button>
      )}
    </li>
  );
}

/**
 * Topshiriq ostidagi ochiq mavzu.
 *
 * Izoh darrov ko'rinadi — moderatsiya keyin bo'ladi. Sabab: moderator
 * yetgunicha to'ladigan mavzu suhbat bo'lishdan to'xtaydi.
 */
export function AssignmentComments({
  assignmentId,
  assignmentTitle,
}: {
  assignmentId: string;
  assignmentTitle: string;
}) {
  const { t, m } = useT();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const [body, setBody] = useState('');

  const { data, isLoading, error } = useGetAssignmentCommentsQuery({
    assignmentId,
    page_size: 50,
  });
  const [post, postState] = usePostAssignmentCommentMutation();

  const comments = data?.results ?? [];
  const trimmed = body.trim();

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!trimmed) return;

    try {
      await post({ assignmentId, body: trimmed }).unwrap();
    } catch {
      // Xato quyida ko'rsatiladi; yozilgan matn saqlanib qoladi.
      return;
    }

    setBody('');
  }

  return (
    <section>
      <div className="flex flex-wrap items-center gap-2">
        <MessageSquare className="size-4 text-brand" />
        <h3 className="text-sm font-semibold text-foreground">{m.comments.title}</h3>
        <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground tabular-nums">
          {data?.count ?? 0}
        </span>
      </div>

      <p className="mt-1 text-xs text-muted-foreground">
        {t((x) => x.comments.lead, { assignment: assignmentTitle })}
      </p>

      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="mt-4">
          <label className="sr-only" htmlFor="comment-body">
            {m.comments.bodyLabel}
          </label>
          <textarea
            id="comment-body"
            rows={3}
            maxLength={MAX_LENGTH}
            value={body}
            onChange={(event) => setBody(event.target.value)}
            placeholder={m.comments.placeholder}
            className="w-full resize-none rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground transition-colors outline-none placeholder:text-muted-foreground/70 focus-visible:border-emerald-500/60 focus-visible:ring-3 focus-visible:ring-emerald-500/20"
          />

          <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
            <span className="text-[11px] text-muted-foreground tabular-nums">
              {body.length} / {MAX_LENGTH}
            </span>
            <Button
              type="submit"
              variant="emerald"
              size="sm"
              disabled={postState.isLoading || !trimmed}
            >
              {postState.isLoading ? m.comments.submitting : m.comments.submit}
            </Button>
          </div>

          {postState.error && (
            <p role="alert" className="mt-2 text-xs text-destructive">
              {getApiErrorMessage(postState.error)}
            </p>
          )}
        </form>
      ) : (
        /*
          Kirmagan odamga forma chizilmaydi: backend 401 qaytaradi va
          yozilgan matn behuda ketardi. Mavzuning O'ZI esa ko'rinadi —
          u katalogning bir qismi.
        */
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-muted/30 px-3.5 py-3">
          <p className="text-sm text-muted-foreground">{m.comments.loginRequired}</p>
          <ButtonLink href="/login" variant="emerald" size="sm">
            {m.header.login}
          </ButtonLink>
        </div>
      )}

      <div className="mt-4">
        {error ? (
          <p role="alert" className="text-sm text-destructive">
            {getApiErrorMessage(error)}
          </p>
        ) : isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }, (_, index) => (
              <div key={index} className="h-16 animate-pulse rounded-xl bg-muted/60" />
            ))}
          </div>
        ) : comments.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border px-4 py-10 text-center">
            <MessageSquare className="mx-auto size-6 text-muted-foreground" />
            <p className="mt-2 text-sm font-medium text-foreground">{m.comments.empty}</p>
            <p className="mt-1 text-xs text-muted-foreground">{m.comments.emptyHint}</p>
          </div>
        ) : (
          <ul>
            {comments.map((comment) => (
              <CommentRow key={comment.id} comment={comment} assignmentId={assignmentId} />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
