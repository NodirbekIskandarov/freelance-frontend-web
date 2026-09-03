'use client';

import { CircleCheck } from 'lucide-react';
import { useState } from 'react';

import { Button, ButtonLink } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import { useT } from '@/i18n/useT';
import { cn } from '@/lib/cn';
import { getApiErrorMessage } from '@/shared/api/errors';
import { useAppSelector } from '@/store/hooks';
import { selectIsAuthenticated } from '@/store/slices/authSlice';

import { useGetSubjectCategoriesQuery, useSubmitSubjectRequestMutation } from './requestsApi';

/** Backend chegaralari: kurs 1-6, semestr 1-8. */
const COURSE_OPTIONS = [1, 2, 3, 4, 5, 6].map((n) => ({
  value: String(n),
  label: `${n}-kurs`,
}));

const SEMESTER_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8].map((n) => ({
  value: String(n),
  label: `${n}-semestr`,
}));

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
 * "Fan ro'yxatda yo'q" arizasi.
 *
 * Kirmagan foydalanuvchi uchun forma umuman chizilmaydi: backend 401
 * qaytaradi va bu foydalanuvchiga tushunarsiz xato bo'lardi — o'rniga
 * kirish taklif qilinadi.
 */
export function SubjectRequestModal({
  open,
  universityId,
  universityName,
  onClose,
}: {
  open: boolean;
  universityId: string;
  universityName: string;
  onClose: () => void;
}) {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const { t, m } = useT();
  const [submit, { isLoading, error, reset }] = useSubmitSubjectRequestMutation();

  /*
   * Toifalar faqat forma ochilganda so'raladi va uzoq keshlanadi —
   * ro'yxat kuniga bir marta ham o'zgarmaydi.
   *
   * Tanlov IXTIYORIY: talaba fanning nomini biladi, uni qaysi sohaga
   * qo'yishni esa har doim ham emas. Moderator tasdiqlashda tuzatadi.
   */
  const { data: categoryPage } = useGetSubjectCategoriesQuery(undefined, { skip: !open });
  const categoryOptions = [
    { value: '', label: m.requests.categoryUnknown },
    ...(categoryPage?.results ?? []).map((item) => ({ value: item.id, label: item.name })),
  ];

  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [course, setCourse] = useState('1');
  const [semester, setSemester] = useState('1');
  const [note, setNote] = useState('');
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
        university: universityId,
        name: name.trim(),
        ...(category ? { category } : {}),
        course: Number(course),
        semester: Number(semester),
        ...(note.trim() ? { note: note.trim() } : {}),
      }).unwrap();
    } catch {
      return;
    }

    setName('');
    setCategory('');
    setCourse('1');
    setSemester('1');
    setNote('');
    setDone(true);
  }

  return (
    <Modal
      open={open}
      onClose={close}
      title={m.requests.subjectTitle}
      description={t((x) => x.requests.subjectDesc, { university: universityName })}
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
              form="subject-request-form"
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
            {m.requests.subjectSentText}
          </p>
        </div>
      ) : !isAuthenticated ? (
        <div className="py-2">
          <p className="text-sm text-muted-foreground">{m.requests.subjectLoginRequired}</p>
          <ButtonLink href="/login" variant="emerald" className="mt-4">
            {m.header.login}
          </ButtonLink>
        </div>
      ) : (
        <form id="subject-request-form" onSubmit={handleSubmit} className="space-y-4">
          <div>
            <FieldLabel htmlFor="subject-request-name">{m.requests.subjectName}</FieldLabel>
            <input
              id="subject-request-name"
              required
              maxLength={200}
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder={m.requests.subjectNamePlaceholder}
              className={cn(fieldClass, 'h-11')}
            />
          </div>

          <div>
            <FieldLabel htmlFor="subject-request-category">{m.requests.category}</FieldLabel>
            <Select
              id="subject-request-category"
              aria-label={m.requests.category}
              value={category}
              onChange={setCategory}
              searchable={categoryOptions.length > 8}
              options={categoryOptions}
            />
            <p className="mt-1.5 text-xs text-muted-foreground">{m.requests.categoryHint}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel htmlFor="subject-request-course">{m.requests.course}</FieldLabel>
              <Select
                id="subject-request-course"
                aria-label={m.requests.course}
                value={course}
                onChange={setCourse}
                options={COURSE_OPTIONS}
              />
            </div>

            <div>
              <FieldLabel htmlFor="subject-request-semester">{m.requests.semester}</FieldLabel>
              <Select
                id="subject-request-semester"
                aria-label={m.requests.semester}
                value={semester}
                onChange={setSemester}
                options={SEMESTER_OPTIONS}
              />
            </div>
          </div>

          <div>
            <FieldLabel htmlFor="subject-request-note">{m.requests.extraNote}</FieldLabel>
            <textarea
              id="subject-request-note"
              rows={3}
              maxLength={2000}
              value={note}
              onChange={(event) => setNote(event.target.value)}
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
