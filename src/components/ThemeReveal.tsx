import FlippableCard from "./ui/flippableCard";
import { useCallback } from "react";
import { useGameSounds } from "../hooks/useSounds";
import { GOAL_IDS, useTrackMatomoGoalById } from "../hooks/useTrackGoals";
import type { GameState } from "../types/game";
import { cn } from "@sglara/cn";

interface ThemeRevealProps {
  theme: string | null;
  gameState: GameState;
  onThemeReveal: () => void;
}

export const ThemeReveal = ({
  theme,
  gameState,
  onThemeReveal,
}: ThemeRevealProps) => {
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
    <div
      className={cn(
        "flex items-center w-full max-w-[60vh] text-2xl text-center text-balance font-bold uppercase mt-4",
        {
          "text-lg md:text-2xl": theme.length > 10,
          "text-base md:text-2xl": theme.length > 15,
        }
      )}
    >
      <FlippableCard
        className="w-full h-16 md:h-20 xl:h-24"
        frontContent="reveal theme"
        backContent={theme}
        isFlipped={gameState.isThemeRevealed || gameState.isCompleted}
        onClick={handleThemeReveal}
      />
    </div>
  );
};
