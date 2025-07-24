import {
  CopyIcon,
  Share2Icon,
  SquareCheckBigIcon,
  SquareIcon,
} from "lucide-react";
import { formatDurationMs } from "../../utils/game";
import useShare from "../../hooks/useShare";
import { SOLUTION_SIZES } from "../../game/logic";
import {
  useCompletedPuzzlesManager,
  getPuzzleCompletionByDateAndSize,
  type CompletedPuzzle,
} from "../../hooks/useLocalStorage";
import { cn } from "@sglara/cn";

const URL = "https://blockle.au";

interface PerformanceShareProps {
  handleChangePuzzle: (size: number) => void;
};

export function PerformanceShare({
  handleChangePuzzle,
}: PerformanceShareProps) {
  const { copy, share, canShare } = useShare();

  const { completedPuzzles } = useCompletedPuzzlesManager();

  const shareText = buildShareText(completedPuzzles);
  const copyText = shareText + "\n" + URL;

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 w-full bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 p-4 rounded-lg">
          <p className="font-bold text-xl text-center text-balance mb-2">
            Your Results ({new Date().toLocaleDateString()})
          </p>
          <div className="grid grid-rows-3 gap-2">
            {SOLUTION_SIZES.map((size: number) => {
              const strSize = size.toString();
              const puzzle = getPuzzleCompletionByDateAndSize(
                completedPuzzles,
                new Date().toISOString().split("T")[0],
                size
              );
              const isCompleted = !!puzzle;
              return (
                <div
                  className="flex items-center justify-between gap-2"
                  key={size}
                >
                  <p className="flex items-center font-bold text-lg">
                    {strSize}×{strSize}
                    {isCompleted ? (
                      <SquareCheckBigIcon className="size-5 ml-2" />
                    ) : (
                      <SquareIcon className="size-5 ml-2" />
                    )}
                  </p>
                  {isCompleted ? (
                    <p className="text-right">
                      Completed in {formatDurationMs(puzzle.timeToCompleteMs)}
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        handleChangePuzzle(size);
                      }}
                      title={`Switch to ${strSize}x${strSize} puzzle`}
                      className={cn(
                        "flex items-center justify-center rounded-full text-center bg-gray-800 dark:bg-white text-white dark:text-gray-800 hover:opacity-80 px-4 py-2 gap-2"
                      )}
                    >
                      Play the {strSize}×{strSize}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <button
            type="button"
            onClick={() => {
              void copy(copyText);
            }}
            className={cn(
              "cursor-pointer w-full flex items-center justify-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-full hover:opacity-80",
              {
                "bg-gray-500": canShare,
              }
            )}
          >
            <span>Copy results</span>
            <CopyIcon className="size-5" />
          </button>
          {canShare && (
            <button
              type="button"
              onClick={() => {
                void share(shareText, URL);
              }}
              className="cursor-pointer w-full flex items-center justify-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-full hover:opacity-80"
            >
              <span>Share results</span>
              <Share2Icon className="size-5" />
            </button>
          )}
        </div>
      </div>
    </>
  );
}

function buildShareText(completedPuzzles: CompletedPuzzle[]): string {
  let out = `My Blockle Results (${new Date().toLocaleDateString()}):`;
  SOLUTION_SIZES.map((size: number) => {
    const strSize = size.toString();
    const puzzle = getPuzzleCompletionByDateAndSize(
      completedPuzzles,
      new Date().toISOString().split("T")[0],
      size
    );
    if (puzzle) {
      out += `\n${strSize}x${strSize} - ${formatDurationMs(
        puzzle.timeToCompleteMs
      )} ${puzzle.isThemeRevealed ? "(theme revealed)" : ""}`;
    }
  });
  return out;
}
