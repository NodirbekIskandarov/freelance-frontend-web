import { ForgotPasswordForm } from '@/features/auth/ForgotPasswordForm';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Parolni tiklash',
  description:
    'Telefon raqam yoki email orqali tasdiqlash kodini oling va Yopamiz.uz hisobingiz parolini yangilang.',
  path: '/forgot-password',
});

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
