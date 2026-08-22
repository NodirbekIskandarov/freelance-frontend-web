'use client';

import { CircleCheck } from 'lucide-react';
import { useState } from 'react';

import { Button, ButtonLink } from '@/components/ui/Button';
import { TextAreaField, TextField } from '@/components/ui/Field';
import { Modal } from '@/components/ui/Modal';
import { getApiErrorMessage } from '@/shared/api/errors';
import { useAppSelector } from '@/store/hooks';
import { selectIsAuthenticated } from '@/store/slices/authSlice';

import { useSubmitAssignmentRequestMutation } from './requestsApi';

/**
 * "Topshiriq ro'yxatda yo'q" arizasi.
 *
 * Fan arizasi bilan bir xil oqim: kirmagan foydalanuvchiga forma
 * ko'rsatilmaydi, chunki backend 401 qaytaradi.
 */
export function AssignmentRequestModal({
  open,
  subjectId,
  subjectName,
  onClose,
}: {
  open: boolean;
  subjectId: string;
  subjectName: string;
  onClose: () => void;
}) {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const [submit, { isLoading, error, reset }] = useSubmitAssignmentRequestMutation();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [variantCount, setVariantCount] = useState('');
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
        subject: subjectId,
        title: title.trim(),
        ...(description.trim() ? { description: description.trim() } : {}),
        ...(variantCount ? { variant_count: Number(variantCount) } : {}),
      }).unwrap();
    } catch {
      return;
    }

    setTitle('');
    setDescription('');
    setVariantCount('');
    setDone(true);
  }

  return (
    <Modal
      open={open}
      onClose={close}
      title="Topshiriq qo'shish arizasi"
      description={subjectName}
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
              form="assignment-request-form"
              variant="emerald"
              disabled={isLoading || !title.trim()}
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
            Moderatsiyadan o&apos;tgach topshiriq ro&apos;yxatga qo&apos;shiladi. Tasdiqlangan ariza
            uchun bonus olishingiz mumkin.
          </p>
        </div>
      ) : !isAuthenticated ? (
        <div className="py-2">
          <p className="text-sm text-muted-foreground">
            Topshiriq yuklash uchun avval hisobingizga kiring — arizangiz holatini kuzatib
            borishingiz uchun shart.
          </p>
          <ButtonLink href="/login" variant="emerald" className="mt-4">
            Kirish
          </ButtonLink>
        </div>
      ) : (
        <form id="assignment-request-form" onSubmit={handleSubmit} className="space-y-4">
          <TextField
            label="Topshiriq nomi"
            required
            maxLength={200}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Masalan: 3-amaliy ish"
          />

          <TextField
            label="Variantlar soni"
            type="number"
            min={1}
            max={100}
            value={variantCount}
            onChange={(event) => setVariantCount(event.target.value)}
            placeholder="20"
            hint="Bilmasangiz bo'sh qoldiring."
          />

          <TextAreaField
            label="Tavsif"
            rows={4}
            maxLength={2000}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Topshiriq shartlari, talablar, muddat..."
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
