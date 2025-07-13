import { useState, useRef, useEffect, useCallback } from "react";
import type { Game } from "../game/logic";
import type { Piece } from "../types/game";
import { useGameSounds } from "./sounds";

export function useDragAndDrop({ game, gameState, updateGameState, isCompleted }: {
  game: Game;
  gameState: { pieces: Piece[] };
  updateGameState: () => void;
  isCompleted: boolean;
}) {
  const [draggedPieceIndex, setDraggedPieceIndex] = useState<number | null>(null);
  const [dragPosition, setDragPosition] = useState<{ x: number; y: number } | null>(null);
  const [originalPosition, setOriginalPosition] = useState<{ x: number; y: number } | null>(null);
  const [isValidDrop, setIsValidDrop] = useState<boolean>(true);
  const [draggedBlockIndex, setDraggedBlockIndex] = useState<number | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);

  // Sound effects
  const { playDragClick, playDropSuccess, playDropFail } = useGameSounds();

  const handlePointerDown = useCallback((pieceIndex: number, x: number, y: number, event: React.PointerEvent) => {
    // Prevent dragging if game is completed
    if (isCompleted) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    // Prevent default behavior and set pointer capture
    event.preventDefault();
    event.stopPropagation();
    
    // Set pointer capture to ensure we get all pointer events
    if (event.currentTarget instanceof HTMLElement) {
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    
    setDraggedPieceIndex(null); // Reset before checking
    setDraggedBlockIndex(null);
    setOriginalPosition({ x: gameState.pieces[pieceIndex].x, y: gameState.pieces[pieceIndex].y });
    
    // Find which block in the piece is being dragged
    const piece = gameState.pieces[pieceIndex];
    let foundBlockIndex = -1;
    for (let i = 0; i < piece.blocks.length; i++) {
      if (piece.blocks[i].x + piece.x === x && piece.blocks[i].y + piece.y === y) {
        foundBlockIndex = i;
        break;
      }
    }
    
    if (foundBlockIndex === -1) {
      return;
    }
    
    setDraggedPieceIndex(pieceIndex);
    game.selectPiece(pieceIndex);
    setDraggedBlockIndex(foundBlockIndex);
    document.body.style.cursor = 'grabbing';
    document.body.classList.add('overflow-hidden', 'touch-none');
  }, [game, gameState.pieces, isCompleted]);

  const handlePointerMove = useCallback((event: PointerEvent) => {
    if (draggedPieceIndex === null || !gridRef.current || draggedBlockIndex === null) {
      return;
    }

    const rect = gridRef.current.getBoundingClientRect();
    const tileSize = rect.width / game.getGridSize();
    const cursorTileX = Math.floor(Math.min(Math.max(0, event.clientX - rect.left) / tileSize, game.getGridSize() - 1));
    const cursorTileY = Math.floor(Math.min(Math.max(0, event.clientY - rect.top) / tileSize, game.getGridSize() - 1));

    const piece = gameState.pieces[draggedPieceIndex];
    const block = piece.blocks[draggedBlockIndex];
    const x = cursorTileX - block.x;
    const y = cursorTileY - block.y;

    if (dragPosition?.x !== x || dragPosition?.y !== y) {
      playDragClick();
    }
    
    // Check if the piece would be fully within bounds
    let inBounds = true;
    for (let i = 0; i < piece.blocks.length; i++) {
      const blockX = x + piece.blocks[i].x;
      const blockY = y + piece.blocks[i].y;
      if (blockX < 0 || blockX >= game.getGridSize() || blockY < 0 || blockY >= game.getGridSize()) {
        inBounds = false;
        break;
      }
    }

    setDragPosition({ x, y });
    
    // Check if valid drop (in bounds and no collision)
    const isValid = inBounds && game.isValidMove(draggedPieceIndex, x, y);
    setIsValidDrop(isValid);
  }, [draggedPieceIndex, draggedBlockIndex, game, gameState.pieces, dragPosition, playDragClick]);

  const handlePointerUp = useCallback(() => {
    if (draggedPieceIndex !== null && dragPosition) {
      // Always check collision and bounds on drop
      const piece = gameState.pieces[draggedPieceIndex];
      let inBounds = true;
      for (let i = 0; i < piece.blocks.length; i++) {
        const blockX = dragPosition.x + piece.blocks[i].x;
        const blockY = dragPosition.y + piece.blocks[i].y;
        if (blockX < 0 || blockX >= game.getGridSize() || blockY < 0 || blockY >= game.getGridSize()) {
          inBounds = false;
          break;
        }
      }
      
      const isValidMove = game.isValidMove(draggedPieceIndex, dragPosition.x, dragPosition.y);

      if (inBounds && isValidMove) {
        playDropSuccess();
        game.setPiecePosition(draggedPieceIndex, dragPosition.x, dragPosition.y);
        updateGameState();
      } else if (originalPosition) {
        playDropFail();
        game.setPiecePosition(draggedPieceIndex, originalPosition.x, originalPosition.y);
        updateGameState();
      }
    }
    
    setDraggedPieceIndex(null);
    setDragPosition(null);
    setOriginalPosition(null);
    setIsValidDrop(true);
    setDraggedBlockIndex(null);
    document.body.style.cursor = '';
    document.body.classList.remove('overflow-hidden', 'touch-none');
  }, [draggedPieceIndex, dragPosition, game, gameState.pieces, originalPosition, updateGameState, playDropSuccess, playDropFail]);

  // Attach global listeners for pointer move/up
  useEffect(() => {
    if (draggedPieceIndex !== null) {
      const move = (e: PointerEvent) => {
        e.preventDefault();
        handlePointerMove(e);
      };
      const up = (e: PointerEvent) => {
        e.preventDefault();
        handlePointerUp();
      };
      
      window.addEventListener('pointermove', move);
      window.addEventListener('pointerup', up);
      
      return () => {
        window.removeEventListener('pointermove', move);
        window.removeEventListener('pointerup', up);
      };
    }
  }, [draggedPieceIndex, dragPosition, isValidDrop, handlePointerMove, handlePointerUp]);

  // Cleanup effect to remove dragging classes when component unmounts
  useEffect(() => {
    return () => {
      document.body.classList.remove('overflow-hidden', 'touch-none');
      document.body.style.cursor = '';
    };
  }, []);

  return {
    draggedPieceIndex,
    setDraggedPieceIndex,
    dragPosition,
    setDragPosition,
    originalPosition,
    setOriginalPosition,
    isValidDrop,
    setIsValidDrop,
    draggedBlockIndex,
    setDraggedBlockIndex,
    gridRef,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp
  };
} 