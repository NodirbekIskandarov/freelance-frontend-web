import { FreelancerOffers } from '@/features/freelancer/FreelancerOffers';
import { DEFAULT_LOCALE, isLocale } from '@/i18n/config';
import { getMessages } from '@/i18n/messages';

export async function generateMetadata({ params }: PageProps<'/[locale]'>) {
  const { locale: raw } = await params;
  const m = await getMessages(isLocale(raw) ? raw : DEFAULT_LOCALE);

  return { title: m.cabinet.myOffers };
}

export default async function FreelancerOffersPage({ params }: PageProps<'/[locale]'>) {
  const { locale: raw } = await params;
  const m = await getMessages(isLocale(raw) ? raw : DEFAULT_LOCALE);

  return (
    <>
      <h2 className="text-lg font-bold text-foreground">{m.cabinet.myOffers}</h2>
      <div className="mt-4">
        <FreelancerOffers />
      </div>
    </>
  );
}
