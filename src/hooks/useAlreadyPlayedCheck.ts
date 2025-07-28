import { useEffect, useState } from "react";
import { useCompletedPuzzlesManager, type CompletedPuzzle } from "./useLocalStorage";

interface UseAlreadyPlayedCheckParams {
  isInitialized: boolean;
  solutionSize: number;
}

export const useAlreadyPlayedCheck = ({
  isInitialized,
  solutionSize,
}: UseAlreadyPlayedCheckParams) => {
  const [shouldShowAlreadyPlayed, setShouldShowAlreadyPlayed] = useState(false);
  const [completedPuzzle, setCompletedPuzzle] = useState<CompletedPuzzle | null>(null);
  
  const { hasCompletedTodayWithSize, getPuzzleByDateAndSize } = useCompletedPuzzlesManager();

  // Check if puzzle was already completed when loading
  useEffect(() => {
    if (isInitialized && hasCompletedTodayWithSize(solutionSize)) {
      const puzzle = getPuzzleByDateAndSize(
        new Date().toISOString().split("T")[0],
        solutionSize
      );
      if (puzzle) {
        setCompletedPuzzle(puzzle);
        setShouldShowAlreadyPlayed(true);
        return;
      }
    }
    setShouldShowAlreadyPlayed(false);
    setCompletedPuzzle(null);
  }, [isInitialized, solutionSize, hasCompletedTodayWithSize, getPuzzleByDateAndSize]);

  return {
    shouldShowAlreadyPlayed,
    completedPuzzle,
  };
}; 