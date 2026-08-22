'use client';

import { CircleCheck } from 'lucide-react';
import { useState } from 'react';

import { Button, ButtonLink } from '@/components/ui/Button';
import { SelectField, TextField } from '@/components/ui/Field';
import { Modal } from '@/components/ui/Modal';
import { getApiErrorMessage } from '@/shared/api/errors';
import { useAppSelector } from '@/store/hooks';
import { selectIsAuthenticated } from '@/store/slices/authSlice';

import { useSubmitSubjectRequestMutation } from './requestsApi';

const COURSES = [1, 2, 3, 4, 5, 6];

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
  const [course, setCourse] = useState('');
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
        ...(course ? { course: Number(course) } : {}),
      }).unwrap();
    } catch {
      return;
    }

    setName('');
    setCourse('');
    setDone(true);
  }

  return (
    <Modal
      open={open}
      onClose={close}
      title="Fan qo'shish arizasi"
      description={universityName}
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
              {isLoading ? 'Yuborilmoqda...' : 'Yuborish'}
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
          <TextField
            label="Fan nomi"
            required
            maxLength={200}
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Masalan: Diskret matematika"
          />

          <SelectField
            label="Kurs"
            value={course}
            onChange={(event) => setCourse(event.target.value)}
            options={[
              { value: '', label: "Ko'rsatilmagan" },
              ...COURSES.map((item) => ({ value: String(item), label: `${item}-kurs` })),
            ]}
            hint="Bilmasangiz bo'sh qoldiring."
          />

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
