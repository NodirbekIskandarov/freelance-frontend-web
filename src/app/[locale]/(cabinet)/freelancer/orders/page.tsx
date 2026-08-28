import { FreelancerOrders } from '@/features/freelancer/FreelancerOrders';

export const metadata = { title: 'Buyurtmalar' };

export default function FreelancerOrdersPage() {
  return (
    <>
      <h2 className="text-lg font-bold text-foreground">Qabul qilingan ishlar</h2>
      <div className="mt-4">
        <FreelancerOrders />
      </div>
    </>
  );
}
