'use client';

import Script from 'next/script';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

import { getApiErrorMessage } from '@/shared/api';

import { useLoginWithGoogleMutation } from './authApi';
import { cabinetPathFor } from './cabinetPath';

/**
 * Google orqali kirish.
 *
 * Tugmani Google Identity Services SDK'sining o'zi chizadi — o'z
 * tugmamizni chizib, `id_token`ni qo'lda olishning yo'li yo'q.
 *
 * `NEXT_PUBLIC_GOOGLE_CLIENT_ID` sozlanmagan bo'lsa komponent HECH
 * NARSA ko'rsatmaydi: ishlamaydigan tugmani chizish foydalanuvchini
 * chalg'itardi, "xato" xabari esa bu sozlama muammosi ekanini
 * tushuntirmasdi.
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

export function GoogleLoginButton() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [loginWithGoogle, { error }] = useLoginWithGoogleMutation();
  const [ready, setReady] = useState(false);

  const handleCredential = useCallback(
    async (response: GoogleCredentialResponse) => {
      if (!response.credential) return;

      try {
        const { user } = await loginWithGoogle({ id_token: response.credential }).unwrap();
        router.push(cabinetPathFor(user));
      } catch {
        // Xato quyida ko'rsatiladi.
      }
    },
    [loginWithGoogle, router],
  );

  useEffect(() => {
    if (!ready || !CLIENT_ID || !containerRef.current) return;

    const google = window.google;
    if (!google) return;

    google.accounts.id.initialize({
      client_id: CLIENT_ID,
      callback: (response) => void handleCredential(response),
    });

    google.accounts.id.renderButton(containerRef.current, {
      theme: 'outline',
      size: 'large',
      width: 320,
      locale: 'uz',
    });
  }, [ready, handleCredential]);

  if (!CLIENT_ID) return null;

  return (
    <div>
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onReady={() => setReady(true)}
      />

      <div ref={containerRef} className="flex justify-center" />

      {error && (
        <p role="alert" className="mt-3 text-sm text-destructive">
          {getApiErrorMessage(error)}
        </p>
      )}
    </div>
  );
}
