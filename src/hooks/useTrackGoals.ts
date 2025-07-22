import { useCallback } from "react";
import type { MatomoFunction } from "./useTrackingOptOut";

declare global {
  interface Window {
    _paq: (string | number | MatomoFunction)[][] | undefined;
  }
}

export const GOAL_IDS = {
  // PLAY_TIME: 1 // managed in Matomo
  // BUY_ME_A_COFFEE_CLICKS: 2 // managed in Matomo
  // JOINED_DISCORD: 15 // managed in Matomo
  CLICKED_SHARE_BUTTON: 3,
  COMPLETED_PUZZLE_5X5: 4,
  COMPLETED_PUZZLE_6X6: 5,
  COMPLETED_PUZZLE_7X7: 6,
  CLICKED_COPY_BUTTON: 7,
  OPENED_TUTORIAL: 8,
  OPENED_STATS: 9,
  OPENED_SETTINGS: 10,
  OPENED_ABOUT: 11,
  OPENED_SUCCESS: 12,
  SHUFFLED_PIECES: 13,
  REVEALED_THEME: 14,
} as const;

function trackGoal(goalId: typeof GOAL_IDS[keyof typeof GOAL_IDS]): void {
  console.log("Tracking goal:", goalId);
  window._paq = window._paq ?? [];
  window._paq.push(["trackGoal", goalId]);
}

export const useTrackMatomoGoalById = (): ((goalId: typeof GOAL_IDS[keyof typeof GOAL_IDS]) => void) => {
  return useCallback((goalId: typeof GOAL_IDS[keyof typeof GOAL_IDS]) => {
    trackGoal(goalId);
  }, []);
};

export const useTrackCompletedPuzzle = (): ((solutionSize: number) => void) => {
  return useCallback((solutionSize: number) => {
    switch (solutionSize) {
      case 5:
        trackGoal(GOAL_IDS.COMPLETED_PUZZLE_5X5);
        break;
      case 6:
        trackGoal(GOAL_IDS.COMPLETED_PUZZLE_6X6);
        break;
      case 7:
        trackGoal(GOAL_IDS.COMPLETED_PUZZLE_7X7);
        break;
      default:
        throw new Error(`Invalid solution size: ${solutionSize.toString()}`);
    }
  }, []);
};
