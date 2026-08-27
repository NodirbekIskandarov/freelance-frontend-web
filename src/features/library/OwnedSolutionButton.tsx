'use client';

import { Download } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/Button';

import { useLazyGetLibraryItemQuery } from './libraryApi';

/**
 * Sotib olingan yechim uchun yuklab olish tugmasi — katalogning o'zida.
 *
 * Ilgari katalogda faqat "Sotib olish" bo'lardi va sotib olingan yechimda
 * ham o'sha turardi: bosilganda server «You already own this solution»
 * deb rad qilardi. Endi egalik serverdan biladi va tugma o'rniga faylni
 * beradi.
 *
 * Fayl havolasi ro'yxatda kelmaydi — u faqat kutubxona tafsilotida
 * beriladi, shuning uchun bosilganda avval tafsilot olinadi.
 */
export function OwnedSolutionButton({
  solutionId,
  className,
}: {
  solutionId: string;
  className?: string;
}) {
  const [fetchItem, { isFetching }] = useLazyGetLibraryItemQuery();
  const [error, setError] = useState<string | null>(null);

  async function handleDownload() {
    setError(null);

    try {
      const detail = await fetchItem(solutionId).unwrap();
      if (!detail.solution.file) {
        setError('Fayl topilmadi');
        return;
      }
      window.open(detail.solution.file, '_blank', 'noopener');
    } catch {
      setError('Yuklab olishda xato');
    }
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className={className}
        disabled={isFetching}
        onClick={() => void handleDownload()}
      >
        {isFetching ? (
          'Ochilmoqda…'
        ) : (
          <>
            <Download className="size-3.5" />
            Yuklab olish
          </>
        )}
      </Button>

      {error && (
        <p role="alert" className="mt-1 text-[11px] text-destructive">
          {error}
        </p>
      )}
    </>
  );
}
