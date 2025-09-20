import { useGame } from "./hooks/useGame";
import { ButtonPanel } from "./components/ButtonPanel";
import PlayingGrid from "./components/PlayingGrid";
import ChengyuGrid from "./components/ChengyuGrid";
import { Modal } from "./components/ui/modal";
import type { GameMode } from "./types/gameMode";
import { About } from "./components/DialogContents/About";
import { usePuzzleFromURL } from "./hooks/usePuzzleFromURL";
import { AnimatedEndlessRunner } from "./utils/svg";
import { useTheme } from "./hooks/useTheme";
import NotFound from "./components/404";
import { useModal } from "./hooks/useModal";
import { usePuzzleCompletion } from "./hooks/usePuzzleCompletion";
import { GameHeader } from "./components/GameHeader";
import { GameConfetti } from "./components/GameConfetti";
import { HeartIcon } from "lucide-react";
import { useGameSounds } from "./hooks/useSounds";
import { useCallback } from "react";
import CurrentGameStats from "./components/CurrentGameStats";

function App() {
  // Initialize theme
  useTheme();
  const { playMenuClick } = useGameSounds();

  const { gameMode, changeGameMode, isInitialized, shouldShow404 } =
    usePuzzleFromURL();

  const {
    isModalOpen,
    modalHeader,
    modalContent,
    handleOpenModal,
    handleCloseModal,
  } = useModal();

  const {
    game,
    gameState,
    updateGameState,
    handleTileClick,
    loading,
    solvePuzzle,
  } = useGame(gameMode);

  const { showConfetti, resetCompletionState, handleGiveUp } =
    usePuzzleCompletion({
      game,
      gameState,
      solvePuzzle,
    });

  const handleChangePuzzle = useCallback(
    (newMode?: GameMode) => {
      if (newMode) {
        changeGameMode(newMode);
      }
      handleCloseModal();
      resetCompletionState();
    },
    [changeGameMode, handleCloseModal, resetCompletionState]
  );

  // Show 404 page for invalid URLs
  if (shouldShow404) {
    return <NotFound setGameMode={changeGameMode} />;
  }

  if (!isInitialized || game === null || gameState === null || loading) {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center bg-gray-300 dark:bg-gray-900 p-4">
        {/* Spinner */}
        <AnimatedEndlessRunner className="max-w-md w-full text-white fill-gray-400/50 dark:fill-gray-600 bg-gray-300 dark:bg-gray-700 rounded-lg p-4" />
      </div>
    );
  }

  const playingGrid =
    gameMode === "chengyu" ? (
      <ChengyuGrid
        game={game}
        gameState={gameState}
        updateGameState={updateGameState}
        handleTileClick={handleTileClick}
      />
    ) : (
      <PlayingGrid
        game={game}
        gameState={gameState}
        updateGameState={updateGameState}
        handleTileClick={handleTileClick}
      />
    );

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-gray-300 dark:bg-gray-900 py-4 px-8">
      {/* Confetti */}
      <GameConfetti show={showConfetti} game={game} />

      <GameHeader
        game={game}
        onOpenModal={handleOpenModal}
        handleChangePuzzle={handleChangePuzzle}
      />

      {/* Greeting */}
      {game.getWordSolution().greeting && (
        <div className="text-gray-600 dark:text-gray-300 text-lg md:text-xl xl:text-2xl font-bold text-center text-balance mb-4">
          {game.getWordSolution().greeting}
        </div>
      )}

      {/* Playing grid */}
      <div className="w-full max-w-[60vh] flex flex-col justify-center my-4">
        {playingGrid}
      </div>

      <div className="flex flex-row justify-between items-center w-full max-w-[60vh] gap-4">
        <CurrentGameStats game={game} />
        <button
          type="button"
          onClick={() => {
            playMenuClick();
            handleOpenModal("About Blockle", <About />);
          }}
          className="cursor-pointer hover:opacity-80 transition-opacity text-gray-600 dark:text-white text-sm md:text-base text-center text-balance"
        >
          Made with{" "}
          <HeartIcon className="size-5 inline-block fill-gray-600 dark:fill-gray-300 -mt-1" />{" "}
          by Ollie
        </button>
      </div>

      {/* Button Panel */}
      <ButtonPanel
        updateGameState={updateGameState}
        solvePuzzle={solvePuzzle}
        handleChangePuzzle={handleChangePuzzle}
        game={game}
        onOpenModal={handleOpenModal}
        onCloseModal={handleCloseModal}
        onGiveUp={handleGiveUp}
      />

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
