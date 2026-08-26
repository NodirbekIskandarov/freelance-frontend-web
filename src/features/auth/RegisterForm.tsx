'use client';

import { ArrowLeft, Loader2, ShieldCheck, UserRound } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';

import { useUpdateProfileMutation } from '@/features/profile/profileApi';
import { getApiErrorMessage } from '@/shared/api';
import type { AppUser } from '@/shared/types/auth';

import {
  AuthCard,
  AuthCardFooter,
  AuthCardHeader,
  AuthError,
  AuthFieldLabel,
  AuthInput,
  AuthPrimaryButton,
  AuthSeparator,
} from './AuthCard';
import { AuthMethodTabs, type AuthMethod } from './AuthMethodTabs';
import {
  useChangePasswordMutation,
  useSendPhoneCodeMutation,
  useVerifyPhoneCodeMutation,
} from './authApi';
import { cabinetPathFor } from './cabinetPath';
import { GoogleLoginButton } from './GoogleLoginButton';
import { OtpInput } from './OtpInput';
import { PasswordRequirements } from './PasswordRequirements';
import { validatePassword } from './passwordPolicy';
import { isCompletePhone, toApiPhone } from './phone';
import { PhoneField } from './PhoneField';

const CODE_LENGTH = 6;

type Step = 'contact' | 'code' | 'profile';

/** Hisob allaqachon to'ldirilganmi — ismi bor bo'lsa, bu qayta kirish. */
function isExistingAccount(user: AppUser): boolean {
  return Boolean(user.profile?.first_name?.trim());
}

/**
 * Uch qadamli ro'yxatdan o'tish: kontakt → tasdiqlash kodi → ism va parol.
 *
 * Ism bilan parol ATAYLAB oxirida so'raladi: telefon tasdiqlanmagan
 * odamdan uzun forma to'ldirishni so'rash — tashlab ketiladigan qadam.
 * Kod tasdiqlangach backend hisobni ochib, seansni ham boshlab beradi
 * (`/auth/phone/verify/`), shuning uchun uchinchi qadam allaqachon
 * kirgan foydalanuvchi nomidan bajariladi.
 */
export function RegisterForm() {
  const router = useRouter();

  const [sendCode, { isLoading: isSending }] = useSendPhoneCodeMutation();
  const [verifyCode, { isLoading: isVerifying }] = useVerifyPhoneCodeMutation();
  const [updateProfile, { isLoading: isSavingProfile }] = useUpdateProfileMutation();
  const [changePassword, { isLoading: isSavingPassword }] = useChangePasswordMutation();

  const [step, setStep] = useState<Step>('contact');
  const [method, setMethod] = useState<AuthMethod>('phone');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [demoCode, setDemoCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isSavingFinal = isSavingProfile || isSavingPassword;

  async function handleSendCode(event: FormEvent) {
    event.preventDefault();

    if (!isCompletePhone(phone)) {
      setError("Telefon raqam to'liq emas. Masalan: 90 123 45 67");
      return;
    }
    setError(null);

    try {
      const result = await sendCode({ phone: toApiPhone(phone) }).unwrap();
      setDemoCode(result.demo_code ?? null);
      setCode('');
      setStep('code');
    } catch (cause) {
      setError(getApiErrorMessage(cause));
    }
  }

  async function handleVerify(event: FormEvent) {
    event.preventDefault();

    if (code.length !== CODE_LENGTH) {
      setError(`Kod ${CODE_LENGTH} xonali bo'lishi kerak`);
      return;
    }
    setError(null);

    try {
      const { user } = await verifyCode({ phone: toApiPhone(phone), code }).unwrap();

      /*
       * Bu raqamda hisob allaqachon bor edi — kod uni ochmadi, kiritdi.
       * Bunday holatda ism va parol so'ralmaydi: mavjud parolni jimgina
       * almashtirib yuborish mumkin emas.
       */
      if (isExistingAccount(user)) {
        router.push(cabinetPathFor(user));
        return;
      }

      setStep('profile');
    } catch (cause) {
      setError(getApiErrorMessage(cause));
    }
  }

  async function handleFinish(event: FormEvent) {
    event.preventDefault();

    if (!fullName.trim()) {
      setError('Ism familiyani kiriting');
      return;
    }

    const check = validatePassword(password);
    if (!check.valid) {
      setError(check.errors[0] ?? null);
      return;
    }
    setError(null);

    /*
     * Backend ismni `first_name` va `last_name` ko'rinishida kutadi:
     * birinchi so'z ism, qolgani familiya. Bitta so'z yozilsa familiya
     * bo'sh qoladi — ikkalasi ham ixtiyoriy.
     */
    const [firstName = '', ...rest] = fullName.trim().split(/\s+/);

    try {
      const user = await updateProfile({
        first_name: firstName,
        last_name: rest.join(' '),
      }).unwrap();

      /*
       * Parol ALOHIDA so'rov bilan qo'yiladi: SMS orqali ochilgan hisobda
       * parol umuman yo'q, shuning uchun `old_password` yuborilmaydi.
       */
      await changePassword({
        new_password: password,
        new_password_confirm: password,
      }).unwrap();

      router.push(cabinetPathFor(user));
    } catch (cause) {
      setError(getApiErrorMessage(cause));
    }
  }

  if (step === 'code') {
    return (
      <AuthCard>
        <AuthCardHeader
          icon={<ShieldCheck className="size-6" />}
          title="Raqamni tasdiqlang"
          subtitle={`+998 ${phone} raqamiga yuborilgan kodni kiriting.`}
        />

        <form onSubmit={handleVerify} className="flex flex-col gap-4">
          <OtpInput value={code} onChange={setCode} disabled={isVerifying} autoFocus />

          {/*
            SMS provayderi ulanmagan — backend kodni javobda qaytaradi va
            uni shu yerda ko'rsatamiz. Provayder ulangach `demo_code`
            kelmay qo'yadi va bu quti o'z-o'zidan yo'qoladi.
          */}
          {demoCode ? (
            <button
              type="button"
              onClick={() => setCode(demoCode)}
              className="rounded-lg border border-dashed border-amber-500/40 bg-amber-500/5 px-3 py-2 text-center text-xs text-muted-foreground transition-colors hover:bg-amber-500/10"
            >
              SMS hali ulanmagan. Sinov kodi:{' '}
              <span className="font-mono font-semibold text-amber-700 dark:text-amber-400">
                {demoCode}
              </span>{' '}
              — bosing, o&apos;zi qo&apos;yiladi.
            </button>
          ) : null}

          <AuthError message={error} />

          <AuthPrimaryButton
            type="submit"
            loading={isVerifying}
            disabled={code.length !== CODE_LENGTH}
          >
            {isVerifying && <Loader2 className="size-4 animate-spin" />}
            {isVerifying ? 'Tekshirilmoqda...' : 'Tasdiqlash'}
          </AuthPrimaryButton>

          <div className="flex items-center justify-between text-sm">
            <button
              type="button"
              onClick={() => {
                setStep('contact');
                setError(null);
              }}
              className="inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-4" />
              Raqamni o&apos;zgartirish
            </button>

            <button
              type="button"
              disabled={isSending}
              onClick={() =>
                void sendCode({ phone: toApiPhone(phone) })
                  .unwrap()
                  .then((result) => setDemoCode(result.demo_code ?? null))
                  .catch(() => setError("Kodni qayta yuborib bo'lmadi"))
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

  if (step === 'profile') {
    return (
      <AuthCard>
        <AuthCardHeader
          icon={<UserRound className="size-6" />}
          title="Ma'lumotlaringizni kiriting"
          subtitle="Raqam tasdiqlandi. Endi ism va parol qo'ying."
        />

        <form onSubmit={handleFinish} className="flex flex-col gap-4">
          <div>
            <AuthFieldLabel htmlFor="register-name">Ism familiya</AuthFieldLabel>
            <AuthInput
              id="register-name"
              required
              autoComplete="name"
              placeholder="Dilnoza Karimova"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
            />
          </div>

          <div>
            <AuthFieldLabel htmlFor="register-password">Parol</AuthFieldLabel>
            <AuthInput
              id="register-password"
              type="password"
              required
              autoComplete="new-password"
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <PasswordRequirements password={password} className="mt-2.5" />
          </div>

          <AuthError message={error} />

          <AuthPrimaryButton type="submit" loading={isSavingFinal}>
            {isSavingFinal && <Loader2 className="size-4 animate-spin" />}
            {isSavingFinal ? 'Saqlanmoqda...' : 'Yakunlash'}
          </AuthPrimaryButton>
        </form>
      </AuthCard>
    );
  }

  return (
    <AuthCard>
      <AuthCardHeader
        icon={<UserRound className="size-6" />}
        title="Ro'yxatdan o'tish"
        subtitle="Raqamingizni kiriting — tasdiqlash kodi yuboramiz."
      />

      <GoogleLoginButton />
      <AuthSeparator />

      <form onSubmit={handleSendCode} className="flex flex-col gap-4">
        <AuthMethodTabs value={method} onChange={setMethod} />

        <PhoneField id="register-phone" value={phone} onChange={setPhone} required />

        <AuthError message={error} />

        <AuthPrimaryButton type="submit" loading={isSending}>
          {isSending && <Loader2 className="size-4 animate-spin" />}
          {isSending ? 'Yuborilmoqda...' : 'Kod yuborish'}
        </AuthPrimaryButton>
      </form>

      <AuthCardFooter>
        Hisobingiz bormi?{' '}
        <Link
          href="/login"
          className="font-medium text-emerald-600 hover:underline dark:text-emerald-400"
        >
          Kiring
        </Link>
      </AuthCardFooter>
    </AuthCard>
  );
}
