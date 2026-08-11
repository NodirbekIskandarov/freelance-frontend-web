import { Container } from '@/components/ui/Container';

import { FAQ } from './FAQ';
import { PopularSubjects } from './PopularSubjects';

export function LandingBottomGrid() {
  return (
    <section className="pt-10 pb-[40px] sm:pt-12" aria-label="Qo'shimcha ma'lumotlar">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-10 xl:gap-14">
          <PopularSubjects />
          <FAQ />
        </div>
      </Container>
    </section>
  );
}
