import { toast } from "react-toastify";
import { useNotificationsControlled } from "../hooks/useNotifications";
import { useNotificationsStore } from "../store/notificationsStore";

export default function NotificationControls() {
  const { enabled, intervalMs, setEnabled, setIntervalMs } = useNotificationsStore();

  const { permission, requestPermission, start, stop } = useNotificationsControlled({
    enabled,
    intervalMs,
    onPermissionChange: (p) => {
      if (p !== "granted") setEnabled(false);
    },
  });

  const toggle = async () => {
    if (enabled) {
      stop();
      setEnabled(false);
      toast.info("🔕 Notificaciones desactivadas");
    } else {
      const ok = await requestPermission();
      if (ok) {
        setEnabled(true);
        toast.success("🔔 Notificaciones activadas");
      } else {
        toast.error("No se concedió el permiso de notificaciones");
      }
    }
  };

  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
      <button onClick={toggle}>
        {enabled ? "Desactivar recordatorios" : "Activar recordatorios"}
      </button>

      <select
        value={String(intervalMs)}
        onChange={(e) => setIntervalMs(Number(e.target.value))}
        disabled={enabled}
      >
        <option value={30 * 60 * 1000}>Cada 30 min</option>
        <option value={60 * 60 * 1000}>Cada 1 hora</option>
        <option value={2 * 60 * 60 * 1000}>Cada 2 horas</option>
      </select>

      <small>Permiso: <b>{permission}</b></small>
    </div>
  );
}
