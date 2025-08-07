// import { useEffect, useRef } from "react";

// export const useNotifications = () => {
//   const intervalRef = useRef<number | null>(null);

//   const requestPermission = async () => {
//     if (!("Notification" in window)) return false;
//     const result = await Notification.requestPermission();
//     return result === "granted";
//   };

//   const isInNotificationWindow = (startTime: string, endTime: string) => {
//     const now = new Date();

//     const [startHour, startMinute] = startTime.split(":").map(Number);
//     const [endHour, endMinute] = endTime.split(":").map(Number);

//     const start = new Date();
//     start.setHours(startHour, startMinute, 0, 0);

//     const end = new Date();
//     end.setHours(endHour, endMinute, 0, 0);

//     return now >= start && now <= end;
//   };

//   const startNotifications = () => {
//     if (!("Notification" in window)) return;

//     const configRaw = localStorage.getItem("noti-config");
//     const config = configRaw
//       ? JSON.parse(configRaw)
//       : {
//           startTime: "09:00",
//           endTime: "22:00",
//           intervalMs: 60 * 60 * 1000, // 1 hora por defecto
//         };

//     if (intervalRef.current) clearInterval(intervalRef.current); // Evitar múltiples timers

//     intervalRef.current = window.setInterval(() => {
//       if (isInNotificationWindow(config.startTime, config.endTime)) {
//         new Notification("💧 Agüita", {
//           body: "¡Es hora de tomar un vasito de agua!",
//         });
//       }
//     }, config.intervalMs);
//   };

//   const stopNotifications = () => {
//     if (intervalRef.current) {
//       clearInterval(intervalRef.current);
//       intervalRef.current = null;
//     }
//   };

//   useEffect(() => {
//     return () => {
//       stopNotifications(); // Limpieza al desmontar
//     };
//   }, []);

//   return {
//     requestPermission,
//     startNotifications,
//     stopNotifications,
//   };
// };

import { useEffect, useRef } from "react";

const ENABLED_KEY = "noti-enabled";

export const useNotifications = () => {
  const intervalRef = useRef<number | null>(null);

  const requestPermission = async () => {
    if (!("Notification" in window)) return false;
    const result = await Notification.requestPermission();
    return result === "granted";
  };

  const isInNotificationWindow = (startTime: string, endTime: string) => {
    const now = new Date();
    const [sH, sM] = startTime.split(":").map(Number);
    const [eH, eM] = endTime.split(":").map(Number);

    const start = new Date();
    start.setHours(sH, sM, 0, 0);
    const end = new Date();
    end.setHours(eH, eM, 0, 0);

    return now >= start && now <= end;
  };

  const startNotifications = () => {
    if (!("Notification" in window)) return;

    const configRaw = localStorage.getItem("noti-config");
    const config = configRaw
      ? JSON.parse(configRaw)
      : {
          startTime: "09:00",
          endTime: "22:00",
          intervalMs: 60 * 60 * 1000, // 1h
        };

    // evitar múltiples timers
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = window.setInterval(() => {
      if (isInNotificationWindow(config.startTime, config.endTime)) {
        new Notification("💧 Agüita", {
          body: "¡Es hora de tomar un vasito de agua!",
        });
      }
    }, config.intervalMs);

    localStorage.setItem(ENABLED_KEY, "true");
  };

  const stopNotifications = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    localStorage.setItem(ENABLED_KEY, "false");
  };

  const wasEnabled = () => localStorage.getItem(ENABLED_KEY) === "true";

  useEffect(() => {
    return () => {
      // limpieza al desmontar
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return {
    requestPermission,
    startNotifications,
    stopNotifications,
    wasEnabled,
  };
};
