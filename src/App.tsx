import "./App.css";
import { useGame } from "./hooks/useGame";
import { MenuButtonPanel } from "./components/MenuButtonPanel";
import PlayingGrid from "./components/PlayingGrid";
import { LoaderCircleIcon } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { Modal } from "./components/ui/modal";
import { About } from "./components/DialogContents/About";
import { Success } from "./components/DialogContents/Success";
import Settings from "./components/DialogContents/Settings";
import { useGameSounds, useSoundContext } from "./hooks/sounds";
import ConfettiBoom from "react-confetti-boom";
import { SuccessButtonPanel } from "./components/SuccessButtonPanel";

export const MAX_SOLUTION_SIZE = 7;

function App() {
  const [solutionSize, setSolutionSize] = useState<number>(5);

  const { isMuted, setIsMuted } = useSoundContext();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalHeader, setModalHeader] = useState<string>("");
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [currentModalType, setCurrentModalType] = useState<string>("");
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [showSuccessButtonPanel, setShowSuccessButtonPanel] =
    useState<boolean>(false);

  const { playMenuClick, playPuzzleComplete } = useGameSounds();

  const {
    game,
    gameState,
    updateGameState,
    handleTileClick,
    loading,
    solvePuzzle,
  } = useGame(solutionSize);

  // Update modal content when isMuted changes and settings modal is open
  useEffect(() => {
    if (isModalOpen && currentModalType === "settings" && game) {
      setModalContent(
        <Settings game={game} isMuted={isMuted} setIsMuted={setIsMuted} />
      );
    }
  }, [isMuted, isModalOpen, currentModalType, game, setIsMuted]);

  const handleLevelUp = useCallback(() => {
    if (solutionSize < 5 || solutionSize >= MAX_SOLUTION_SIZE) {
      return;
    }
    setShowConfetti(false);
    setIsModalOpen(false);
    setShowSuccessButtonPanel(false);
    setSolutionSize(solutionSize + 1);
  }, [solutionSize]);

  // Check for puzzle completion and trigger confetti and success modal
  useEffect(() => {
    if (gameState?.isCompleted) {
      setShowConfetti(true);
      playPuzzleComplete();
      setShowSuccessButtonPanel(true);
      handleOpenModal(
        "success",
        "Well done!",
        <Success game={game} handleLevelUp={handleLevelUp} />
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

  if (loading) {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center bg-gray-300 dark:bg-gray-900 p-4">
        <p className="sr-only">Loading...</p>
        {/* Spinner */}
        <LoaderCircleIcon className="size-24 text-gray-400 dark:text-gray-300 animate-spin mt-8" />
      </div>
    );
  }

  if (!game || !gameState) {
    return null;
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
      <div className="flex flex-col md:flex-row justify-between items-center w-full max-w-[65vh] my-auto py-4 gap-4">
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
        {(showSuccessButtonPanel && (
          <div className="flex flex-row justify-center md:justify-end gap-8">
            <SuccessButtonPanel
              game={game}
              handleLevelUp={handleLevelUp}
              onOpenModal={handleOpenModal}
            />
          </div>
        )) || (
          <div className="flex flex-col text-gray-600 dark:text-gray-300 text-md text-center md:text-right text-balance gap-2">
            <p className="">
              Drag and drop the pieces to spell out the{" "}
              {game.getSolutionSize()} words across the {game.getSolutionSize()}
              ×{game.getSolutionSize()} grid in the centre.
            </p>
            {game.getEmptyTilePositions().length > 0 && (
              <p className="">
                There {game.getEmptyTilePositions().length === 1 ? "is" : "are"}{" "}
                {game.getEmptyTilePositions().length} empty tile
                {game.getEmptyTilePositions().length === 1 ? "" : "s"} in the
                solution.
              </p>
            )}
          </div>
        )}
      </div>
      <div className="w-full max-w-[65vh] flex flex-col justify-center">
        {playingGrid}
      </div>
      <div className="flex flex-col-reverse md:flex-row justify-between items-center w-full max-w-[65vh] my-auto py-4 gap-4">
        {/* Greeting and theme */}
        <div className="flex flex-col text-gray-600 dark:text-gray-300 text-lg text-center md:text-left text-balance gap-2">
          {game.getGreeting() && <p className="">{game.getGreeting()}</p>}
          <p className="">
            Today's theme:{" "}
            <span className="font-bold">{game.getWordTheme()}</span>
          </p>
        </div>
        {/* Button Panel */}
        <div className="flex flex-row justify-center md:justify-end gap-4">
          <MenuButtonPanel
            updateGameState={updateGameState}
            solvePuzzle={solvePuzzle}
            game={game}
            isMuted={isMuted}
            setIsMuted={setIsMuted}
            onOpenModal={handleOpenModal}
          />
        </div>
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
