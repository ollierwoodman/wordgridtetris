import { useState, useEffect, useCallback } from "react";
import { SOLUTION_SIZES } from "../game/logic";

const MAX_SOLUTION_SIZE = Math.max(...SOLUTION_SIZES);
const MIN_SOLUTION_SIZE = Math.min(...SOLUTION_SIZES);

export function useSolutionSizeFromURL() {
  const [solutionSize, setSolutionSize] = useState<number>(MIN_SOLUTION_SIZE);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Function to parse solution size from URL
  const parseSolutionSizeFromURL = useCallback(() => {
    const path = window.location.pathname;
    const match = path.match(/^\/(\d+)x\d+$/);
    
    if (match) {
      const size = parseInt(match[1]);
      // Validate that the size is within allowed range
      if (size >= MIN_SOLUTION_SIZE && size <= MAX_SOLUTION_SIZE) {
        return size;
      }
    }
    
    // If no valid URL pattern or invalid size, redirect to default
    if (path !== `/${MIN_SOLUTION_SIZE}x${MIN_SOLUTION_SIZE}`) {
      window.history.replaceState({}, '', `/${MIN_SOLUTION_SIZE}x${MIN_SOLUTION_SIZE}`);
    }
    
    return MIN_SOLUTION_SIZE; // Default fallback
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
      const size = parseSolutionSizeFromURL();
      setSolutionSize(size);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [parseSolutionSizeFromURL]);

  // Update URL when solution size changes (only after initialization)
  useEffect(() => {
    if (!isInitialized) return; // Skip during initialization
    
    const currentPath = window.location.pathname;
    const newPath = `/${solutionSize}x${solutionSize}`;
    
    // Only update URL if it's different from current path
    if (currentPath !== newPath) {
      window.history.replaceState(
        {},
        "",
        newPath
      );
    }
  }, [solutionSize, isInitialized]);

  // Function to manually change solution size (for level up/down)
  const changeSolutionSize = useCallback((newSize: number) => {
    if (newSize >= MIN_SOLUTION_SIZE && newSize <= MAX_SOLUTION_SIZE) {
      setSolutionSize(newSize);
    }
  }, []);

  return {
    solutionSize,
    isInitialized,
    changeSolutionSize,
    canLevelUp: solutionSize < MAX_SOLUTION_SIZE,
    canLevelDown: solutionSize > MIN_SOLUTION_SIZE,
  };
} 