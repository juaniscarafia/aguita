import type { Handler } from "@netlify/functions";
import webpush from "web-push";

export const handler: Handler = async () => {
  try {
    const { VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT, SUSCRIPTIONS_JSON } = process.env;
    if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY || !VAPID_SUBJECT) {
      return { statusCode: 500, body: "Faltan variables VAPID_*" };
    }
    webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

    const subs = JSON.parse(SUSCRIPTIONS_JSON || "[]");
    const payload = JSON.stringify({
      title: "¡Agüita!",
      body: "Recordatorio programado 💧",
      icon: "/icon-192x192.png",
      tag: "aguita-reminder",
      renotify: true,
    });

    const results = await Promise.allSettled(
      subs.map((sub: any) => webpush.sendNotification(sub, payload))
    );

    const ok = results.filter(r => r.status === "fulfilled").length;
    const failed = results.filter(r => r.status === "rejected").length;
    return { statusCode: 200, body: JSON.stringify({ ok, failed }) };
  } catch (err: any) {
    return { statusCode: 500, body: err?.message || "error" };
  }
};
