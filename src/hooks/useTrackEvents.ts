import { useCallback } from "react";
import type { GameMode } from "../types/gameMode";

declare global {
  interface Window {
    umami?: {
      track: (eventName: string, eventData?: Record<string, unknown>) => void;
    };
  }
}

export const ANALYTICS_EVENTS = {
  OPENED_DIALOG: "opened-dialog",
  SELECTED_PUZZLE: "selected-puzzle",
  COMPLETED_PUZZLE: "completed-puzzle",
  SHARED_RESULTS: "shared-results",
  SHUFFLED_PIECES: "shuffled-pieces",
  REVEALED_HINT: "revealed-hint",
} as const;

export type AnalyticsEvent =
  typeof ANALYTICS_EVENTS[keyof typeof ANALYTICS_EVENTS];

// window.umami is absent if the script is blocked or still loading
function trackEvent(name: AnalyticsEvent, data?: Record<string, unknown>): void {
  window.umami?.track(name, data);
}

export const useTrackEvent = (): typeof trackEvent => {
  return useCallback(trackEvent, []);
};

export const useTrackCompletedPuzzle = (): ((mode: GameMode) => void) => {
  return useCallback((mode: GameMode) => {
    trackEvent(ANALYTICS_EVENTS.COMPLETED_PUZZLE, { mode });
  }, []);
};
