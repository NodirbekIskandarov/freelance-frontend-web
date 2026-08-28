import { NotificationList } from '@/features/notifications/NotificationList';

export const metadata = { title: 'Bildirishnomalar' };

export default function NotificationsPage() {
  return (
    <>
      <h2 className="text-lg font-bold text-foreground">Bildirishnomalar</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Buyurtma, taklif, to&apos;lov va moderatsiya bo&apos;yicha barcha xabarlar.
      </p>

      <div className="mt-5">
        <NotificationList />
      </div>
    </>
  );
}
