import { cn } from "@sglara/cn";
import { TrophyIcon } from "lucide-react";
import { BigRoundButton } from "./ui/bigRoundButton";
import { useGameSounds } from "../hooks/useSounds";
import { GOAL_IDS, useTrackMatomoGoalById } from "../hooks/useTrackGoals";

interface GameHeaderProps {
  showSuccessButton: boolean;
  onAboutClick: () => void;
  onSuccessClick: () => void;
}

export const GameHeader = ({ 
  showSuccessButton, 
  onAboutClick, 
  onSuccessClick 
}: GameHeaderProps) => {
  const { playMenuClick } = useGameSounds();
  const trackGoal = useTrackMatomoGoalById();

  const handleAboutClick = () => {
    playMenuClick();
    trackGoal(GOAL_IDS.OPENED_ABOUT);
    onAboutClick();
  };

  const handleSuccessClick = () => {
    trackGoal(GOAL_IDS.OPENED_SUCCESS);
    onSuccessClick();
  };

  return (
    <div
      className={cn(
        "flex flex-col md:flex-row items-center justify-center w-full max-w-[60vh] my-auto py-4 gap-4",
        {
          "justify-between": showSuccessButton,
        }
      )}
    >
      <button
        title="About this game"
        className="cursor-pointer hover:opacity-80 transition-opacity"
        onClick={handleAboutClick}
      >
        <h1 className="text-gray-600 dark:text-white text-6xl md:text-8xl font-bold select-none">
          Blockle
        </h1>
      </button>
      <div className="flex flex-row justify-center md:justify-end gap-4">
        {showSuccessButton && (
          <BigRoundButton
            title="Open share"
            className="bg-yellow-600 dark:bg-yellow-800"
            onClick={handleSuccessClick}
          >
            <TrophyIcon className="size-8 md:size-10 xl:size-12" />
          </BigRoundButton>
        )}
      </div>
    </div>
  );
}; 