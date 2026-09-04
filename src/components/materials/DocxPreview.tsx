'use client';

import { useEffect, useState } from 'react';

import { useT } from '@/i18n/useT';

/**
 * `.docx` hujjatni sahifaning o'zida ko'rsatish.
 *
 * Word hujjatini brauzer o'zi chiza olmaydi — «ochish» bosilganda baribir
 * yuklab olish oynasi chiqadi. Shuning uchun fayl BRAUZERDA ochiladi:
 * `docx-preview` uni HTML'ga aylantiradi.
 *
 * Uchinchi tomon ko'rsatgichlari (Office Online, Google Docs viewer)
 * ATAYLAB ishlatilmagan: ular ishlashi uchun fayl havolasini o'sha
 * xizmatga yuborish kerak, ya'ni bizning hujjatlarimizni begona serverga
 * berish kerak. Bu yerda fayl foydalanuvchi brauzeridan chiqmaydi.
 *
 * Natija `sandbox=""` li `<iframe>` ichida chiziladi. Hujjatni istalgan
 * odam yuklaydi va uning ichida `javascript:` havolasi yoki `altChunk`
 * bilan solingan HTML bo'lishi mumkin — sahifamizga to'g'ridan-to'g'ri
 * qo'yilsa, bu XSS bo'lardi. Sandbox'da skript umuman ishlamaydi.
 */

/**
 * Kattaroq hujjat `srcdoc`ga sig'sa ham, brauzerni qotirib qo'yadi:
 * rasmlar base64 bo'lib matnga aylanadi va hajm yana o'sadi. Bunday
 * faylni yuklab olgan ma'qul.
 */
const MAX_BYTES = 12 * 1024 * 1024;

/**
 * Kutubxonaning o'z uslublari ustidan yoziladi.
 *
 * Asl holida u varaqlar atrofiga kulrang gutter chizadi — u yorug'da ham,
 * qorong'ida ham kartochkadan ajralib turadi. Shaffof qoldirsak, varaqlar
 * kartochka fonida suzib turadi va ikkala tema uchun ham bittasi yetadi.
 */
const FRAME_CSS = `
html, body { margin: 0; background: transparent; }
.docx-wrapper { background: transparent; padding: 0; align-items: stretch; }
.docx-wrapper > section.docx {
  width: auto;
  /* Varaq chekkalari hujjatda 2–3 sm bo'ladi va bu ustunda matnga
     deyarli joy qoldirmasdi. Inline uslubni faqat \`!important\` yengadi:
     kutubxona ularni elementning o'ziga yozadi. */
  padding: 18px 16px !important;
  margin: 0 0 12px;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(15, 23, 42, 0.18);
  overflow-x: auto;
}
.docx-wrapper > section.docx:last-child { margin-bottom: 0; }
/* Jadval kengligi hujjatda qat'iy berilgan bo'lishi mumkin — u ustundan
   chiqib ketmasin. */
.docx-wrapper table { width: auto !important; max-width: 100%; }
img { max-width: 100%; height: auto; }
`;

function buildPage(styles: string, body: string): string {
  /*
   * Bizning uslublar KEYIN qo'yiladi: kutubxonanikilar bilan bir xil
   * kuchda va faqat tartib hal qiladi. Oldin qo'yilganda ular hech
   * nimaga ta'sir qilmasdi.
   */
  return `<!doctype html><html><head><meta charset="utf-8">${styles}<style>${FRAME_CSS}</style></head><body>${body}</body></html>`;
}

type State = { kind: 'loading' } | { kind: 'ready'; page: string } | { kind: 'failed' };

/**
 * `url` o'zgarganda komponent chaqiruvchi tomonda `key` bilan qaytadan
 * yaratiladi, shuning uchun bu yerda holatni qo'lda tozalash shart emas.
 */
export function DocxPreview({ url, label }: { url: string; label: string }) {
  const { m } = useT();
  const [state, setState] = useState<State>({ kind: 'loading' });

  useEffect(() => {
    let active = true;

    async function render() {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(String(response.status));

        const blob = await response.blob();
        if (blob.size > MAX_BYTES) throw new Error('too-large');

        // Kutubxona (jszip bilan birga) FAQAT shu yerda kerak —
        // sahifaning asosiy paketiga qo'shilmasin.
        const { renderAsync } = await import('docx-preview');

        const body = document.createElement('div');
        const styles = document.createElement('div');

        await renderAsync(blob, body, styles, {
          /*
           * Varaq kengligi tashlab yuboriladi: A4 (≈794px) bu ustunga
           * sig'maydi va kichraytirilsa matn o'qib bo'lmas holga keladi.
           * Shu bilan hujjat mavjud kenglikka moslashadi.
           */
          ignoreWidth: true,
          ignoreHeight: true,
          // Bo'sh varaqlarning balandligi kerak emas, lekin varaqlar
          // orasidagi chegara qolsin — hujjat tuzilishi ko'rinib tursin.
          breakPages: true,
          // Rasmlar `blob:` havola bo'lsa, sandbox'dagi ramka ularni
          // ocholmaydi: uning manbasi (origin) boshqa. base64 ishlaydi.
          useBase64URL: true,
        });

        if (!active) return;
        setState({ kind: 'ready', page: buildPage(styles.innerHTML, body.innerHTML) });
      } catch {
        if (active) setState({ kind: 'failed' });
      }
    }

    void render();

    return () => {
      active = false;
    };
  }, [url]);

  if (state.kind === 'loading') {
    return (
      <p className="px-3 py-10 text-center text-xs text-muted-foreground">
        {m.assignmentFile.loading}
      </p>
    );
  }

  if (state.kind === 'failed') {
    return (
      <p className="px-3 py-6 text-center text-xs text-muted-foreground">
        {m.assignmentFile.cannotShowDoc}{' '}
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="font-medium text-brand hover:underline"
        >
          {m.assignmentFile.openInNewTab}
        </a>
      </p>
    );
  }

  return (
    <iframe
      // `sandbox=""` — hech qanday ruxsatsiz: hujjat ichidagi skript ham,
      // `javascript:` havolasi ham ishlamaydi.
      sandbox=""
      srcDoc={state.page}
      title={label}
      className="h-[60vh] max-h-[560px] w-full rounded-lg border-0"
    />
  );
}
