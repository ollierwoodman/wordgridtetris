import { useState, useEffect, useCallback } from "react";
import { type GameMode, getGameModeFromPath, getGameModeConfig, GAME_MODE_LIST } from "../types/gameMode";

const DEFAULT_GAME_MODE: GameMode = '5x5';

export function usePuzzleFromURL() {
  const [gameMode, setGameMode] = useState<GameMode>(DEFAULT_GAME_MODE);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [shouldShow404, setShouldShow404] = useState<boolean>(false);

  // Function to parse game mode from URL
  const parseGameModeFromURL = useCallback(() => {
    const path = window.location.pathname;
    
    const mode = getGameModeFromPath(path);
    
    if (mode) {
      // Handle base path - redirect to 5x5
      if (path === '/') {
        window.history.replaceState({}, '', '/5x5');
      }
      return mode;
    }
    
    // Invalid path - should show 404
    setShouldShow404(true);
    return DEFAULT_GAME_MODE;
  }, []);

  // Initialize game mode from URL on mount
  useEffect(() => {
    const mode = parseGameModeFromURL();
    setGameMode(mode);
    setIsInitialized(true);
  }, [parseGameModeFromURL]);

  // Listen for browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      setShouldShow404(false); // Reset 404 state
      const mode = parseGameModeFromURL();
      setGameMode(mode);
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [parseGameModeFromURL]);

  // Update URL when game mode changes (only after initialization)
  useEffect(() => {
    if (!isInitialized || shouldShow404) return; // Skip during initialization or 404 state
    
    const currentPath = window.location.pathname;
    const config = getGameModeConfig(gameMode);
    const newPath = config.urlPath;
    
    // Only update URL if it's different from current path
    if (currentPath !== newPath) {
      window.history.replaceState(
        {},
        "",
        newPath
      );
    }
  }, [gameMode, isInitialized, shouldShow404]);

  // Function to manually change game mode
  const changeGameMode = useCallback((newMode: GameMode) => {
    if (GAME_MODE_LIST.includes(newMode)) {
      setShouldShow404(false); // Reset 404 state when manually changing mode
      setGameMode(newMode);
    }
  }, []);

  return {
    gameMode,
    isInitialized,
    changeGameMode,
    shouldShow404,
  };
} 