import { useEffect, useState } from "react";
import styled from "styled-components";
import WaterDrop from "./WaterDrop";
// ⬇️ reemplaza el hook viejo por el controlado + store
import { useNotificationsControlled } from "../hooks/useNotifications";
import { useNotificationsStore } from "../store/notificationsStore";

import { toast } from "react-toastify";
import { FaBell, FaBellSlash, FaCog, FaHistory } from "react-icons/fa";
import Confetti from "react-confetti";
import { useWindowSize } from "@react-hook/window-size";
import DigitalClock from "./DigitalClock";
import { useWaterStore } from "../store/waterStore";
import { useNavigate } from "react-router-dom";

const DAILY_GOAL = 2500;
const getTodayKey = () => new Date().toISOString().slice(0, 10);

const Container = styled.div`
  text-align: center;
  padding: 2rem;
  max-width: 500px;
  margin: 0 auto;
  width: 100%;
`;

const Title = styled.h1`
  font-size: 2.2rem;
  color: #016BCD;
  margin-bottom: 1.5rem;

  @media (max-width: 480px) {
    font-size: 1.6rem;
  }
`;

const Progress = styled.div`
  font-size: 1.2rem;
  margin: 1.5rem 0;
  color: #004d40;

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
`;

const WaterButton = styled.button`
  background-color: #00bcd4;
  color: white;
  border: none;
  padding: 1rem 1.5rem;
  font-size: 1rem;
  border-radius: 10px;
  cursor: pointer;
  transition: 0.2s;
  min-width: 100px;

  &:hover {
    background-color: #0097a7;
  }

  &:disabled {
    background-color: #b2ebf2;
    color: #004d40;
    cursor: not-allowed;
    opacity: 0.6;
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
    padding: 0.8rem 1rem;
    min-width: 90px;
  }
`;

const NotificationButton = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  background-color: #00bcd4;
  border: none;
  border-radius: 50%;
  padding: 12px;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0097a7;
  }

  svg {
    color: white;
    width: 24px;
    height: 24px;
  }
`;

const WaterTracker = () => {
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowWidth, windowHeight] = useWindowSize();

  const { totalDiario, agregarRegistro, reiniciarDia, fecha } = useWaterStore();

  const isGoalReached = totalDiario >= DAILY_GOAL;
  const percentage = Math.min((totalDiario / DAILY_GOAL) * 100, 100);

  // ⬇️ estado persistente (enabled/interval) desde el store
  const { enabled, intervalMs, setEnabled, setIntervalMs } = useNotificationsStore();

  // ⬇️ hook controlado: programa/limpia según enabled + intervalMs
  const { permission, requestPermission, stop } = useNotificationsControlled({
    enabled,
    intervalMs,
    onPermissionChange: (p) => {
      if (p !== "granted") setEnabled(false);
    },
  });

  // Al montar: si tenés tu config en localStorage, setea el intervalo en el store
  useEffect(() => {
    const saved = localStorage.getItem("noti-config");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (typeof parsed.intervalMs === "number") {
          setIntervalMs(parsed.intervalMs);
        }
      } catch {}
    }
  }, [setIntervalMs]);

  // Cambio de día -> reset + toast
  useEffect(() => {
    const today = getTodayKey();
    if (fecha !== today) {
      reiniciarDia();
      toast.info("¡Nuevo día, tomá agua 💧!");
    }
  }, [fecha, reiniciarDia]);

  const handleAdd = (ml: number) => {
    agregarRegistro(ml);
    if (totalDiario + ml >= DAILY_GOAL && totalDiario < DAILY_GOAL) {
      toast.success("🎉 ¡Objetivo alcanzado! Tomaste 2.5 L 💧");
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 6000);
    }
  };

  // Toggle de notificaciones usando store + permiso del navegador
  const toggleNotifications = async () => {
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
        toast.error("❌ Permiso denegado");
      }
    }
  };

  return (
    <Container>
      <DigitalClock />
      <Title>¡Agüita!</Title>

      <WaterDrop percentage={percentage} />

      <Progress>
        Has tomado <strong>{(totalDiario / 1000).toFixed(2)} L</strong> de{" "}
        {(DAILY_GOAL / 1000).toFixed(1)} L
      </Progress>

      <ButtonRow>
        <WaterButton onClick={() => handleAdd(250)} disabled={isGoalReached}>
          +250 ml
        </WaterButton>
        <WaterButton onClick={() => handleAdd(500)} disabled={isGoalReached}>
          +500 ml
        </WaterButton>
        <WaterButton onClick={() => handleAdd(1000)} disabled={isGoalReached}>
          +1 L
        </WaterButton>
      </ButtonRow>

      {/* Historial */}
      <NotificationButton style={{ bottom: 140 }} onClick={() => navigate("/historial")}>
        <FaHistory />
      </NotificationButton>

      {/* Configuración */}
      <NotificationButton style={{ bottom: 80 }} onClick={() => navigate("/config")}>
        <FaCog />
      </NotificationButton>

      {/* Notificaciones ON/OFF */}
      <NotificationButton onClick={toggleNotifications} title={`Permiso: ${permission}`}>
        {enabled ? <FaBellSlash /> : <FaBell />}
      </NotificationButton>

      {showConfetti && (
        <Confetti width={windowWidth} height={windowHeight} recycle={false} />
      )}
    </Container>
  );
};

export default WaterTracker;
