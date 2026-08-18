import { OpenTaskBoard } from '@/features/freelancer/OpenTaskBoard';

export const metadata = { title: 'Ochiq topshiriqlar' };

export default function FreelancerBoardPage() {
  return (
    <>
      <h2 className="text-lg font-bold text-foreground">Ochiq topshiriqlar</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Mijozlar joylagan topshiriqlar. Mos kelganiga taklif yuboring.
      </p>
      <div className="mt-4">
        <OpenTaskBoard />
      </div>
    </>
  );
}
