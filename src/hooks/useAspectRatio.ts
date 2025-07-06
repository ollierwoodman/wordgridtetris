import { useCallback, useEffect, useState } from "react";

/**
 * useAspectRatio
 *
 * Returns the aspect ratio (width / height) of the viewport.
 * Updates on window resize and is SSR safe.
 */
export function useAspectRatio(): {
  aspectRatio: number;
  isSquare: (aspectRatio: number) => boolean;
  isLandscape: (aspectRatio: number) => boolean;
  isPortrait: (aspectRatio: number) => boolean;
} {
  const getAspectRatio = () => {
    if (typeof window === "undefined") return 1; // Default aspect ratio
    return window.innerWidth / window.innerHeight;
  };

  const [aspectRatio, setAspectRatio] = useState(getAspectRatio);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleResize = () => setAspectRatio(getAspectRatio());
    window.addEventListener("resize", handleResize);
    setAspectRatio(getAspectRatio());
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isSquare = useCallback((aspectRatio: number): boolean => {
    return aspectRatio >= 0.75 && aspectRatio <= 1.5;
  }, []);

  const isLandscape = useCallback((aspectRatio: number): boolean => {
    return aspectRatio > 1.5;
  }, []);

  const isPortrait = useCallback((aspectRatio: number): boolean => {
    return aspectRatio < 0.75;
  }, []);

  return { aspectRatio, isSquare, isLandscape, isPortrait };
}
