import React from "react";
import {
  CheckCheckIcon,
  GraduationCapIcon,
  SettingsIcon,
} from "lucide-react";
import Tutorial from "./DialogContents/Tutorial";
import Settings from "./DialogContents/Settings";
import type { Game } from "../game/logic";
import { BigRoundButton } from "./ui/bigRoundButton";

interface MenuButtonPanelProps {
  updateGameState: () => void;
  solvePuzzle: () => void;
  game?: Game;
  isMuted: boolean;
  setIsMuted: (isMuted: boolean) => void;
  onOpenModal: (type: string, header: string, content: React.ReactNode) => void;
}

export const MenuButtonPanel: React.FC<MenuButtonPanelProps> = ({
  solvePuzzle,
  game,
  isMuted,
  setIsMuted,
  onOpenModal,
}) => {
  return (
    <>
      <BigRoundButton
        title="Show tutorial"
        onClick={() => {
          onOpenModal("tutorial", "Tutorial", <Tutorial game={game} />);
        }}
      >
        <GraduationCapIcon className="size-8 md:size-10 xl:size-12" />
      </BigRoundButton>
      <BigRoundButton
        title="Open settings"
        onClick={() => {
          onOpenModal("settings", "Settings", <Settings game={game} isMuted={isMuted} setIsMuted={setIsMuted} />);
        }}
      >
        <SettingsIcon className="size-8 md:size-10 xl:size-12" />
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

