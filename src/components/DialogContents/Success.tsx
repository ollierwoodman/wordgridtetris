import { CopyIcon, Grid2X2PlusIcon, Share2Icon } from "lucide-react";
import { formatDurationMs } from "../../utils/game";
import useShare from "../../hooks/useShare";
import { useTrackSharedResult } from "../../hooks/useTrackGoals";
import { SOLUTION_SIZES, type Game } from "../../game/logic";

const MAX_SOLUTION_SIZE = Math.max(...SOLUTION_SIZES);
interface SuccessProps {
  game: Game;
  handleLevelUp: () => void;
}

export function Success({ game, handleLevelUp }: SuccessProps) {
  const solutionSize = game.getSolutionSize();
  const strSolutionSize = solutionSize.toString();
  const completionDurationMs = game.getCompletionDurationMs() ?? 0;
  const isThemeRevealed = game.getIsThemeRevealed();

  const { copy, share, canShare } = useShare();

  const url = `https://blockle.au/${strSolutionSize}x${strSolutionSize}`;
  const shareTitle = `I solved today's ${strSolutionSize}×${strSolutionSize} Blockle in ${formatDurationMs(
    completionDurationMs
  )}${isThemeRevealed ? " (with theme revealed)" : ""}! ${url}`;
  const shareText = shareTitle;

  const trackSharedResults = useTrackSharedResult();

  return (
    <>
      <p className="text-gray-600 dark:text-gray-300 text-lg text-center text-balance">
        You've completed today's {strSolutionSize}×{strSolutionSize} Blockle
        {completionDurationMs > 0
          ? ` in ${formatDurationMs(completionDurationMs)}`
          : ""}
        !
      </p>
      {canShare ? (
        <button
          type="button"
          onClick={() => {
            void share(shareText, url, shareTitle);
            trackSharedResults();
          }}
          className="cursor-pointer w-full flex items-center justify-center space-x-2 bg-blue-500  text-white px-4 py-2 mt-4 rounded-full hover:opacity-80"
        >
          <span>Share</span>
          <Share2Icon className="size-5" />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => {
            void copy(shareText);
            trackSharedResults();
          }}
          className="cursor-pointer w-full flex items-center justify-center space-x-2 bg-blue-500 text-white px-4 py-2 mt-4 rounded-full hover:opacity-80"
        >
          <span>Copy text</span>
          <CopyIcon className="size-5" />
        </button>
      )}
      {solutionSize && solutionSize < MAX_SOLUTION_SIZE && (
        <button
          onClick={() => {
            handleLevelUp();
          }}
          className="cursor-pointer w-full flex items-center justify-center space-x-2 bg-gray-200 text-gray-800 px-4 py-2 mt-4 rounded-full hover:opacity-80"
        >
          <span>Play next puzzle</span>
          <Grid2X2PlusIcon className="size-5" />
        </button>
      )}

      {solutionSize && solutionSize >= MAX_SOLUTION_SIZE && (
        <p className="text-center text-gray-500 dark:text-gray-400">
          Come back tomorrow for new puzzles!
        </p>
      )}
    </>
  );
}
