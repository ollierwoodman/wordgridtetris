import { Grid2X2CheckIcon } from "lucide-react";
import { type CompletedPuzzle } from "../../hooks/useLocalStorage";
import { PerformanceShare } from "./PerformanceShare";

interface AlreadyPlayedProps {
  puzzle: CompletedPuzzle;
}

export function AlreadyPlayed({ puzzle }: AlreadyPlayedProps) {
  return (
    <>
      <Grid2X2CheckIcon className="text-gray-800 dark:text-white size-24 mx-auto" />
      <p className="text-gray-600 dark:text-gray-300 text-lg text-center text-balance">
        You have already completed today's {puzzle.solutionSize.toString()}×{puzzle.solutionSize.toString()} Blockle
      </p>
      <PerformanceShare />
      <p className="text-center text-balance text-gray-500 dark:text-gray-400">
        You can still play today's {puzzle.solutionSize.toString()}×{puzzle.solutionSize.toString()} puzzle again, but it won't count towards your stats.
      </p>
    </>
  );
}
