import ConfettiBoom from "react-confetti-boom";
import { SOLUTION_SIZES } from "../game/logic";

// Constants for particle count interpolation
const MIN_PARTICLES = 50;
const MAX_PARTICLES = 100;
const MIN_SOLUTION_SIZE = Math.min(...SOLUTION_SIZES);
const MAX_SOLUTION_SIZE = Math.max(...SOLUTION_SIZES);

interface GameConfettiProps {
  show: boolean;
  solutionSize: number;
}

export const GameConfetti = ({ show, solutionSize }: GameConfettiProps) => {
  if (!show) {
    return null;
  }

  const particleCount = MIN_PARTICLES + Math.round(
    ((solutionSize - MIN_SOLUTION_SIZE) * (MAX_PARTICLES - MIN_PARTICLES)) /
    (MAX_SOLUTION_SIZE - MIN_SOLUTION_SIZE)
  );

  return (
    <ConfettiBoom
      mode="fall"
      className="z-50"
      particleCount={particleCount}
      colors={[
        "#FF6B6B",
        "#4ECDC4", 
        "#45B7D1",
        "#96CEB4",
        "#FFEAA7",
        "#DDA0DD",
        "#98D8C8",
      ]}
    />
  );
}; 