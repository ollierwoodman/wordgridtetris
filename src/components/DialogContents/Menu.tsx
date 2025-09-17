import React from "react";
import { ChevronRightIcon } from "lucide-react";
import { Stats } from "./Stats";
import { BarChart2Icon, InfoIcon } from "lucide-react";
import { GOAL_IDS, useTrackMatomoGoalById } from "../../hooks/useTrackGoals";
import { About } from "./About";
import { useGameSounds } from "../../hooks/useSounds";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";

const Menu: React.FC = () => {
  const {
    isModalOpen,
    modalHeader,
    modalContent,
    handleOpenModal,
    handleCloseModal,
  } = useModal();
  const { playMenuClick } = useGameSounds();
  const trackGoal = useTrackMatomoGoalById();

  const handleOpenStats = () => {
    playMenuClick();
    trackGoal(GOAL_IDS.OPENED_STATS);
    handleOpenModal("My stats", <Stats />);
  };

  const handleOpenAbout = () => {
    playMenuClick();
    trackGoal(GOAL_IDS.OPENED_ABOUT);
    handleOpenModal("About Blockle", <About />);
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Statistics Section */}
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center dark:text-gray-200 w-full gap-4">
          <div className="flex flex-col">
            <h3 className="text-lg font-bold">Statistics</h3>
            <p className="text-gray-800 dark:text-gray-300">
              View your puzzle performance
            </p>
          </div>
          <BarChart2Icon className="size-8 ml-auto" />
        </div>
        <button
          type="button"
          title="View my stats"
          onClick={handleOpenStats}
          className="cursor-pointer rounded-full flex items-center justify-center w-full bg-gray-200 text-gray-800 hover:opacity-80 px-4 py-2"
        >
          Open My Stats
          <ChevronRightIcon className="size-4 ml-2" />
        </button>
      </div>

      {/* About Section */}
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center dark:text-gray-200 w-full gap-4">
          <div className="flex flex-col">
            <h3 className="text-lg font-bold">About</h3>
            <p className="text-gray-800 dark:text-gray-300">
              Learn more about the game
            </p>
          </div>
          <InfoIcon className="size-8 ml-auto" />
        </div>
        <button
          type="button"
          title="About this game"
          onClick={handleOpenAbout}
          className="cursor-pointer rounded-full flex items-center justify-center w-full bg-gray-200 text-gray-800 hover:opacity-80 px-4 py-2"
        >
          About Blockle
          <ChevronRightIcon className="size-4 ml-2" />
        </button>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        header={modalHeader}
      >
        {modalContent}
      </Modal>
    </div>
  );
};

export default Menu;
