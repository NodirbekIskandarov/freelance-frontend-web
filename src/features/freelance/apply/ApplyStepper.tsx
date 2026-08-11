'use client';

import { Check } from 'lucide-react';

import { cn } from '@/lib/cn';

import { APPLY_STEPS } from './steps';

export function ApplyStepper({ current }: { current: number }) {
  return (
    <ol className="flex items-start gap-1 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden">
      {APPLY_STEPS.map((step, index) => {
        const isDone = index < current;
        const isCurrent = index === current;

        return (
          <li
            key={step.title}
            className="flex min-w-[92px] flex-1 flex-col items-center"
            aria-current={isCurrent ? 'step' : undefined}
          >
            <div className="flex w-full items-center">
              <span
                className={cn(
                  'mx-auto grid size-8 shrink-0 place-items-center rounded-full border text-xs font-bold',
                  isDone && 'border-emerald-600 bg-emerald-600 text-white',
                  isCurrent && 'border-emerald-600 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
                  !isDone && !isCurrent && 'border-border bg-muted text-muted-foreground',
                )}
              >
                {isDone ? <Check className="size-4" strokeWidth={3} /> : index + 1}
              </span>
            </div>
            <span
              className={cn(
                'mt-1.5 line-clamp-2 text-center text-[10px] leading-tight font-medium',
                isCurrent ? 'text-foreground' : 'text-muted-foreground',
              )}
            >
              {step.shortTitle}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
