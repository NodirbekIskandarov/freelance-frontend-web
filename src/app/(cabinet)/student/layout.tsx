import type { ReactNode } from 'react';

import { CabinetShell } from '@/components/layout/CabinetShell';

export default function StudentLayout({ children }: { children: ReactNode }) {
  return <CabinetShell variant="student">{children}</CabinetShell>;
}
