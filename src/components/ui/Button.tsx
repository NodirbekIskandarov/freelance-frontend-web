import { cva, type VariantProps } from 'class-variance-authority';
import Link from 'next/link';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react';

import { cn } from '@/lib/cn';

export const buttonVariants = cva(
  'inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg border border-transparent text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4',
  {
    variants: {
      variant: {
        default: 'bg-foreground text-background hover:bg-foreground/85',
        emerald: 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-400',
        outline: 'border-border bg-background hover:bg-muted hover:text-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-muted hover:text-foreground',
        link: 'text-emerald-600 underline-offset-4 hover:underline dark:text-emerald-400',
      },
      size: {
        default: 'h-9 px-4',
        sm: 'h-8 px-3 text-[0.8rem]',
        lg: 'h-12 px-7 text-base',
        icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, type = 'button', ...props }: ButtonProps) {
  return (
    <button type={type} className={cn(buttonVariants({ variant, size, className }))} {...props} />
  );
}

interface ButtonLinkProps
  extends AnchorHTMLAttributes<HTMLAnchorElement>, VariantProps<typeof buttonVariants> {
  href: string;
}

/** `<Link>` ustiga tugma ko'rinishi — CTA'lar odatda navigatsiya, `<button>` emas. */
export function ButtonLink({ className, variant, size, href, ...props }: ButtonLinkProps) {
  return (
    <Link href={href} className={cn(buttonVariants({ variant, size, className }))} {...props} />
  );
}
