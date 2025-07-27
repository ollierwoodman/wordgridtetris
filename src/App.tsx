import { useGame } from "./hooks/useGame";
import { MenuButtonPanel } from "./components/MenuButtonPanel";
import PlayingGrid from "./components/PlayingGrid";
import { useState, useEffect, useCallback } from "react";
import { Modal } from "./components/ui/modal";
import { About } from "./components/DialogContents/About";
import { Success } from "./components/DialogContents/Success";
import { useGameSounds } from "./hooks/sounds";
import ConfettiBoom from "react-confetti-boom";
import { useCompletedPuzzlesManager } from "./hooks/useLocalStorage";
import { cn } from "@sglara/cn";
import { useSolutionSizeFromURL } from "./hooks/useSolutionSizeFromURL";
import { AnimatedEndlessRunner } from "./utils/svg";
import { useTheme } from "./hooks/useTheme";
import {
  GOAL_IDS,
  useTrackCompletedPuzzle,
  useTrackMatomoGoalById,
} from "./hooks/useTrackGoals";
import FlippableCard from "./components/ui/flippableCard";
import { LightbulbIcon, TrophyIcon } from "lucide-react";
import { AlreadyPlayed } from "./components/DialogContents/AlreadyPlayed";
import { BigRoundButton } from "./components/ui/bigRoundButton";
import { SOLUTION_SIZES } from "./game/logic";

// Constants for particle count interpolation
const MIN_PARTICLES = 50;
const MAX_PARTICLES = 100;
const MIN_SOLUTION_SIZE = Math.min(...SOLUTION_SIZES);
const MAX_SOLUTION_SIZE = Math.max(...SOLUTION_SIZES);

function App() {
  // Initialize theme
  useTheme();

  const { solutionSize, changeSolutionSize, isInitialized } =
    useSolutionSizeFromURL();

  const { addPuzzle, hasCompletedTodayWithSize, getPuzzleByDateAndSize } =
    useCompletedPuzzlesManager();
  const alreadyCompletedThisPuzzleToday =
    hasCompletedTodayWithSize(solutionSize);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalHeader, setModalHeader] = useState<string>("");
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [showSuccessButton, setShowSuccessButton] = useState<boolean>(false);

  const { playMenuClick, playPuzzleComplete, playThemeReveal } =
    useGameSounds();

  const trackGoal = useTrackMatomoGoalById();
  const trackCompletedPuzzle = useTrackCompletedPuzzle();

  const {
    game,
    gameState,
    updateGameState,
    handleTileClick,
    loading,
    solvePuzzle,
    revealTheme,
  } = useGame(isInitialized ? solutionSize : undefined);

  // Check if puzzle was already completed when loading
  useEffect(() => {
    if (loading) return;

    setIsModalOpen(false);
    setShowConfetti(false);
    setShowSuccessButton(false);

    if (hasCompletedTodayWithSize(solutionSize)) {
      const completedPuzzle = getPuzzleByDateAndSize(
        new Date().toISOString().split("T")[0],
        solutionSize
      );
      if (completedPuzzle) {
        handleOpenModal(
          "Back again?",
          <AlreadyPlayed
            puzzle={completedPuzzle}
            handleChangePuzzle={changeSolutionSize}
          />
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [solutionSize, loading]);

  const handleThemeReveal = useCallback(() => {
    if (gameState?.isThemeRevealed) {
      return;
    }
    revealTheme();
    playThemeReveal();
    trackGoal(GOAL_IDS.REVEALED_THEME);
  }, [revealTheme, gameState, playThemeReveal, trackGoal]);

  // Check for puzzle completion and trigger confetti and success modal
  useEffect(() => {
    if (!game) {
      return;
    }

    if (gameState?.isCompleted) {
      trackCompletedPuzzle(game.getSolutionSize());
      setShowConfetti(true);
      setShowSuccessButton(true);
      playPuzzleComplete();

      if (!alreadyCompletedThisPuzzleToday) {
        addPuzzle({
          date: new Date().toISOString().split("T")[0],
          solutionSize: game.getSolutionSize(),
          theme: game.getWordTheme(),
          isThemeRevealed: gameState.isThemeRevealed,
          timeToCompleteMs: game.getCompletionDurationMs() ?? -1,
        });
      }

      setTimeout(() => {
        handleOpenModal(
          "Well done!",
          <Success
            game={game}
            isReplay={alreadyCompletedThisPuzzleToday}
            handleChangePuzzle={changeSolutionSize}
          />
        );
      }, 500);
    }
  }, [
    gameState,
    game,
    trackCompletedPuzzle,
    addPuzzle,
    playPuzzleComplete,
    alreadyCompletedThisPuzzleToday,
    changeSolutionSize,
  ]);

  const handleOpenModal = (header: string, content: React.ReactNode) => {
    setModalHeader(header);
    setModalContent(content);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
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

  if (!isInitialized || game === null || gameState === null || loading) {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center bg-gray-300 dark:bg-gray-900 p-4">
        {/* Spinner */}
        <AnimatedEndlessRunner className="max-w-md w-full text-white fill-gray-400/50 dark:fill-gray-600 bg-gray-300 dark:bg-gray-700 rounded-lg p-4" />
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
            particleCount={
              MIN_PARTICLES +
              Math.round(
                ((solutionSize - MIN_SOLUTION_SIZE) *
                  (MAX_PARTICLES - MIN_PARTICLES)) /
                  (MAX_SOLUTION_SIZE - MIN_SOLUTION_SIZE)
              )
            }
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
          "flex flex-col md:flex-row items-center justify-center w-full max-w-[60vh] my-auto py-4 gap-4",
          {
            "justify-between": showSuccessButton,
          }
        )}
      >
        <button
          title="About this game"
          className="cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => {
            playMenuClick();
            trackGoal(GOAL_IDS.OPENED_ABOUT);
            handleOpenModal("About Blockle", <About />);
          }}
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
              onClick={() => {
                trackGoal(GOAL_IDS.OPENED_SUCCESS);
                handleOpenModal(
                  "Well done!",
                  <Success
                    game={game}
                    isReplay={alreadyCompletedThisPuzzleToday}
                    handleChangePuzzle={changeSolutionSize}
                  />
                );
              }}
            >
              <TrophyIcon className="size-8 md:size-10 xl:size-12" />
            </BigRoundButton>
          )}
        </div>
      </div>
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
      {game.getWordTheme() && (
        <div className="flex items-center w-full max-w-[60vh] text-lg md:text-xl xl:text-2xl text-center text-balance mt-4">
          <FlippableCard
            className="w-full"
            frontContent={
              <>
                <LightbulbIcon className="size-10" />
                <span className="font-bold uppercase ml-2">
                  Tap to reveal theme
                </span>
              </>
            }
            backContent={
              <>
                <span>Theme:</span>
                <span className="font-bold uppercase ml-2">
                  {game.getWordTheme()}
                </span>
              </>
            }
            isFlipped={gameState.isThemeRevealed}
            onClick={handleThemeReveal}
          />
        </div>
      )}
      <div className="flex flex-row justify-center items-center w-full max-w-[60vh] my-auto py-4 gap-4">
        {/* Button Panel */}
        <MenuButtonPanel
          updateGameState={updateGameState}
          solvePuzzle={solvePuzzle}
          game={game}
          onOpenModal={handleOpenModal}
          onCloseModal={handleCloseModal}
          handleChangePuzzle={changeSolutionSize}
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
