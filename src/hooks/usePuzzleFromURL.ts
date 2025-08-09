import { useState, useEffect, useCallback } from "react";
import { SOLUTION_SIZES } from "../game/logic";

const MAX_SOLUTION_SIZE = Math.max(...SOLUTION_SIZES);
const MIN_SOLUTION_SIZE = Math.min(...SOLUTION_SIZES);
const DEFAULT_SOLUTION_SIZE = 5; // Base path should go to 5x5

export function usePuzzleFromURL() {
  const [solutionSize, setSolutionSize] = useState<number>(DEFAULT_SOLUTION_SIZE);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [shouldShow404, setShouldShow404] = useState<boolean>(false);

  // Function to parse solution size from URL
  const parseSolutionSizeFromURL = useCallback(() => {
    const path = window.location.pathname;
    
    // Handle base path - redirect to 5x5
    if (path === '/') {
      window.history.replaceState({}, '', '/5x5');
      return DEFAULT_SOLUTION_SIZE;
    }
    
    const match = /^\/(\d+)x\d+$/.exec(path);
    
    if (match) {
      const size = parseInt(match[1]);
      // Validate that the size is within allowed range
      if (size >= MIN_SOLUTION_SIZE && size <= MAX_SOLUTION_SIZE && SOLUTION_SIZES.includes(size)) {
        return size;
      }
    }
    
    // Invalid path - should show 404
    setShouldShow404(true);
    return DEFAULT_SOLUTION_SIZE;
  }, []);

  // Initialize solution size from URL on mount
  useEffect(() => {
    const size = parseSolutionSizeFromURL();
    setSolutionSize(size);
    setIsInitialized(true);
  }, [parseSolutionSizeFromURL]);

  // Listen for browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      setShouldShow404(false); // Reset 404 state
      const size = parseSolutionSizeFromURL();
      setSolutionSize(size);
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [parseSolutionSizeFromURL]);

  // Update URL when solution size changes (only after initialization)
  useEffect(() => {
    if (!isInitialized || shouldShow404) return; // Skip during initialization or 404 state
    
    const currentPath = window.location.pathname;
    const newPath = `/${solutionSize.toString()}x${solutionSize.toString()}`;
    
    // Only update URL if it's different from current path
    if (currentPath !== newPath) {
      window.history.replaceState(
        {},
        "",
        newPath
      );
    }
  }, [solutionSize, isInitialized, shouldShow404]);

  // Function to manually change solution size (for level up/down)
  const changeSolutionSize = useCallback((newSize: number) => {
    if (newSize >= MIN_SOLUTION_SIZE && newSize <= MAX_SOLUTION_SIZE && SOLUTION_SIZES.includes(newSize)) {
      setShouldShow404(false); // Reset 404 state when manually changing size
      setSolutionSize(newSize);
    }
  }, []);

  return {
    solutionSize,
    isInitialized,
    changeSolutionSize,
    shouldShow404,
  };
} 