'use client';

import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import { useT } from '@/i18n/useT';

/** Topshiriqda yechim bor-yo'qligi — yon ro'yxatdagi rangli nuqta bilan bir xil mantiq. */
export type TaskAvailability = 'has_solution' | 'demand' | 'missing';

export type TaskFilters = {
  availability: 'all' | TaskAvailability;
  format: 'all' | 'with_variants' | 'without_variants';
};

export const DEFAULT_TASK_FILTERS: TaskFilters = {
  availability: 'all',
  format: 'all',
};

export function hasActiveTaskFilters(filters: TaskFilters): boolean {
  return filters.availability !== 'all' || filters.format !== 'all';
}

const AVAILABILITY_OPTIONS = [
  { value: 'all', label: 'Holat: barchasi' },
  { value: 'has_solution', label: 'Yechim bor' },
  { value: 'demand', label: 'Talab mavjud' },
  { value: 'missing', label: "Yechim yo'q" },
];

const FORMAT_OPTIONS = [
  { value: 'all', label: 'Format: barchasi' },
  { value: 'with_variants', label: 'Variantli' },
  { value: 'without_variants', label: 'Variantsiz' },
];

/**
 * Topshiriqlar ro'yxati uchun filtr.
 *
 * Kurs, semestr va yil ATAYLAB yo'q: backend bu maydonlarni topshiriqda
 * emas, fanda saqlaydi — bir fan ichidagi barcha topshiriqda ular bir xil,
 * shuning uchun bunday filtr hech qachon ro'yxatni o'zgartirmasdi.
 * O'rniga topshiriqdan topshiriqqa haqiqatan farq qiladigan ikki narsa
 * qoldirildi: yechim holati va variant formati.
 */
export function TaskFilterModal({
  open,
  filters,
  onChange,
  onClose,
  onReset,
}: {
  open: boolean;
  filters: TaskFilters;
  onChange: (next: TaskFilters) => void;
  onClose: () => void;
  onReset: () => void;
}) {
  const { m } = useT();

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={m.ui.filters}
      description={m.ui.filtersDesc}
      className="w-[min(24rem,calc(100vw-2rem))]"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onReset}>
            Tozalash
          </Button>
          <Button
            size="sm"
            className="bg-emerald-600 text-white hover:bg-emerald-700"
            onClick={onClose}
          >
            Qo&apos;llash
          </Button>
        </>
      }
    >
      <div className="space-y-3">
        <Select
          aria-label="Yechim holati"
          value={filters.availability}
          onChange={(availability) =>
            onChange({ ...filters, availability: availability as TaskFilters['availability'] })
          }
          triggerClassName="h-9"
          options={AVAILABILITY_OPTIONS}
        />

        <Select
          aria-label="Variant formati"
          value={filters.format}
          onChange={(format) => onChange({ ...filters, format: format as TaskFilters['format'] })}
          triggerClassName="h-9"
          options={FORMAT_OPTIONS}
        />
      </div>
    </Modal>
  );
}
