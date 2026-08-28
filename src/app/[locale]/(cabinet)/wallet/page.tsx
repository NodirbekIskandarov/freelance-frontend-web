import { WalletView } from '@/features/account/WalletView';

export const metadata = { title: 'Hamyon' };

export default function WalletPage() {
  return (
    <>
      <h2 className="text-lg font-bold text-foreground">Hamyon</h2>
      <p className="mt-1 text-sm text-muted-foreground">Balans va to&apos;lovlar tarixi.</p>

      <div className="mt-5">
        <WalletView />
      </div>
    </>
  );
}
