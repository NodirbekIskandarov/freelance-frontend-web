'use client';

import { CircleCheck, Paperclip, X } from 'lucide-react';
import { useRef, useState } from 'react';

import { Button, ButtonLink } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { cn } from '@/lib/cn';
import { getApiErrorMessage } from '@/shared/api/errors';
import { useAppSelector } from '@/store/hooks';
import { selectIsAuthenticated } from '@/store/slices/authSlice';

import { useUploadSolutionMutation } from './solutionsApi';
import { useMoney } from '@/lib/useMoney';

/**
 * Qabul qilinadigan formatlar.
 *
 * Backendning `SOLUTION_ALLOWED_EXTENSIONS` ro'yxatidan olingan. To'liq
 * nusxasi emas: bu yerda o'quv ishlarida uchraydiganlari qoldirildi.
 * Ro'yxat qisqa bo'lgani uchun `accept` faylni tanlash oynasini foydali
 * darajada toraytiradi — lekin u faqat maslahat, chek backendda.
 */
const ACCEPTED = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.zip', '.rar'];

/** Backend chegarasi — `SOLUTION_FILE_MAX_SIZE_MB`, standart 50 MB. */
const MAX_SIZE_MB = 50;

/** Narx `DecimalField` ga tushadi: 10 xonagacha butun, 2 xonagacha kasr. */
const PRICE_PATTERN = /^\d{1,10}(\.\d{1,2})?$/;

const fieldClass =
  'w-full rounded-xl border border-border/70 bg-background px-3 text-sm text-foreground transition-colors outline-none placeholder:text-muted-foreground/70 focus-visible:border-emerald-500/60 focus-visible:ring-3 focus-visible:ring-emerald-500/20';

function FieldLabel({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-foreground">
      {children}
    </label>
  );
}

function formatSize(bytes: number): string {
  const mb = bytes / (1024 * 1024);
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

/**
 * Variantga yechim yuborish.
 *
 * Narxni foydalanuvchining O'ZI qo'yadi, lekin bu yakuniy narx emas:
 * moderator uni ko'rib chiqib boshqa raqam belgilashi mumkin. Buni forma
 * ochiq aytadi — aks holda e'lon qilingandan keyin boshqa summani ko'rib,
 * xato bo'ldi deb o'ylashardi.
 *
 * Kirmagan foydalanuvchiga forma chizilmaydi: backend 401 qaytaradi va
 * bu yuklangan faylni behuda ketkazardi.
 */
export function SolutionUploadModal({
  open,
  variantId,
  variantNumber,
  assignmentId,
  assignmentTitle,
  onClose,
}: {
  open: boolean;
  /** Variantli topshiriqda — tanlangan variant. */
  variantId?: string;
  variantNumber?: number;
  /** Variantsiz topshiriqda — topshiriqning o'zi. */
  assignmentId?: string;
  assignmentTitle: string;
  onClose: () => void;
}) {
  const money = useMoney();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const [upload, { isLoading, error, reset }] = useUploadSolutionMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [localError, setLocalError] = useState('');
  const [done, setDone] = useState(false);

  function close() {
    reset();
    setLocalError('');
    setDone(false);
    onClose();
  }

  /*
   * Hajm va kengaytma mijozda ham tekshiriladi.
   *
   * Backend baribir tekshiradi, lekin 50 MB li faylni yuklab bo'lib,
   * keyin "format noto'g'ri" javobini olish mobil internetda qimmatga
   * tushadi.
   */
  function pickFile(next: File | null) {
    setLocalError('');
    if (!next) {
      setFile(null);
      return;
    }

    const extension = `.${next.name.split('.').pop()?.toLowerCase() ?? ''}`;
    if (!ACCEPTED.includes(extension)) {
      setLocalError(`Bu format qabul qilinmaydi. Ruxsat etilgan: ${ACCEPTED.join(', ')}`);
      setFile(null);
      return;
    }
    if (next.size > MAX_SIZE_MB * 1024 * 1024) {
      setLocalError(`Fayl juda katta (${formatSize(next.size)}). Chegara — ${MAX_SIZE_MB} MB.`);
      setFile(null);
      return;
    }

    setFile(next);
    // Sarlavha bo'sh bo'lsa fayl nomidan taklif qilinadi — ko'pchilik uchun
    // to'g'ri javob, xohlasa ustiga yozadi.
    if (!title.trim()) setTitle(next.name.replace(/\.[^.]+$/, ''));
  }

  const priceError =
    price.trim() && !PRICE_PATTERN.test(price.trim()) ? 'Narxni raqamda kiriting' : '';
  const canSubmit = Boolean(file) && title.trim().length > 0 && PRICE_PATTERN.test(price.trim());

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!file || !canSubmit) return;

    try {
      await upload({
        // Backend ikkovidan BITTASINI kutadi.
        ...(variantId ? { variant: variantId } : { assignment: assignmentId }),
        title: title.trim(),
        ...(description.trim() ? { description: description.trim() } : {}),
        price: price.trim(),
        file,
      }).unwrap();
    } catch {
      return;
    }

    setTitle('');
    setDescription('');
    setPrice('');
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setDone(true);
  }

  return (
    <Modal
      open={open}
      onClose={close}
      title="Yechim yuborish"
      description={
        variantNumber ? `${assignmentTitle} · ${variantNumber}-variant` : assignmentTitle
      }
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
              form="solution-upload-form"
              variant="emerald"
              disabled={isLoading || !canSubmit}
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
          <p className="mt-3 text-sm font-medium text-foreground">Yechim yuborildi</p>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Moderator tekshirib chiqadi va yakuniy narxni belgilaydi. Tasdiqlangach yechim shu
            variantda sotuvga chiqadi — holatini &laquo;Yechimlarim&raquo; bo&apos;limida kuzatasiz.
          </p>
        </div>
      ) : !isAuthenticated ? (
        <div className="py-2">
          <p className="text-sm text-muted-foreground">
            Yechim yuborish uchun avval hisobingizga kiring — yechim sizning nomingizga
            biriktiriladi va daromadi hamyoningizga tushadi.
          </p>
          <ButtonLink href="/login" variant="emerald" className="mt-4">
            Kirish
          </ButtonLink>
        </div>
      ) : (
        <form id="solution-upload-form" onSubmit={handleSubmit} className="space-y-4">
          <div>
            <FieldLabel htmlFor="solution-file">Yechim fayli</FieldLabel>

            {file ? (
              <div className="flex items-center gap-3 rounded-xl border border-emerald-500/40 bg-emerald-500/[0.06] px-3 py-2.5">
                <Paperclip className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm text-foreground">{file.name}</span>
                  <span className="block text-[11px] text-muted-foreground">
                    {formatSize(file.size)}
                  </span>
                </span>
                <button
                  type="button"
                  aria-label="Faylni olib tashlash"
                  onClick={() => {
                    pickFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="grid size-7 shrink-0 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <X className="size-4" />
                </button>
              </div>
            ) : (
              <input
                ref={fileInputRef}
                id="solution-file"
                type="file"
                required
                accept={ACCEPTED.join(',')}
                onChange={(event) => pickFile(event.target.files?.[0] ?? null)}
                className={cn(
                  fieldClass,
                  'py-2.5 file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-500/15 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-emerald-700 dark:file:text-emerald-300',
                )}
              />
            )}

            <p className="mt-1.5 text-[11px] text-muted-foreground">
              {ACCEPTED.join(', ')} · eng ko&apos;pi {MAX_SIZE_MB} MB
            </p>
          </div>

          <div>
            <FieldLabel htmlFor="solution-title">Sarlavha</FieldLabel>
            <input
              id="solution-title"
              required
              maxLength={255}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Masalan: 5-variant, to'liq yechim"
              className={cn(fieldClass, 'h-11')}
            />
          </div>

          <div>
            <FieldLabel htmlFor="solution-price">Narxingiz</FieldLabel>
            <input
              id="solution-price"
              required
              inputMode="decimal"
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              placeholder="15000"
              aria-invalid={Boolean(priceError)}
              className={cn(fieldClass, 'h-11', priceError && 'border-destructive/60')}
            />
            {priceError ? (
              <p className="mt-1.5 text-[11px] text-destructive">{priceError}</p>
            ) : (
              <p className="mt-1.5 text-[11px] text-muted-foreground">
                So&apos;mda. Bu siz so&apos;ragan narx — moderator uni ko&apos;rib chiqib yakuniy
                summani belgilaydi.
                {PRICE_PATTERN.test(price.trim()) && (
                  <> Siz so&apos;radingiz: {money.decimalSom(price.trim())}.</>
                )}
              </p>
            )}
          </div>

          <div>
            <FieldLabel htmlFor="solution-description">Izoh (ixtiyoriy)</FieldLabel>
            <textarea
              id="solution-description"
              rows={3}
              maxLength={2000}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Masalan: barcha masalalar yechilgan, izohlari bilan"
              className={cn(fieldClass, 'resize-none py-2.5')}
            />
          </div>

          {(localError || error) && (
            <p
              role="alert"
              className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm text-destructive"
            >
              {localError || getApiErrorMessage(error)}
            </p>
          )}
        </form>
      )}
    </Modal>
  );
}
