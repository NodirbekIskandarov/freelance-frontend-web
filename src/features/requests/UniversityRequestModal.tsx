'use client';

import { CircleCheck } from 'lucide-react';
import { useState } from 'react';

import { Button, ButtonLink } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useT } from '@/i18n/useT';
import { cn } from '@/lib/cn';
import { getApiErrorMessage } from '@/shared/api/errors';
import { useAppSelector } from '@/store/hooks';
import { selectIsAuthenticated } from '@/store/slices/authSlice';

import { useSubmitUniversityRequestMutation } from './requestsApi';

const fieldClass =
  'w-full rounded-xl border border-border/70 bg-background px-3 text-sm text-foreground transition-colors outline-none placeholder:text-muted-foreground/70 focus-visible:border-emerald-500/60 focus-visible:ring-3 focus-visible:ring-emerald-500/20';

function FieldLabel({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-foreground">
      {children}
    </label>
  );
}

/**
 * "Institutim ro'yxatda yo'q" arizasi.
 *
 * Endpoint ancha vaqtdan beri bor edi, lekin saytda uni chaqiradigan joy
 * yo'q edi: katalogda o'z institutini topmagan odam boshi berk ko'chaga
 * kirardi. Forma katalogning O'ZIDA — muammo aynan shu yerda paydo
 * bo'ladi.
 *
 * Kirmagan foydalanuvchiga forma umuman chizilmaydi: backend 401
 * qaytaradi va bu tushunarsiz xato bo'lardi.
 */
export function UniversityRequestModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const { m } = useT();
  const [submit, { isLoading, error, reset }] = useSubmitUniversityRequestMutation();

  const [name, setName] = useState('');
  const [shortName, setShortName] = useState('');
  const [city, setCity] = useState('');
  const [comment, setComment] = useState('');
  const [done, setDone] = useState(false);

  function close() {
    reset();
    setDone(false);
    onClose();
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    try {
      await submit({
        name: name.trim(),
        ...(shortName.trim() ? { short_name: shortName.trim() } : {}),
        ...(city.trim() ? { city: city.trim() } : {}),
        ...(comment.trim() ? { comment: comment.trim() } : {}),
      }).unwrap();
    } catch {
      return;
    }

    setName('');
    setShortName('');
    setCity('');
    setComment('');
    setDone(true);
  }

  return (
    <Modal
      open={open}
      onClose={close}
      title={m.requests.universityTitle}
      description={m.requests.universityDesc}
      footer={
        done ? (
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
              form="university-request-form"
              variant="emerald"
              disabled={isLoading || !name.trim()}
            >
              {isLoading ? m.requests.submitting : m.requests.submit}
            </Button>
          </>
        ) : undefined
      }
    >
      {done ? (
        <div className="flex flex-col items-center py-4 text-center">
          <CircleCheck className="size-10 text-emerald-600 dark:text-emerald-400" />
          <p className="mt-3 text-sm font-medium text-foreground">{m.requests.sentTitle}</p>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            {m.requests.universitySentText}
          </p>
        </div>
      ) : !isAuthenticated ? (
        <div className="py-2">
          <p className="text-sm text-muted-foreground">{m.requests.universityLoginRequired}</p>
          <ButtonLink href="/login" variant="emerald" className="mt-4">
            {m.header.login}
          </ButtonLink>
        </div>
      ) : (
        <form id="university-request-form" onSubmit={handleSubmit} className="space-y-4">
          <div>
            <FieldLabel htmlFor="university-request-name">{m.requests.universityName}</FieldLabel>
            <input
              id="university-request-name"
              required
              maxLength={255}
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder={m.requests.universityNamePlaceholder}
              className={cn(fieldClass, 'h-11')}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel htmlFor="university-request-short">
                {m.requests.universityShortName}
              </FieldLabel>
              <input
                id="university-request-short"
                maxLength={64}
                value={shortName}
                onChange={(event) => setShortName(event.target.value)}
                placeholder={m.requests.universityShortPlaceholder}
                className={cn(fieldClass, 'h-11')}
              />
            </div>

            <div>
              <FieldLabel htmlFor="university-request-city">{m.requests.universityCity}</FieldLabel>
              <input
                id="university-request-city"
                maxLength={128}
                value={city}
                onChange={(event) => setCity(event.target.value)}
                placeholder={m.requests.universityCityPlaceholder}
                className={cn(fieldClass, 'h-11')}
              />
            </div>
          </div>

          <div>
            <FieldLabel htmlFor="university-request-comment">{m.requests.extraNote}</FieldLabel>
            <textarea
              id="university-request-comment"
              rows={3}
              maxLength={2000}
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              placeholder={m.requests.extraNotePlaceholder}
              className={cn(fieldClass, 'resize-none py-2.5')}
            />
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
