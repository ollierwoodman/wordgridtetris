import type { Game } from "../game/logic";
import type { Piece, TileState, PuzzleData } from "../types/game";

export function formatDurationMs(ms: number): string {
  if (ms === 0) return "N/A";

  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes > 0) {
    return `${String(minutes)}m ${remainingSeconds
      .toString()
      .padStart(2, "0")}s`;
  } else {
    return `${String(remainingSeconds)}s`;
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
    return `${String(diffMinutes)} minute${diffMinutes === 1 ? "" : "s"} ago`;
  } else if (diffHours < 24) {
    return `${String(diffHours)} hour${diffHours === 1 ? "" : "s"} ago`;
  } else if (diffDays < 7) {
    return `${String(diffDays)} day${diffDays === 1 ? "" : "s"} ago`;
  } else if (diffWeeks < 4) {
    return `${String(diffWeeks)} week${diffWeeks === 1 ? "" : "s"} ago`;
  } else if (diffMonths < 12) {
    return `${String(diffMonths)} month${diffMonths === 1 ? "" : "s"} ago`;
  } else {
    return `${String(diffYears)} year${diffYears === 1 ? "" : "s"} ago`;
  }
}

/**
 * Gets the current date in YYYY-MM-DD format using local timezone
 * This ensures "today" aligns with user's perception regardless of timezone
 */
export function getLocalDateString(date: Date = new Date()): string {
  const year = String(date.getFullYear());
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getPieceColor(pieceIndex: number) {
  const colors = [
    "z-10 bg-cyan-600 inset-shadow-sm inset-shadow-white/50 dark:bg-cyan-800 dark:inset-shadow-white/40",
    "z-10 bg-yellow-600 inset-shadow-sm inset-shadow-white/50 dark:bg-yellow-800 dark:inset-shadow-white/40",
    "z-10 bg-purple-600 inset-shadow-sm inset-shadow-white/50 dark:bg-purple-800 dark:inset-shadow-white/40",
    "z-10 bg-green-600 inset-shadow-sm inset-shadow-white/50 dark:bg-green-800 dark:inset-shadow-white/40",
    "z-10 bg-red-600 inset-shadow-sm inset-shadow-white/50 dark:bg-red-800 dark:inset-shadow-white/40",
    "z-10 bg-orange-600 inset-shadow-sm inset-shadow-white/50 dark:bg-orange-800 dark:inset-shadow-white/40",
    "z-10 bg-blue-600 inset-shadow-sm inset-shadow-white/50 dark:bg-blue-800 dark:inset-shadow-white/40",
    "z-10 bg-teal-600 inset-shadow-sm inset-shadow-white/50 dark:bg-teal-800 dark:inset-shadow-white/40",
    "z-10 bg-pink-600 inset-shadow-sm inset-shadow-white/50 dark:bg-pink-800 dark:inset-shadow-white/40",
    "z-10 bg-fuchsia-600 inset-shadow-sm inset-shadow-white/50 dark:bg-fuchsia-800 dark:inset-shadow-white/40",
    "z-10 bg-indigo-600 inset-shadow-sm inset-shadow-white/50 dark:bg-indigo-800 dark:inset-shadow-white/40",
    "z-10 bg-rose-600 inset-shadow-sm inset-shadow-white/50 dark:bg-rose-800 dark:inset-shadow-white/40",
  ];
  return colors[pieceIndex % colors.length];
}

export function getPieceRotationState(game: Game, pieceIndex: number): number {
  return game.getPieceRotationState(pieceIndex);
}

export function getTileState({
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
}): TileState {
  const solutionSize = game.getSolutionSize();
  const gridSize = game.getGridSize();
  const solutionOffset = game.getSolutionOffset();
  
  let isInSolutionGrid: boolean;
  // Special handling for chengyu mode (8x8)
  if (solutionSize === 8) {
    // Check if in valid x range, excluding middle spacing column (x=6)
    const isInLeftHalf = x >= 2 && x < 6;  // columns 2-5
    const isInRightHalf = x >= 7 && x < 11; // columns 7-10
    const isInValidXRange = isInLeftHalf || isInRightHalf;
    
    // Check if in valid y range, excluding middle spacing row (y=6)
    const isInTopHalf = y >= 2 && y < 6;   // rows 2-5
    const isInBottomHalf = y >= 7 && y < 11; // rows 7-10
    const isInValidYRange = isInTopHalf || isInBottomHalf;
    
    isInSolutionGrid = isInValidXRange && isInValidYRange;
  } else {
    // Regular mode logic
    isInSolutionGrid =
      x >= solutionOffset &&
      x <= solutionSize + solutionOffset - 1 &&
      y >= solutionOffset &&
      y <= solutionSize + solutionOffset - 1;
  }

  if (draggedPieceIndex !== null && dragPosition) {
    const piece = gameState.pieces[draggedPieceIndex];
    for (const block of piece.blocks) {
      const blockX = dragPosition.x + block.x;
      const blockY = dragPosition.y + block.y;
      if (blockX === x && blockY === y) {
        return {
          letter: block.letter,
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
    const block = piece.blocks[pieceAtPosition.blockIndex];
    return {
      letter: block.letter,
      isSelected: piece.isSelected,
      pieceIndex: pieceAtPosition.pieceIndex,
      isInSolutionGrid,
    };
  }

  const isGameCompleted = gameState.isCompleted ?? game.isPuzzleCompleted();
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
