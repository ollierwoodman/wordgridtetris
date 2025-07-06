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
    "bg-blue-500 inset-shadow-sm inset-shadow-blue-200/75 dark:bg-blue-800 dark:inset-shadow-blue-500/75",
    "bg-pink-500 inset-shadow-sm inset-shadow-pink-200/75 dark:bg-pink-800 dark:inset-shadow-pink-500/75",
    "bg-indigo-500 inset-shadow-sm inset-shadow-indigo-200/75 dark:bg-indigo-800 dark:inset-shadow-indigo-500/75",
    "bg-teal-500 inset-shadow-sm inset-shadow-teal-200/75 dark:bg-teal-800 dark:inset-shadow-teal-500/75",
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
  };
  game: Game;
}): TileContent {
  // Check if tile is in the 5x5 center area (coordinates 2-6, 2-6)
  const isInSolutionGrid = x >= 2 && x <= 6 && y >= 2 && y <= 6;

  if (draggedPieceIndex !== null && dragPosition) {
    const piece = gameState.pieces[draggedPieceIndex];
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
  // Normal rendering
  const pieceAtPosition = game.getPieceAtPosition(x, y);
  if (pieceAtPosition) {
    const piece = gameState.pieces[pieceAtPosition.pieceIndex];
    return {
      letter: piece.blocks[pieceAtPosition.blockIndex].letter,
      isSelected: piece.isSelected,
      pieceIndex: pieceAtPosition.pieceIndex,
      isInSolutionGrid,
    };
  }

  // Check if this is the empty tile and if it should be revealed
  const hintProgress = game.getHintProgress();
  if (hintProgress >= 2) {
    const emptyPosition = game.getEmptyTilePosition();
    if (emptyPosition && x === emptyPosition.x && y === emptyPosition.y) {
      const emptyLetter = hintProgress >= 3 ? game.getEmptyTileLetter() : "";
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
  const emptyPosition = game.getEmptyTilePosition();
  const emptyLetter = game.getEmptyTileLetter();

  return {
    theme,
    emptyPosition,
    emptyLetter,
  };
}
