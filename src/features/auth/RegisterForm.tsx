'use client';

import { ArrowLeft, Loader2, ShieldCheck, UserRound } from 'lucide-react';
import { Link } from '@/i18n/Link';
import { useState, type FormEvent } from 'react';

import { useUpdateProfileMutation } from '@/features/profile/profileApi';
import { useT } from '@/i18n/useT';
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
import { useLocaleRouter } from '@/i18n/useLocaleRouter';

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
  const router = useLocaleRouter();
  const { t, m } = useT();

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
      setError(m.auth.phoneIncomplete);
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
      setError(t((x) => x.register.codeLength, { length: CODE_LENGTH }));
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
      setError(m.register.fullNameRequired);
      return;
    }

    const check = validatePassword(password);
    if (!check.valid) {
      setError(check.failed[0] ? m.password[check.failed[0]] : null);
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
          title={m.register.codeTitle}
          subtitle={t((x) => x.register.codeSubtitle, { phone })}
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
              {t((x) => x.register.demoHint, { code: demoCode })}
            </button>
          ) : null}

          <AuthError message={error} />

          <AuthPrimaryButton
            type="submit"
            loading={isVerifying}
            disabled={code.length !== CODE_LENGTH}
          >
            {isVerifying && <Loader2 className="size-4 animate-spin" />}
            {isVerifying ? m.register.verifying : m.register.verify}
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
              {m.register.changePhone}
            </button>

            <button
              type="button"
              disabled={isSending}
              onClick={() =>
                void sendCode({ phone: toApiPhone(phone) })
                  .unwrap()
                  .then((result) => setDemoCode(result.demo_code ?? null))
                  .catch(() => setError(m.register.resendFailed))
              }
              className="font-medium text-brand transition-colors hover:underline disabled:opacity-60"
            >
              {isSending ? m.register.sending : m.register.resend}
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
          title={m.register.profileTitle}
          subtitle={m.register.profileSubtitle}
        />

        <form onSubmit={handleFinish} className="flex flex-col gap-4">
          <div>
            <AuthFieldLabel htmlFor="register-name">{m.register.fullName}</AuthFieldLabel>
            <AuthInput
              id="register-name"
              required
              autoComplete="name"
              placeholder={m.register.fullNamePlaceholder}
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
            />
          </div>

          <div>
            <AuthFieldLabel htmlFor="register-password">{m.auth.password}</AuthFieldLabel>
            <AuthInput
              id="register-password"
              type="password"
              required
              autoComplete="new-password"
              placeholder={m.auth.passwordPlaceholder}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <PasswordRequirements password={password} className="mt-2.5" />
          </div>

          <AuthError message={error} />

          <AuthPrimaryButton type="submit" loading={isSavingFinal}>
            {isSavingFinal && <Loader2 className="size-4 animate-spin" />}
            {isSavingFinal ? m.common.saving : m.register.finish}
          </AuthPrimaryButton>
        </form>
      </AuthCard>
    );
  }

  return (
    <AuthCard>
      <AuthCardHeader
        icon={<UserRound className="size-6" />}
        title={m.register.title}
        subtitle={m.register.subtitle}
      />

      <GoogleLoginButton />
      <AuthSeparator />

      <form onSubmit={handleSendCode} className="flex flex-col gap-4">
        <AuthMethodTabs value={method} onChange={setMethod} />

        <PhoneField id="register-phone" value={phone} onChange={setPhone} required />

        <AuthError message={error} />

        <AuthPrimaryButton type="submit" loading={isSending}>
          {isSending && <Loader2 className="size-4 animate-spin" />}
          {isSending ? m.register.sending : m.register.sendCode}
        </AuthPrimaryButton>
      </form>

      <AuthCardFooter>
        {m.register.haveAccount}{' '}
        <Link
          href="/login"
          className="font-medium text-brand hover:underline"
        >
          {m.register.goLogin}
        </Link>
      </AuthCardFooter>
    </AuthCard>
  );
}
