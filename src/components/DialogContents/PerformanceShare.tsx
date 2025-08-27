import {
  CopyIcon,
  Share2Icon,
  SquareCheckBigIcon,
  SquareIcon,
} from "lucide-react";
import { formatDurationMs, getLocalDateString } from "../../utils/game";
import useShare from "../../hooks/useShare";
import { GAME_MODE_LIST, getGameModeConfig, type GameMode } from "../../types/gameMode";
import {
  useCompletedPuzzlesManager,
  getPuzzleCompletionByDateAndSize,
  type CompletedPuzzle,
} from "../../hooks/useLocalStorage";
import { cn } from "@sglara/cn";
import { GOAL_IDS, useTrackMatomoGoalById } from "../../hooks/useTrackGoals";

const URL = "https://blockle.au";

interface PerformanceShareProps {
  handleChangePuzzle: (mode: GameMode) => void;
};

export function PerformanceShare({
  handleChangePuzzle,
}: PerformanceShareProps) {
  const { copy, share, canShare } = useShare();
  const trackGoal = useTrackMatomoGoalById();

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
          <div className="grid gap-2" style={{ gridTemplateRows: `repeat(${GAME_MODE_LIST.filter(mode => {
            const config = getGameModeConfig(mode);
            const puzzle = getPuzzleCompletionByDateAndSize(
              completedPuzzles,
              getLocalDateString(),
              config.solutionSize
            );
            // Show Chengyu mode only if completed, show others always
            return mode !== 'chengyu' || !!puzzle;
          }).length.toString()}, minmax(0, 1fr))` }}>
            {GAME_MODE_LIST.filter(mode => {
              const config = getGameModeConfig(mode);
              const puzzle = getPuzzleCompletionByDateAndSize(
                completedPuzzles,
                getLocalDateString(),
                config.solutionSize
              );
              // Show Chengyu mode only if completed, show others always
              return mode !== 'chengyu' || !!puzzle;
            }).map((mode: GameMode) => {
              const config = getGameModeConfig(mode);
              const puzzle = getPuzzleCompletionByDateAndSize(
                completedPuzzles,
                getLocalDateString(),
                config.solutionSize
              );
              const isCompleted = !!puzzle;
              return (
                <div
                  className="flex items-center justify-between gap-2"
                  key={mode}
                >
                  <p className="flex items-center font-bold text-lg">
                    {config.displayName}
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
                        handleChangePuzzle(mode);
                      }}
                      title={`Switch to ${config.description}`}
                      className={cn(
                        "cursor-pointer flex items-center justify-center rounded-full text-center bg-gray-800 dark:bg-white text-white dark:text-gray-800 hover:opacity-80 px-4 py-2 gap-2"
                      )}
                    >
                      Play {config.displayName}
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
              trackGoal(GOAL_IDS.CLICKED_COPY_BUTTON);
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
                trackGoal(GOAL_IDS.CLICKED_SHARE_BUTTON);
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
  GAME_MODE_LIST.filter(mode => {
    const config = getGameModeConfig(mode);
    const puzzle = getPuzzleCompletionByDateAndSize(
      completedPuzzles,
      getLocalDateString(),
      config.solutionSize
    );
    // Show Chengyu mode only if completed, show others always
    return mode !== 'chengyu' || !!puzzle;
  }).map((mode: GameMode) => {
    const config = getGameModeConfig(mode);
    const puzzle = getPuzzleCompletionByDateAndSize(
      completedPuzzles,
      getLocalDateString(),
      config.solutionSize
    );
    if (puzzle) {
      out += `\n${config.displayName} - ${formatDurationMs(
        puzzle.timeToCompleteMs
      )} ${puzzle.isThemeRevealed ? "(theme revealed)" : ""}`;
    }
  });
  return out;
}
