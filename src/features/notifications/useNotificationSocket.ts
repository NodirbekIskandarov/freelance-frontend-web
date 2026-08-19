'use client';

import { useEffect, useRef } from 'react';

import { env } from '@/lib/env';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectIsAuthenticated } from '@/store/slices/authSlice';

import { notificationsApi, useGetWebSocketTicketMutation } from './notificationsApi';

/** Qayta ulanish kechikishlari — har urinishda uzayadi, 30 soniyada to'xtaydi. */
const BACKOFF_MS = [1000, 2000, 5000, 10_000, 30_000];

/**
 * Bildirishnomalarni JONLI oladi.
 *
 * Chipta atigi 30 soniya yashaydi, shuning uchun u ulanishdan bevosita
 * oldin so'raladi — oldindan olib qo'yib bo'lmaydi. Har uzilishda
 * yangisi olinadi.
 *
 * Xabarning MAZMUNI ishlatilmaydi: u faqat "nimadir o'zgardi" signali.
 * Keshni bekor qilish yagona haqiqat manbaini serverda qoldiradi —
 * WebSocket va REST javoblari bir-biridan farq qilib qolmaydi.
 */
export function useNotificationSocket(): void {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const [getTicket] = useGetWebSocketTicketMutation();

  // Effect ichidagi qayta ulanish zanjiri uchun — render'ga bog'liq emas.
  const socketRef = useRef<WebSocket | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const attemptRef = useRef(0);

  useEffect(() => {
    if (!isAuthenticated) return;

    let cancelled = false;

    async function connect() {
      if (cancelled) return;

      let url: string;
      try {
        const ticket = await getTicket().unwrap();
        url = `${env.wsOrigin}${ticket.url}?ticket=${encodeURIComponent(ticket.ticket)}`;
      } catch {
        scheduleReconnect();
        return;
      }

      if (cancelled) return;

      const socket = new WebSocket(url);
      socketRef.current = socket;

      socket.onopen = () => {
        attemptRef.current = 0;
      };

      socket.onmessage = () => {
        dispatch(notificationsApi.util.invalidateTags(['Notification']));
      };

      socket.onclose = () => {
        socketRef.current = null;
        if (!cancelled) scheduleReconnect();
      };

      // `onerror` dan keyin brauzer `onclose` ni ham yuboradi —
      // qayta ulanish faqat bitta joyda boshlansin.
      socket.onerror = () => socket.close();
    }

    function scheduleReconnect() {
      const delay = BACKOFF_MS[Math.min(attemptRef.current, BACKOFF_MS.length - 1)];
      attemptRef.current += 1;
      timerRef.current = setTimeout(() => void connect(), delay);
    }

    void connect();

    return () => {
      cancelled = true;
      if (timerRef.current) clearTimeout(timerRef.current);
      // `onclose` ni tozalaymiz: aks holda yopish qayta ulanishni
      // boshlab yuboradi va socket abadiy tiriladi.
      if (socketRef.current) {
        socketRef.current.onclose = null;
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [dispatch, getTicket, isAuthenticated]);
}
