'use client';

import { useRef, type ClipboardEvent } from 'react';

import { cn } from '@/lib/cn';

const LENGTH = 6;

/**
 * Olti xonali tasdiqlash kodi.
 *
 * Har raqam alohida katakda: kod SMS'dan ko'chirib yoziladi va bitta uzun
 * maydonda qayeriga yetganini yo'qotib qo'yish oson. Yozilganda fokus
 * o'zi keyingisiga o'tadi, Backspace bo'sh katakda oldingisiga qaytaradi.
 */
export function OtpInput({
  value,
  onChange,
  disabled,
  autoFocus,
}: {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  autoFocus?: boolean;
}) {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const digits = value.padEnd(LENGTH, ' ').split('').slice(0, LENGTH);

  function updateAt(index: number, char: string) {
    const next = digits.map((digit, i) => (i === index ? char : digit === ' ' ? '' : digit));
    onChange(next.join('').replace(/\s/g, '').slice(0, LENGTH));
  }

  /* Butun kodni bir katakka yopishtirsa ham to'g'ri taqsimlanadi. */
  function handlePaste(event: ClipboardEvent<HTMLInputElement>) {
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, LENGTH);
    if (!pasted) return;

    event.preventDefault();
    onChange(pasted);
    inputsRef.current[Math.min(pasted.length, LENGTH - 1)]?.focus();
  }

  return (
    <div className="flex justify-center gap-2 sm:gap-2.5">
      {digits.map((digit, index) => (
        <input
          // Kataklar soni o'zgarmaydi va joyi qat'iy — indeks kalit sifatida xavfsiz.
          key={index}
          ref={(element) => {
            inputsRef.current[index] = element;
          }}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? 'one-time-code' : 'off'}
          aria-label={`Kodning ${index + 1}-raqami`}
          maxLength={1}
          disabled={disabled}
          autoFocus={autoFocus && index === 0}
          value={digit === ' ' ? '' : digit}
          onPaste={handlePaste}
          onChange={(event) => {
            const char = event.target.value.replace(/\D/g, '').slice(-1);
            updateAt(index, char);
            if (char && index < LENGTH - 1) inputsRef.current[index + 1]?.focus();
          }}
          onKeyDown={(event) => {
            if (event.key === 'Backspace' && !digit.trim() && index > 0) {
              inputsRef.current[index - 1]?.focus();
            }
          }}
          className={cn(
            'size-11 rounded-xl border border-border bg-background text-center text-lg font-semibold text-foreground transition-colors outline-none sm:size-12',
            'focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20',
            'disabled:opacity-60 dark:border-white/10 dark:bg-white/[0.04] dark:text-white',
          )}
        />
      ))}
    </div>
  );
}
