import { useEffect, useState } from "react";
import styled from "styled-components";

const ClockWrapper = styled.div`
  font-family: 'Orbitron', sans-serif;
  color: #016BCD; /* Azul gota #00bcd4; */
  text-align: center;
  padding: 0.5rem;
  margin-bottom: 1.5rem;

  .time {
    font-size: 2.5rem;
    font-weight: bold;
    letter-spacing: 3px;
    text-shadow: 0 0 6px #00e5ff, 0 0 10px #00e5ff;
    animation: blink 1s infinite;
  }

  .date {
    font-size: 1.1rem;
    margin-top: 0.4rem;
    text-shadow: 0 0 4px #00e5ff;
  }

  @keyframes blink {
    50% {
      opacity: 0.8;
    }
  }

  @media (max-width: 480px) {
    .time {
      font-size: 2rem;
    }

    .date {
      font-size: 0.9rem;
    }
  }
`;

const daysEs = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

const DigitalClock = () => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const time = now.toLocaleTimeString("es-AR", { hour12: false });
  const day = daysEs[now.getDay()];
  const date = now.toLocaleDateString("es-AR");

  return (
    <ClockWrapper>
      <div className="time">{time}</div>
      <div className="date">{day} - {date}</div>
    </ClockWrapper>
  );
};

export default DigitalClock;