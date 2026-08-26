'use client';

import { KeyRound, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
import { useLoginMutation } from './authApi';
import { cabinetPathFor } from './cabinetPath';
import { GoogleLoginButton } from './GoogleLoginButton';
import { isCompletePhone, toApiPhone } from './phone';
import { PhoneField } from './PhoneField';

export function LoginForm() {
  const router = useRouter();
  const [login, { isLoading, error }] = useLoginMutation();

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isCompletePhone(phone)) {
      setLocalError("Telefon raqam to'liq emas. Masalan: 90 123 45 67");
      return;
    }
    setLocalError(null);

    try {
      const { user } = await login({ phone: toApiPhone(phone), password }).unwrap();
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
        title="Kirish"
        subtitle="Telefon raqamingiz va parol bilan kiring."
      />

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <PhoneField id="login-phone" value={phone} onChange={setPhone} required />

        <div>
          <AuthFieldLabel htmlFor="login-password">Parol</AuthFieldLabel>
          <AuthInput
            id="login-password"
            type="password"
            required
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>

        <AuthError message={localError ?? (error ? getApiErrorMessage(error) : null)} />

        <AuthPrimaryButton type="submit" loading={isLoading}>
          {isLoading && <Loader2 className="size-4 animate-spin" />}
          {isLoading ? 'Kirilmoqda...' : 'Kirish'}
        </AuthPrimaryButton>
      </form>

      <GoogleLoginButton />

      <AuthCardFooter>
        Hisobingiz yo&apos;qmi?{' '}
        <Link
          href="/register"
          className="font-medium text-emerald-600 hover:underline dark:text-emerald-400"
        >
          Ro&apos;yxatdan o&apos;ting
        </Link>
      </AuthCardFooter>
    </AuthCard>
  );
}
