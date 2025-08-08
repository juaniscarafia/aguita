import { useCallback, useEffect, useRef } from "react";

type UseNotificationsParams = {
  enabled: boolean;
  intervalMs: number;
  onPermissionChange?: (p: NotificationPermission) => void;
};

async function showViaSW(title: string, options?: NotificationOptions) {
  if (!("serviceWorker" in navigator)) return false;
  const reg = await navigator.serviceWorker.ready;
  await reg.showNotification(title, options);
  return true;
}

export function useNotificationsControlled({
  enabled,
  intervalMs,
  onPermissionChange,
}: UseNotificationsParams) {
  const timerRef = useRef<number | null>(null);

  // Guardamos el callback en un ref (evita loops por cambio de identidad)
  const cbRef = useRef<UseNotificationsParams["onPermissionChange"]>(undefined);
  useEffect(() => {
    cbRef.current = onPermissionChange;
  }, [onPermissionChange]);

  const requestPermission = useCallback(async () => {
    const result = await Notification.requestPermission();
    cbRef.current?.(result);
    return result === "granted";
  }, []);

  const notifyNow = useCallback(async (title: string, body?: string) => {
    if (Notification.permission !== "granted") return false;
    return showViaSW(title, {
      body,
      icon: "/icon-192x192.png",
      badge: "/icon-192x192.png",
      tag: "aguita-reminder",
      // renotify: true,
    });
  }, []);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    if (Notification.permission !== "granted") return false;
    clearTimer();
    // Dispara una ahora
    showViaSW("¡Hora de tomar agua!", { body: "Un vasito ahora te viene bárbaro 💧" });
    // Luego programa
    timerRef.current = window.setInterval(() => {
      showViaSW("¡Recordatorio de Agüita!", { body: "Pequeño trago = gran diferencia 💧" });
    }, Math.max(60_000, intervalMs));
    return true;
  }, [clearTimer, intervalMs]);

  const stop = useCallback(() => {
    clearTimer();
  }, [clearTimer]);

  // Arrancar/parar según enabled/intervalMs
  useEffect(() => {
    if (enabled) start(); else stop();
    return () => stop();
  }, [enabled, intervalMs, start, stop]);

  // Notificar el permiso una única vez al montar
  useEffect(() => {
    cbRef.current?.(Notification.permission);
    // sin deps: intencional, solo una vez
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { permission: Notification.permission, requestPermission, notifyNow, start, stop };
}
