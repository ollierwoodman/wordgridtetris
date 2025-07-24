import { PartyPopperIcon } from "lucide-react";
import { SOLUTION_SIZES, type Game } from "../../game/logic";
import { useCompletedPuzzlesManager } from "../../hooks/useLocalStorage";
import { PerformanceShare } from "./PerformanceShare";

interface SuccessProps {
  game: Game;
  isReplay: boolean;
  handleChangePuzzle: (size: number) => void;
}

export function Success({ game, isReplay, handleChangePuzzle }: SuccessProps) {
  const solutionSize = game.getSolutionSize();
  const strSolutionSize = solutionSize.toString();
  const { hasCompletedTodayWithSize } = useCompletedPuzzlesManager();
  const hasCompletedAllTodaysPuzzles = SOLUTION_SIZES.every((size) =>
    hasCompletedTodayWithSize(size)
  );

  return (
    <>
      <PartyPopperIcon className="text-gray-800 dark:text-white size-24 mx-auto" />
      <p className="text-gray-600 dark:text-gray-300 text-lg text-center text-balance">
        {`You completed today's ${strSolutionSize}×${strSolutionSize} Blockle${isReplay ? " again" : ""}!`}
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