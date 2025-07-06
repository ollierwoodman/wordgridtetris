import useSound from "use-sound";
import { createContext, useContext } from "react";

// Sound file paths
const SOUND_PATHS = {
  BUTTON_CLICK: "/sounds/button_click.ogg",
  DRAG_CLICK: "/sounds/drag_tick.ogg",
  DRAG_SUCCESS: "/sounds/drag_success.ogg",
  DRAG_FAIL: "/sounds/drag_fail.ogg",
  HINT_REVEAL: "/sounds/hint_reveal.ogg",
  PUZZLE_COMPLETE: "/sounds/puzzle_complete.ogg",
} as const;

// Sound configuration options
const SOUND_OPTIONS = {
  volume: 0.5,
  interrupt: true,
} as const;

// Sound context type
interface SoundContextType {
  isMuted: boolean;
  setIsMuted: (isMuted: boolean) => void;
}

// Create the sound context
const SoundContext = createContext<SoundContextType | undefined>(undefined);

// Hook to use the sound context
export function useSoundContext() {
  const context = useContext(SoundContext);
  if (context === undefined) {
    throw new Error("useSoundContext must be used within a SoundProvider");
  }
  return context;
}

/**
 * Custom hook that provides all sound functions for the game
 * Uses the global sound context for mute state
 * @returns Object containing all sound play functions
 */
export function useGameSounds() {
  const { isMuted } = useSoundContext();

  const [playButtonClick] = useSound(SOUND_PATHS.BUTTON_CLICK, {
    ...SOUND_OPTIONS,
    soundEnabled: !isMuted,
  });

  const [playDragClick] = useSound(SOUND_PATHS.DRAG_CLICK, {
    ...SOUND_OPTIONS,
    soundEnabled: !isMuted,
  });

  const [playDragSuccess] = useSound(SOUND_PATHS.DRAG_SUCCESS, {
    ...SOUND_OPTIONS,
    soundEnabled: !isMuted,
  });

  const [playDragFail] = useSound(SOUND_PATHS.DRAG_FAIL, {
    ...SOUND_OPTIONS,
    soundEnabled: !isMuted,
  });

  const [playHintReveal] = useSound(SOUND_PATHS.HINT_REVEAL, {
    ...SOUND_OPTIONS,
    soundEnabled: !isMuted,
  });

  const [playPuzzleComplete] = useSound(SOUND_PATHS.PUZZLE_COMPLETE, {
    ...SOUND_OPTIONS,
    soundEnabled: !isMuted,
  });

  return {
    playButtonClick,
    playDragClick,
    playDragSuccess,
    playDragFail,
    playHintReveal,
    playPuzzleComplete,
  };
}

// Export sound paths for reference
export { SOUND_PATHS, SoundContext };
