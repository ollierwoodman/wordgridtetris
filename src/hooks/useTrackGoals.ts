import { useCallback } from 'react';

declare global {
  interface Window {
    _mtm: (string | number)[][];
  }
}

// Storage keys for the application
export const GOAL_IDS = {
  SHARED_RESULT: 3,
  COMPLETED_PUZZLE: 4,
} as const;

function trackGoal(goalID: number): void {
  window._mtm.push(['trackGoal', goalID]);
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