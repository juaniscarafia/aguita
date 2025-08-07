import styled from "styled-components";
import dropImage from "../assets/logo.png";

interface Props {
  percentage: number;
}

const DropWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 200px;
  aspect-ratio: 1 / 1;
  margin: 0 auto;
`;

const DropImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  pointer-events: none;
`;

const MAX_HEIGHT = 163;

const Fill = styled.div<{ percentage: number }>`
  position: absolute;
  bottom: 31px;
  left: 46px;
  width: 120px;
  height: ${({ percentage }) => `${(percentage / 100) * MAX_HEIGHT}px`};
  background-color: #00bcd4;
  z-index: 1;
  transition: height 0.4s ease;
`;

const WaterDrop = ({ percentage }: Props) => {
  const clamped = Math.min(Math.max(percentage, 0), 100);

  return (
    <DropWrapper>
      <Fill percentage={clamped} />
      <DropImage src={dropImage} alt="Gotita feliz" />
    </DropWrapper>
  );
};

export default WaterDrop;
