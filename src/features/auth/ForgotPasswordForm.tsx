'use client';

import { ArrowLeft, CheckCircle2, KeyRound, Loader2, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useState, type FormEvent } from 'react';

import { getApiErrorMessage } from '@/shared/api';

import {
  AuthCard,
  AuthCardFooter,
  AuthCardHeader,
  AuthError,
  AuthFieldLabel,
  AuthInput,
  AuthPrimaryButton,
} from './AuthCard';
import { AuthMethodTabs, type AuthMethod } from './AuthMethodTabs';
import { useConfirmForgotPasswordMutation, useForgotPasswordMutation } from './authApi';
import { OtpInput } from './OtpInput';
import { PasswordRequirements } from './PasswordRequirements';
import { validatePassword } from './passwordPolicy';
import { isCompletePhone, toApiPhone } from './phone';
import { PhoneField } from './PhoneField';

/**
 * Parolni tiklash — uch qadam: hisobni ayting, kodni kiriting, yangi parol.
 *
 * Telefon ham, email ham bir xil oqim orqali: kod tanlangan usulga
 * yuboriladi (SMS yoki xat), keyin qolgani bir xil. Backendda ham shunday
 * — bitta `identifier` maydoni ikkalasini ham qabul qiladi.
 *
 * MUHIM: birinchi qadam hisob bor-yo'qligini AYTMAYDI. Noma'lum raqam
 * ham «kod yuborildi» javobini oladi va oqim kod qadamiga o'tadi. Aks
 * holda bu forma «bu odam ro'yxatdan o'tganmi?» degan savolga javob
 * beradigan ochiq vositaga aylanardi.
 */
const CODE_LENGTH = 6;

type Step = 'identify' | 'reset';

export function ForgotPasswordForm() {
  const [requestCode, { isLoading: isSending }] = useForgotPasswordMutation();
  const [confirm, { isLoading: isConfirming }] = useConfirmForgotPasswordMutation();

  const [step, setStep] = useState<Step>('identify');
  const [method, setMethod] = useState<AuthMethod>('phone');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  /* Birinchi qadamda hisoblangan identifikator — keyingi qadam shuni yuboradi. */
  const [identifier, setIdentifier] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [demoCode, setDemoCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  function buildIdentifier(): string | null {
    if (method === 'email') {
      const value = email.trim();
      if (!value.includes('@')) {
        setError('Email manzilni to‘liq kiriting.');
        return null;
      }
      return value;
    }

    if (!isCompletePhone(phone)) {
      setError("Telefon raqam to'liq emas. Masalan: 90 123 45 67");
      return null;
    }
    return toApiPhone(phone);
  }

  async function send(target: string) {
    const result = await requestCode({ identifier: target }).unwrap();
    setDemoCode(result.demo_code ?? null);
  }

  async function handleIdentify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const target = buildIdentifier();
    if (!target) return;

    try {
      await send(target);
      setIdentifier(target);
      setStep('reset');
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    }
  }

  async function handleReset(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!validatePassword(password).valid) {
      setError('Yangi parol talablarga javob bermayapti.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Parollar mos kelmadi.');
      return;
    }

    try {
      await confirm({ identifier, code, new_password: password }).unwrap();
      setDone(true);
    } catch (confirmError) {
      setError(getApiErrorMessage(confirmError));
    }
  }

  if (done) {
    return (
      <AuthCard>
        <AuthCardHeader
          icon={<CheckCircle2 className="size-6" />}
          title="Parol yangilandi"
          subtitle="Endi yangi parolingiz bilan kirishingiz mumkin."
        />

        <Link href="/login" className="block">
          <AuthPrimaryButton>Kirish sahifasiga o&apos;tish</AuthPrimaryButton>
        </Link>
      </AuthCard>
    );
  }

  if (step === 'reset') {
    return (
      <AuthCard>
        <AuthCardHeader
          icon={<ShieldCheck className="size-6" />}
          title="Kodni kiriting"
          subtitle={
            method === 'email'
              ? `${identifier} manziliga yuborilgan kodni kiriting.`
              : `${identifier} raqamiga yuborilgan kodni kiriting.`
          }
        />

        <form onSubmit={handleReset} className="flex flex-col gap-4">
          <OtpInput value={code} onChange={setCode} disabled={isConfirming} autoFocus />

          {/* Yetkazish ulanmaganda backend kodni javobda qaytaradi.
              Provayder ulangach `demo_code` kelmay qo'yadi va bu quti
              o'z-o'zidan yo'qoladi. */}
          {demoCode ? (
            <button
              type="button"
              onClick={() => setCode(demoCode)}
              className="rounded-lg border border-dashed border-amber-500/40 bg-amber-500/5 px-3 py-2 text-center text-xs text-muted-foreground transition-colors hover:bg-amber-500/10"
            >
              Yetkazish hali ulanmagan. Sinov kodi:{' '}
              <span className="font-mono font-semibold text-amber-700 dark:text-amber-400">
                {demoCode}
              </span>{' '}
              — bosing, o&apos;zi qo&apos;yiladi.
            </button>
          ) : null}

          <div>
            <AuthFieldLabel htmlFor="reset-password">Yangi parol</AuthFieldLabel>
            <AuthInput
              id="reset-password"
              type="password"
              required
              autoComplete="new-password"
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>

          <PasswordRequirements password={password} />

          <div>
            <AuthFieldLabel htmlFor="reset-password-confirm">Parolni takrorlang</AuthFieldLabel>
            <AuthInput
              id="reset-password-confirm"
              type="password"
              required
              autoComplete="new-password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
            />
          </div>

          <AuthError message={error} />

          <AuthPrimaryButton
            type="submit"
            loading={isConfirming}
            disabled={code.length !== CODE_LENGTH}
          >
            {isConfirming && <Loader2 className="size-4 animate-spin" />}
            {isConfirming ? 'Saqlanmoqda...' : 'Parolni yangilash'}
          </AuthPrimaryButton>

          <div className="flex items-center justify-between text-sm">
            <button
              type="button"
              onClick={() => {
                setStep('identify');
                setError(null);
                setCode('');
              }}
              className="inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-4" />
              Orqaga
            </button>

            <button
              type="button"
              disabled={isSending}
              onClick={() =>
                void send(identifier).catch(() =>
                  setError("Kodni qayta yuborib bo'lmadi. Biroz kutib turing."),
                )
              }
              className="font-medium text-emerald-600 transition-colors hover:underline disabled:opacity-60 dark:text-emerald-400"
            >
              {isSending ? 'Yuborilmoqda...' : 'Kodni qayta yuborish'}
            </button>
          </div>
        </form>
      </AuthCard>
    );
  }

  return (
    <AuthCard>
      <AuthCardHeader
        icon={<KeyRound className="size-6" />}
        title="Parolni tiklash"
        subtitle="Hisobingizga bog'langan telefon raqam yoki emailni kiriting — tasdiqlash kodi yuboramiz."
      />

      <form onSubmit={handleIdentify} className="flex flex-col gap-4">
        <AuthMethodTabs value={method} onChange={setMethod} emailEnabled />

        {method === 'email' ? (
          <div>
            <AuthFieldLabel htmlFor="forgot-email">Email</AuthFieldLabel>
            <AuthInput
              id="forgot-email"
              type="email"
              required
              autoComplete="email"
              placeholder="ism@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            {/* Tasdiqlanmagan manzilga kod ketmaydi — buni oldindan aytamiz,
                aks holda «kod kelmadi» sababi tushunarsiz bo'lardi. */}
            <p className="mt-1.5 text-[11px] text-muted-foreground">
              Faqat tasdiqlangan email manzilga kod yuboriladi.
            </p>
          </div>
        ) : (
          <PhoneField id="forgot-phone" value={phone} onChange={setPhone} required />
        )}

        <AuthError message={error} />

        <AuthPrimaryButton type="submit" loading={isSending}>
          {isSending && <Loader2 className="size-4 animate-spin" />}
          {isSending ? 'Yuborilmoqda...' : 'Kod yuborish'}
        </AuthPrimaryButton>
      </form>

      <AuthCardFooter>
        Parolingiz esingizdami?{' '}
        <Link
          href="/login"
          className="font-medium text-emerald-600 hover:underline dark:text-emerald-400"
        >
          Kirish
        </Link>
      </AuthCardFooter>
    </AuthCard>
  );
}
