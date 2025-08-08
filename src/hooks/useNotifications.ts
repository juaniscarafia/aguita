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

  const requestPermission = useCallback(async () => {
    const result = await Notification.requestPermission();
    onPermissionChange?.(result);
    return result === "granted";
  }, [onPermissionChange]);

  const notifyNow = useCallback(async (title: string, body?: string) => {
    if (Notification.permission !== "granted") return false;
    return showViaSW(title, {
      body,
      icon: "/icon-192x192.png",
      badge: "/icon-192x192.png",
      tag: "aguita-reminder",
      renotify: true,
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
    // Programa luego
    timerRef.current = window.setInterval(() => {
      showViaSW("¡Recordatorio de Agüita!", { body: "Pequeño trago = gran diferencia 💧" });
    }, Math.max(60_000, intervalMs)); // mínimo 1 min
    return true;
  }, [clearTimer, intervalMs]);

  const stop = useCallback(() => {
    clearTimer();
  }, [clearTimer]);

  useEffect(() => {
    if (enabled) start(); else stop();
    return () => stop();
  }, [enabled, intervalMs, start, stop]);

  useEffect(() => {
    onPermissionChange?.(Notification.permission);
  }, [onPermissionChange]);

  return { permission: Notification.permission, requestPermission, notifyNow, start, stop };
}