import type { ReactNode } from 'react';

import { CabinetShell } from '@/components/layout/CabinetShell';

export default function FreelancerLayout({ children }: { children: ReactNode }) {
  return <CabinetShell variant="freelancer">{children}</CabinetShell>;
}
