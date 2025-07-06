import "./App.css";
import { useGame } from "./hooks/useGame";
import { MenuButtonPanel } from "./components/MenuButtonPanel";
import PlayingGrid from "./components/PlayingGrid";
import { LoaderCircleIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { Modal } from "./components/ui/modal";
import { About } from "./components/DialogContents/About";
import { Success } from "./components/DialogContents/Success";
import { useGameSounds, useSoundContext } from "./hooks/sounds";
import ConfettiBoom from "react-confetti-boom";

function App() {
  const { isMuted, setIsMuted } = useSoundContext();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalHeader, setModalHeader] = useState<string>("");
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);

  const { playButtonClick, playPuzzleComplete } = useGameSounds();

  const {
    game,
    gameState,
    updateGameState,
    handleTileClick,
    loading,
    solvePuzzle,
  } = useGame();

  // Check for puzzle completion and trigger confetti and success modal
  useEffect(() => {    
    if (gameState?.isCompleted && !showConfetti && !showSuccessModal) {
      setShowConfetti(true);
      playPuzzleComplete();
      setShowSuccessModal(true);
      setModalHeader("Well done!");
      setModalContent(<Success gameState={gameState} />);
    }
  }, [gameState, showConfetti, showSuccessModal, playPuzzleComplete]);

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
        <p className="sr-only">
          Loading...
        </p>
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
      <button
        title="About this game"
        className="cursor-pointer flex flex-row items-center justify-center gap-[10px] my-auto py-8 hover:opacity-80 transition-opacity"
        onClick={() => {
          playButtonClick();
          setIsModalOpen(true);
          setModalHeader("About Blockle");
          setModalContent(<About />);
        }}
      >
        <h1 className="text-gray-600 dark:text-white text-6xl md:text-8xl font-bold">
          Blockle
        </h1>
      </button>
      <div className="w-full max-w-[70vh] flex flex-col justify-center">
        {playingGrid}
      </div>
      <div className="flex flex-row justify-around w-full max-w-[70vh] my-auto py-8">
        {/* Button Panel */}
        <MenuButtonPanel
          updateGameState={updateGameState}
          solvePuzzle={solvePuzzle}
          game={game}
          isMuted={isMuted}
          setIsMuted={setIsMuted}
        />
      </div>
      <Modal
        isOpen={isModalOpen || showSuccessModal}
        onClose={() => {
          setIsModalOpen(false);
          setShowSuccessModal(false);
        }}
        header={modalHeader}
      >
        {modalContent}
      </Modal>
    </div>
  );
}

export default App;
