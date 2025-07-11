import { CopyIcon, Grid2X2PlusIcon, Share2Icon } from "lucide-react";
import type { Game } from "../../game/logic";
import { MAX_SOLUTION_SIZE } from "../../hooks/useSolutionSizeFromURL";
import { formatDurationMs } from "../../utils/game";
import useShare from "../../hooks/useShare";

interface SuccessProps {
  game: Game | null;
  handleLevelUp: () => void;
  completionTime: number;
}

export function Success({ game, handleLevelUp, completionTime }: SuccessProps) {
  const { copy, share, canShare } = useShare();

  const GAME_LINK = `https://blockle.au/${game?.getSolutionSize()}x${game?.getSolutionSize()}`;
  const shareText = `I solved today's ${game?.getSolutionSize()}×${game?.getSolutionSize()} Blockle ${
    completionTime > 0 ? `in ${formatDurationMs(completionTime)}` : ""
  }!\n${GAME_LINK}`;

  return (
    <>
      <p className="text-gray-600 dark:text-gray-300 text-lg text-center text-balance">
        You've completed today's {game?.getSolutionSize()}×
        {game?.getSolutionSize()} Blockle
        {completionTime > 0 ? ` in ${formatDurationMs(completionTime)}` : ""}!
      </p>

      <div className="w-full max-w-md">
        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
          <p className="text-center text-gray-500 dark:text-gray-400 mb-2">
            Share your achievement
          </p>
          <div className="bg-white dark:bg-gray-600 rounded p-4 text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words select-text">
            {shareText}
          </div>
          {(canShare && (
            <button
              type="button"
              onClick={() => share(GAME_LINK, "Blockle", shareText)}
              className="cursor-pointer w-full flex items-center justify-center space-x-2 bg-blue-500  text-white px-4 py-2 mt-4 rounded-full hover:opacity-80"
            >
              <span>Share</span>
              <Share2Icon className="size-5" />
            </button>
          )) || (
            <button
              type="button"
              onClick={() => copy(GAME_LINK)}
              className="cursor-pointer w-full flex items-center justify-center space-x-2 bg-gray-200 text-gray-800 px-4 py-2 mt-4 rounded-full hover:opacity-80"
            >
              <span>Copy text</span>
              <CopyIcon className="size-5" />
            </button>
          )}
        </div>
        {game?.getSolutionSize() &&
          game.getSolutionSize() < MAX_SOLUTION_SIZE && (
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
      </div>

      {game?.getSolutionSize() &&
        game.getSolutionSize() >= MAX_SOLUTION_SIZE && (
          <p className="text-center text-gray-500 dark:text-gray-400">
            Come back tomorrow for new puzzles!
          </p>
        )}
    </>
  );
}
