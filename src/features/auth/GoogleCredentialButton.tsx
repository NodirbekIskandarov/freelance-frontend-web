'use client';

import Script from 'next/script';
import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Google Identity Services tugmasi — faqat ID token oladi va uzatadi.
 *
 * Tugmani SDK'ning O'ZI chizadi. O'z tugmamizni qo'yish mumkin emas:
 * `id_token` oqimida Google faqat shu tugmani qo'llab-quvvatlaydi, qo'lda
 * chaqiriladigan API esa `access_token` qaytaradi — backend esa `id_token`
 * kutadi. Shuning uchun bu yerda ko'rinishni SOZLASH bilan cheklanamiz.
 *
 * Nima qilish kerakligini CHAQIRUVCHI hal qiladi: kirish sahifasida bu
 * tizimga kirish, profilda esa hisobga Google'ni bog'lash. Ikkalasi ham
 * bir xil tokenni oladi, faqat uni boshqa endpointga yuboradi.
 */
const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

interface GoogleCredentialResponse {
  credential?: string;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: GoogleCredentialResponse) => void;
          }) => void;
          renderButton: (parent: HTMLElement, options: Record<string, unknown>) => void;
        };
      };
    };
  }
}

/**
 * Google tugmasining ruxsat etilgan eng katta kengligi — 400px.
 *
 * Kattaroq qiymat berilsa SDK uni jimgina qisqartiradi va tugma
 * konteynerdan tor bo'lib, chapga yopishib qoladi.
 */
const MAX_WIDTH = 400;

export function GoogleCredentialButton({
  onCredential,
  text = 'continue_with',
}: {
  onCredential: (idToken: string) => void;
  /** SDK matni: kirish uchun `continue_with`, bog'lash uchun `signin_with`. */
  text?: 'signin_with' | 'signup_with' | 'continue_with';
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  const handle = useCallback(
    (response: GoogleCredentialResponse) => {
      if (response.credential) onCredential(response.credential);
    },
    [onCredential],
  );

  useEffect(() => {
    if (!ready || !CLIENT_ID) return;

    const container = containerRef.current;
    const google = window.google;
    if (!container || !google) return;

    google.accounts.id.initialize({
      client_id: CLIENT_ID,
      callback: handle,
    });

    /*
     * Tugma temaga qarab qayta chiziladi.
     *
     * SDK tugmani bir marta chizadi va keyin o'zgartirib bo'lmaydi, shuning
     * uchun tema almashganda konteyner tozalanib qaytadan chaqiriladi.
     * `outline` — oq tugma: qorong'i kartada u ko'zni qamashtiradigan oq
     * to'rtburchak bo'lib turardi; `filled_black` esa kartaga singib ketadi.
     *
     * Haqiqiy tema `.dark` klassidan o'qiladi, saqlangan tanlovdan emas:
     * tanlov `auto` bo'lishi mumkin va u soatga qarab hal qilinadi — qaysi
     * biri amalda chizilganini faqat klass biladi.
     */
    function render() {
      const google = window.google;
      if (!container || !google) return;

      const isDark = document.documentElement.classList.contains('dark');
      // Kenglik konteynerdan: qat'iy qiymat tor ekranda toshib, keng
      // ekranda esa yonidagi maydonlardan tor bo'lib qolardi.
      const width = Math.min(
        MAX_WIDTH,
        Math.round(container.getBoundingClientRect().width) || MAX_WIDTH,
      );

      container.replaceChildren();
      google.accounts.id.renderButton(container, {
        theme: isDark ? 'filled_black' : 'outline',
        size: 'large',
        // Sahifadagi boshqa tugmalar dumaloq burchakli; SDK'ning standart
        // to'rtburchagi ular orasida begona ko'rinardi.
        shape: 'pill',
        logo_alignment: 'left',
        text,
        locale: 'uz',
        width,
      });
    }

    render();

    // Tema tanlagichi `.dark` klassini almashtiradi — shuni kuzatamiz.
    const observer = new MutationObserver(render);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    const resize = new ResizeObserver(render);
    resize.observe(container);

    return () => {
      observer.disconnect();
      resize.disconnect();
    };
  }, [ready, handle, text]);

  /*
   * `NEXT_PUBLIC_GOOGLE_CLIENT_ID` sozlanmagan bo'lsa HECH NARSA
   * ko'rsatilmaydi: ishlamaydigan tugmani chizish foydalanuvchini
   * chalg'itardi, "xato" xabari esa bu sozlama muammosi ekanini
   * tushuntirmasdi.
   */
  if (!CLIENT_ID) return null;

  return (
    <>
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onReady={() => setReady(true)}
      />

      {/* `min-h` — tugma yuklanguncha joy band bo'lib tursin: usiz SDK
          javob bergan payt sahifa pastdagi maydonlarni siljitardi. */}
      <div ref={containerRef} className="flex min-h-[44px] w-full justify-center" />
    </>
  );
}

/** Sozlanganmi — chaqiruvchi bo'limni umuman chizmaslik uchun. */
export const isGoogleConfigured = Boolean(CLIENT_ID);
