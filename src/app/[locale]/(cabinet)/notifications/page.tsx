import { NotificationList } from '@/features/notifications/NotificationList';
import { DEFAULT_LOCALE, isLocale } from '@/i18n/config';
import { getMessages } from '@/i18n/messages';

export async function generateMetadata({ params }: PageProps<'/[locale]'>) {
  const { locale: raw } = await params;
  const m = await getMessages(isLocale(raw) ? raw : DEFAULT_LOCALE);

  return { title: m.cabinet.notifications };
}

export default async function NotificationsPage({ params }: PageProps<'/[locale]'>) {
  const { locale: raw } = await params;
  const m = await getMessages(isLocale(raw) ? raw : DEFAULT_LOCALE);

  return (
    <>
      <h2 className="text-lg font-bold text-foreground">{m.cabinet.notifications}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{m.pages.notificationsLead}</p>

      <div className="mt-5">
        <NotificationList />
      </div>
    </>
  );
}
