import { Container } from '@/components/ui/Container';
import { ExchangeBoard } from '@/features/freelance/ExchangeBoard';

/*
 * Bu sahifa `(cabinet)` guruhida: u yerdagi layout `noindex` metadata'sini
 * va `RequireAuth` qo'riqchisini beradi — birjaga aynan shu ikkisi kerak.
 * URL guruh nomidan mustaqil, shuning uchun manzil `/freelance/exchange`
 * bo'lib qolaveradi.
 */
export default function ExchangePage() {
  return (
    <Container className="py-8 sm:py-10">
      <ExchangeBoard />
    </Container>
  );
}
