'use client';

import { useCallback } from 'react';

import { getApiErrorMessage } from '@/shared/api';

import { GoogleCredentialButton } from './GoogleCredentialButton';
import { useLoginWithGoogleMutation } from './authApi';
import { cabinetPathFor } from './cabinetPath';
import { useLocaleRouter } from '@/i18n/useLocaleRouter';

/**
 * Google bilan kirish.
 *
 * Tugmaning o'zi `GoogleCredentialButton` da — bu yerda faqat olingan
 * token bilan nima qilish yozilgan. Profildagi «bog'lash» ham xuddi shu
 * tugmadan foydalanadi va tokenni boshqa endpointga yuboradi.
 */
export function GoogleLoginButton() {
  const router = useLocaleRouter();
  const [loginWithGoogle, { error }] = useLoginWithGoogleMutation();

  const handle = useCallback(
    (idToken: string) => {
      void loginWithGoogle({ id_token: idToken })
        .unwrap()
        .then(({ user }) => router.push(cabinetPathFor(user)))
        .catch(() => undefined); // Xato quyida ko'rsatiladi.
    },
    [loginWithGoogle, router],
  );

  return (
    <div>
      <GoogleCredentialButton onCredential={handle} />

      {error && (
        <p role="alert" className="mt-3 text-sm text-destructive">
          {getApiErrorMessage(error)}
        </p>
      )}
    </div>
  );
}
