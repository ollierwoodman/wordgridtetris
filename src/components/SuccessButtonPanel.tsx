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
  completionTime: number;
}

export const SuccessButtonPanel: React.FC<SuccessButtonPanelProps> = ({
  game,
  onOpenModal,
  handleLevelUp,
  completionTime,
}) => {
  const { playLevelUp } = useGameSounds();

  return (
    <>
      <BigRoundButton
        title="Open share"
        className="bg-yellow-600 dark:bg-yellow-800"
        onClick={() => {
          onOpenModal("Well done!", <Success solutionSize={game.getSolutionSize()} handleLevelUp={handleLevelUp} completionTime={completionTime} />);
        }}
      >
        <TrophyIcon className="size-8 md:size-10 xl:size-12" />
      </BigRoundButton>
      {game.getSolutionSize() < MAX_SOLUTION_SIZE && (
        <BigRoundButton
          title="Begin a new, more difficult puzzle"
          className="gap-4 px-4 md:px-6 animate-bounce"
          onClick={() => {
            handleLevelUp();
          }}
          playSound={playLevelUp}
        >
          <span className="text-xl font-bold uppercase">Next&nbsp;puzzle</span>
          <Grid2X2PlusIcon className="size-8 md:size-10 xl:size-12" />
        </BigRoundButton>
      )}
    </>
  );
};
