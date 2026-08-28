'use client';

import { KeyRound, Loader2 } from 'lucide-react';
import { Link } from '@/i18n/Link';
import { useState, type FormEvent } from 'react';

import { useT } from '@/i18n/useT';
import { getApiErrorMessage } from '@/shared/api';

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
import { useLoginMutation } from './authApi';
import { cabinetPathFor } from './cabinetPath';
import { GoogleLoginButton } from './GoogleLoginButton';
import { isCompletePhone, toApiPhone } from './phone';
import { PhoneField } from './PhoneField';
import { useLocaleRouter } from '@/i18n/useLocaleRouter';

export function LoginForm() {
  const router = useLocaleRouter();
  const { m } = useT();
  const [login, { isLoading, error }] = useLoginMutation();

  const [method, setMethod] = useState<AuthMethod>('phone');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    /*
     * Identifikator tanlangan usulga qarab yig'iladi. Telefon `+998…`
     * ko'rinishiga keltiriladi, email esa o'zgarishsiz ketadi — bir xil
     * maydon ikkalasini ham qabul qiladi va backend «@» belgisiga qarab
     * qaysi biri ekanini hal qiladi.
     */
    let identifier: string;

    if (method === 'email') {
      identifier = email.trim();
      if (!identifier.includes('@')) {
        setLocalError(m.auth.emailIncomplete);
        return;
      }
    } else {
      if (!isCompletePhone(phone)) {
        setLocalError(m.auth.phoneIncomplete);
        return;
      }
      identifier = toApiPhone(phone);
    }

    setLocalError(null);

    try {
      const { user } = await login({ identifier, password }).unwrap();
      router.push(cabinetPathFor(user));
    } catch {
      // Xato `error` orqali ko'rsatiladi — bu yerda jim o'tamiz,
      // aks holda konsolda ushlanmagan promise xatosi chiqadi.
    }
  }

  return (
    <AuthCard>
      <AuthCardHeader
        icon={<KeyRound className="size-6" />}
        title={m.auth.loginTitle}
        subtitle={m.auth.loginSubtitle}
      />

      <GoogleLoginButton />
      <AuthSeparator />

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Email endi ISHLAYDI: tasdiqlangan manzil kirish identifikatori.
            Tasdiqlanmagani rad etiladi — u hech kim egaligini isbotlamagan
            matn. */}
        <AuthMethodTabs value={method} onChange={setMethod} emailEnabled />

        {method === 'email' ? (
          <div>
            <AuthFieldLabel htmlFor="login-email">{m.auth.email}</AuthFieldLabel>
            <AuthInput
              id="login-email"
              type="email"
              required
              autoComplete="email"
              placeholder={m.auth.emailPlaceholder}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
        ) : (
          <PhoneField id="login-phone" value={phone} onChange={setPhone} required />
        )}

        <div>
          <div className="flex items-baseline justify-between gap-3">
            <AuthFieldLabel htmlFor="login-password">{m.auth.password}</AuthFieldLabel>
            {/* Havola aynan shu yerda: parol esdan chiqqani maydonga
                yozayotganda ma'lum bo'ladi, kartaning pastida emas. */}
            <Link
              href="/forgot-password"
              className="text-xs font-medium text-emerald-600 hover:underline dark:text-emerald-400"
            >
              {m.auth.forgot}
            </Link>
          </div>
          <AuthInput
            id="login-password"
            type="password"
            required
            autoComplete="current-password"
            placeholder={m.auth.passwordPlaceholder}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>

        <AuthError message={localError ?? (error ? getApiErrorMessage(error) : null)} />

        <AuthPrimaryButton type="submit" loading={isLoading}>
          {isLoading && <Loader2 className="size-4 animate-spin" />}
          {isLoading ? m.auth.submittingLogin : m.auth.submitLogin}
        </AuthPrimaryButton>
      </form>

      <AuthCardFooter>
        {m.auth.noAccount}{' '}
        <Link
          href="/register"
          className="font-medium text-emerald-600 hover:underline dark:text-emerald-400"
        >
          {m.auth.goRegister}
        </Link>
      </AuthCardFooter>
    </AuthCard>
  );
}
