import { FreelancerDashboard } from '@/features/freelancer/FreelancerDashboard';
import { DEFAULT_LOCALE, isLocale } from '@/i18n/config';
import { getMessages } from '@/i18n/messages';

export async function generateMetadata({ params }: PageProps<'/[locale]'>) {
  const { locale: raw } = await params;
  const m = await getMessages(isLocale(raw) ? raw : DEFAULT_LOCALE);

  return { title: m.cabinet.home };
}

export default function FreelancerDashboardPage() {
  return <FreelancerDashboard />;
}
