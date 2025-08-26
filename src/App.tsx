import { useGame } from "./hooks/useGame";
import { ButtonPanel } from "./components/ButtonPanel";
import PlayingGrid from "./components/PlayingGrid";
import ChengyuGrid from "./components/ChengyuGrid";
import { useEffect, useCallback } from "react";
import { Modal } from "./components/ui/modal";
import type { GameMode } from "./types/gameMode";
import { About } from "./components/DialogContents/About";
import { Success } from "./components/DialogContents/Success";
import { useCompletedPuzzlesManager } from "./hooks/useLocalStorage";
import { usePuzzleFromURL } from "./hooks/usePuzzleFromURL";
import { AnimatedEndlessRunner } from "./utils/svg";
import { useTheme } from "./hooks/useTheme";
import { AlreadyPlayed } from "./components/DialogContents/AlreadyPlayed";
import NotFound from "./components/404";
import { useModal } from "./hooks/useModal";
import { usePuzzleCompletion } from "./hooks/usePuzzleCompletion";
import { useAlreadyPlayedCheck } from "./hooks/useAlreadyPlayedCheck";
import { GameHeader } from "./components/GameHeader";
import { ThemeReveal } from "./components/ThemeReveal";
import { GameConfetti } from "./components/GameConfetti";
import { HeartIcon } from "lucide-react";
import { useGameSounds } from "./hooks/useSounds";

function App() {
  // Initialize theme
  useTheme();
  const { playMenuClick } = useGameSounds();

  const { solutionSize, changeGameMode, isInitialized, shouldShow404 } =
    usePuzzleFromURL();

  const { hasCompletedTodayWithSize } = useCompletedPuzzlesManager();

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
    revealTheme,
  } = useGame(isInitialized ? solutionSize : undefined);

  const { showConfetti, showSuccessButton, resetCompletionState } =
    usePuzzleCompletion({ game, gameState });

  const { shouldShowAlreadyPlayed, completedPuzzle } = useAlreadyPlayedCheck({
    isInitialized,
    solutionSize,
  });

  const handleChangePuzzle = useCallback(
    (newMode?: GameMode) => {
      if (newMode) {
        changeGameMode(newMode);
      }
      handleCloseModal();
      resetCompletionState();
    },
    [
      changeGameMode,
      handleCloseModal,
      resetCompletionState,
    ]
  );

  // Handle already played modal
  useEffect(() => {
    if (shouldShowAlreadyPlayed && completedPuzzle) {
      handleOpenModal(
        "Back again?",
        <AlreadyPlayed
          puzzle={completedPuzzle}
          handleChangePuzzle={handleChangePuzzle}
        />
      );
    } else if (!shouldShowAlreadyPlayed) {
      handleCloseModal();
    }
  }, [
    shouldShowAlreadyPlayed,
    completedPuzzle,
    handleOpenModal,
    handleCloseModal,
    handleChangePuzzle,
  ]);

  // Handle puzzle completion modal
  useEffect(() => {
    if (!game || !gameState?.isCompleted) {
      return;
    }

    const alreadyCompletedThisPuzzleToday = hasCompletedTodayWithSize(
      game.getSolutionSize()
    );

    handleOpenModal(
      "Well done!",
      <Success
        game={game}
        isReplay={alreadyCompletedThisPuzzleToday}
        handleChangePuzzle={handleChangePuzzle}
      />
    );
  }, [
    gameState?.isCompleted,
    game,
    hasCompletedTodayWithSize,
    handleOpenModal,
    handleChangePuzzle,
  ]);

  const handleAboutClick = () => {
    handleOpenModal("About Blockle", <About />);
  };

  const handleSuccessClick = () => {
    if (!game) return;

    const alreadyCompletedThisPuzzleToday = hasCompletedTodayWithSize(
      game.getSolutionSize()
    );

    handleOpenModal(
      "Well done!",
      <Success
        game={game}
        isReplay={alreadyCompletedThisPuzzleToday}
        handleChangePuzzle={handleChangePuzzle}
      />
    );
  };

  // Show 404 page for invalid URLs
  if (shouldShow404) {
    return (
      <NotFound
        setGameMode={changeGameMode}
      />
    );
  }

  if (!isInitialized || game === null || gameState === null || loading) {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center bg-gray-300 dark:bg-gray-900 p-4">
        {/* Spinner */}
        <AnimatedEndlessRunner className="max-w-md w-full text-white fill-gray-400/50 dark:fill-gray-600 bg-gray-300 dark:bg-gray-700 rounded-lg p-4" />
      </div>
    );
  }

  const playingGrid = solutionSize === 8 ? (
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
      <GameConfetti show={showConfetti} solutionSize={solutionSize} />

      <GameHeader
        showSuccessButton={showSuccessButton}
        onAboutClick={handleAboutClick}
        onSuccessClick={handleSuccessClick}
      />

      {/* Greeting */}
      {game.getWordSolution().greeting && (
        <div className="text-gray-600 dark:text-gray-300 text-lg md:text-xl xl:text-2xl font-bold text-center text-balance mb-4">
          {game.getWordSolution().greeting}
        </div>
      )}

      {/* Playing grid */}
      <div className="w-full max-w-[60vh] flex flex-col justify-center">
        {playingGrid}
      </div>

      {/* Theme */}
      <ThemeReveal
        theme={game.getWordTheme()}
        gameState={gameState}
        onThemeReveal={revealTheme}
      />

      <div className="flex flex-row justify-center items-center w-full max-w-[60vh] my-auto py-4 gap-4">
        {/* Button Panel */}
        <ButtonPanel
          updateGameState={updateGameState}
          solvePuzzle={solvePuzzle}
          handleChangePuzzle={handleChangePuzzle}
          game={game}
          onOpenModal={handleOpenModal}
          onCloseModal={handleCloseModal}
        />
      </div>
      <button
        type="button"
        onClick={() => {
          playMenuClick();
          handleOpenModal("About Blockle", <About />);
        }}
        className="cursor-pointer hover:opacity-80 transition-opacity text-gray-600 dark:text-gray-300 text-sm md:text-base text-center text-balance mt-4"
      >
        Made with{" "}
        <HeartIcon className="size-5 inline-block fill-gray-600 dark:fill-gray-300 -mt-1" />{" "}
        by Ollie
      </button>

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
