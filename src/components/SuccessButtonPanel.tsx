import React from "react";
import { Grid2X2PlusIcon, TrophyIcon } from "lucide-react";
import type { Game } from "../game/logic";
import { BigRoundButton } from "./ui/bigRoundButton";
import { Success } from "./DialogContents/Success";
import { MAX_SOLUTION_SIZE } from "../hooks/useSolutionSizeFromURL";
import { useGameSounds } from "../hooks/sounds";

interface SuccessButtonPanelProps {
  game: Game;
  onOpenModal: (header: string, content: React.ReactNode) => void;
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
        title="Open share"
        className="bg-yellow-600 dark:bg-yellow-800"
        onClick={() => {
          onOpenModal("Well done!", <Success game={game} handleLevelUp={handleLevelUp} />);
        }}
      >
        <TrophyIcon className="size-8 md:size-10 xl:size-12" />
      </BigRoundButton>
      {game.getSolutionSize() < MAX_SOLUTION_SIZE && (
        <BigRoundButton
          title="Begin a new, more difficult puzzle"
          onClick={() => {
            handleLevelUp();
          }}
          playSound={playLevelUp}
          hasBadge
        >
          <Grid2X2PlusIcon className="size-8 md:size-10 xl:size-12" />
        </BigRoundButton>
      )}
    </>
  );
};
