import { useCallback } from 'react';

// Storage keys for the application
export const GOAL_IDS = {
  SHARED_RESULT: 3,
  COMPLETED_PUZZLE: 4,
} as const;

function trackGoal(goalID: number): void {
  // @ts-expect-error - Matomo is not typed
  _mtm.push({ event: "trackGoal", goalID: goalID });
}

// Specific hooks for each storage key
export function useTrackSharedResult() {
  return useCallback(() => {
    trackGoal(GOAL_IDS.SHARED_RESULT);
  }, []);
}

export function useTrackCompletedPuzzle() {
  return useCallback(() => {
    trackGoal(GOAL_IDS.COMPLETED_PUZZLE);
  }, []);
}