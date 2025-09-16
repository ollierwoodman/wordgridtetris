import { useState } from "react";
import {
  TrophyIcon,
  CalendarIcon,
  TrendingUpIcon,
  BarChartHorizontalIcon,
  CheckCheckIcon,
  XIcon,
  BlocksIcon,
  GaugeCircleIcon,
  MoveIcon,
} from "lucide-react";
import { useCompletedPuzzlesManager } from "../../hooks/useLocalStorage";
import { ConfirmModal } from "../ui/ConfirmModal";
import { formatDurationMs } from "../../utils/game";
import { GAME_MODES, type GameMode } from "../../types/gameMode";

// All completed puzzles now include a definitive mode; no legacy size fallback needed.

export function Stats() {
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const {
    completedPuzzles,
    getPuzzlesByMode,
    hasCompletedToday,
    clearCompletedPuzzles,
  } = useCompletedPuzzlesManager();

  // Calculate statistics (excluding given up puzzles)
  const totalPuzzles = completedPuzzles.filter(p => !p.gaveUp).length;
  const completedToday = hasCompletedToday(false); // exclude gave up

  // Group puzzles by size (excluding gave up)
  const puzzlesByMode = {
    "5x5": getPuzzlesByMode("5x5", false).length,
    "6x6": getPuzzlesByMode("6x6", false).length,
    "7x7": getPuzzlesByMode("7x7", false).length,
    "chengyu": getPuzzlesByMode("chengyu", false).length,
  } as Record<GameMode, number>;

  // Calculate average completion time (excluding 0 values and gave up puzzles)
  const puzzlesWithTime = completedPuzzles.filter(
    (p) => p.timeToCompleteMs > 0 && !p.gaveUp
  );
  // Get best time for each puzzle size
  const bestTimes = puzzlesWithTime.reduce<Record<GameMode, number>>((acc, puzzle) => {
    const mode = puzzle.mode;
    if (!acc[mode] || puzzle.timeToCompleteMs < acc[mode]) {
      acc[mode] = puzzle.timeToCompleteMs;
    }
    return acc;
  }, {} as Record<GameMode, number>);

  // Get best moves (fewest moves) for each puzzle size
  const puzzlesWithMoves = completedPuzzles.filter(
    (p) => p.numMoves > 0 && !p.gaveUp
  );
  const bestMoves = puzzlesWithMoves.reduce<Record<GameMode, number>>((acc, puzzle) => {
    const mode = puzzle.mode;
    if (!acc[mode] || puzzle.numMoves < acc[mode]) {
      acc[mode] = puzzle.numMoves;
    }
    return acc;
  }, {} as Record<GameMode, number>);

  // Calculate completion streak (consecutive days, excluding gave up)
  const calcCurrentStreak = () => {
    const completedOnly = completedPuzzles.filter(p => !p.gaveUp);
    if (completedOnly.length === 0) return 0;

    const sortedPuzzles = [...completedOnly].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    let streak = 0;
    const currentDate = new Date();

    for (const puzzle of sortedPuzzles) {
      const puzzleDate = new Date(puzzle.date);
      const daysDiff = Math.floor(
        (currentDate.getTime() - puzzleDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysDiff === streak) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  };

  const calcBestStreak = () => {
    const completedOnly = completedPuzzles.filter(p => !p.gaveUp);
    if (completedOnly.length === 0) return 0;

    // Sort puzzles by date (oldest first)
    const sortedPuzzles = [...completedOnly].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    let bestStreak = 0;
    let currentStreak = 0;
    let lastDate: Date | null = null;

    for (const puzzle of sortedPuzzles) {
      const puzzleDate = new Date(puzzle.date);
      // Set time to start of day for consistent comparison
      puzzleDate.setHours(0, 0, 0, 0);

      if (lastDate === null) {
        // First puzzle
        currentStreak = 1;
        lastDate = puzzleDate;
      } else {
        const daysDiff = Math.floor(
          (puzzleDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (daysDiff === 1) {
          // Consecutive day
          currentStreak++;
        } else if (daysDiff === 0) {
          // Same day - multiple puzzles, continue streak
          continue;
        } else {
          // Gap in streak, reset
          bestStreak = Math.max(bestStreak, currentStreak);
          currentStreak = 1;
        }
        lastDate = puzzleDate;
      }
    }

    // Check if the last streak is the best
    bestStreak = Math.max(bestStreak, currentStreak);

    return bestStreak;
  };

  const currentStreak = calcCurrentStreak();
  const bestStreak = calcBestStreak();

  return (
    <div className="space-y-8">
      {/* Today's Status */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2">
        <div className="flex items-center gap-4 p-2">
          <span className="px-2">
            <CalendarIcon className="size-6 text-blue-800 dark:text-blue-200" />
          </span>
          <div>
            <h3 className="font-bold text-blue-800 dark:text-blue-200">
              Today's Puzzle
            </h3>
            <p className="text-blue-600 dark:text-blue-300">
              {completedToday ? (
                <span className="inline-flex items-center gap-1">
                  <CheckCheckIcon className="size-5" />
                  <span>Completed</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1">
                  <span>
                    <XIcon className="size-4" />
                  </span>{" "}
                  Not completed yet
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Key Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <BlocksIcon className="size-8 mx-auto mb-2 text-purple-600 dark:text-purple-400" />
          <div className="text-2xl font-bold text-gray-800 dark:text-gray-200 py-1">
            {totalPuzzles}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Puzzles
            <br />
            Solved
          </div>
        </div>

        <div className="text-center">
          <TrendingUpIcon className="size-8 mx-auto mb-2 text-green-600 dark:text-green-400" />
          <div className="flex items-center justify-center w-full text-2xl font-bold text-gray-800 dark:text-gray-200 py-1">
            {currentStreak}
            <span className="text-xs ml-0.5">
              day{currentStreak === 1 ? "" : "s"}
            </span>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Current
            <br />
            Streak
          </div>
        </div>

        <div className="text-center">
          <TrendingUpIcon className="size-8 mx-auto mb-2 text-yellow-600 dark:text-yellow-400" />
          <div className="flex items-center justify-center w-full text-2xl font-bold text-gray-800 dark:text-gray-200 py-1">
            {bestStreak}
            <span className="text-xs ml-0.5">
              day{bestStreak === 1 ? "" : "s"}
            </span>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Best
            <br />
            Streak
          </div>
        </div>
      </div>

      {/* Best Times Breakdown */}
      <div>
        <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-2">
          <GaugeCircleIcon className="size-5" />
          Fastest Times
        </h3>
        {Object.entries(bestTimes).length > 0 ? (
          Object.entries(bestTimes).map(([mode, time]) => {
            const gameModeConfig = GAME_MODES[mode as GameMode];
            return (
            <div key={mode} className="grid grid-cols-4 gap-4 items-center">
              <div className="text-gray-600 dark:text-gray-400">
                {gameModeConfig.displayName}
              </div>
              <div className="col-span-2">
                <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${(totalPuzzles > 0
                        ? (time / Math.max(...Object.values(bestTimes))) * 100
                        : 0
                      ).toString()}%`,
                    }}
                  />
                </div>
              </div>
              <div className="text-right text-sm text-gray-800 dark:text-gray-200">
                {formatDurationMs(time)}
              </div>
            </div>
            );
          })
        ) : (
          <p className="text-gray-600 dark:text-gray-400">No times yet.</p>
        )}
      </div>

      {/* Fewest Moves Breakdown */}
      <div>
        <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-2">
          <MoveIcon className="size-5" />
          Fewest Moves
        </h3>
        {Object.entries(bestMoves).length > 0 ? (
          Object.entries(bestMoves).map(([mode, moves]) => {
            const gameModeConfig = GAME_MODES[mode as GameMode];
            return (
            <div key={mode} className="grid grid-cols-4 gap-4 items-center">
              <div className="text-gray-600 dark:text-gray-400">
                {gameModeConfig.displayName}
              </div>
              <div className="col-span-2">
                <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${(Object.values(bestMoves).length > 0
                        ? (moves / Math.max(...Object.values(bestMoves))) * 100
                        : 0
                      ).toString()}%`,
                    }}
                  />
                </div>
              </div>
              <div className="text-right text-sm text-gray-800 dark:text-gray-200">
                {moves} move{moves === 1 ? '' : 's'}
              </div>
            </div>
            );
          })
        ) : (
          <p className="text-gray-600 dark:text-gray-400">No moves recorded yet.</p>
        )}
      </div>

      {/* Puzzle Mode Breakdown */}
      <div>
        <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-2">
          <BarChartHorizontalIcon className="size-5" />
          Puzzles by Mode
        </h3>
        {Object.entries(puzzlesByMode).map(([mode, count]) => {
          if (count <= 0) return null;
          const gameModeConfig = GAME_MODES[mode as GameMode];
          const countProportion =
            totalPuzzles > 0 ? (count / totalPuzzles) * 100 : 0;
          return (
            <div key={mode} className="grid grid-cols-4 gap-4 items-center">
              <div className="text-gray-600 dark:text-gray-400">
                {gameModeConfig.displayName}
              </div>
              <div className="col-span-2">
                <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${countProportion.toString()}%`,
                    }}
                  />
                </div>
              </div>
              <div className="text-right text-sm text-gray-800 dark:text-gray-200">
                {count}
              </div>
            </div>
          );
        })}
      </div>

      {/* Clear Data Button */}
      {completedPuzzles.filter(p => !p.gaveUp).length > 0 && (
        <div className="text-center">
          <button
            type="button"
            onClick={() => {
              setShowClearConfirm(true);
            }}
            className="text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 transition-colors cursor-pointer hover:opacity-80"
          >
            Clear all statistics
          </button>

          {/* Clear Confirmation Modal */}
          <ConfirmModal
            isOpen={showClearConfirm}
            onClose={() => {
              setShowClearConfirm(false);
            }}
            onConfirm={clearCompletedPuzzles}
            title="Clear All Statistics"
            message="Are you sure you want to clear all your puzzle statistics? This action cannot be undone."
            confirmText="Clear All"
            cancelText="Cancel"
            variant="danger"
          />
        </div>
      )}

      {/* Empty State */}
      {completedPuzzles.filter(p => !p.gaveUp).length === 0 && (
        <div className="text-center py-8">
          <TrophyIcon className="size-16 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
          <h3 className="font-bold text-gray-600 dark:text-gray-400 mb-2">
            No puzzles completed yet
          </h3>
          <p className="text-gray-500 dark:text-gray-500 text-balance">
            Complete your first puzzle to see your statistics here!
          </p>
        </div>
      )}
    </div>
  );
}
