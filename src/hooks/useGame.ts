import { useState, useEffect, useCallback } from "react";
import { Game } from "../game/logic";
import type { GameState } from "../types/game";
import { fetchRandomPieceSolution, fetchRandomWordSolution } from "../game/puzzle/random";
import { useGameSounds } from "./sounds";

export function useGame() {
  const [game, setGame] = useState<Game | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [loading, setLoading] = useState(true);
  
  const { playDragClick } = useGameSounds();

  const initializeGame = useCallback(async () => {
    setLoading(true);
    const [wordSolution, pieceSolution] = await Promise.all([
      fetchRandomWordSolution(),
      fetchRandomPieceSolution()
    ]);
    const newGame = new Game(wordSolution, pieceSolution);
    setGame(newGame);
    setGameState({
      grid: newGame.getGrid(),
      pieces: newGame.getPieces(),
      selectedPieceIndex: newGame.getSelectedPieceIndex(),
      hintProgress: newGame.getHintProgress(),
      isCompleted: newGame.isPuzzleCompleted()
    });
    setLoading(false);
  }, []);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  const updateGameState = useCallback(() => {
    if (!game) return;
    setGameState({
      grid: game.getGrid(),
      pieces: game.getPieces(),
      selectedPieceIndex: game.getSelectedPieceIndex(),
      hintProgress: game.getHintProgress(),
      isCompleted: game.isPuzzleCompleted()
    });
  }, [game]);

  const handleTileClick = useCallback((x: number, y: number) => {
    if (!game) return;
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
    if (!game) return;
    switch (event.key) {
      case 'ArrowLeft':
        if (game.movePiece(-1, 0)) {
          playDragClick();
        }
        break;
      case 'ArrowRight':
        if (game.movePiece(1, 0)) {
          playDragClick();
        }
        break;
      case 'ArrowUp':
        if (game.movePiece(0, -1)) {
          playDragClick();
        }
        break;
      case 'ArrowDown':
        if (game.movePiece(0, 1)) {
          playDragClick();
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
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const resetGame = useCallback(async () => {
    setLoading(true);
    const [wordSolution, pieceSolution] = await Promise.all([
      fetchRandomWordSolution(),
      fetchRandomPieceSolution()
    ]);
    if (game) {
      game.resetGame(wordSolution, pieceSolution);
      setGameState({
        grid: game.getGrid(),
        pieces: game.getPieces(),
        selectedPieceIndex: game.getSelectedPieceIndex(),
        hintProgress: game.getHintProgress(),
        isCompleted: game.isPuzzleCompleted()
      });
    } else {
      const newGame = new Game(wordSolution, pieceSolution);
      setGame(newGame);
              setGameState({
          grid: newGame.getGrid(),
          pieces: newGame.getPieces(),
          selectedPieceIndex: newGame.getSelectedPieceIndex(),
          hintProgress: newGame.getHintProgress(),
          isCompleted: newGame.isPuzzleCompleted()
        });
    }
    setLoading(false);
  }, [game]);

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
    resetGame,
    loading,
    solvePuzzle
  };
} 