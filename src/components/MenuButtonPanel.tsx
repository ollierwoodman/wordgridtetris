import React from "react";
import {
  BarChart2Icon,
  GraduationCapIcon,
  Grid2X2CheckIcon,
  InfoIcon,
  SettingsIcon,
  ShuffleIcon,
} from "lucide-react";
import Tutorial from "./DialogContents/Tutorial";
import Settings from "./DialogContents/Settings";
import type { Game } from "../game/logic";
import { BigRoundButton } from "./ui/bigRoundButton";
import { About } from "./DialogContents/About";
import { Stats } from "./DialogContents/Stats";
import { useHasSeenTutorial } from "../hooks/useLocalStorage";
import { GOAL_IDS, useTrackMatomoGoalById } from "../hooks/useTrackGoals";

interface MenuButtonPanelProps {
  updateGameState: () => void;
  solvePuzzle: () => void;
  game: Game;
  onOpenModal: (header: string, content: React.ReactNode) => void;
  onCloseModal?: () => void;
  handleChangePuzzle: (size: number) => void;
}

export const MenuButtonPanel: React.FC<MenuButtonPanelProps> = ({
  solvePuzzle,
  game,
  onOpenModal,
  updateGameState,
  handleChangePuzzle,
}) => {
  const [hasSeenTutorial, setHasSeenTutorial] = useHasSeenTutorial();

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
        <GraduationCapIcon className="size-8 md:size-10 xl:size-12" />
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
          onOpenModal("Settings", <Settings handleChangePuzzle={handleChangePuzzle} />);
        }}
      >
        <SettingsIcon className="size-8 md:size-10 xl:size-12" />
      </BigRoundButton>
      <BigRoundButton
        title="My stats"
        onClick={() => {
          trackGoal(GOAL_IDS.OPENED_STATS);
          onOpenModal("My stats", <Stats />);
        }}
      >
        <BarChart2Icon className="size-8 md:size-10 xl:size-12" />
      </BigRoundButton>
      <BigRoundButton
        title="About Blockle"
        onClick={() => {
          trackGoal(GOAL_IDS.OPENED_ABOUT);
          onOpenModal("About Blockle", <About />);
        }}
      >
        <InfoIcon className="size-8 md:size-10 xl:size-12" />
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

