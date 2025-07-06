import React, { useState, useEffect } from "react";
import {
  CheckCheckIcon,
  GraduationCapIcon,
  LightbulbIcon,
  SettingsIcon,
} from "lucide-react";
import { Modal } from "./ui/modal";
import { cn } from "@sglara/cn";
import Hints from "./DialogContents/Hints";
import Tutorial from "./DialogContents/Tutorial";
import Settings from "./DialogContents/Settings";
import type { Game } from "../game/logic";
import { useGameSounds } from "../hooks/sounds";

interface MenuButtonPanelProps {
  updateGameState: () => void;
  solvePuzzle: () => void;
  game?: Game;
  isMuted: boolean;
  setIsMuted: (isMuted: boolean) => void;
}

export const MenuButtonPanel: React.FC<MenuButtonPanelProps> = ({
  updateGameState,
  solvePuzzle,
  game,
  isMuted,
  setIsMuted,
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [modalHeader, setModalHeader] = useState<string>("");
  const [currentModalType, setCurrentModalType] = useState<string>("");

  // Update modal content when isMuted changes and settings modal is open
  useEffect(() => {
    if (isModalOpen && currentModalType === "settings") {
      setModalContent(
        <Settings game={game} isMuted={isMuted} setIsMuted={setIsMuted} />
      );
    }
  }, [isMuted, isModalOpen, currentModalType, game, setIsMuted]);

  return (
    <>
      <MenuButton
        title="Show tutorial"
        icon={<GraduationCapIcon className="size-1/2" />}
        onClick={() => {
          setModalHeader("Tutorial");
          setModalContent(<Tutorial />);
          setCurrentModalType("tutorial");
          setIsModalOpen(true);
        }}
      />
      <MenuButton
        title="Get hints"
        icon={<LightbulbIcon className="size-1/2" />}
        onClick={() => {
          setIsModalOpen(true);
          setModalHeader("Hints");
          setModalContent(
            <Hints game={game} onHintRevealed={() => updateGameState()} />
          );
          setCurrentModalType("hints");
        }}
      />
      <MenuButton
        title="Open settings"
        icon={<SettingsIcon className="size-1/2" />}
        onClick={() => {
          setIsModalOpen(true);
          setModalHeader("Settings");
          setModalContent(
            <Settings game={game} isMuted={isMuted} setIsMuted={setIsMuted} />
          );
          setCurrentModalType("settings");
        }}
      />
      {import.meta.env.DEV && (
        <MenuButton
          title="Solve puzzle"
          icon={<CheckCheckIcon className="size-1/2" />}
          onClick={() => {
            solvePuzzle();
          }}
        />
      )}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setCurrentModalType("");
        }}
        header={modalHeader}
      >
        {modalContent}
      </Modal>
    </>
  );
};

const MenuButton: React.FC<{
  title: string;
  icon: React.ReactNode;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
}> = ({ title, icon, onClick, className }) => {
  const { playButtonClick } = useGameSounds();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    playButtonClick();
    onClick(e);
  };

  return (
    <button
      title={title}
      className={cn(
        "flex items-center justify-center bg-gray-600 dark:bg-gray-800 text-white rounded-full size-16 md:size-20 xl:size-24 shadow-xl/20 dark:shadow-xl/40 cursor-pointer hover:opacity-80 transition-opacity",
        className
      )}
      onClick={handleClick}
    >
      {icon}
    </button>
  );
};
