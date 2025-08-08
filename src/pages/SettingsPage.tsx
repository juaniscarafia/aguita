import styled from "styled-components";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import NotificationControls from "../components/NotificationControls";

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

const SettingsPage = () => {
  const navigate = useNavigate();
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("22:00");
  const [intervalValue, setIntervalValue] = useState(1);
  const [intervalUnit, setIntervalUnit] = useState<"minutes" | "hours">("hours");

  useEffect(() => {
    const saved = localStorage.getItem("noti-config");
    if (saved) {
      const parsed = JSON.parse(saved);
      setStartTime(parsed.startTime);
      setEndTime(parsed.endTime);
      setIntervalValue(parsed.intervalValue);
      setIntervalUnit(parsed.intervalUnit);
    }
  }, []);

  const handleSave = () => {
    const intervalMs =
      intervalUnit === "minutes"
        ? intervalValue * 60 * 1000
        : intervalValue * 60 * 60 * 1000;

    const config = {
      startTime,
      endTime,
      intervalMs,
      intervalValue,
      intervalUnit,
    };

    localStorage.setItem("noti-config", JSON.stringify(config));
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
        onChange={(e) => setIntervalValue(parseInt(e.target.value))}
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

      <NotificationControls />
    </Page>
  );
};

export default SettingsPage;