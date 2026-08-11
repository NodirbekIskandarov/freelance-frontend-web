import { getApiErrorMessage } from '@/shared/api';

/** RTK Query xatosini bir xil ko'rinishda chiqaradi. */
export function ErrorNotice({ error }: { error: unknown }) {
  return (
    <p role="alert" className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
      {getApiErrorMessage(error)}
    </p>
  );
}
