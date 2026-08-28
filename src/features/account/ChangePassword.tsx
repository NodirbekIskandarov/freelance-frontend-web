'use client';

import { Check, KeyRound, Loader2 } from 'lucide-react';
import { useState, type FormEvent } from 'react';

import { Button } from '@/components/ui/Button';
import { useChangePasswordMutation } from '@/features/auth/authApi';
import { PasswordRequirements } from '@/features/auth/PasswordRequirements';
import { validatePassword } from '@/features/auth/passwordPolicy';
import { useT } from '@/i18n/useT';
import { getApiErrorMessage } from '@/shared/api/errors';

import { useGetLoginMethodsQuery } from './identitiesApi';

/**
 * Profildagi «parolni o'zgartirish».
 *
 * Ikki holat, bitta forma: paroli BOR hisob eskisini yozadi, PAROLI YO'Q
 * hisob (SMS kodi yoki Google orqali ochilgani) esa birinchi parolini
 * qo'yadi. Ikkinchisidan eski parolni so'rash javobi yo'q savol bo'lardi
 * — u yerda yozadigan narsa yo'q.
 *
 * Qaysi holat ekani serverdan (`has_password`) o'qiladi, taxmin
 * qilinmaydi: hisob qanday ochilganini faqat backend biladi.
 *
 * Forma yopiq turadi — parol maydonlari doim ochiq turgan profil sahifasi
 * brauzerning avtoto'ldirishini chalg'itadi va tasodifiy o'zgartirishga
 * yaqinlashtiradi.
 */
const fieldClass =
  'h-11 w-full rounded-xl border border-border/70 bg-background px-3 text-sm text-foreground transition-colors outline-none placeholder:text-muted-foreground/70 focus-visible:border-emerald-500/60 focus-visible:ring-3 focus-visible:ring-emerald-500/20';

export function ChangePassword() {
  const { m } = useT();
  const { data } = useGetLoginMethodsQuery();
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const [open, setOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  /* Ma'lumot kelgunicha parol bor deb hisoblaymiz: eski parol maydonini
     keyin YO'QOTISH uni keraksiz joyda ko'rsatishdan kam chalg'itadi. */
  const hasPassword = data?.has_password ?? true;

  function reset() {
    setOldPassword('');
    setPassword('');
    setConfirmPassword('');
    setError(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setDone(false);

    if (!validatePassword(password).valid) {
      setError(m.changePassword.weak);
      return;
    }
    if (password !== confirmPassword) {
      setError(m.changePassword.mismatch);
      return;
    }

    try {
      await changePassword({
        // Paroli yo'q hisob uchun maydon UMUMAN yuborilmaydi — bo'sh
        // qator ham "eski parol" deb tekshiriladi va rad etilardi.
        ...(hasPassword ? { old_password: oldPassword } : {}),
        new_password: password,
        new_password_confirm: confirmPassword,
      }).unwrap();

      reset();
      setOpen(false);
      setDone(true);
    } catch (changeError) {
      setError(getApiErrorMessage(changeError));
    }
  }

  return (
    <div className="rounded-xl border border-border/60 bg-background p-5 dark:border-zinc-800 dark:bg-zinc-900/70">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <KeyRound className="size-4 text-emerald-600 dark:text-emerald-400" />
            {hasPassword ? m.changePassword.titleChange : m.changePassword.titleSet}
          </h3>
          <p className="mt-1 max-w-lg text-xs leading-relaxed text-muted-foreground">
            {hasPassword ? m.changePassword.descChange : m.changePassword.descSet}
          </p>
        </div>

        {!open && (
          <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
            {hasPassword ? m.changePassword.actionChange : m.changePassword.actionSet}
          </Button>
        )}
      </div>

      {done && !open && (
        <p className="mt-3 flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs font-medium text-emerald-700 dark:text-emerald-300">
          <Check className="size-3.5" />
          {m.changePassword.done}
        </p>
      )}

      {open && (
        <form onSubmit={handleSubmit} className="mt-4 space-y-3 border-t border-border/50 pt-4">
          {hasPassword && (
            <div>
              <label
                htmlFor="current-password"
                className="mb-1.5 block text-xs font-medium text-foreground"
              >
                {m.changePassword.current}
              </label>
              <input
                id="current-password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                value={oldPassword}
                onChange={(event) => setOldPassword(event.target.value)}
                className={fieldClass}
              />
            </div>
          )}

          <div>
            <label
              htmlFor="new-password"
              className="mb-1.5 block text-xs font-medium text-foreground"
            >
              {m.changePassword.new}
            </label>
            <input
              id="new-password"
              type="password"
              required
              autoComplete="new-password"
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className={fieldClass}
            />
          </div>

          <PasswordRequirements password={password} />

          <div>
            <label
              htmlFor="new-password-confirm"
              className="mb-1.5 block text-xs font-medium text-foreground"
            >
              {m.changePassword.repeat}
            </label>
            <input
              id="new-password-confirm"
              type="password"
              required
              autoComplete="new-password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className={fieldClass}
            />
          </div>

          {error && (
            <p role="alert" className="text-xs text-destructive">
              {error}
            </p>
          )}

          <div className="flex flex-wrap gap-2">
            <Button type="submit" variant="emerald" size="sm" disabled={isLoading}>
              {isLoading && <Loader2 className="size-3.5 animate-spin" />}
              {isLoading ? m.common.saving : m.common.save}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                reset();
                setOpen(false);
              }}
            >
              {m.common.cancel}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
