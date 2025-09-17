import ConfettiBoom from "react-confetti-boom";
import type { Game } from "../game/logic";
interface GameConfettiProps {
  show: boolean;
  game: Game;
}

export const GameConfetti = ({ show, game }: GameConfettiProps) => {
  if (!show) {
    return null;
  }

  const numHintsUsed = game.getNumHintsUsed();
  const numHintsAvailable = game.getNumHintsAvailable();

  const timeToCompleteMs = game.getCompletionDurationMs();

  const calcScore = (numHintsUsed: number, numHintsAvailable: number, timeToCompleteMs: number | null) => {
    const fractionHintsUsed = (numHintsAvailable - numHintsUsed) / numHintsAvailable;
    
    let timeScore = 0;
    if (timeToCompleteMs === null) {
      return null;
    } else if (timeToCompleteMs < 60 * 1000) {
      timeScore = 1.0;
    } else if (timeToCompleteMs < 90 * 1000) {
      timeScore = 0.8;
    } else if (timeToCompleteMs < 120 * 1000) {
      timeScore = 0.6;
    } else if (timeToCompleteMs < 150 * 1000) {
      timeScore = 0.4;
    } else if (timeToCompleteMs < 180 * 1000) {
      timeScore = 0.2;
    } else {
      timeScore = 0.1;
    }

    return fractionHintsUsed * timeScore;
  }

  const score = calcScore(numHintsUsed, numHintsAvailable, timeToCompleteMs);
  
  let colors = [] as string[];

  if (score === null) {
    return null;
  } else if (score < 0.5) {
    colors = [
      "#a1a1a1",
    ];
  } else if (score < 0.75) {
    colors = [
      "#5cff5c",
    ];
  } else if (score < 0.85) {
    colors = [
      "#5c72ff",
    ];
  } else if (score < 0.95) {
    colors = [
      "#b65cff",
    ];
  } else {
    colors = [
      "#ffd15c",
    ];
  }

  return (
    <ConfettiBoom
      mode="fall"
      className="z-50"
      particleCount={88}
      colors={colors}
    />
  );
}; 