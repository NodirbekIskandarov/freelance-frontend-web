import { Container } from '@/components/ui/Container';
import { ExchangeBoard } from '@/features/freelance/ExchangeBoard';

export default function ExchangePage() {
  return (
    <Container className="py-8 sm:py-10">
      <ExchangeBoard />
    </Container>
  );
}
