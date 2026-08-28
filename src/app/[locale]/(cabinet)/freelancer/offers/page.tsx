import { FreelancerOffers } from '@/features/freelancer/FreelancerOffers';

export const metadata = { title: 'Takliflarim' };

export default function FreelancerOffersPage() {
  return (
    <>
      <h2 className="text-lg font-bold text-foreground">Takliflarim</h2>
      <div className="mt-4">
        <FreelancerOffers />
      </div>
    </>
  );
}
