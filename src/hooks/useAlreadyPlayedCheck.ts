import { useEffect, useState } from "react";
import { useCompletedPuzzlesManager, type CompletedPuzzle } from "./useLocalStorage";
import { getLocalDateString } from "../utils/game";
import type { GameMode } from "../types/gameMode";

interface UseAlreadyPlayedCheckParams {
  isInitialized: boolean;
  gameMode: GameMode;
}

export const useAlreadyPlayedCheck = ({
  isInitialized,
  gameMode,
}: UseAlreadyPlayedCheckParams) => {
  const [shouldShowAlreadyPlayed, setShouldShowAlreadyPlayed] = useState(false);
  const [completedPuzzle, setCompletedPuzzle] = useState<CompletedPuzzle | null>(null);
  
  const { hasCompletedTodayWithMode, getPuzzleByDateAndMode } = useCompletedPuzzlesManager();

  // Check if puzzle was already completed when loading (including gave up)
  useEffect(() => {
    if (isInitialized && hasCompletedTodayWithMode(gameMode, true)) {
      const puzzle = getPuzzleByDateAndMode(
        getLocalDateString(),
        gameMode,
        true // include gave up
      );
      if (puzzle) {
        setCompletedPuzzle(puzzle);
        setShouldShowAlreadyPlayed(true);
        return;
      }
    }
    setShouldShowAlreadyPlayed(false);
    setCompletedPuzzle(null);
  }, [isInitialized, gameMode, hasCompletedTodayWithMode, getPuzzleByDateAndMode]);

  return {
    shouldShowAlreadyPlayed,
    completedPuzzle,
  };
}; 