import { PartyPopperIcon } from "lucide-react";
import { type Game } from "../../game/logic";
import { useCompletedPuzzlesManager } from "../../hooks/useLocalStorage";
import { PerformanceShare } from "./PerformanceShare";
import { GAME_MODE_LIST, getGameModeConfig, type GameMode } from "../../types/gameMode";

interface SuccessProps {
  game: Game;
  isReplay: boolean;
  handleChangePuzzle: (mode: GameMode) => void;
}

export function Success({ game, isReplay, handleChangePuzzle }: SuccessProps) {
  const solutionSize = game.getSolutionSize();
  const strSolutionSize = solutionSize.toString();
  const { hasCompletedTodayWithSize } = useCompletedPuzzlesManager();
  const hasCompletedAllTodaysPuzzles = GAME_MODE_LIST.every((mode) => {
    const config = getGameModeConfig(mode);
    return hasCompletedTodayWithSize(config.solutionSize);
  });

  return (
    <>
      <PartyPopperIcon className="text-gray-800 dark:text-white size-24 mx-auto" />
      <p className="text-gray-600 dark:text-gray-300 text-lg text-center text-balance">
        {solutionSize === 8 
          ? `You completed today's Chengyu Blockle${isReplay ? " again" : ""}!`
          : `You completed today's ${strSolutionSize}×${strSolutionSize} Blockle${isReplay ? " again" : ""}!`
        }
      </p>
      <PerformanceShare handleChangePuzzle={handleChangePuzzle} />
      <p className="text-center text-balance text-gray-500 dark:text-gray-400">
        {hasCompletedAllTodaysPuzzles
          ? "Come back tomorrow for new puzzles!"
          : "Try to complete all of today's puzzles!"}
      </p>
    </>
  );
}