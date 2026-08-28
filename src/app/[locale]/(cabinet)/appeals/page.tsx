import { Appeals } from '@/features/account/Appeals';
import { DEFAULT_LOCALE, isLocale } from '@/i18n/config';
import { getMessages } from '@/i18n/messages';

export async function generateMetadata({ params }: PageProps<'/[locale]'>) {
  const { locale: raw } = await params;
  const m = await getMessages(isLocale(raw) ? raw : DEFAULT_LOCALE);

  return { title: m.cabinet.appeals };
}

export default async function AppealsPage({ params }: PageProps<'/[locale]'>) {
  const { locale: raw } = await params;
  const m = await getMessages(isLocale(raw) ? raw : DEFAULT_LOCALE);

  return (
    <>
      <h2 className="text-lg font-bold text-foreground">{m.cabinet.appeals}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{m.pages.appealsLead}</p>

      <div className="mt-5">
        <Appeals />
      </div>
    </>
  );
}
