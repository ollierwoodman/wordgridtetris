import React, { useCallback, useMemo, useState, useEffect } from "react";
import type { HintsProps, Hint } from "../../types/game";
import { getHintData } from "../../utils/game";
import FlippableCard from "../ui/flippableCard";
import { CircleQuestionMarkIcon } from "lucide-react";
import { useGameSounds } from "../../hooks/sounds";

const Hints: React.FC<HintsProps> = ({ game, onHintRevealed }) => {
  // Local state to track hint progress
  const [hintProgress, setHintProgress] = useState(0);

  // Update local state when game changes
  useEffect(() => {
    if (game) {
      setHintProgress(game.getHintProgress());
    }
  }, [game]);

  // Check if hints are enabled for this game
  const hintsEnabled = game?.areHintsEnabled() ?? false;

  // Define hints in order
  const hints: Hint[] = useMemo(
    () => [
      {
        id: "theme",
        type: "theme",
        title: "Puzzle Theme",
        description: "Reveal the theme of today's puzzle",
      },
      {
        id: "position",
        type: "position",
        title: "Empty Tile Position",
        description: "Show where the empty tile is located",
      },
      {
        id: "letter",
        type: "letter",
        title: "Empty Tile Letter",
        description: "Reveal the letter in the empty tile",
      },
    ],
    []
  );

  const { playHintReveal } = useGameSounds();

  const getHintContent = useCallback(
    (hintId: string) => {
      if (!game) return null;

      const puzzleData = getHintData(game);

      switch (hintId) {
        case "theme":
          return (
            puzzleData.theme.charAt(0).toUpperCase() + puzzleData.theme.slice(1)
          );

        case "position": {
          // Convert grid coordinates to solution coordinates
          const solutionOffset = game.getSolutionOffset();
          const solutionX = puzzleData.emptyPositions[0].x - solutionOffset;
          const solutionY = puzzleData.emptyPositions[0].y - solutionOffset;
          return `${getOrdinalNumber(solutionX + 1)} letter of the ${getOrdinalNumber(solutionY + 1)} word`;
        }

        case "letter":
          return puzzleData.emptyLetters[0];

        default:
          return null;
      }
    },
    [game]
  );

  // If hints are disabled, show a message
  if (!hintsEnabled) {
    return (
      <div className="text-center space-y-4">
        <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
          Hints Not Available
        </p>
        <p className="text-gray-600 dark:text-gray-300">
          Hints are only available for 5x5 puzzles. This puzzle is {game?.getSolutionSize()}x{game?.getSolutionSize()}.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* All hints as flippable cards */}
      {hints.map((hint, index) => {
        const isRevealed = hintProgress > index;
        const isNextHint = hintProgress === index;

        return (
          <div key={hint.id} className="flex flex-col">
            <p className="text-lg font-bold dark:text-gray-200">{hint.title}</p>
            <p className="text-gray-800 dark:text-gray-300 mb-2">
              {hint.description}
            </p>
            <FlippableCard
              isFlipped={isRevealed}
              onFlip={
                isNextHint
                  ? () => {
                      if (game?.revealNextHint()) {
                        // Update local state immediately
                        setHintProgress(game.getHintProgress());
                        // Call the callback to trigger UI update
                        onHintRevealed?.(hint.id);
                        playHintReveal();
                      }
                    }
                  : undefined
              }
              frontContent={
                <div className="flex flex-row items-center text-lg font-bold gap-2">
                  {(isNextHint && <p>Tap to show hint</p>) || (
                    <CircleQuestionMarkIcon className="size-8" />
                  )}
                </div>
              }
              backContent={
                <p className="text-lg font-bold text-balance">
                  {getHintContent(hint.id)}
                </p>
              }
              frontClassName={
                isNextHint
                  ? "bg-cyan-500 text-white dark:bg-cyan-700"
                  : "bg-gray-500 text-white cursor-not-allowed opacity-50 dark:bg-gray-700"
              }
              backClassName="bg-green-500 text-white dark:bg-green-700"
            />
          </div>
        );
      })}
    </>
  );
};

export default Hints;

function getOrdinalNumber(number: number) {
  const suffixes = ["th", "st", "nd", "rd"];
  const remainder = number % 100;
  return (
    number + (suffixes[(remainder - 20) % 10] || suffixes[remainder] || "th")
  );
}
