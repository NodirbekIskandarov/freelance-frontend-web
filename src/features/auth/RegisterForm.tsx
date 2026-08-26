'use client';

import { Loader2, UserRound } from 'lucide-react';
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
import { useRegisterMutation } from './authApi';
import { cabinetPathFor } from './cabinetPath';
import { PasswordRequirements } from './PasswordRequirements';
import { validatePassword } from './passwordPolicy';
import { isCompletePhone, toApiPhone } from './phone';
import { PhoneField } from './PhoneField';

export function RegisterForm() {
  const router = useRouter();
  const [register, { isLoading, error }] = useRegisterMutation();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isCompletePhone(phone)) {
      setLocalError("Telefon raqam to'liq emas. Masalan: 90 123 45 67");
      return;
    }

    const check = validatePassword(password);
    if (!check.valid) {
      setLocalError(check.errors[0] ?? null);
      return;
    }

    setLocalError(null);

    /*
     * Backend ismni bitta maydonda emas, `first_name` va `last_name`
     * ko'rinishida kutadi. Foydalanuvchidan ikkita maydon so'ramaymiz —
     * birinchi so'z ism, qolgani familiya deb bo'linadi. Bitta so'z
     * yozilsa familiya bo'sh qoladi, backend buni qabul qiladi
     * (ikkalasi ham ixtiyoriy).
     */
    const [firstName = '', ...rest] = fullName.trim().split(/\s+/);

    try {
      const { user } = await register({
        phone: toApiPhone(phone),
        password,
        password_confirm: password,
        first_name: firstName,
        last_name: rest.join(' '),
      }).unwrap();
      router.push(cabinetPathFor(user));
    } catch {
      // Server xatosi `error` orqali ko'rsatiladi.
    }
  }

  return (
    <AuthCard>
      <AuthCardHeader
        icon={<UserRound className="size-6" />}
        title="Ro'yxatdan o'tish"
        subtitle="Bir daqiqada hisob oching va topshiriqlarga kirish oling."
      />

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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

        <PhoneField id="register-phone" value={phone} onChange={setPhone} required />

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

        <AuthError message={localError ?? (error ? getApiErrorMessage(error) : null)} />

        <AuthPrimaryButton type="submit" loading={isLoading}>
          {isLoading && <Loader2 className="size-4 animate-spin" />}
          {isLoading ? 'Yaratilmoqda...' : "Ro'yxatdan o'tish"}
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
