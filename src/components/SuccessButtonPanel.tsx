import React from "react";
import { ArrowUpCircleIcon, TrophyIcon } from "lucide-react";
import type { Game } from "../game/logic";
import { BigRoundButton } from "./ui/bigRoundButton";
import { Success } from "./DialogContents/Success";
import { MAX_SOLUTION_SIZE } from "../App";
import { useGameSounds } from "../hooks/sounds";

interface SuccessButtonPanelProps {
  game: Game;
  onOpenModal: (type: string, header: string, content: React.ReactNode) => void;
  handleLevelUp: () => void;
}

export const SuccessButtonPanel: React.FC<SuccessButtonPanelProps> = ({
  game,
  onOpenModal,
  handleLevelUp,
}) => {
  const { playLevelUp } = useGameSounds();

  return (
    <>
      <BigRoundButton
        title="Open success dialog"
        className="bg-yellow-600 dark:bg-yellow-800"
        onClick={() => {
          onOpenModal("success", "Success", <Success game={game} />);
        }}
      >
        <TrophyIcon className="size-8 md:size-10 xl:size-12" />
      </BigRoundButton>
      {game.getSolutionSize() < MAX_SOLUTION_SIZE && (
        <BigRoundButton
          title="Begin a new, more difficult puzzle"
          className="bg-red-600 dark:bg-red-800 gap-4 pl-6"
          onClick={() => {
            handleLevelUp();
          }}
          playSound={playLevelUp}
        >
          <span className="text-xl font-bold uppercase md:">Level&nbsp;up</span>
          <ArrowUpCircleIcon className="size-8 md:size-10 xl:size-12" />
        </BigRoundButton>
      )}
    </>
  );
};
