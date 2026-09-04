'use client';

import { AuthFieldLabel, AuthInput } from './AuthCard';
import { toNationalDigits } from './phone';

/**
 * Telefon maydoni — `+998` qismi alohida qutida, o'zgarmaydi.
 *
 * Dizayndagi ko'rinish shunday, lekin foyda faqat ko'rinishda emas:
 * kod maydonga kirmagani uchun foydalanuvchi uni ikki marta yozib
 * yubora olmaydi. Maydonga yopishtirilgan to'liq raqamdan ham `998`
 * qirqib tashlanadi.
 */
export function PhoneField({
  id,
  label = 'Telefon raqami',
  value,
  onChange,
  autoComplete = 'tel',
  required,
}: {
  id: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
  required?: boolean;
}) {
  return (
    <div>
      <AuthFieldLabel htmlFor={id}>{label}</AuthFieldLabel>

      <div className="flex gap-2">
        <span className="grid h-12 w-16 shrink-0 place-items-center rounded-xl border border-border bg-muted/50 text-sm font-medium text-muted-foreground dark:border-white/10 dark:bg-white/[0.04]">
          +998
        </span>

        <AuthInput
          id={id}
          type="tel"
          inputMode="numeric"
          autoComplete={autoComplete}
          required={required}
          placeholder="90 123 45 67"
          value={value}
          onChange={(event) => onChange(toNationalDigits(event.target.value))}
        />
      </div>
    </div>
  );
}
