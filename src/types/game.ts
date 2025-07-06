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
  hintProgress: number; // 0-3: 0=no hints, 1=theme, 2=position, 3=letter
  isCompleted: boolean;
}

// UI types
export interface TileContent {
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
  emptyPosition: { x: number; y: number };
  emptyLetter: string;
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
}

export interface HintsProps {
  puzzleData?: PuzzleData;
  onHintRevealed?: (hintId: string) => void;
  game?: Game;
}

export interface WordSolution {
  theme: string;
  words: string[];
}

export interface UserSettings {
  themeOverride?: string;
  highContrastMode?: boolean;
}