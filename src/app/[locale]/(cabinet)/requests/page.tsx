import { MyRequests } from '@/features/requests/MyRequests';
import { DEFAULT_LOCALE, isLocale } from '@/i18n/config';
import { getMessages } from '@/i18n/messages';

export async function generateMetadata({ params }: PageProps<'/[locale]'>) {
  const { locale: raw } = await params;
  const m = await getMessages(isLocale(raw) ? raw : DEFAULT_LOCALE);

  return { title: m.cabinet.myRequests };
}

export default async function MyRequestsPage({ params }: PageProps<'/[locale]'>) {
  const { locale: raw } = await params;
  const m = await getMessages(isLocale(raw) ? raw : DEFAULT_LOCALE);

  return (
    <>
      <h2 className="text-lg font-bold text-foreground">{m.cabinet.myRequests}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{m.pages.requestsLead}</p>

      <div className="mt-5">
        <MyRequests />
      </div>
    </>
  );
}
