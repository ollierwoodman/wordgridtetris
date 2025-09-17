import useSound from "use-sound";
import { createContext, useContext } from "react";
import { createUrl } from "../utils/game";

// Sound file paths
const SOUND_PATHS = {
  MENU_CLICK: createUrl("sounds/menu_click.ogg"),
  DRAG_CLICK: createUrl("sounds/drag_blong.ogg"),
  DROP_SUCCESS: createUrl("sounds/drop_success.ogg"),
  DROP_FAIL: createUrl("sounds/drop_fail.ogg"),
  THEME_REVEAL: createUrl("sounds/hint_reveal.ogg"),
  LEVEL_COMPLETE: createUrl("sounds/level_complete.ogg"),
  LEVEL_UP: createUrl("sounds/level_up.ogg"),
} as const;

// Sound configuration options
const SOUND_OPTIONS = {
  volume: 0.5,
  interrupt: false,
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

  const [playMenuClick] = useSound(SOUND_PATHS.MENU_CLICK, {
    ...SOUND_OPTIONS,
    soundEnabled: !isMuted,
  });

  const [playDragClick] = useSound(SOUND_PATHS.DRAG_CLICK, {
    ...SOUND_OPTIONS,
    volume: SOUND_OPTIONS.volume * 0.5,
    playbackRate: 2,
    soundEnabled: !isMuted,
  });

  const [playDropSuccess] = useSound(SOUND_PATHS.DROP_SUCCESS, {
    ...SOUND_OPTIONS,
    soundEnabled: !isMuted,
  });

  const [playDropFail] = useSound(SOUND_PATHS.DROP_FAIL, {
    ...SOUND_OPTIONS,
    soundEnabled: !isMuted,
  });

  const [playHintReveal] = useSound(SOUND_PATHS.THEME_REVEAL, {
    ...SOUND_OPTIONS,
    soundEnabled: !isMuted,
  });

  const [playPuzzleComplete] = useSound(SOUND_PATHS.LEVEL_COMPLETE, {
    ...SOUND_OPTIONS,
    soundEnabled: !isMuted,
  });

  const [playLevelUp] = useSound(SOUND_PATHS.LEVEL_UP, {
    ...SOUND_OPTIONS,
    soundEnabled: !isMuted,
  });

  return {
    playMenuClick,
    playDragClick,
    playDropSuccess,
    playDropFail,
    playHintReveal,
    playPuzzleComplete,
    playLevelUp,
  };
}

// Export sound paths for reference
export { SOUND_PATHS, SoundContext };
