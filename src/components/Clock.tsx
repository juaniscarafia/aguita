import { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";

const flicker = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.85; }
`;

const ClockWrapper = styled.div`
  background-color: #000;
  border-radius: 12px;
  padding: 1rem;
  color: #00ffff;
  font-family: 'Orbitron', monospace;
  text-align: center;
  box-shadow: 0 0 10px #00ffff;
  animation: ${flicker} 1.5s infinite;
`;

const TimeText = styled.div`
  font-size: 2.5rem;
  letter-spacing: 0.2rem;
  margin-bottom: 0.5rem;
  text-shadow: 0 0 5px #00ffff, 0 0 10px #00ffff;
`;

const DateText = styled.div`
  font-size: 1rem;
  text-shadow: 0 0 5px #00ffff;
`;

const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  const formatDate = (date: Date) => {
    const day = date.toLocaleDateString("es-AR", { weekday: "long" });
    const fullDate = date.toLocaleDateString("es-AR");
    return `${capitalize(day)} - ${fullDate}`;
  };

  const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <ClockWrapper>
      <TimeText>{formatTime(time)}</TimeText>
      <DateText>{formatDate(time)}</DateText>
    </ClockWrapper>
  );
};

export default Clock;
