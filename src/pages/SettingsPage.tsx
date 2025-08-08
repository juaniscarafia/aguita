import styled from "styled-components";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
// ⬇️ usamos el store para sincronizar intervalMs
import { useNotificationsStore } from "../store/notificationsStore";

const Page = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Label = styled.label`
  font-weight: bold;
  color: #004d40;
`;

const Input = styled.input`
  padding: 0.5rem;
  border-radius: 8px;
  border: 1px solid #ccc;
`;

const Select = styled.select`
  padding: 0.5rem;
  border-radius: 8px;
  border: 1px solid #ccc;
`;

const Button = styled.button`
  margin-top: 1rem;
  background-color: #00bcd4;
  color: white;
  border: none;
  padding: 0.8rem 1.2rem;
  border-radius: 8px;
  cursor: pointer;
`;

const SaveButton = styled(Button)`
  background-color: #4caf50;
`;

const InlineInfo = styled.div`
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #004d40;
  opacity: 0.85;
`;

export default function SettingsPage() {
  const navigate = useNavigate();
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("22:00");
  const [intervalValue, setIntervalValue] = useState(1);
  const [intervalUnit, setIntervalUnit] = useState<"minutes" | "hours">("hours");

  // store para que el hook controlado tome el nuevo intervalo
  const { enabled, intervalMs, setIntervalMs } = useNotificationsStore();

  // cargar config guardada
  useEffect(() => {
    const saved = localStorage.getItem("noti-config");
    if (saved) {
      const parsed = JSON.parse(saved);
      setStartTime(parsed.startTime);
      setEndTime(parsed.endTime);
      setIntervalValue(parsed.intervalValue);
      setIntervalUnit(parsed.intervalUnit);
      if (typeof parsed.intervalMs === "number") {
        setIntervalMs(parsed.intervalMs);
      }
    } else {
      // si no hay nada guardado, reflejar el valor del store en los campos
      const mins = Math.max(1, Math.round(intervalMs / 60000));
      setIntervalValue(mins >= 60 && mins % 60 === 0 ? mins / 60 : mins);
      setIntervalUnit(mins >= 60 && mins % 60 === 0 ? "hours" : "minutes");
    }
  }, [intervalMs, setIntervalMs]);

  const handleSave = () => {
    const newIntervalMs =
      intervalUnit === "minutes"
        ? intervalValue * 60 * 1000
        : intervalValue * 60 * 60 * 1000;

    const config = {
      startTime,
      endTime,
      intervalMs: newIntervalMs,
      intervalValue,
      intervalUnit,
    };

    localStorage.setItem("noti-config", JSON.stringify(config));
    setIntervalMs(newIntervalMs); // el hook controlado reprograma si está enabled
    toast.success("Configuración guardada");
  };

  return (
    <Page>
      <h2>Configuración</h2>

      <Label>Hora de inicio:</Label>
      <Input
        type="time"
        value={startTime}
        onChange={(e) => setStartTime(e.target.value)}
      />

      <Label>Hora de fin:</Label>
      <Input
        type="time"
        value={endTime}
        onChange={(e) => setEndTime(e.target.value)}
      />

      <Label>Intervalo:</Label>
      <Input
        type="number"
        min="1"
        value={intervalValue}
        onChange={(e) => setIntervalValue(parseInt(e.target.value || "0", 10) || 1)}
      />

      <Label>Unidad de intervalo:</Label>
      <Select
        value={intervalUnit}
        onChange={(e) => setIntervalUnit(e.target.value as "minutes" | "hours")}
      >
        <option value="minutes">Minutos</option>
        <option value="hours">Horas</option>
      </Select>

      <SaveButton onClick={handleSave}>Guardar configuración</SaveButton>
      <Button onClick={() => navigate("/")}>Volver</Button>

      <InlineInfo>
        Permiso: <b>{Notification.permission}</b> · Recordatorios:{" "}
        <b>{enabled ? "activados" : "desactivados"}</b>
      </InlineInfo>
    </Page>
  );
}