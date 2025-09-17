import { useState, useEffect, useCallback } from 'react';
import { Game } from '../game/logic';
import { getLocalDateString } from '../utils/game';
import type { GameMode } from '../types/gameMode';
import { GAME_MODE_LIST } from '../types/gameMode';
import type { HintState } from '../types/game';

// Storage keys for the application
export const STORAGE_KEYS = {
  IS_MUTED: 'isMuted',
  THEME: 'theme',
  HAS_SEEN_TUTORIAL: 'hasSeenTutorial',
  COMPLETED_PUZZLES: 'completedPuzzlesVersion2',
  TRACKING_OPT_OUT: 'trackingOptOut',
} as const;

// Types for the data we store
export interface CompletedPuzzle {
  date: string; // ISO date string
  theme: string;
  hintState: HintState;
  completedAt: string; // ISO timestamp
  timeToCompleteMs: number; // in milliseconds
  seed: string; // puzzle seed
  mode: GameMode; // puzzle mode
  gaveUp: boolean; // whether the player gave up (default: false)
  numMoves: number; // number of moves to complete the puzzle
}

export interface LocalStorageData {
  [STORAGE_KEYS.IS_MUTED]: boolean;
  [STORAGE_KEYS.THEME]: 'light' | 'dark' | 'system';
  [STORAGE_KEYS.HAS_SEEN_TUTORIAL]: boolean;
  [STORAGE_KEYS.COMPLETED_PUZZLES]: CompletedPuzzle[];
  [STORAGE_KEYS.TRACKING_OPT_OUT]: boolean;
}

// Default values for each storage key
const DEFAULT_VALUES: LocalStorageData = {
  [STORAGE_KEYS.IS_MUTED]: false,
  [STORAGE_KEYS.THEME]: 'system',
  [STORAGE_KEYS.HAS_SEEN_TUTORIAL]: false,
  [STORAGE_KEYS.COMPLETED_PUZZLES]: [],
  [STORAGE_KEYS.TRACKING_OPT_OUT]: false,
};

// Helper function to safely get item from localStorage
function getStorageItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (item === null) {
      return defaultValue;
    }
    return JSON.parse(item) as T;
  } catch (error) {
    console.warn(`Failed to parse localStorage item "${key}":`, error);
    return defaultValue;
  }
}

// Helper function to safely set item in localStorage
function setStorageItem(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Failed to save to localStorage "${key}":`, error);
  }
}

// Generic hook for any storage key
export function useLocalStorage<T extends keyof LocalStorageData>(
  key: T,
  defaultValue?: LocalStorageData[T]
): [LocalStorageData[T], (value: LocalStorageData[T]) => void] {
  const defaultVal = defaultValue ?? DEFAULT_VALUES[key];
  
  const [storedValue, setStoredValue] = useState<LocalStorageData[T]>(() => 
    getStorageItem(key, defaultVal)
  );

  const setValue = useCallback((value: LocalStorageData[T]) => {
    try {
      setStoredValue(value);
      setStorageItem(key, value);
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key]);

  // Listen for changes from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          const newValue = JSON.parse(e.newValue) as LocalStorageData[T];
          setStoredValue(newValue);
        } catch (error) {
          console.warn(`Failed to parse storage change for "${key}":`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key]);

  return [storedValue, setValue];
}

// Specific hooks for each storage key
export function useIsMuted() {
  return useLocalStorage(STORAGE_KEYS.IS_MUTED);
}

export function useTheme() {
  return useLocalStorage(STORAGE_KEYS.THEME);
}

export function useHasSeenTutorial() {
  return useLocalStorage(STORAGE_KEYS.HAS_SEEN_TUTORIAL);
}

export function useCompletedPuzzles() {
  return useLocalStorage(STORAGE_KEYS.COMPLETED_PUZZLES);
}

export function useTrackingOptOut() {
  return useLocalStorage(STORAGE_KEYS.TRACKING_OPT_OUT);
}

// Utility functions for completed puzzles
export function addCompletedPuzzle(
  puzzles: CompletedPuzzle[],
  newPuzzle: CompletedPuzzle
): CompletedPuzzle[] {
  return [newPuzzle, ...puzzles];
}

export function getPuzzleCompletionByDate(
  puzzles: CompletedPuzzle[],
  date: string,
  includeGaveUp = false
): CompletedPuzzle | undefined {
  return puzzles.find(puzzle => puzzle.date === date && (includeGaveUp || !puzzle.gaveUp));
}

export function getPuzzleCompletionByDateAndMode(
  puzzles: CompletedPuzzle[],
  date: string,
  mode: GameMode,
  includeGaveUp = false
): CompletedPuzzle | undefined {
  return puzzles.find(puzzle => 
    puzzle.date === date && 
    puzzle.mode === mode &&
    (includeGaveUp || !puzzle.gaveUp)
  );
}

export function hasCompletedPuzzleToday(puzzles: CompletedPuzzle[], includeGaveUp = false): boolean {
  const today = getLocalDateString();
  return puzzles.some(puzzle => puzzle.date === today && (includeGaveUp || !puzzle.gaveUp));
}

export function hasCompletedPuzzleTodayWithMode(puzzles: CompletedPuzzle[], mode: GameMode, includeGaveUp = false): boolean {
  const today = getLocalDateString();
  return puzzles.some(puzzle => 
    puzzle.date === today && 
    puzzle.mode === mode && 
    (includeGaveUp || !puzzle.gaveUp)
  );
}

export function getCompletedPuzzlesByMode(
  puzzles: CompletedPuzzle[],
  mode: GameMode,
  includeGaveUp = false
): CompletedPuzzle[] {
  return puzzles.filter(puzzle => 
    puzzle.mode === mode && 
    (includeGaveUp || !puzzle.gaveUp)
  );
}

export function getPuzzleBySeed(
  puzzles: CompletedPuzzle[],
  seed: string,
  includeGaveUp = false
): CompletedPuzzle | undefined {
  return puzzles.find(puzzle => 
    puzzle.seed === seed && 
    (includeGaveUp || !puzzle.gaveUp)
  );
}

export function hasAttemptedPuzzleBySeed(
  puzzles: CompletedPuzzle[],
  seed: string
): boolean {
  return puzzles.some(puzzle => puzzle.seed === seed);
}

export function hasCompletedPuzzleBySeed(
  puzzles: CompletedPuzzle[],
  seed: string
): boolean {
  return puzzles.some(puzzle => puzzle.seed === seed && !puzzle.gaveUp);
}

// Hook for managing completed puzzles with utility functions
export function useCompletedPuzzlesManager() {
  const [completedPuzzles, setCompletedPuzzles] = useCompletedPuzzles();

  const addPuzzle = useCallback((game: Game) => {
    setCompletedPuzzles(addCompletedPuzzle(completedPuzzles, {
      date: getLocalDateString(),
      theme: game.getWordTheme(),
      hintState: game.getHintState(),
      timeToCompleteMs: game.getCompletionDurationMs() ?? -1,
      completedAt: new Date().toISOString(),
      seed: game.getSeed(),
      mode: game.getMode(),
      gaveUp: game.getGaveUp(),
      numMoves: game.getNumMoves(),
    }));
  }, [completedPuzzles, setCompletedPuzzles]);

  const getPuzzleByDate = useCallback((date: string, includeGaveUp = false) => {
    return getPuzzleCompletionByDate(completedPuzzles, date, includeGaveUp);
  }, [completedPuzzles]);

  const getPuzzleByDateAndMode = useCallback((date: string, mode: GameMode, includeGaveUp = false) => {
    return getPuzzleCompletionByDateAndMode(completedPuzzles, date, mode, includeGaveUp);
  }, [completedPuzzles]);

  const getTodaysPuzzles = useCallback((includeGaveUp = false) => {
    return GAME_MODE_LIST.map((mode) => getPuzzleCompletionByDateAndMode(completedPuzzles, getLocalDateString(), mode, includeGaveUp));
  }, [completedPuzzles]);

  const hasCompletedToday = useCallback((includeGaveUp = false) => {
    return hasCompletedPuzzleToday(completedPuzzles, includeGaveUp);
  }, [completedPuzzles]);

  const hasCompletedTodayWithMode = useCallback((mode: GameMode, includeGaveUp = false) => {
    return hasCompletedPuzzleTodayWithMode(completedPuzzles, mode, includeGaveUp);
  }, [completedPuzzles]);

  const getPuzzlesByMode = useCallback((mode: GameMode, includeGaveUp = false) => {
    return getCompletedPuzzlesByMode(completedPuzzles, mode, includeGaveUp);
  }, [completedPuzzles]);

  const getPuzzleBySeedCallback = useCallback((seed: string, includeGaveUp = false) => {
    return getPuzzleBySeed(completedPuzzles, seed, includeGaveUp);
  }, [completedPuzzles]);

  const hasAttemptedPuzzleBySeedCallback = useCallback((seed: string) => {
    return hasAttemptedPuzzleBySeed(completedPuzzles, seed);
  }, [completedPuzzles]);

  const hasCompletedPuzzleBySeedCallback = useCallback((seed: string) => {
    return hasCompletedPuzzleBySeed(completedPuzzles, seed);
  }, [completedPuzzles]);

  const clearCompletedPuzzles = useCallback(() => {
    setCompletedPuzzles([]);
  }, [setCompletedPuzzles]);

  return {
    completedPuzzles,
    addPuzzle,
    getPuzzleByDate,
    getPuzzleByDateAndMode,
    hasCompletedToday,
    hasCompletedTodayWithMode,
    getTodaysPuzzles,
    getPuzzlesByMode,
    getPuzzleBySeed: getPuzzleBySeedCallback,
    hasAttemptedPuzzleBySeed: hasAttemptedPuzzleBySeedCallback,
    hasCompletedPuzzleBySeed: hasCompletedPuzzleBySeedCallback,
    clearCompletedPuzzles,
  };
} 