'use client';

import { Check, Link2Off, Mail, Phone, Plus, ShieldCheck, TriangleAlert } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/Button';
import { ErrorNotice } from '@/components/ui/ErrorNotice';
import { Modal } from '@/components/ui/Modal';
import { OtpInput } from '@/features/auth/OtpInput';
import { PhoneField } from '@/features/auth/PhoneField';
import { cn } from '@/lib/cn';
import { getApiErrorMessage } from '@/shared/api/errors';
import {
  LOGIN_METHOD_LABELS,
  type LoginMethod,
  type LoginMethodKind,
} from '@/shared/types/identities';

import {
  useConfirmEmailLinkMutation,
  useConfirmPhoneLinkMutation,
  useGetLoginMethodsQuery,
  useStartEmailLinkMutation,
  useStartPhoneLinkMutation,
  useUnlinkMethodMutation,
} from './identitiesApi';

const ICONS: Record<LoginMethodKind, typeof Phone> = {
  phone: Phone,
  email: Mail,
  google: ShieldCheck,
};

const fieldClass =
  'h-11 w-full rounded-xl border border-border/70 bg-background px-3 text-sm text-foreground transition-colors outline-none placeholder:text-muted-foreground/70 focus-visible:border-emerald-500/60 focus-visible:ring-3 focus-visible:ring-emerald-500/20';

/**
 * Bir usulni bog'lash oynasi: identifikator → kod → tasdiq.
 *
 * Ikki qadam bitta oynada. Alohida sahifalarga bo'lish odamni oqimdan
 * chiqarardi va kod kelgunicha u qayerda ekanini unutardi.
 */
function LinkModal({
  kind,
  open,
  onClose,
}: {
  kind: 'phone' | 'email';
  open: boolean;
  onClose: () => void;
}) {
  const [identifier, setIdentifier] = useState('');
  const [code, setCode] = useState('');
  const [sent, setSent] = useState(false);
  const [hint, setHint] = useState<string | null>(null);

  const [startPhone, startPhoneState] = useStartPhoneLinkMutation();
  const [confirmPhone, confirmPhoneState] = useConfirmPhoneLinkMutation();
  const [startEmail, startEmailState] = useStartEmailLinkMutation();
  const [confirmEmail, confirmEmailState] = useConfirmEmailLinkMutation();

  const isPhone = kind === 'phone';
  const startState = isPhone ? startPhoneState : startEmailState;
  const confirmState = isPhone ? confirmPhoneState : confirmEmailState;

  function close() {
    setIdentifier('');
    setCode('');
    setSent(false);
    setHint(null);
    startPhoneState.reset();
    confirmPhoneState.reset();
    startEmailState.reset();
    confirmEmailState.reset();
    onClose();
  }

  async function handleSend() {
    try {
      const result = isPhone
        ? await startPhone({ phone: identifier.trim() }).unwrap()
        : await startEmail({ email: identifier.trim() }).unwrap();

      setSent(true);
      /*
       * `demo_code` faqat yetkazish o'chiq bo'lganda keladi (konsol email,
       * qat'iy SMS kod). Uni ko'rsatish sozlanmagan muhitda oqimni
       * sinash imkonini beradi; ishlab chiqarishda u `null` va bu qator
       * umuman chizilmaydi.
       */
      setHint(result.demo_code ?? null);
    } catch {
      // Xato quyida ko'rsatiladi.
    }
  }

  async function handleConfirm() {
    try {
      if (isPhone) {
        await confirmPhone({ phone: identifier.trim(), code }).unwrap();
      } else {
        await confirmEmail({ email: identifier.trim(), code }).unwrap();
      }
    } catch {
      return;
    }

    close();
  }

  const error = startState.error ?? confirmState.error;

  return (
    <Modal
      open={open}
      onClose={close}
      title={isPhone ? "Telefon raqamni bog'lash" : "Email bog'lash"}
      description={
        sent
          ? `${identifier} manziliga yuborilgan kodni kiriting.`
          : "Tasdiqlagandan keyin bu usul bilan ham kirishingiz mumkin bo'ladi."
      }
      footer={
        <>
          <Button variant="outline" onClick={close}>
            Bekor qilish
          </Button>
          {sent ? (
            <Button
              variant="emerald"
              disabled={confirmState.isLoading || code.length < 4}
              onClick={() => void handleConfirm()}
            >
              {confirmState.isLoading ? 'Tekshirilmoqda...' : 'Tasdiqlash'}
            </Button>
          ) : (
            <Button
              variant="emerald"
              disabled={startState.isLoading || identifier.trim().length < 4}
              onClick={() => void handleSend()}
            >
              {startState.isLoading ? 'Yuborilmoqda...' : 'Kod yuborish'}
            </Button>
          )}
        </>
      }
    >
      {sent ? (
        <div>
          <OtpInput value={code} onChange={setCode} autoFocus />

          {hint && (
            <p className="mt-3 rounded-xl border border-amber-500/40 bg-amber-500/[0.06] px-3 py-2 text-xs text-amber-700 dark:text-amber-300">
              Sinov rejimi — kod: <strong className="font-mono">{hint}</strong>
            </p>
          )}

          <button
            type="button"
            onClick={() => {
              setSent(false);
              setCode('');
              setHint(null);
            }}
            className="mt-3 text-xs text-muted-foreground underline-offset-2 hover:underline"
          >
            Boshqa {isPhone ? 'raqam' : 'manzil'} kiritish
          </button>
        </div>
      ) : isPhone ? (
        <PhoneField id="link-phone" value={identifier} onChange={setIdentifier} required />
      ) : (
        <div>
          <label htmlFor="link-email" className="mb-1.5 block text-sm font-medium text-foreground">
            Email manzil
          </label>
          <input
            id="link-email"
            type="email"
            value={identifier}
            onChange={(event) => setIdentifier(event.target.value)}
            placeholder="ism@example.com"
            className={fieldClass}
          />
        </div>
      )}

      {error && (
        <p
          role="alert"
          className="mt-3 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm text-destructive"
        >
          {getApiErrorMessage(error)}
        </p>
      )}
    </Modal>
  );
}

function MethodRow({ method }: { method: LoginMethod }) {
  const [unlink, { isLoading, error }] = useUnlinkMethodMutation();
  const Icon = ICONS[method.kind];

  return (
    <li className="flex flex-wrap items-center gap-3 border-b border-border/50 py-3.5 last:border-0">
      <span
        className={cn(
          'grid size-10 shrink-0 place-items-center rounded-xl',
          method.verified
            ? 'bg-emerald-500/12 text-emerald-600 dark:text-emerald-400'
            : 'bg-amber-500/12 text-amber-600 dark:text-amber-400',
        )}
      >
        <Icon className="size-5" />
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-foreground">
            {LOGIN_METHOD_LABELS[method.kind]}
          </span>
          {method.verified ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/12 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-300">
              <Check className="size-3" />
              Tasdiqlangan
            </span>
          ) : (
            /* Tasdiqlanmagan usul kirish yo'li EMAS — buni ochiq aytish
               kerak, aks holda odam u bilan kira olaman deb o'ylardi. */
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/12 px-2 py-0.5 text-[11px] font-medium text-amber-700 dark:text-amber-300">
              <TriangleAlert className="size-3" />
              Tasdiqlanmagan
            </span>
          )}
        </span>
        <span className="mt-0.5 block truncate text-sm text-muted-foreground">{method.value}</span>

        {error && (
          <span role="alert" className="mt-1 block text-xs text-destructive">
            {getApiErrorMessage(error)}
          </span>
        )}
      </span>

      {method.can_unlink ? (
        <Button
          variant="outline"
          size="sm"
          disabled={isLoading}
          onClick={() => void unlink({ kind: method.kind })}
        >
          <Link2Off className="size-3.5" />
          {isLoading ? 'Uzilmoqda...' : 'Uzish'}
        </Button>
      ) : (
        /*
          Tugmani yashirish o'rniga sababini aytamiz: «nega uzolmayapman»
          degan savol javobsiz qolmasin.
        */
        <span className="text-[11px] text-muted-foreground">
          {method.verified ? 'Yagona kirish yo‘li' : 'Avval tasdiqlang'}
        </span>
      )}
    </li>
  );
}

/**
 * «Kirish usullari» — profil sahifasidagi bo'lim.
 *
 * Hisob bitta, unga bir nechta yo'l bog'lanadi: telefon, email, Google.
 * Har biri mustaqil — qaysi biri orqali kirilsa ham o'sha hisobga
 * tushiladi.
 */
export function LoginMethods() {
  const { data, isLoading, error } = useGetLoginMethodsQuery();
  const [linking, setLinking] = useState<'phone' | 'email' | null>(null);

  if (error) return <ErrorNotice error={error} />;

  if (isLoading || !data) {
    return <div className="h-48 animate-pulse rounded-xl bg-muted" />;
  }

  const linked = new Set(data.methods.map((item) => item.kind));

  return (
    <div className="rounded-xl border border-border/60 bg-background p-5 dark:border-zinc-800 dark:bg-zinc-900/70">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Kirish usullari</h3>
          <p className="mt-1 max-w-lg text-xs leading-relaxed text-muted-foreground">
            Hisobingizga bir nechta yo&apos;l bilan kirishingiz mumkin. Har birini qo&apos;shishda
            tasdiqlash so&apos;raladi, oxirgi qolganini esa uzib bo&apos;lmaydi.
          </p>
        </div>
      </div>

      <ul className="mt-4">
        {data.methods.map((method) => (
          <MethodRow key={method.kind} method={method} />
        ))}
      </ul>

      {/* Bog'lanmagan usullar uchun tugmalar. Google bu yerda yo'q:
          uni bog'lash Google SDK tugmasini talab qiladi va u alohida
          ish — hozircha telefon va email. */}
      <div className="mt-4 flex flex-wrap gap-2 border-t border-border/50 pt-4">
        {!linked.has('phone') && (
          <Button variant="outline" size="sm" onClick={() => setLinking('phone')}>
            <Plus className="size-3.5" />
            Telefon qo&apos;shish
          </Button>
        )}
        {!linked.has('email') && (
          <Button variant="outline" size="sm" onClick={() => setLinking('email')}>
            <Plus className="size-3.5" />
            Email qo&apos;shish
          </Button>
        )}
        {/* Tasdiqlanmagan manzil ham qayta tasdiqlanishi kerak. */}
        {linked.has('email') && !data.methods.find((item) => item.kind === 'email')?.verified && (
          <Button variant="outline" size="sm" onClick={() => setLinking('email')}>
            Emailni tasdiqlash
          </Button>
        )}
      </div>

      <LinkModal
        kind={linking ?? 'phone'}
        open={linking !== null}
        onClose={() => setLinking(null)}
      />
    </div>
  );
}
