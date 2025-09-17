import { useState, useEffect, useCallback } from "react";
import { Game } from "../game/logic";
import type { GameState } from "../types/game";
import { getSeedFromDate } from "../game/puzzle/random";
import { useGameSounds } from "./useSounds";
import type { GameMode } from "../types/gameMode";

export function useGame(mode?: GameMode, seed: string = getSeedFromDate()) {
  const [game, setGame] = useState<Game | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [loading, setLoading] = useState(true);
  
  const { playDragClick } = useGameSounds();

  const initializeGame = useCallback(async () => {
    // Don't initialize if mode is not provided
    if (mode === undefined) {
      setLoading(true);
      setGame(null);
      setGameState(null);
      return;
    }

    setLoading(true);
    // Reset gameState immediately to prevent completion effects from old state
    setGameState(null);
    
    const newGame = new Game(mode, seed);
    setGame(newGame);
    
    // Wait for the game to be fully initialized
    await newGame.waitForInitialization();
    
    setGameState({
      grid: newGame.getGrid(),
      pieces: newGame.getPieces(),
      selectedPieceIndex: newGame.getSelectedPieceIndex(),
      isCompleted: newGame.isPuzzleCompleted(),
      hintState: newGame.getHintState()
    });
    setLoading(false);
  }, [mode, seed]);

  useEffect(() => {
    void initializeGame();
  }, [initializeGame]);

  const updateGameState = useCallback(() => {
    if (!game) return;
    const isCompleted = game.isPuzzleCompleted();
    
    // If the puzzle is newly completed
    if (isCompleted) {
      game.setGameEndTime();
    }

    setGameState({
      grid: game.getGrid(),
      pieces: game.getPieces(),
      selectedPieceIndex: game.getSelectedPieceIndex(),
      isCompleted,
      hintState: game.getHintState()
    });
  }, [game]);

  const handleTileClick = useCallback((x: number, y: number) => {
    if (!game || game.isPuzzleCompleted()) return;
    const pieceAtPosition = game.getPieceAtPosition(x, y);
    if (pieceAtPosition) {
      game.selectPiece(pieceAtPosition.pieceIndex);
      updateGameState();
    } else {
      game.deselectPiece();
      updateGameState();
    }
  }, [game, updateGameState]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!game || game.isPuzzleCompleted()) return;
    switch (event.key) {
      case 'ArrowLeft':
        if (game.movePiece(-1, 0)) {
          playDragClick();
          game.incrementNumMoves()
        }
        break;
      case 'ArrowRight':
        if (game.movePiece(1, 0)) {
          playDragClick();
          game.incrementNumMoves()
        }
        break;
      case 'ArrowUp':
        if (game.movePiece(0, -1)) {
          playDragClick();
          game.incrementNumMoves()
        }
        break;
      case 'ArrowDown':
        if (game.movePiece(0, 1)) {
          playDragClick();
          game.incrementNumMoves()
        }
        break;
      case ' ': // Space bar
        {
          const pieces = game.getPieces();
          const current = game.getSelectedPieceIndex();
          const next = (current === null ? 0 : (current + 1) % pieces.length);
          game.selectPiece(next);
        }
        break;
      default:
        return;
    }
    updateGameState();
  }, [game, updateGameState, playDragClick]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const solvePuzzle = useCallback(() => {
    if (game) {
      game.solvePuzzle();
      updateGameState();
    }
  }, [game, updateGameState]);

  return {
    game,
    gameState,
    updateGameState,
    handleTileClick,
    handleKeyDown,
    loading,
    solvePuzzle,
  };
} 