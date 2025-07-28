import { useState, useEffect, useCallback } from "react";
import { Game } from "../game/logic";
import type { GameState } from "../types/game";
import { useGameSounds } from "./sounds";
import { useCompletedPuzzlesManager } from "./useLocalStorage";
import { useTrackCompletedPuzzle } from "./useTrackGoals";

interface UsePuzzleCompletionParams {
  game: Game | null;
  gameState: GameState | null;
}

export const usePuzzleCompletion = ({ 
  game, 
  gameState 
}: UsePuzzleCompletionParams) => {
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [showSuccessButton, setShowSuccessButton] = useState<boolean>(false);

  const { playPuzzleComplete } = useGameSounds();
  const { addPuzzle, hasCompletedTodayWithSize } = useCompletedPuzzlesManager();
  const trackCompletedPuzzle = useTrackCompletedPuzzle();

  const resetCompletionState = useCallback(() => {
    setShowConfetti(false);
    setShowSuccessButton(false);
  }, []);

  // Check for puzzle completion and trigger confetti and success modal
  useEffect(() => {
    if (!game) {
      return;
    }

    const alreadyCompletedThisPuzzleToday = hasCompletedTodayWithSize(
      game.getSolutionSize()
    );

    if (gameState?.isCompleted) {
      trackCompletedPuzzle(game.getSolutionSize());
      setShowConfetti(true);
      setShowSuccessButton(true);
      playPuzzleComplete();

      if (!alreadyCompletedThisPuzzleToday) {
        addPuzzle({
          date: new Date().toISOString().split("T")[0],
          solutionSize: game.getSolutionSize(),
          theme: game.getWordTheme(),
          isThemeRevealed: gameState.isThemeRevealed,
          timeToCompleteMs: game.getCompletionDurationMs() ?? -1,
        });
      }
    }
  }, [gameState, game, hasCompletedTodayWithSize, trackCompletedPuzzle, addPuzzle, playPuzzleComplete]);

  return {
    showConfetti,
    showSuccessButton,
    resetCompletionState,
  };
}; 