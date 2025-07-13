import type { Game } from "../game/logic";
import type { Piece, TileContent, PuzzleData } from "../types/game";

export function formatDurationMs(ms: number): string {
  if (ms === 0) return "N/A";
  
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds.toString().padStart(2, '0')}s`;
  } else {
    return `${remainingSeconds}s`;
  }
}

export function formatDateHowLongAgo(date: string): string {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - new Date(date).getTime());
  
  const diffMinutes = Math.floor(diffTime / (1000 * 60));
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30.44); // Average days per month
  const diffYears = Math.floor(diffDays / 365.25); // Account for leap years
  
  if (diffMinutes < 1) {
    return "just now";
  } else if (diffMinutes < 60) {
    return `${diffMinutes} minute${diffMinutes === 1 ? '' : 's'} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
  } else if (diffDays < 7) {
    return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
  } else if (diffWeeks < 4) {
    return `${diffWeeks} week${diffWeeks === 1 ? '' : 's'} ago`;
  } else if (diffMonths < 12) {
    return `${diffMonths} month${diffMonths === 1 ? '' : 's'} ago`;
  } else {
    return `${diffYears} year${diffYears === 1 ? '' : 's'} ago`;
  }
}

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

  const isGameCompleted = gameState.isCompleted || game.isPuzzleCompleted();
  if (isGameCompleted) {
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
