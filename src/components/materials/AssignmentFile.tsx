'use client';

import { Download, ExternalLink, FileText } from 'lucide-react';
import { useState } from 'react';

import { useT } from '@/i18n/useT';

/**
 * Topshiriq sharti — variantlar ustidagi fayl.
 *
 * PDF sahifaning O'ZIDA ochiladi: talaba shartni o'qimasdan qaysi
 * variantni tanlashini bilmaydi, fayl yuklab olib, ochib, qaytib
 * kelish esa uzun yo'l. Qolgan formatlar (zip, docx, xlsx) brauzerda
 * ko'rsatilmaydi — ular uchun faqat yuklab olish qoladi, chunki
 * "ochish" tugmasi bosilganda baribir yuklab olish oynasi chiqardi.
 */
function isPdf(url: string): boolean {
  // So'rov parametrlari (MinIO imzolangan havolasi) kengaytmadan keyin
  // keladi — ularni kesib tashlaymiz, aks holda hech bir fayl PDF
  // bo'lib ko'rinmasdi.
  return /\.pdf$/i.test(new URL(url, 'http://x').pathname);
}

function fileNameOf(url: string): string {
  const path = new URL(url, 'http://x').pathname;
  return decodeURIComponent(path.split('/').pop() || '');
}

export function AssignmentFile({ url }: { url: string }) {
  const { m } = useT();
  const [open, setOpen] = useState(true);

  if (!url) return null;

  const pdf = isPdf(url);
  const name = fileNameOf(url);

  return (
    <section className="mt-4 rounded-xl border border-border/70 bg-card">
      <div className="flex flex-wrap items-center gap-2 px-3.5 py-3">
        <FileText className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />

        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-semibold text-foreground">{m.assignmentFile.title}</p>
          <p className="truncate text-[11px] text-muted-foreground" title={name}>
            {name}
          </p>
        </div>

        {/*
          `download` atributi ATAYLAB yo'q: fayl boshqa domendan
          (MinIO) keladi va u yerda brauzer uni e'tiborsiz qoldiradi.
          Yuklab olishni sarlavhalar hal qiladi.
        */}
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-emerald-600 px-3 text-xs font-semibold text-white transition-colors hover:bg-emerald-500"
        >
          <Download className="size-3.5" />
          {m.assignmentFile.download}
        </a>

        {pdf && (
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border px-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            {open ? m.assignmentFile.hide : m.assignmentFile.show}
          </button>
        )}
      </div>

      {pdf && open && (
        <div className="border-t border-border/60 p-2">
          {/*
            `<object>`, `<iframe>` emas: PDF ko'rsatgichi yo'q brauzerda
            `<object>` ichidagi zaxira mazmunni chizadi va odam bo'sh
            oq to'rtburchak o'rniga havolani ko'radi.
          */}
          <object
            data={url}
            type="application/pdf"
            className="h-[60vh] max-h-[560px] w-full rounded-lg"
            aria-label={m.assignmentFile.title}
          >
            <p className="px-3 py-6 text-center text-xs text-muted-foreground">
              {m.assignmentFile.cannotShow}{' '}
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-medium text-emerald-600 hover:underline dark:text-emerald-400"
              >
                {m.assignmentFile.openInNewTab}
                <ExternalLink className="size-3" />
              </a>
            </p>
          </object>
        </div>
      )}
    </section>
  );
}
