import { useState, useEffect, useCallback } from 'react';
import { SOLUTION_SIZES } from '../game/logic';
import { getLocalDateString } from '../utils/game';

// Storage keys for the application
export const STORAGE_KEYS = {
  IS_MUTED: 'isMuted',
  THEME: 'theme',
  HAS_SEEN_TUTORIAL: 'hasSeenTutorial',
  COMPLETED_PUZZLES: 'completedPuzzles',
  TRACKING_OPT_OUT: 'trackingOptOut',
} as const;

// Types for the data we store
export interface CompletedPuzzle {
  date: string; // ISO date string
  solutionSize: number;
  theme: string;
  isThemeRevealed: boolean;
  completedAt: string; // ISO timestamp
  timeToCompleteMs: number; // in milliseconds
  seed: string; // Puzzle seed
  gaveUp: boolean; // Whether the player gave up on the puzzle
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
  puzzle: Omit<CompletedPuzzle, 'completedAt'>
): CompletedPuzzle[] {
  const newPuzzle: CompletedPuzzle = {
    ...puzzle,
    completedAt: new Date().toISOString(),
  };
  
  // Add to the beginning of the array (most recent first)
  return [newPuzzle, ...puzzles];
}

export function getPuzzleCompletionByDate(
  puzzles: CompletedPuzzle[],
  date: string
): CompletedPuzzle | undefined {
  return puzzles.find(puzzle => puzzle.date === date && !puzzle.gaveUp);
}

export function getPuzzleCompletionByDateAndSize(
  puzzles: CompletedPuzzle[],
  date: string,
  solutionSize: number
): CompletedPuzzle | undefined {
  return puzzles.find(puzzle => puzzle.date === date && puzzle.solutionSize === solutionSize && !puzzle.gaveUp);
}

export function hasCompletedPuzzleToday(puzzles: CompletedPuzzle[]): boolean {
  const today = getLocalDateString();
  return puzzles.some(puzzle => puzzle.date === today && !puzzle.gaveUp);
}

export function hasCompletedPuzzleTodayWithSize(puzzles: CompletedPuzzle[], solutionSize: number): boolean {
  const today = getLocalDateString();
  return puzzles.some(puzzle => puzzle.date === today && puzzle.solutionSize === solutionSize && !puzzle.gaveUp);
}

export function getCompletedPuzzlesBySize(
  puzzles: CompletedPuzzle[],
  solutionSize: number
): CompletedPuzzle[] {
return puzzles.filter(puzzle => puzzle.solutionSize === solutionSize && !puzzle.gaveUp);
}

// Hook for managing completed puzzles with utility functions
export function useCompletedPuzzlesManager() {
  const [completedPuzzles, setCompletedPuzzles] = useCompletedPuzzles();

  const addPuzzle = useCallback((puzzle: Omit<CompletedPuzzle, 'completedAt'>) => {
    setCompletedPuzzles(addCompletedPuzzle(completedPuzzles, puzzle));
  }, [completedPuzzles, setCompletedPuzzles]);

  const getPuzzleByDate = useCallback((date: string) => {
    return getPuzzleCompletionByDate(completedPuzzles, date);
  }, [completedPuzzles]);

  const getPuzzleByDateAndSize = useCallback((date: string, solutionSize: number) => {
    return getPuzzleCompletionByDateAndSize(completedPuzzles, date, solutionSize);
  }, [completedPuzzles]);

  const getTodaysPuzzles = useCallback(() => {
    return SOLUTION_SIZES.map((size) => getPuzzleCompletionByDateAndSize(completedPuzzles, getLocalDateString(), size));
  }, [completedPuzzles]);

  const hasCompletedToday = useCallback(() => {
    return hasCompletedPuzzleToday(completedPuzzles);
  }, [completedPuzzles]);

  const hasCompletedTodayWithSize = useCallback((solutionSize: number) => {
    return hasCompletedPuzzleTodayWithSize(completedPuzzles, solutionSize);
  }, [completedPuzzles]);

  const getPuzzlesBySize = useCallback((solutionSize: number) => {
    return getCompletedPuzzlesBySize(completedPuzzles, solutionSize);
  }, [completedPuzzles]);

  const clearCompletedPuzzles = useCallback(() => {
    setCompletedPuzzles([]);
  }, [setCompletedPuzzles]);

  return {
    completedPuzzles,
    addPuzzle,
    getPuzzleByDate,
    getPuzzleByDateAndSize,
    hasCompletedToday,
    hasCompletedTodayWithSize,
    getTodaysPuzzles,
    getPuzzlesBySize,
    clearCompletedPuzzles,
  };
} 