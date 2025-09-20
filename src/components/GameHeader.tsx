import { BigRoundButton } from "./ui/bigRoundButton";
import { useGameSounds } from "../hooks/useSounds";
import { GOAL_IDS, useTrackMatomoGoalById } from "../hooks/useTrackGoals";
import { GAME_MODES, type GameMode } from "../types/gameMode";
import { LightbulbIcon, ShareIcon } from "lucide-react";
import type { Game } from "../game/logic";
import { About } from "./DialogContents/About";
import { useState } from "react";
import { Share } from "./DialogContents/Share";
import { PuzzleSelect } from "./DialogContents/PuzzleSelect";
import { Hints } from "./Hints";

interface GameHeaderProps {
  game: Game;
  onOpenModal: (header: string, content: React.ReactNode) => void;
  handleChangePuzzle: (newMode?: GameMode) => void;
}

export const GameHeader = ({
  game,
  onOpenModal,
  handleChangePuzzle,
}: GameHeaderProps) => {
  const { playMenuClick } = useGameSounds();
  const trackGoal = useTrackMatomoGoalById();

  const [shareButtonHasBeenClicked, setShareButtonHasBeenClicked] =
    useState(false);

  const handleShareClick = () => {
    trackGoal(GOAL_IDS.OPENED_SUCCESS);
    setShareButtonHasBeenClicked(true);
    onOpenModal("Share", <Share handleChangePuzzle={handleChangePuzzle} />);
  };

  const handleAboutClick = () => {
    playMenuClick();
    trackGoal(GOAL_IDS.OPENED_ABOUT);
    onOpenModal("About Blockle", <About />);
  };

  const handleHintsClick = () => {
    playMenuClick();
    // trackGoal(GOAL_IDS.OPENED_HINTS);
    onOpenModal("Hints", <Hints game={game} />);
  };

  return (
    <div className="flex flex-col xl:flex-row items-center w-full max-w-[60vh] my-auto pt-4 gap-8">
      <button
        title="About this game"
        className="flex flex-col text-center cursor-pointer hover:opacity-80 transition-opacity"
        onClick={handleAboutClick}
      >
        <h1 className="text-gray-600 dark:text-white text-4xl xl:text-6xl font-bold select-none">
          Blockle
        </h1>
        <p className="text-gray-600 dark:text-white text-base xl:text-lg font-bold font-mono select-none">
          {GAME_MODES[game.getMode()].displayName} #{game.getSeed()}
        </p>
      </button>
      <div className="xl:flex-1 flex flex-row justify-center xl:justify-end gap-4 w-full">
        <BigRoundButton
          title="Open puzzle select menu"
          onClick={() => {
            onOpenModal(
              "Puzzle select",
              <PuzzleSelect handleChangePuzzle={handleChangePuzzle} />
            );
          }}
          className="font-bold aspect-auto"
        >
          <span className="text-base md:text-xl px-4 uppercase">Puzzle Select</span>
        </BigRoundButton>
        <BigRoundButton
          title="Open share"
          className="font-bold aspect-auto"
          onClick={handleShareClick}
          hasBadge={
            game.getGameEndTime() !== null && !shareButtonHasBeenClicked
          }
        >
          <ShareIcon className="size-6 md:size-8 xl:size-10" />
        </BigRoundButton>
        <BigRoundButton
          title="Open hints"
          onClick={handleHintsClick}
        >
          <LightbulbIcon className="size-6 md:size-8 xl:size-10" />
        </BigRoundButton>
      </div>
    </div>
  );
};
