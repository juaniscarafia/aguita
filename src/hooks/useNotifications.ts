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
//       : { startTime: "09:00", endTime: "22:00", interval: 1 };

//     const intervalMs = config.interval * 60 * 1000;

//     // intervalRef.current = window.setInterval(() => {
//     //   if (isInNotificationWindow(config.startTime, config.endTime)) {
//     //     new Notification("💧 Agüita", {
//     //       body: "¡Es hora de tomar un vasito de agua!",
//     //     });
//     //   }
//     // }, intervalMs);

//     intervalRef.current = window.setInterval(() => {
//       const now = new Date().toLocaleTimeString();
//       console.log(`[DEBUG] Evaluando notificación: ${now}`);
    
//       if (isInNotificationWindow(config.startTime, config.endTime)) {
//         console.log(`[DEBUG] ✅ Enviando notificación`);
//         new Notification("💧 Agüita", {
//           body: "¡Es hora de tomar un vasito de agua!",
//         });
//       } else {
//         console.log(`[DEBUG] ⏱️ Fuera del horario configurado`);
//       }
//     }, intervalMs);
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
//       : { startTime: "09:00", endTime: "22:00", interval: 60 };

//     const intervalMinutes = Number(config.interval);
//     const intervalMs = intervalMinutes * 60 * 1000;

//     console.log(
//       `[DEBUG] Iniciando notificaciones cada ${intervalMinutes} minutos`
//     );

//     // Ejecutar inmediatamente una vez (para test)
//     if (isInNotificationWindow(config.startTime, config.endTime)) {
//       console.log(`[DEBUG] ✅ Primera notificación enviada al iniciar`);
//       new Notification("💧 Agüita", {
//         body: "¡Es hora de tomar un vasito de agua!",
//       });
//     }

//     // Luego ejecutar en intervalo
//     intervalRef.current = window.setInterval(() => {
//       const now = new Date().toLocaleTimeString();
//       console.log(`[DEBUG] Evaluando notificación a las ${now}`);

//       if (isInNotificationWindow(config.startTime, config.endTime)) {
//         console.log(`[DEBUG] ✅ Enviando notificación`);
//         new Notification("💧 Agüita", {
//           body: "¡Es hora de tomar un vasito de agua!",
//         });
//       } else {
//         console.log(`[DEBUG] ⏱️ Fuera del horario configurado`);
//       }
//     }, intervalMs);
//   };

//   const stopNotifications = () => {
//     if (intervalRef.current) {
//       clearInterval(intervalRef.current);
//       intervalRef.current = null;
//       console.log("[DEBUG] 🔕 Notificaciones detenidas");
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

export const useNotifications = () => {
  const intervalRef = useRef<number | null>(null);

  const requestPermission = async () => {
    if (!("Notification" in window)) return false;
    const result = await Notification.requestPermission();
    return result === "granted";
  };

  const isInNotificationWindow = (startTime: string, endTime: string) => {
    const now = new Date();

    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);

    const start = new Date();
    start.setHours(startHour, startMinute, 0, 0);

    const end = new Date();
    end.setHours(endHour, endMinute, 0, 0);

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
          intervalMs: 60 * 60 * 1000, // 1 hora por defecto
        };

    if (intervalRef.current) clearInterval(intervalRef.current); // Evitar múltiples timers

    intervalRef.current = window.setInterval(() => {
      if (isInNotificationWindow(config.startTime, config.endTime)) {
        new Notification("💧 Agüita", {
          body: "¡Es hora de tomar un vasito de agua!",
        });
      }
    }, config.intervalMs);
  };

  const stopNotifications = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      stopNotifications(); // Limpieza al desmontar
    };
  }, []);

  return {
    requestPermission,
    startNotifications,
    stopNotifications,
  };
};
