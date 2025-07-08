import type { Game } from "../game/logic";
import type { Piece, TileContent, PuzzleData } from "../types/game";

export function getPieceColor(pieceIndex: number) {
  const colors = [
    "bg-cyan-500 inset-shadow-sm inset-shadow-cyan-200/75 dark:bg-cyan-800 dark:inset-shadow-cyan-500/75",
    "bg-yellow-500 inset-shadow-sm inset-shadow-yellow-200/75 dark:bg-yellow-800 dark:inset-shadow-yellow-500/75",
    "bg-purple-500 inset-shadow-sm inset-shadow-purple-200/75 dark:bg-purple-800 dark:inset-shadow-purple-500/75",
    "bg-green-500 inset-shadow-sm inset-shadow-green-200/75 dark:bg-green-800 dark:inset-shadow-green-500/75",
    "bg-red-500 inset-shadow-sm inset-shadow-red-200/75 dark:bg-red-800 dark:inset-shadow-red-500/75",
    "bg-orange-500 inset-shadow-sm inset-shadow-orange-200/75 dark:bg-orange-800 dark:inset-shadow-orange-500/75",
    "bg-teal-500 inset-shadow-sm inset-shadow-teal-200/75 dark:bg-teal-800 dark:inset-shadow-teal-500/75",
    "bg-blue-500 inset-shadow-sm inset-shadow-blue-200/75 dark:bg-blue-800 dark:inset-shadow-blue-500/75",
    "bg-pink-500 inset-shadow-sm inset-shadow-pink-200/75 dark:bg-pink-800 dark:inset-shadow-pink-500/75",
    "bg-fuchsia-500 inset-shadow-sm inset-shadow-fuchsia-200/75 dark:bg-fuchsia-800 dark:inset-shadow-fuchsia-500/75",
  ];
  return colors[pieceIndex % colors.length];
}

export function getPieceRotationState(game: Game, pieceIndex: number): number {
  return game.getPieceRotationState(pieceIndex);
}

export function getTileContent({
  x,
  y,
  draggedPieceIndex,
  dragPosition,
  isValidDrop,
  gameState,
  game,
}: {
  x: number;
  y: number;
  draggedPieceIndex: number | null;
  dragPosition: { x: number; y: number } | null;
  isValidDrop: boolean;
  gameState: {
    pieces: Piece[];
    isCompleted?: boolean;
  };
  game: Game;
}): TileContent {
  const solutionSize = game.getSolutionSize();
  const gridSize = game.getGridSize();
  const solutionOffset = (gridSize - solutionSize) / 2;
  const isInSolutionGrid =
    x >= solutionOffset && 
    x <= solutionSize + solutionOffset - 1 &&
    y >= solutionOffset &&
    y <= solutionSize + solutionOffset - 1;

  if (draggedPieceIndex !== null && dragPosition) {
    const piece = gameState.pieces[draggedPieceIndex];
    if (piece && piece.blocks) {
      for (let blockIndex = 0; blockIndex < piece.blocks.length; blockIndex++) {
        const block = piece.blocks[blockIndex];
        const blockX = dragPosition.x + block.x;
        const blockY = dragPosition.y + block.y;
        if (blockX === x && blockY === y) {
          return {
            letter: piece.blocks[blockIndex].letter,
            isSelected: true,
            isGhost: true,
            isValid: isValidDrop,
            pieceIndex: draggedPieceIndex,
            isInSolutionGrid,
          };
        }
      }
    }
  }
  // Normal rendering
  const pieceAtPosition = game.getPieceAtPosition(x, y);
  if (pieceAtPosition) {
    const piece = gameState.pieces[pieceAtPosition.pieceIndex];
    if (piece && piece.blocks && piece.blocks[pieceAtPosition.blockIndex]) {
      return {
        letter: piece.blocks[pieceAtPosition.blockIndex].letter,
        isSelected: piece.isSelected,
        pieceIndex: pieceAtPosition.pieceIndex,
        isInSolutionGrid,
      };
    }
  }

  // Check if this is the empty tile and if it should be revealed
  const hintProgress = game.getHintProgress();
  const isCompleted = gameState.isCompleted || game.isPuzzleCompleted();

  // Only show empty tiles if hints are enabled (solution size <= 5) and either hints are revealed or puzzle is completed
  if (game.areHintsEnabled() && (hintProgress >= 2 || isCompleted)) {
    const emptyPositions = game.getEmptyTilePositions();
    const emptyPositionIndex = emptyPositions.findIndex(
      (emptyPosition) => x === emptyPosition.x && y === emptyPosition.y
    );
    if (emptyPositionIndex !== -1) {
      const emptyLetter = game.getEmptyTileLetters()[emptyPositionIndex];
      return {
        letter: emptyLetter,
        isSelected: false,
        pieceIndex: -1,
        isInSolutionGrid,
        isEmptyTile: true,
        isLocked: true,
      };
    }
  }

  return {
    letter: "",
    isSelected: false,
    pieceIndex: -1,
    isInSolutionGrid,
  };
}

/**
 * Get puzzle data for hints based on the current game state
 * This function should be called when the puzzle is loaded or when hint data is needed
 */
export function getHintData(game: Game): PuzzleData {
  const theme = game.getWordSolution().theme;
  const emptyPositions = game.getEmptyTilePositions();
  const emptyLetters = game.getEmptyTileLetters();

  return {
    theme,
    emptyPositions,
    emptyLetters,
  };
}

/**
 * Creates a URL by concatenating the base URL with the given path
 * Uses import.meta.env.BASE_URL for dynamic base path support
 * @param path - The path to append to the base URL
 * @returns The complete URL
 */
export function createUrl(path: string): string {
  return `${import.meta.env.BASE_URL}${path}`;
}
