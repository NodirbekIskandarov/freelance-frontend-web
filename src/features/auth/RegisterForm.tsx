'use client';

import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';

import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/Field';
import { getApiErrorMessage } from '@/shared/api';

import { useRegisterMutation } from './authApi';
import { cabinetPathFor } from './cabinetPath';

const MIN_PASSWORD_LENGTH = 8;

export function RegisterForm() {
  const router = useRouter();
  const [register, { isLoading, error }] = useRegisterMutation();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | undefined>();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (password.length < MIN_PASSWORD_LENGTH) {
      setPasswordError(`Parol kamida ${MIN_PASSWORD_LENGTH} ta belgidan iborat bo'lishi kerak`);
      return;
    }
    setPasswordError(undefined);

    try {
      const { user } = await register({ fullName, phone, password }).unwrap();
      router.push(cabinetPathFor(user));
    } catch {
      // Server xatosi `error` orqali ko'rsatiladi.
    }
  }

  return (
    <div className="w-full max-w-sm">
      <h1 className="text-2xl font-bold tracking-tight text-foreground">
        Ro&apos;yxatdan o&apos;tish
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Bir daqiqada hisob oching va topshiriqlarga kirish oling.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <TextField
          label="Ism familiya"
          required
          autoComplete="name"
          placeholder="Dilnoza Karimova"
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
        />

        <TextField
          label="Telefon raqam"
          type="tel"
          required
          autoComplete="tel"
          placeholder="+998 90 123 45 67"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
        />

        <TextField
          label="Parol"
          type="password"
          required
          autoComplete="new-password"
          placeholder="••••••••"
          hint={`Kamida ${MIN_PASSWORD_LENGTH} ta belgi`}
          error={passwordError}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        {error && (
          <p
            role="alert"
            className="rounded-lg bg-destructive/10 px-3.5 py-2.5 text-sm text-destructive"
          >
            {getApiErrorMessage(error)}
          </p>
        )}

        <Button
          type="submit"
          variant="emerald"
          size="lg"
          disabled={isLoading}
          className="mt-2 w-full"
        >
          {isLoading && <Loader2 className="size-4 animate-spin" />}
          {isLoading ? 'Yaratilmoqda...' : "Ro'yxatdan o'tish"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Hisobingiz bormi?{' '}
        <Link
          href="/login"
          className="font-medium text-emerald-600 hover:underline dark:text-emerald-400"
        >
          Kiring
        </Link>
      </p>
    </div>
  );
}
