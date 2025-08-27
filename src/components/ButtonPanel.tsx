import React, { useEffect } from "react";
import {
  BookOpenIcon,
  Grid2X2CheckIcon,
  MenuIcon,
  SettingsIcon,
  ShuffleIcon,
} from "lucide-react";
import Tutorial from "./DialogContents/Tutorial";
import Settings from "./DialogContents/Settings";
import type { Game } from "../game/logic";
import { BigRoundButton } from "./ui/bigRoundButton";
import { useHasSeenTutorial } from "../hooks/useLocalStorage";
import { GOAL_IDS, useTrackMatomoGoalById } from "../hooks/useTrackGoals";
import Menu from "./DialogContents/Menu";
import type { GameMode } from "../types/gameMode";

interface ButtonPanelProps {
  updateGameState: () => void;
  solvePuzzle: () => void;
  handleChangePuzzle: (mode: GameMode) => void;
  game: Game;
  onOpenModal: (header: string, content: React.ReactNode) => void;
  onCloseModal?: () => void;
}

export const ButtonPanel: React.FC<ButtonPanelProps> = ({
  solvePuzzle,
  handleChangePuzzle,
  game,
  onOpenModal,
  updateGameState,
}) => {
  const [hasSeenTutorial, setHasSeenTutorial] = useHasSeenTutorial();

  useEffect(() => {
    if (!hasSeenTutorial) {
      onOpenModal("Tutorial", <Tutorial game={game} />);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasSeenTutorial]);

  const trackGoal = useTrackMatomoGoalById();

  return (
    <>
      <BigRoundButton
        title="Tutorial"
        onClick={() => {
          setHasSeenTutorial(true);
          trackGoal(GOAL_IDS.OPENED_TUTORIAL);
          onOpenModal("Tutorial", <Tutorial game={game} />);
        }}
        hasBadge={!hasSeenTutorial}
      >
        <BookOpenIcon className="size-8 md:size-10 xl:size-12" />
      </BigRoundButton>
      <BigRoundButton
        title="Shuffle pieces"
        disabled={game.isPuzzleCompleted()}
        onClick={() => {
          game.resetPieces();
          updateGameState();
          trackGoal(GOAL_IDS.SHUFFLED_PIECES);
        }}
      >
        <ShuffleIcon className="size-8 md:size-10 xl:size-12" />
      </BigRoundButton>
      <BigRoundButton
        title="Settings"
        onClick={() => {
          trackGoal(GOAL_IDS.OPENED_SETTINGS);
          onOpenModal("Settings", <Settings />);
        }}
      >
        <SettingsIcon className="size-8 md:size-10 xl:size-12" />
      </BigRoundButton>
      <BigRoundButton
        title="Open menu"
        onClick={() => {
          trackGoal(GOAL_IDS.OPENED_ABOUT);
          onOpenModal("Menu", <Menu handleChangePuzzle={handleChangePuzzle} />);
        }}
      >
        <MenuIcon className="size-8 md:size-10 xl:size-12" />
      </BigRoundButton>
      {import.meta.env.DEV && (
        <BigRoundButton
          title="Solve puzzle"
          onClick={() => {
            solvePuzzle();
          }}
        >
          <Grid2X2CheckIcon className="size-8 md:size-10 xl:size-12" />
        </BigRoundButton>
      )}
    </>
  );
};

