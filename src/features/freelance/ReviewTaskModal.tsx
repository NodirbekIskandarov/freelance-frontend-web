'use client';

import { Star } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/Button';
import { TextAreaField } from '@/components/ui/Field';
import { Modal } from '@/components/ui/Modal';
import { cn } from '@/lib/cn';
import { getApiErrorMessage } from '@/shared/api/errors';
import type { ExchangeTask } from '@/shared/types/exchange';

import { useReviewTaskMutation } from './exchangeApi';
import { useT } from '@/i18n/useT';

const RATINGS = [1, 2, 3, 4, 5] as const;

export function ReviewTaskModal({
  task,
  onClose,
}: {
  task: ExchangeTask | null;
  onClose: () => void;
}) {
  const { m } = useT();
  const [reviewTask, { isLoading, error, reset }] = useReviewTaskMutation();
  const [rating, setRating] = useState(5);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState('');

  function close() {
    setRating(5);
    setHovered(0);
    setComment('');
    reset();
    onClose();
  }

  async function submit() {
    if (!task) return;

    try {
      await reviewTask({
        taskId: task.id,
        freelancerId: task.freelancer?.id,
        rating,
        ...(comment.trim() ? { comment: comment.trim() } : {}),
      }).unwrap();
    } catch {
      return;
    }

    close();
  }

  return (
    <Modal
      open={task !== null}
      onClose={close}
      title="Bajaruvchini baholash"
      description={task?.freelancer?.full_name ?? task?.title}
      footer={
        <>
          <Button variant="outline" onClick={close}>
            {m.common.cancel}
          </Button>
          <Button variant="emerald" disabled={isLoading} onClick={() => void submit()}>
            {isLoading ? m.exchange.sending : m.exchange.send}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <span className="mb-2 block text-sm font-medium text-foreground">Baho</span>
          <div className="flex items-center gap-1" onMouseLeave={() => setHovered(0)}>
            {RATINGS.map((value) => (
              <button
                key={value}
                type="button"
                aria-label={`${value} yulduz`}
                aria-pressed={rating === value}
                onMouseEnter={() => setHovered(value)}
                onClick={() => setRating(value)}
                className="p-0.5"
              >
                <Star
                  className={cn(
                    'size-7 transition-colors',
                    // Sichqoncha ustida turganda oldindan ko'rsatiladi,
                    // aks holda tanlangan baho ko'rinadi.
                    value <= (hovered || rating)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-muted-foreground/40',
                  )}
                />
              </button>
            ))}
          </div>
        </div>

        <TextAreaField
          label={m.exchange.reviewNote}
          rows={4}
          maxLength={1000}
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          placeholder="Ish sifati, muddatga rioya, muloqot..."
          hint={m.exchange.reviewHint}
        />

        {error && (
          <p role="alert" className="text-sm text-destructive">
            {getApiErrorMessage(error)}
          </p>
        )}
      </div>
    </Modal>
  );
}
