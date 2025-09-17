// Import Game class type for component props
import type { Game } from '../game/logic';

// Core game types
export interface Tile {
  letter: string;
  x: number;
  y: number;
  isSelected: boolean;
}

export interface Block {
  letter: string;
  x: number;
  y: number;
}

export interface Piece {
  type: PieceType;
  blocks: Block[];
  x: number;
  y: number;
  isSelected: boolean;
}

export enum PieceType {
  I = 0,
  O = 1,
  T = 2,
  S = 3,
  Z = 4,
  L = 5,
  J = 6,
}

// Solution types
export interface PiecePlacement {
  pieceIndex: number;
  rotation: number;
  x: number;
  y: number;
}

export type PieceSolutionEntry = PiecePlacement;

export type Solution = PiecePlacement[];

// Game state types
export interface GameState {
  grid: Tile[][];
  pieces: Piece[];
  selectedPieceIndex: number | null;
  isCompleted: boolean;
  hintState: HintState;
}

// UI types
export interface TileState {
  letter: string;
  isSelected: boolean;
  pieceIndex: number;
  isInSolutionGrid: boolean;
  isGhost?: boolean;
  isValid?: boolean;
  isEmptyTile?: boolean;
  isLocked?: boolean;
}

// Hint types
export interface Hint {
  id: string;
  type: 'theme' | 'position' | 'letter';
  title: string;
  description: string;
}

export interface PuzzleData {
  theme: string;
  emptyPositions: { x: number; y: number }[];
  emptyLetters: string[];
}

// Component prop types
export interface PlayingGridProps {
  game: Game;
  gameState: GameState;
  updateGameState: () => void;
  handleTileClick: (x: number, y: number) => void;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  header: string;
  children: React.ReactNode;
  className?: string;
}

export interface HintState {
  theme?: boolean;
  emptyTilePosition?: boolean;
  emptyTileLetter?: boolean;
  firstPieceLocation: boolean;
  firstWord: boolean;
}

export type HintType = 'theme' | 'emptyTilePosition' | 'emptyTileLetter' | 'firstPieceLocation' | 'firstWord';

export interface WordSolution {
  theme: string;
  words: string[];
  greeting?: string;
}

export interface UserSettings {
  themeOverride?: string;
  highContrastMode?: boolean;
}