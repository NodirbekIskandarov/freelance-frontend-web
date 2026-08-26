'use client';

import { CircleCheck, Upload, X } from 'lucide-react';
import { useRef, useState } from 'react';

import { Button, ButtonLink } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import { cn } from '@/lib/cn';
import { getApiErrorMessage } from '@/shared/api/errors';
import { ASSIGNMENT_TAB_ORDER, assignmentTypeLabel } from '@/shared/types/assignmentTypes';
import { useAppSelector } from '@/store/hooks';
import { selectIsAuthenticated } from '@/store/slices/authSlice';

import { useSubmitAssignmentRequestMutation } from './requestsApi';

const TYPE_OPTIONS = ASSIGNMENT_TAB_ORDER.map((type) => ({
  value: type,
  label: assignmentTypeLabel(type),
}));

/** Backenddagi chegara (`MAX_REQUESTED_VARIANTS`). */
const MAX_VARIANTS = 100;

const fieldClass =
  'w-full rounded-xl border border-border/70 bg-background px-3 text-sm text-foreground transition-colors outline-none placeholder:text-muted-foreground/70 focus-visible:border-emerald-500/60 focus-visible:ring-3 focus-visible:ring-emerald-500/20';

function FieldLabel({
  htmlFor,
  children,
  required,
}: {
  htmlFor?: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-foreground">
      {children}
      {required && (
        <span aria-hidden className="ml-0.5 text-destructive">
          *
        </span>
      )}
    </label>
  );
}

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
  subjectCourse,
  subjectSemester,
  onClose,
}: {
  open: boolean;
  subjectId: string;
  subjectName: string;
  subjectCourse?: number | null;
  subjectSemester?: number | null;
  onClose: () => void;
}) {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const [submit, { isLoading, error, reset }] = useSubmitAssignmentRequestMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [type, setType] = useState<string>(ASSIGNMENT_TAB_ORDER[0]);
  /* `null` — hali tanlanmagan. Ataylab sukut qiymat yo'q: variantlar soni
     shu tanlovga bog'liq, taxmin qilib qo'yish xato ma'lumot demak. */
  const [hasVariants, setHasVariants] = useState<boolean | null>(null);
  const [variantCount, setVariantCount] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  function close() {
    reset();
    setDone(false);
    setLocalError(null);
    onClose();
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (hasVariants === null) {
      setLocalError('Variantli yoki variantsiz ekanini tanlang');
      return;
    }

    const count = Number(variantCount);
    if (hasVariants && (!Number.isInteger(count) || count < 1 || count > MAX_VARIANTS)) {
      setLocalError(`Variantlar soni 1 dan ${MAX_VARIANTS} gacha bo'lishi kerak`);
      return;
    }
    setLocalError(null);

    try {
      await submit({
        subject: subjectId,
        title: title.trim(),
        type,
        ...(description.trim() ? { description: description.trim() } : {}),
        ...(hasVariants ? { variant_count: count } : {}),
        ...(file ? { file } : {}),
      }).unwrap();
    } catch {
      return;
    }

    setTitle('');
    setDescription('');
    setVariantCount('');
    setHasVariants(null);
    setFile(null);
    setDone(true);
  }

  const meta = [
    subjectCourse ? `${subjectCourse}-kurs` : null,
    subjectSemester ? `${subjectSemester}-semestr` : null,
  ].filter(Boolean);

  return (
    <Modal
      open={open}
      onClose={close}
      title="Topshiriqni yuklash"
      description="Ariza admin tasdiqlagach ro'yxatga qo'shiladi. Bonus olish imkoniyati ham bor."
      className="w-[min(32rem,calc(100vw-2rem))]"
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
          <div>
            <FieldLabel>Fan</FieldLabel>
            <p className={cn(fieldClass, 'flex h-11 items-center bg-muted/40')}>{subjectName}</p>
            {meta.length > 0 && (
              <p className="mt-1.5 text-xs text-muted-foreground">{meta.join(' · ')}</p>
            )}
          </div>

          <div>
            <FieldLabel htmlFor="assignment-type">Ish turi</FieldLabel>
            <Select
              id="assignment-type"
              aria-label="Ish turi"
              value={type}
              onChange={setType}
              options={TYPE_OPTIONS}
            />
          </div>

          <fieldset className="rounded-xl border border-border/70 p-3.5">
            <legend className="px-1 text-sm font-medium text-foreground">
              Variantlik
              <span aria-hidden className="ml-0.5 text-destructive">
                *
              </span>
            </legend>

            <p className="text-xs leading-relaxed text-muted-foreground">
              Mustaqil, amaliy va laboratoriya ishlarida ham tanlanadi.
            </p>

            <div className="mt-3 grid grid-cols-2 gap-2">
              {[
                { value: true, label: 'Variantli' },
                { value: false, label: 'Variantsiz' },
              ].map((option) => (
                <label
                  key={option.label}
                  className={cn(
                    'inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border text-sm font-medium transition-colors',
                    hasVariants === option.value
                      ? 'border-emerald-500/60 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                      : 'border-border/70 text-muted-foreground hover:bg-muted',
                  )}
                >
                  <input
                    type="radio"
                    name="assignment-variants"
                    className="accent-emerald-600"
                    checked={hasVariants === option.value}
                    onChange={() => {
                      setHasVariants(option.value);
                      if (!option.value) setVariantCount('');
                    }}
                  />
                  {option.label}
                </label>
              ))}
            </div>

            {/* Variantlar soni FAQAT variantli topshiriqda so'raladi —
                variantsizida u ma'nosiz va backendga ham yuborilmaydi. */}
            {hasVariants === true && (
              <div className="mt-3">
                <FieldLabel htmlFor="assignment-variant-count" required>
                  Nechta variant
                </FieldLabel>
                <input
                  id="assignment-variant-count"
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={MAX_VARIANTS}
                  required
                  value={variantCount}
                  onChange={(event) => setVariantCount(event.target.value)}
                  placeholder="Masalan: 20"
                  className={cn(fieldClass, 'h-10')}
                />
              </div>
            )}

            {hasVariants === false && (
              <p className="mt-3 text-xs text-muted-foreground">
                Bitta umumiy topshiriq — variantlar bo&apos;lmaydi.
              </p>
            )}
          </fieldset>

          <div>
            <FieldLabel htmlFor="assignment-title">Topshiriq nomi</FieldLabel>
            <input
              id="assignment-title"
              required
              maxLength={200}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Masalan: Mustaqil ish 12-variant"
              className={cn(fieldClass, 'h-11')}
            />
          </div>

          <div>
            <FieldLabel htmlFor="assignment-description">Izoh (ixtiyoriy)</FieldLabel>
            <textarea
              id="assignment-description"
              rows={3}
              maxLength={2000}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Qo'shimcha ma'lumot"
              className={cn(fieldClass, 'resize-none py-2.5')}
            />
          </div>

          <div>
            <FieldLabel htmlFor="assignment-file">Topshiriq fayli</FieldLabel>

            <input
              id="assignment-file"
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
              className="sr-only"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            />

            {file ? (
              <div className="flex items-center gap-2 rounded-xl border border-border/70 px-3 py-2.5">
                <span className="min-w-0 flex-1 truncate text-sm text-foreground">{file.name}</span>
                <button
                  type="button"
                  aria-label="Faylni olib tashlash"
                  onClick={() => {
                    setFile(null);
                    // Bir xil faylni qayta tanlash uchun: `input` qiymati
                    // tozalanmasa `change` hodisasi umuman chiqmaydi.
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="grid size-7 shrink-0 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <X className="size-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex w-full flex-col items-center gap-2 rounded-xl border border-dashed border-border/70 px-4 py-8 text-sm text-muted-foreground transition-colors hover:border-emerald-500/40 hover:bg-emerald-500/[0.03]"
              >
                <Upload className="size-5 text-emerald-600 dark:text-emerald-400" />
                PDF yoki hujjatni tanlang
              </button>
            )}
          </div>

          {(localError || error) && (
            <p role="alert" className="text-sm text-destructive">
              {localError ?? getApiErrorMessage(error)}
            </p>
          )}
        </form>
      )}
    </Modal>
  );
}
