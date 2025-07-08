import { useState, useRef, useEffect, useCallback } from "react";
import type { Game } from "../game/logic";
import type { Piece } from "../types/game";
import { useGameSounds } from "./sounds";

// Add proper type definitions for touch events
interface TouchEvent extends Event {
  touches: TouchList;
  changedTouches: TouchList;
  targetTouches: TouchList;
}

interface TouchList {
  readonly length: number;
  item(index: number): Touch | null;
  [index: number]: Touch;
}

interface Touch {
  readonly identifier: number;
  readonly target: EventTarget;
  readonly clientX: number;
  readonly clientY: number;
  readonly pageX: number;
  readonly pageY: number;
  readonly radiusX: number;
  readonly radiusY: number;
  readonly rotationAngle: number;
  readonly force: number;
}

export function useDragAndDrop({ game, gameState, updateGameState }: {
  game: Game;
  gameState: { pieces: Piece[] };
  updateGameState: () => void;
}) {
  const [draggedPieceIndex, setDraggedPieceIndex] = useState<number | null>(null);
  const [dragPosition, setDragPosition] = useState<{ x: number; y: number } | null>(null);
  const [originalPosition, setOriginalPosition] = useState<{ x: number; y: number } | null>(null);
  const [isValidDrop, setIsValidDrop] = useState<boolean>(true);
  const [draggedBlockIndex, setDraggedBlockIndex] = useState<number | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);

  // Sound effects
  const { playDragClick, playDropSuccess, playDropFail } = useGameSounds();

  const handleDragStart = useCallback((pieceIndex: number, x: number, y: number, event: React.MouseEvent | React.TouchEvent) => {
    // Prevent default behavior for touch events to avoid mouse event synthesis and scrolling
    if (event.type === 'touchstart') {
      event.preventDefault();
    }
    event.stopPropagation();

    // playDragStart();
    
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
  }, [game, gameState.pieces]);

  const handleDragMove = useCallback((event: MouseEvent | TouchEvent) => {
    // Prevent default for touch events to avoid scrolling
    if ('touches' in event) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (draggedPieceIndex === null || !gridRef.current || draggedBlockIndex === null) {
      return;
    }

    let clientX: number, clientY: number;
    if ('touches' in event && event.touches.length > 0) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else if ('clientX' in event) {
      clientX = event.clientX;
      clientY = event.clientY;
    } else {
      clientX = 0;
      clientY = 0;
    }

    const rect = gridRef.current.getBoundingClientRect();
    const tileSize = rect.width / game.getGridSize();
    const cursorTileX = Math.floor(Math.min(Math.max(0, clientX - rect.left) / tileSize, game.getGridSize() - 1));
    const cursorTileY = Math.floor(Math.min(Math.max(0, clientY - rect.top) / tileSize, game.getGridSize() - 1));

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

  const handleDragEnd = useCallback((event?: MouseEvent | TouchEvent) => {
    // Prevent default for touch events
    if (event && 'touches' in event) {
      event.preventDefault();
      event.stopPropagation();
    }

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

  // Attach global listeners for drag move/end
  useEffect(() => {
    if (draggedPieceIndex !== null) {
      const move = (e: MouseEvent | TouchEvent) => {
        // Prevent scrolling during drag
        if ('touches' in e) {
          e.preventDefault();
          e.stopPropagation();
        }
        handleDragMove(e);
      };
      const up = (e: MouseEvent | TouchEvent) => {
        if ('touches' in e) {
          e.preventDefault();
          e.stopPropagation();
        }
        handleDragEnd(e);
      };
      
      window.addEventListener('mousemove', move);
      window.addEventListener('touchmove', move);
      window.addEventListener('mouseup', up);
      window.addEventListener('touchend', up);
      
      return () => {
        window.removeEventListener('mousemove', move);
        window.removeEventListener('touchmove', move);
        window.removeEventListener('mouseup', up);
        window.removeEventListener('touchend', up);
      };
    }
  }, [draggedPieceIndex, dragPosition, isValidDrop, handleDragMove, handleDragEnd]);

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
    handleDragStart,
    handleDragMove,
    handleDragEnd
  };
} 