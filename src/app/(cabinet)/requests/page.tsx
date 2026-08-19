import { MyRequests } from '@/features/requests/MyRequests';

export const metadata = { title: 'Arizalarim' };

export default function MyRequestsPage() {
  return (
    <>
      <h2 className="text-lg font-bold text-foreground">Arizalarim</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Katalogga qo&apos;shishni so&apos;ragan institut, fan va topshiriqlaringiz — hamda ular
        bo&apos;yicha javob.
      </p>

      <div className="mt-5">
        <MyRequests />
      </div>
    </>
  );
}
