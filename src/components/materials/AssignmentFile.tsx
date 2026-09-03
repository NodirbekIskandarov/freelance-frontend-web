'use client';

import { Download, ExternalLink, FileText } from 'lucide-react';
import { useState } from 'react';

import { useT } from '@/i18n/useT';

import { DocxPreview } from './DocxPreview';

/**
 * Topshiriq sharti — variantlar ustidagi fayl.
 *
 * Fayl sahifaning O'ZIDA ochiladi, lekin FAQAT so'ralganda: talaba
 * shartni o'qimasdan qaysi variantni tanlashini bilmaydi, ammo o'sha
 * shartni allaqachon biladigan odam uchun ochiq turgan ko'rsatgich
 * variantlar to'rini ekrandan pastga surib yuborardi — va u aynan shu
 * sahifaga kelgan maqsad.
 *
 * PDF va rasmni brauzerning o'zi chizadi, `.docx` esa [DocxPreview] da
 * HTML'ga aylantiriladi. Qolgan formatlar (zip, xlsx, eski `.doc`) uchun
 * ko'rsatgich yo'q — ular uchun faqat yuklab olish qoladi, chunki
 * "ochish" tugmasi bosilganda baribir yuklab olish oynasi chiqardi.
 */
type FileKind = 'pdf' | 'docx' | 'image' | 'other';

function extensionOf(url: string): string {
  // So'rov parametrlari (MinIO imzolangan havolasi) kengaytmadan keyin
  // keladi — ularni kesib tashlaymiz, aks holda hech bir fayl tanilmasdi.
  const path = new URL(url, 'http://x').pathname;
  return (path.split('.').pop() ?? '').toLowerCase();
}

function kindOf(url: string): FileKind {
  const extension = extensionOf(url);

  if (extension === 'pdf') return 'pdf';
  if (extension === 'docx') return 'docx';
  if (['png', 'jpg', 'jpeg', 'webp', 'gif', 'avif'].includes(extension)) return 'image';

  return 'other';
}

function fileNameOf(url: string): string {
  const path = new URL(url, 'http://x').pathname;
  return decodeURIComponent(path.split('/').pop() || '');
}

export function AssignmentFile({ url }: { url: string }) {
  const { m } = useT();
  const [open, setOpen] = useState(false);

  if (!url) return null;

  const kind = kindOf(url);
  const name = fileNameOf(url);
  const canShow = kind !== 'other';

  return (
    <section className="mt-4 rounded-xl border border-border/70 bg-card">
      <div className="flex flex-wrap items-center gap-2 px-3.5 py-3">
        {/* Tor ekranda sarlavha o'z qatorini oladi va tugmalar tagiga
            tushadi: bitta qatorga tiqilganda fayl nomi ikki harfgacha
            qisqarardi. */}
        <div className="flex min-w-0 flex-1 basis-full items-center gap-2 sm:basis-0">
          <FileText className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />

          <div className="min-w-0">
            <p className="text-[13px] font-semibold text-foreground">{m.assignmentFile.title}</p>
            <p className="truncate text-[11px] text-muted-foreground" title={name}>
              {name}
            </p>
          </div>
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

        {canShow && (
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border px-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            {open ? m.assignmentFile.hide : m.assignmentFile.show}
          </button>
        )}
      </div>

      {canShow && open && (
        <div className="border-t border-border/60 p-2">
          {kind === 'pdf' && (
            /*
              `<object>`, `<iframe>` emas: PDF ko'rsatgichi yo'q brauzerda
              `<object>` ichidagi zaxira mazmunni chizadi va odam bo'sh
              oq to'rtburchak o'rniga havolani ko'radi.
            */
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
          )}

          {/* `key` — boshqa topshiriqqa o'tilganda ko'rsatgich yangi
              fayldan boshlasin, eski hujjatni ushlab qolmasin. */}
          {kind === 'docx' && <DocxPreview key={url} url={url} label={name} />}

          {kind === 'image' && (
            // Backend rasm domenlari oldindan noma'lum, shuning uchun
            // `next/image` emas, oddiy `<img>`.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={url}
              alt={name}
              className="mx-auto max-h-[560px] w-auto max-w-full rounded-lg"
            />
          )}
        </div>
      )}
    </section>
  );
}
