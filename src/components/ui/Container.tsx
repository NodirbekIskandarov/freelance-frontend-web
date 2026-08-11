import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';

/** Sahifa kengligini bir joyda ushlab turadi — barcha bo'limlar shu ichida. */
export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn('mx-auto w-full max-w-6xl px-4 sm:px-6', className)}>{children}</div>;
}
