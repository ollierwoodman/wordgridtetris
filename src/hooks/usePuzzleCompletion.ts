import { useState, useEffect, useCallback } from "react";
import { Game } from "../game/logic";
import type { GameState } from "../types/game";
import { useGameSounds } from "./useSounds";
import { useCompletedPuzzlesManager } from "./useLocalStorage";
import { useTrackCompletedPuzzle } from "./useTrackGoals";
import { getLocalDateString } from "../utils/game";

interface UsePuzzleCompletionParams {
  game: Game | null;
  gameState: GameState | null;
  solvePuzzle: () => void;
  onGiveUp?: () => void;
}

export const usePuzzleCompletion = ({ 
  game, 
  gameState,
  solvePuzzle,
  onGiveUp
}: UsePuzzleCompletionParams) => {
  const [showConfetti, setShowConfetti] = useState<boolean>(false);

  const { playPuzzleComplete } = useGameSounds();
  const { addPuzzle, hasCompletedTodayWithMode, completedPuzzles } = useCompletedPuzzlesManager();
  const trackCompletedPuzzle = useTrackCompletedPuzzle();

  const resetCompletionState = useCallback(() => {
    setShowConfetti(false);
  }, []);

  const handleGiveUp = useCallback(() => {
    if (!game) return;
    game.setGaveUp();
    solvePuzzle();
  }, [game, solvePuzzle]);

  // Check for puzzle completion and trigger confetti
  useEffect(() => {
    if (!game) {
      return;
    }

    if (game.getGaveUp()) {
      return;
    }

    const alreadyCompletedThisPuzzleToday = hasCompletedTodayWithMode(
      game.getMode(),
      false // exclude gave up
    );

    if (gameState?.isCompleted) {
      // If this puzzle was marked as gave up, suppress success effects
      const todaysRecord = completedPuzzles.find((p) =>
        p.date === getLocalDateString() && p.mode === game.getMode()
      );
      if (todaysRecord?.gaveUp) {
        return;
      }
      trackCompletedPuzzle(game.getMode());
      setShowConfetti(true);
      playPuzzleComplete();

      if (!alreadyCompletedThisPuzzleToday) {
        addPuzzle(game);
      }
    }
  }, [gameState, game, hasCompletedTodayWithMode, trackCompletedPuzzle, addPuzzle, playPuzzleComplete, completedPuzzles]);

  // Handle give up completion logic
  useEffect(() => {
    if (!game || !gameState?.isCompleted) {
      return;
    }

    const alreadyCompletedThisPuzzleToday = hasCompletedTodayWithMode(
      game.getMode(),
      true // include gave up
    );

    if (!game.isPuzzleCompleted()) {
      // no op if puzzle not completed
      return;
    }

    if (alreadyCompletedThisPuzzleToday) {
      // Already completed this puzzle today, trigger callback if provided
      if (onGiveUp) {
        onGiveUp();
      }
      return;
    }

    if (game.getGaveUp()) {
      addPuzzle(game);
      // Trigger callback if provided
      if (onGiveUp) {
        onGiveUp();
      }
      return;
    }
  }, [
    game,
    gameState?.isCompleted,
    hasCompletedTodayWithMode,
    addPuzzle,
    onGiveUp,
  ]);

  return {
    showConfetti,
    resetCompletionState,
    handleGiveUp,
  };
}; 