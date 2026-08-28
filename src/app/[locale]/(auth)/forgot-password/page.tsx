import { ForgotPasswordForm } from '@/features/auth/ForgotPasswordForm';
import { DEFAULT_LOCALE, isLocale } from '@/i18n/config';
import { getMessages } from '@/i18n/messages';
import { buildMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: PageProps<'/[locale]'>) {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : DEFAULT_LOCALE;
  const m = (await getMessages(locale)).seo.forgot;

  return buildMetadata({
    title: m.title,
    description: m.description,
    path: '/forgot-password',
    locale,
  });
}

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
