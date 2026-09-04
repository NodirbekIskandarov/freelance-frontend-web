'use client';

import { Headphones, Sparkles, Wallet } from 'lucide-react';

import { Button, ButtonLink } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useT } from '@/i18n/useT';

/**
 * «To'ldirish» — to'lov tizimi ulanmaguncha.
 *
 * Tugma bor, lekin u yolg'on gapirmaydi. Payme/Click hali yo'q va
 * o'chirilgan tugma qo'yish ham, bosilganda hech nima qilmaydigan tugma
 * qo'yish ham savolga javob bermasdi: «unda pulni qanday qo'shaman?»
 *
 * Javob bor va u ishlaydi — operator hisobga qo'lda qo'shib qo'yadi
 * (admin panelda «Balansni to'ldirish» amali bor). Shu sababli oyna
 * holatni aytadi va ishlaydigan yo'lni ko'rsatadi.
 */
export function DepositModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { m } = useT();

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={m.wallet.depositTitle}
      className="w-[min(30rem,calc(100vw-2rem))]"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            {m.common.close}
          </Button>
          <ButtonLink href="/appeals" variant="emerald">
            <Headphones className="size-4" />
            {m.wallet.depositSupport}
          </ButtonLink>
        </>
      }
    >
      <div className="space-y-4">
        <p className="flex gap-3 rounded-xl border border-amber-500/40 bg-amber-500/[0.06] p-3.5 text-sm leading-relaxed text-amber-800 dark:text-amber-300">
          <Wallet className="mt-0.5 size-4 shrink-0" />
          {m.wallet.depositSoon}
        </p>

        {/* Ikkinchi yo'l — sotish. Bu shunchaki maslahat emas: balansga
            pul aynan shu tarzda tushishi mumkin va u bugun ishlaydi. */}
        <p className="flex gap-3 rounded-xl border border-border p-3.5 text-sm leading-relaxed text-muted-foreground">
          <Sparkles className="mt-0.5 size-4 shrink-0 text-brand" />
          {m.wallet.depositEarn}
        </p>
      </div>
    </Modal>
  );
}
