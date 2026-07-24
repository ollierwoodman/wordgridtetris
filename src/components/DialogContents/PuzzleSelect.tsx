import React from "react";
import { ANALYTICS_EVENTS, useTrackEvent } from "../../hooks/useTrackEvents";
import { useGameSounds } from "../../hooks/useSounds";
import {
  getGameModeConfig,
  isGameModeEnabled,
  type GameMode,
} from "../../types/gameMode";

// Categories are listed in full; disabled modes are filtered out below, so
// re-enabling a mode in GAME_MODES brings its category back with no edit here.
const PUZZLE_CATEGORIES: { title: string; modes: GameMode[] }[] = [
  { title: "English puzzles", modes: ["5x5", "6x6", "7x7"] },
  { title: "中文 puzzles", modes: ["chengyu"] },
  { title: "Deutsch puzzles", modes: ["ger-5x5", "ger-6x6", "ger-7x7"] },
  { title: "Español puzzles", modes: ["spa-5x5", "spa-6x6", "spa-7x7"] },
  { title: "Français puzzles", modes: ["fra-5x5", "fra-6x6", "fra-7x7"] },
  { title: "Русские puzzles", modes: ["rus-5x5", "rus-6x6", "rus-7x7"] },
  { title: "Tiếng Việt puzzles", modes: ["vie-5x5"] },
];

interface PuzzleSelectProps {
  handleChangePuzzle: (mode: GameMode) => void;
}

export const PuzzleSelect: React.FC<PuzzleSelectProps> = ({ handleChangePuzzle }) => {
  const { playMenuClick } = useGameSounds();
  const trackEvent = useTrackEvent();

  const onChangePuzzle = (mode: GameMode) => {
    playMenuClick();
    trackEvent(ANALYTICS_EVENTS.SELECTED_PUZZLE, { mode });
    handleChangePuzzle(mode);
  };

  return (
    <>
      {PUZZLE_CATEGORIES.map(({ title, modes }) => {
        const enabledModes = modes.filter(isGameModeEnabled);
        if (enabledModes.length === 0) return null;
        return (
          <PuzzleSelectCategory
            key={title}
            title={title}
            modes={enabledModes}
            onChangePuzzle={onChangePuzzle}
          />
        );
      })}
    </>
  );
};

interface PuzzleSelectCategoryProps {
  title: string;
  modes: GameMode[];
  onChangePuzzle: (mode: GameMode) => void;
}

const PuzzleSelectCategory: React.FC<PuzzleSelectCategoryProps> = ({ title, modes, onChangePuzzle }) => {
  return (
    <div className="flex flex-col items-center gap-4">
        <div className="flex items-center dark:text-gray-200 w-full gap-4">
          <div className="flex flex-col">
            <h3 className="text-lg font-bold">{title}</h3>
          </div>
        </div>
        <div className="grid gap-2 w-full grid-cols-2 md:grid-cols-3">
          {modes.map((mode: GameMode) => {
            const config = getGameModeConfig(mode);
            return (
              <button
                type="button"
                onClick={() => {
                  onChangePuzzle(mode);
                }}
                key={mode}
                title={`Switch to ${config.description}`}
                className="cursor-pointer rounded-full w-full text-center bg-gray-200 text-gray-800 hover:opacity-80 px-4 py-2 text-sm"
              >
                {config.displayName}
              </button>
            );
          })}
        </div>
      </div>
  );
};