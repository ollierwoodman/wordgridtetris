import React, { useEffect, useState } from "react";
import {
  BookOpenIcon,
  FlagIcon,
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
import { ConfirmModal } from "./ui/ConfirmModal";
import { cn } from "@sglara/cn";

interface ButtonPanelProps {
  updateGameState: () => void;
  solvePuzzle: () => void;
  handleChangePuzzle: (mode: GameMode) => void;
  game: Game;
  onOpenModal: (header: string, content: React.ReactNode) => void;
  onCloseModal?: () => void;
  onGiveUp: () => void;
}

export const ButtonPanel: React.FC<ButtonPanelProps> = ({
  solvePuzzle,
  game,
  onOpenModal,
  updateGameState,
  onGiveUp,
}) => {
  
  const [hasSeenTutorial, setHasSeenTutorial] = useHasSeenTutorial();
  const [showGiveUpConfirm, setShowGiveUpConfirm] = useState(false);

  useEffect(() => {
    if (!hasSeenTutorial) {
      onOpenModal("Tutorial", <Tutorial game={game} />);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasSeenTutorial]);

  const trackGoal = useTrackMatomoGoalById();

  return (
    <div className={cn("grid grid-cols-5 justify-center items-center w-full max-w-[60vh] my-auto py-4 gap-4",
      import.meta.env.DEV && "grid-cols-6"
    )}>
      <BigRoundButton
        title="Open tutorial"
        onClick={() => {
          setHasSeenTutorial(true);
          trackGoal(GOAL_IDS.OPENED_TUTORIAL);
          onOpenModal("Tutorial", <Tutorial game={game} />);
        }}
        hasBadge={!hasSeenTutorial}
      >
        <BookOpenIcon className="size-6 md:size-8 xl:size-10" />
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
        <ShuffleIcon className="size-6 md:size-8 xl:size-10" />
      </BigRoundButton>
      <BigRoundButton
        title="Give up?"
        disabled={game.isPuzzleCompleted()}
        onClick={() => {
          setShowGiveUpConfirm(true);
        }}
      >
        <FlagIcon className="size-6 md:size-8 xl:size-10" />
      </BigRoundButton>
      <BigRoundButton
        title="Open settings"
        onClick={() => {
          trackGoal(GOAL_IDS.OPENED_SETTINGS);
          onOpenModal("Settings", <Settings />);
        }}
      >
        <SettingsIcon className="size-6 md:size-8 xl:size-10" />
      </BigRoundButton>
      <BigRoundButton
        title="Open menu"
        onClick={() => {
          trackGoal(GOAL_IDS.OPENED_ABOUT);
          onOpenModal("Menu", <Menu />);
        }}
      >
        <MenuIcon className="size-6 md:size-8 xl:size-10" />
      </BigRoundButton>
      {import.meta.env.DEV && (
        <BigRoundButton
          title="Solve puzzle"
          onClick={() => {
            solvePuzzle();
          }}
        >
          <Grid2X2CheckIcon className="size-6 md:size-8 xl:size-10" />
        </BigRoundButton>
      )}
      <ConfirmModal
        isOpen={showGiveUpConfirm}
        onClose={() => {
          setShowGiveUpConfirm(false);
        }}
        onConfirm={() => {
          onGiveUp();
        }}
        title="Give up?"
        message="This will mark today's puzzle as given up and reveal the solution."
        confirmText="Give Up"
        cancelText="Cancel"
        variant="warning"
      />
    </div>
  );
};
