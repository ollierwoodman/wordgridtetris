import ConfettiBoom from "react-confetti-boom";
interface GameConfettiProps {
  show: boolean;
}

export const GameConfetti = ({ show }: GameConfettiProps) => {
  if (!show) {
    return null;
  }

  return (
    <ConfettiBoom
      mode="fall"
      className="z-50"
      particleCount={88}
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