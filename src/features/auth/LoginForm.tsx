'use client';

import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';

import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/Field';
import { getApiErrorMessage } from '@/shared/api';

import { useLoginMutation } from './authApi';
import { GoogleLoginButton } from './GoogleLoginButton';
import { cabinetPathFor } from './cabinetPath';

export function LoginForm() {
  const router = useRouter();
  const [login, { isLoading, error }] = useLoginMutation();

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const { user } = await login({ phone, password }).unwrap();
      router.push(cabinetPathFor(user));
    } catch {
      // Xato `error` orqali ko'rsatiladi — bu yerda jim o'tamiz,
      // aks holda konsolda ushlanmagan promise xatosi chiqadi.
    }
  }

  return (
    <div className="w-full max-w-sm">
      <h1 className="text-2xl font-bold tracking-tight text-foreground">Kirish</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Hisobingizga kiring va topshiriqlaringizni boshqaring.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
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
          autoComplete="current-password"
          placeholder="••••••••"
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
          {isLoading ? 'Kirilmoqda...' : 'Kirish'}
        </Button>
      </form>

      <GoogleLoginButton />

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Hisobingiz yo&apos;qmi?{' '}
        <Link
          href="/register"
          className="font-medium text-emerald-600 hover:underline dark:text-emerald-400"
        >
          Ro&apos;yxatdan o&apos;ting
        </Link>
      </p>

      {/* Mock backend bilan sinash uchun — real backendda olib tashlanadi. */}
      <p className="mt-6 rounded-lg border border-dashed border-border p-3 text-center text-xs text-muted-foreground">
        Sinov uchun: <span className="font-mono">+998901112233</span> /{' '}
        <span className="font-mono">parol123</span>
      </p>
    </div>
  );
}
