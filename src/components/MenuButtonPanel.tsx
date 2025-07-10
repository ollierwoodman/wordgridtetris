import React from "react";
import {
  CheckCheckIcon,
  GraduationCapIcon,
  InfoIcon,
  SettingsIcon,
  ShuffleIcon,
} from "lucide-react";
import Tutorial from "./DialogContents/Tutorial";
import Settings from "./DialogContents/Settings";
import type { Game } from "../game/logic";
import { BigRoundButton } from "./ui/bigRoundButton";
import { About } from "./DialogContents/About";

interface MenuButtonPanelProps {
  updateGameState: () => void;
  solvePuzzle: () => void;
  game?: Game;
  onOpenModal: (type: string, header: string, content: React.ReactNode) => void;
  onCloseModal?: () => void;
}

export const MenuButtonPanel: React.FC<MenuButtonPanelProps> = ({
  solvePuzzle,
  game,
  onOpenModal,
  updateGameState,
  onCloseModal,
}) => {
  return (
    <>
      <BigRoundButton
        title="Show tutorial"
        onClick={() => {
          onOpenModal("tutorial", "Tutorial", <Tutorial game={game} onClose={onCloseModal} />);
        }}
      >
        <GraduationCapIcon className="size-8 md:size-10 xl:size-12" />
      </BigRoundButton>
      <BigRoundButton
        title="Open settings"
        onClick={() => {
          onOpenModal("settings", "Settings", <Settings game={game} />);
        }}
      >
        <SettingsIcon className="size-8 md:size-10 xl:size-12" />
      </BigRoundButton>
      <BigRoundButton
        title="Shuffle pieces"
        disabled={game?.isPuzzleCompleted()}
        onClick={() => {
          game?.resetPieces();
          updateGameState();
        }}
      >
        <ShuffleIcon className="size-8 md:size-10 xl:size-12" />
      </BigRoundButton>
      <BigRoundButton
        title="Open about"
        onClick={() => {
          onOpenModal("about", "About Blockle", <About />);
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
          <CheckCheckIcon className="size-8 md:size-10 xl:size-12" />
        </BigRoundButton>
      )}
    </>
  );
};

