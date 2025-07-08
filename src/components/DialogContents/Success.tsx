import { useState } from "react";
import { ArrowUpCircleIcon, CheckIcon, Copy } from "lucide-react";
import type { Game } from "../../game/logic";
import { MAX_SOLUTION_SIZE } from "../../App";

const GAME_LINK = "https://ollierwoodman.github.io/wordgridtetris/";

interface SuccessProps {
  game: Game | null;
  handleLevelUp: () => void;
}

export function Success({ game, handleLevelUp }: SuccessProps) {
  const [copied, setCopied] = useState(false);

  const shareText = `I solved today's ${game?.getSolutionSize()}×${game?.getSolutionSize()} Blockle puzzle!\nSee how you go here: ${GAME_LINK}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <>
      <p className="text-gray-600 dark:text-gray-300 text-lg text-center text-balance">
        You've completed today's {game?.getSolutionSize()}×
        {game?.getSolutionSize()} puzzle!
      </p>

      <div className="w-full max-w-md">
        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-4">
          <p className="text-center text-gray-500 dark:text-gray-400 mb-2">
            Share your achievement
          </p>
          <div className="bg-white dark:bg-gray-600 rounded p-4 text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words select-text">
            {shareText}
          </div>
          <button
            onClick={copyToClipboard}
            className="cursor-pointer w-full flex items-center justify-center space-x-2 bg-blue-500  text-white px-4 py-2 mt-4 rounded-lg hover:opacity-80"
          >
            <span>{copied ? "Copied" : "Copy text"}</span>
            {copied ? (
              <CheckIcon className="w-4 h-4" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>
        {game?.getSolutionSize() &&
          game.getSolutionSize() < MAX_SOLUTION_SIZE && (
            <button
              onClick={() => {
                handleLevelUp();
              }}
              className="cursor-pointer w-full flex items-center justify-center space-x-2 bg-red-600 dark:bg-red-800 text-white px-4 py-2 mt-4 rounded-lg hover:opacity-80"
            >
              <span>Level up</span>
              <ArrowUpCircleIcon className="w-4 h-4" />
            </button>
          )}
      </div>

      <p className="text-center text-gray-500 dark:text-gray-400">
        Come back tomorrow for new puzzles!
      </p>
    </>
  );
}
