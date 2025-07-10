import "./App.css";
import { useGame } from "./hooks/useGame";
import { MenuButtonPanel } from "./components/MenuButtonPanel";
import PlayingGrid from "./components/PlayingGrid";
import { LoaderCircleIcon } from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";
import { Modal } from "./components/ui/modal";
import { About } from "./components/DialogContents/About";
import { Success } from "./components/DialogContents/Success";
import Settings from "./components/DialogContents/Settings";
import { Stats } from "./components/DialogContents/Stats";
import { useGameSounds } from "./hooks/sounds";
import ConfettiBoom from "react-confetti-boom";
import { SuccessButtonPanel } from "./components/SuccessButtonPanel";
import {
  useShowTutorial,
  useCompletedPuzzlesManager,
} from "./hooks/useLocalStorage";
import Tutorial from "./components/DialogContents/Tutorial";
import { cn } from "@sglara/cn";

export const MAX_SOLUTION_SIZE = 7;

function App() {
  const [solutionSize, setSolutionSize] = useState<number>(5);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalHeader, setModalHeader] = useState<string>("");
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [currentModalType, setCurrentModalType] = useState<string>("");
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [showSuccessButtonPanel, setShowSuccessButtonPanel] =
    useState<boolean>(false);

  const { playMenuClick, playPuzzleComplete } = useGameSounds();

  const [showTutorial] = useShowTutorial();
  const { hasCompletedToday } = useCompletedPuzzlesManager();

  // Track if completion effect has already fired
  const hasCompletedRef = useRef<boolean>(false);

  const {
    game,
    gameState,
    updateGameState,
    handleTileClick,
    loading,
    solvePuzzle,
    getCompletionTime,
  } = useGame(solutionSize);

  const { addPuzzle } = useCompletedPuzzlesManager();

  // Show tutorial modal on page load if showTutorial is true and user hasn't completed today's puzzle
  useEffect(() => {
    if (showTutorial && game && !loading && !hasCompletedToday()) {
      handleOpenModal(
        "tutorial",
        "Tutorial",
        <Tutorial game={game} onClose={handleCloseModal} />
      );
    }
  }, [showTutorial, game, loading, hasCompletedToday]);

  // Update modal content when settings modal is open
  useEffect(() => {
    if (isModalOpen && currentModalType === "settings" && game) {
      setModalContent(
        <Settings
          game={game}
          onOpenStats={() =>
            handleOpenModal("stats", "My Statistics", <Stats />)
          }
        />
      );
    }
  }, [isModalOpen, currentModalType, game]);

  const handleLevelUp = useCallback(() => {
    if (solutionSize < 5 || solutionSize >= MAX_SOLUTION_SIZE) {
      return;
    }
    setShowConfetti(false);
    setIsModalOpen(false);
    setShowSuccessButtonPanel(false);
    setSolutionSize(solutionSize + 1);
    // Reset completion flag when leveling up
    hasCompletedRef.current = false;
  }, [solutionSize]);

  // Check for puzzle completion and trigger confetti and success modal
  useEffect(() => {
    if (gameState?.isCompleted && !hasCompletedRef.current) {
      hasCompletedRef.current = true;
      setShowConfetti(true);
      playPuzzleComplete();
      setShowSuccessButtonPanel(true);
      addPuzzle({
        date: new Date().toISOString().split("T")[0],
        solutionSize: game?.getSolutionSize() || 0,
        seed: game?.getSeed() || "",
        timeToCompleteMs: getCompletionTime(),
      });
      handleOpenModal(
        "success",
        "Well done!",
        <Success
          game={game}
          handleLevelUp={handleLevelUp}
          completionTime={getCompletionTime()}
        />
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState]);

  const handleOpenModal = (
    type: string,
    header: string,
    content: React.ReactNode
  ) => {
    setCurrentModalType(type);
    setModalHeader(header);
    setModalContent(content);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentModalType("");
  };

  const playingGrid =
    game && gameState ? (
      <PlayingGrid
        game={game}
        gameState={gameState}
        updateGameState={updateGameState}
        handleTileClick={handleTileClick}
      />
    ) : null;

  if (!game || !gameState || loading) {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center bg-gray-300 dark:bg-gray-900 p-4">
        <p className="sr-only">Loading...</p>
        {/* Spinner */}
        <LoaderCircleIcon className="size-24 text-gray-400 dark:text-gray-300 animate-spin mt-8" />
      </div>
    );
  }

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-gray-300 dark:bg-gray-900 p-4">
      {showConfetti && (
        <>
          <ConfettiBoom
            mode="fall"
            className="z-50"
            particleCount={200}
            colors={[
              "#FF6B6B",
              "#4ECDC4",
              "#45B7D1",
              "#96CEB4",
              "#FFEAA7",
              "#DDA0DD",
              "#98D8C8",
            ]}
          />
        </>
      )}
      <div
        className={cn(
          "flex flex-col md:flex-row items-center justify-center w-full max-w-[65vh] my-auto py-4 gap-4",
          {
            "justify-between": showSuccessButtonPanel,
          }
        )}
      >
        <button
          title="About this game"
          className="cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => {
            playMenuClick();
            handleOpenModal("about", "About Blockle", <About />);
          }}
        >
          <h1 className="text-gray-600 dark:text-white text-6xl md:text-8xl font-bold">
            Blockle
          </h1>
        </button>
        <div className="flex flex-row flex-wrap justify-center md:justify-end gap-4">
          {showSuccessButtonPanel && (
            <SuccessButtonPanel
              game={game}
              handleLevelUp={handleLevelUp}
              onOpenModal={handleOpenModal}
              completionTime={getCompletionTime()}
            />
          )}
        </div>
      </div>
      <div className="w-full max-w-[65vh] flex flex-col justify-center">
        {playingGrid}
      </div>
      {/* Greeting and theme */}
      {game.getGreeting() && (
        <div className="text-gray-600 dark:text-gray-300 text-lg text-center text-balance">
          {game.getGreeting()}
        </div>
      )}
      <div className="flex flex-row justify-center items-center w-full max-w-[65vh] my-auto py-4 gap-4">
        {/* Button Panel */}
        <MenuButtonPanel
          updateGameState={updateGameState}
          solvePuzzle={solvePuzzle}
          game={game}
          onOpenModal={handleOpenModal}
          onCloseModal={handleCloseModal}
        />
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
}

export default App;
