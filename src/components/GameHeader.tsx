import { BigRoundButton } from "./ui/bigRoundButton";
import { useGameSounds } from "../hooks/useSounds";
import { GOAL_IDS, useTrackMatomoGoalById } from "../hooks/useTrackGoals";
import { GAME_MODES, type GameMode } from "../types/gameMode";
import { Grid2X2PlusIcon, LightbulbIcon, ShareIcon } from "lucide-react";
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
    <div className="flex flex-col lg:flex-row items-center w-full max-w-[60vh] my-auto pt-4 gap-4">
      <button
        title="About this game"
        className="flex flex-col text-center cursor-pointer hover:opacity-80 transition-opacity"
        onClick={handleAboutClick}
      >
        <h1 className="text-gray-600 dark:text-white text-5xl lg:text-7xl font-bold select-none">
          Blockle
        </h1>
        <p className="text-gray-600 dark:text-white text-sm md:text-base font-bold font-mono select-none">
          {GAME_MODES[game.getMode()].displayName} #{game.getSeed()}
        </p>
      </button>
      <div className="lg:flex-1 flex flex-wrap justify-center lg:justify-end gap-4 w-full">
        <BigRoundButton
          title="Open puzzle select menu"
          onClick={() => {
            onOpenModal(
              "Puzzle select",
              <PuzzleSelect handleChangePuzzle={handleChangePuzzle} />
            );
          }}
          className="font-bold py-2 px-4 aspect-auto"
        >
          <span className="mr-2 pl-1">Puzzle&nbsp;select</span>
          <Grid2X2PlusIcon className="size-4 md:size-6" />
        </BigRoundButton>
        <BigRoundButton
          title="Open share"
          className="font-bold py-2 px-4 aspect-auto"
          onClick={handleShareClick}
          hasBadge={
            game.getGameEndTime() !== null && !shareButtonHasBeenClicked
          }
        >
          <span className="mr-2 pl-1">Share</span>
          <ShareIcon className="size-4 md:size-6" />
        </BigRoundButton>
        
      {/* Hints */}
      <BigRoundButton
        title="Open hints"
        onClick={handleHintsClick}
        className="font-bold py-2 px-4 aspect-auto"
      >
        <span className="mr-2 pl-1">
          Hints ({game.getNumHintsUsed()}/{game.getNumHintsAvailable()})
        </span>
        <LightbulbIcon className="size-4 md:size-6" />
      </BigRoundButton>
      </div>
    </div>
  );
};
