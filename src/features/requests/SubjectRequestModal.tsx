'use client';

import { CircleCheck } from 'lucide-react';
import { useState } from 'react';

import { Button, ButtonLink } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import { cn } from '@/lib/cn';
import { getApiErrorMessage } from '@/shared/api/errors';
import { useAppSelector } from '@/store/hooks';
import { selectIsAuthenticated } from '@/store/slices/authSlice';

import { useSubmitSubjectRequestMutation } from './requestsApi';

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
  const [submit, { isLoading, error, reset }] = useSubmitSubjectRequestMutation();

  const [name, setName] = useState('');
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
        course: Number(course),
        semester: Number(semester),
        ...(note.trim() ? { note: note.trim() } : {}),
      }).unwrap();
    } catch {
      return;
    }

    setName('');
    setCourse('1');
    setSemester('1');
    setNote('');
    setDone(true);
  }

  return (
    <Modal
      open={open}
      onClose={close}
      title="Ariza qoldirish"
      description={`${universityName} uchun ro'yxatda yo'q fan bo'lsa, ma'lumotlarni yuboring. Tekshirgach saytga qo'shamiz.`}
      /* Ichida ochiladigan tanlagich bor — dialog uni qirqib qo'ymasligi uchun. */
      scrollBody={false}
      footer={
        done ? (
          <Button variant="emerald" onClick={close}>
            Yopish
          </Button>
        ) : isAuthenticated ? (
          <>
            <Button variant="outline" onClick={close}>
              Bekor qilish
            </Button>
            <Button
              type="submit"
              form="subject-request-form"
              variant="emerald"
              disabled={isLoading || !name.trim()}
            >
              {isLoading ? 'Yuborilmoqda...' : 'Arizani yuborish'}
            </Button>
          </>
        ) : undefined
      }
    >
      {done ? (
        <div className="flex flex-col items-center py-4 text-center">
          <CircleCheck className="size-10 text-emerald-600 dark:text-emerald-400" />
          <p className="mt-3 text-sm font-medium text-foreground">Ariza yuborildi</p>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Moderatsiyadan o&apos;tgach fan katalogga qo&apos;shiladi. Holatini
            &laquo;Arizalarim&raquo; bo&apos;limida kuzatib borasiz.
          </p>
        </div>
      ) : !isAuthenticated ? (
        <div className="py-2">
          <p className="text-sm text-muted-foreground">
            Ariza qoldirish uchun avval hisobingizga kiring — arizangiz holatini kuzatib borishingiz
            uchun shart.
          </p>
          <ButtonLink href="/login" variant="emerald" className="mt-4">
            Kirish
          </ButtonLink>
        </div>
      ) : (
        <form id="subject-request-form" onSubmit={handleSubmit} className="space-y-4">
          <div>
            <FieldLabel htmlFor="subject-request-name">Fan nomi</FieldLabel>
            <input
              id="subject-request-name"
              required
              maxLength={200}
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Masalan: Dasturlash asoslari"
              className={cn(fieldClass, 'h-11')}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel htmlFor="subject-request-course">Kurs</FieldLabel>
              <Select
                id="subject-request-course"
                aria-label="Kurs"
                value={course}
                onChange={setCourse}
                options={COURSE_OPTIONS}
              />
            </div>

            <div>
              <FieldLabel htmlFor="subject-request-semester">Semestr</FieldLabel>
              <Select
                id="subject-request-semester"
                aria-label="Semestr"
                value={semester}
                onChange={setSemester}
                options={SEMESTER_OPTIONS}
              />
            </div>
          </div>

          <div>
            <FieldLabel htmlFor="subject-request-note">Qo&apos;shimcha izoh (ixtiyoriy)</FieldLabel>
            <textarea
              id="subject-request-note"
              rows={3}
              maxLength={2000}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Masalan: 3-kurs, 5-semestr uchun kerak"
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
