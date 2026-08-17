import {
  useId,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from 'react';

import { cn } from '@/lib/cn';

const controlClass =
  'w-full rounded-lg border bg-background px-3.5 text-sm text-foreground transition-colors placeholder:text-muted-foreground/70 focus:border-emerald-500/60';

function FieldLabel({
  htmlFor,
  children,
  required,
}: {
  htmlFor: string;
  children: ReactNode;
  required?: boolean;
}) {
  return (
    <label htmlFor={htmlFor} className="mb-2 block text-sm font-medium text-foreground">
      {children}
      {required && (
        <span aria-hidden className="ml-0.5 text-destructive">
          *
        </span>
      )}
    </label>
  );
}

function FieldMessage({ id, error, hint }: { id: string; error?: string; hint?: ReactNode }) {
  if (error) {
    return (
      <p id={id} className="mt-1.5 text-xs text-destructive">
        {error}
      </p>
    );
  }
  return hint ? <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p> : null;
}

interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'className'> {
  label: string;
  hint?: ReactNode;
  error?: string;
  className?: string;
}

export function TextField({ label, hint, error, className, required, ...props }: TextFieldProps) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div className={className}>
      <FieldLabel htmlFor={id} required={required}>
        {label}
      </FieldLabel>

      <input
        id={id}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={cn('h-11', controlClass, error ? 'border-destructive' : 'border-border')}
        {...props}
      />

      <FieldMessage id={errorId} error={error} hint={hint} />
    </div>
  );
}

interface SelectFieldProps extends Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  'id' | 'className'
> {
  label: string;
  options: { value: string; label: string }[];
  hint?: ReactNode;
  error?: string;
  className?: string;
}

export function SelectField({
  label,
  options,
  hint,
  error,
  className,
  required,
  ...props
}: SelectFieldProps) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div className={className}>
      <FieldLabel htmlFor={id} required={required}>
        {label}
      </FieldLabel>

      <select
        id={id}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={cn('h-11', controlClass, error ? 'border-destructive' : 'border-border')}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <FieldMessage id={errorId} error={error} hint={hint} />
    </div>
  );
}

interface TextAreaFieldProps extends Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  'id' | 'className'
> {
  label: string;
  hint?: ReactNode;
  error?: string;
  className?: string;
}

export function TextAreaField({
  label,
  hint,
  error,
  className,
  required,
  ...props
}: TextAreaFieldProps) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div className={className}>
      <FieldLabel htmlFor={id} required={required}>
        {label}
      </FieldLabel>

      <textarea
        id={id}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={cn('py-2.5', controlClass, error ? 'border-destructive' : 'border-border')}
        {...props}
      />

      <FieldMessage id={errorId} error={error} hint={hint} />
    </div>
  );
}
