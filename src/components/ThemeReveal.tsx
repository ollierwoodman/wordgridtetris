import { LightbulbIcon } from "lucide-react";
import FlippableCard from "./ui/flippableCard";
import { useCallback } from "react";
import { useGameSounds } from "../hooks/sounds";
import { GOAL_IDS, useTrackMatomoGoalById } from "../hooks/useTrackGoals";
import type { GameState } from "../types/game";

interface ThemeRevealProps {
  theme: string | null;
  gameState: GameState;
  onThemeReveal: () => void;
}

export const ThemeReveal = ({ theme, gameState, onThemeReveal }: ThemeRevealProps) => {
  const { playThemeReveal } = useGameSounds();
  const trackGoal = useTrackMatomoGoalById();

  const handleThemeReveal = useCallback(() => {
    if (gameState.isThemeRevealed) {
      return;
    }
    onThemeReveal();
    playThemeReveal();
    trackGoal(GOAL_IDS.REVEALED_THEME);
  }, [onThemeReveal, gameState, playThemeReveal, trackGoal]);

  if (!theme) {
    return null;
  }

  return (
    <div className="flex items-center w-full max-w-[60vh] text-lg md:text-xl xl:text-2xl text-center text-balance mt-4">
      <FlippableCard
        className="w-full"
        frontContent={
          <>
            <LightbulbIcon className="size-10" />
            <span className="font-bold uppercase ml-2">
              Tap to reveal theme
            </span>
          </>
        }
        backContent={
          <>
            <span>Theme:</span>
            <span className="font-bold uppercase ml-2">
              {theme}
            </span>
          </>
        }
        isFlipped={gameState.isThemeRevealed || gameState.isCompleted}
        onClick={handleThemeReveal}
      />
    </div>
  );
}; 