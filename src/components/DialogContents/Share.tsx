import { useCompletedPuzzlesManager } from "../../hooks/useLocalStorage";
import { PerformanceShare } from "./PerformanceShare";
import { GAME_MODE_LIST, getGameModeConfig, type GameMode } from "../../types/gameMode";
import { ShareIcon } from "lucide-react";

interface ShareProps {
  handleChangePuzzle: (mode: GameMode) => void;
}

export function Share({ handleChangePuzzle }: ShareProps) {
  const { hasCompletedTodayWithMode } = useCompletedPuzzlesManager();
  const hasCompletedAllTodaysPuzzles = GAME_MODE_LIST.every((mode) => {
    const config = getGameModeConfig(mode);
    return hasCompletedTodayWithMode(config.mode);
  });

  return (
    <>
      <ShareIcon className="text-gray-800 dark:text-white size-24 mx-auto" />
      <PerformanceShare handleChangePuzzle={handleChangePuzzle} />
      <p className="text-center text-balance text-gray-500 dark:text-gray-400">
        {hasCompletedAllTodaysPuzzles
          ? "Come back tomorrow for new puzzles!"
          : "Try to complete all of today's puzzles!"}
      </p>
    </>
  );
}