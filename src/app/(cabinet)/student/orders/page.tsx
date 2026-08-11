import { StudentOrders } from '@/features/student/StudentOrders';

export const metadata = { title: 'Buyurtmalar' };

export default function StudentOrdersPage() {
  return (
    <>
      <h2 className="text-lg font-bold text-foreground">Buyurtmalar</h2>
      <div className="mt-4">
        <StudentOrders />
      </div>
    </>
  );
}
