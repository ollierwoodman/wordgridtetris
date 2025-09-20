import React from "react";
import { GOAL_IDS, useTrackMatomoGoalById } from "../../hooks/useTrackGoals";
import { useGameSounds } from "../../hooks/useSounds";
import {
  getGameModeConfig,
  type GameMode,
} from "../../types/gameMode";

interface PuzzleSelectProps {
  handleChangePuzzle: (mode: GameMode) => void;
}

export const PuzzleSelect: React.FC<PuzzleSelectProps> = ({ handleChangePuzzle }) => {
  const { playMenuClick } = useGameSounds();
  const trackGoal = useTrackMatomoGoalById();

  const onChangePuzzle = (mode: GameMode) => {
    playMenuClick();
    trackGoal(GOAL_IDS.OPENED_LEVEL_SELECT);
    handleChangePuzzle(mode);
  };

  return (
    <>
      <PuzzleSelectCategory title="English puzzles" modes={["5x5", "6x6", "7x7"]} onChangePuzzle={onChangePuzzle} />
      <PuzzleSelectCategory title="中文 puzzles" modes={["chengyu"]} onChangePuzzle={onChangePuzzle} />
      <PuzzleSelectCategory title="Deutsch puzzles" modes={["ger-5x5", "ger-6x6", "ger-7x7"]} onChangePuzzle={onChangePuzzle} />
      <PuzzleSelectCategory title="Español puzzles" modes={["spa-5x5", "spa-6x6", "spa-7x7"]} onChangePuzzle={onChangePuzzle} />
      <PuzzleSelectCategory title="Français puzzles" modes={["fra-5x5", "fra-6x6", "fra-7x7"]} onChangePuzzle={onChangePuzzle} />
      <PuzzleSelectCategory title="Русские puzzles" modes={["rus-5x5", "rus-6x6", "rus-7x7"]} onChangePuzzle={onChangePuzzle} />
      <PuzzleSelectCategory title="Tiếng Việt puzzles" modes={["vie-5x5"]} onChangePuzzle={onChangePuzzle} />
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