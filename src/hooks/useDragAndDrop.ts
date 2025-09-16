import { useState, useRef, useEffect, useCallback } from "react";
import type { Game } from "../game/logic";
import type { Piece } from "../types/game";
import { useGameSounds } from "./useSounds";

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
    // Prevent dragging the first piece if its hint location is revealed (locked)
    if (game.getHintState().firstPieceLocation && pieceIndex === 0) {
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
    // Set initial drag position to current piece position so ghost appears immediately
    setDragPosition({ x: gameState.pieces[pieceIndex].x, y: gameState.pieces[pieceIndex].y });
    setIsValidDrop(true); // Initial position is always valid
    document.body.style.cursor = 'grabbing';
    document.body.classList.add('overflow-hidden', 'touch-none');
  }, [game, gameState.pieces, isCompleted]);

  // Helper function to find closest valid position within grace region
  const findClosestValidPosition = useCallback((event: PointerEvent, pieceIndex: number) => {
    if (!gridRef.current || draggedBlockIndex === null) return null;
    
    const rect = gridRef.current.getBoundingClientRect();
    const tileSize = rect.width / game.getGridSize();
    const pointerX = event.clientX - rect.left;
    const pointerY = event.clientY - rect.top;
    const graceRadius = tileSize * 1.5;
    
    const piece = gameState.pieces[pieceIndex];
    const draggedBlock = piece.blocks[draggedBlockIndex];
    
    let closestPosition = null;
    let closestDistance = Infinity;
    
    // Search all positions within the grace region
    const gridSize = game.getGridSize();
    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        // First check if piece would be fully within bounds (fast check)
        let inBounds = true;
        for (const block of piece.blocks) {
          const blockX = x + block.x;
          const blockY = y + block.y;
          if (blockX < 0 || blockX >= gridSize || blockY < 0 || blockY >= gridSize) {
            inBounds = false;
            break;
          }
        }
        
        // Only proceed if bounds are valid and move is valid
        if (inBounds && game.isValidMove(pieceIndex, x, y)) {
          // Calculate where the dragged block would be positioned
          const draggedBlockX = x + draggedBlock.x;
          const draggedBlockY = y + draggedBlock.y;
          
          // Calculate pixel distance to dragged block center
          const draggedBlockCenterX = (draggedBlockX + 0.5) * tileSize;
          const draggedBlockCenterY = (draggedBlockY + 0.5) * tileSize;
          const distance = Math.sqrt(
            Math.pow(pointerX - draggedBlockCenterX, 2) + 
            Math.pow(pointerY - draggedBlockCenterY, 2)
          );
          
          // Check if within grace region
          if (distance <= graceRadius && distance < closestDistance) {
            closestDistance = distance;
            closestPosition = { x, y };
          }
        }
      }
    }
    
    return closestPosition;
  }, [game, gameState.pieces, draggedBlockIndex]);

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
    const rawX = cursorTileX - block.x;
    const rawY = cursorTileY - block.y;

    // Check if the raw position would be fully within bounds
    let inBounds = true;
    for (const block of piece.blocks) {
      const blockX = rawX + block.x;
      const blockY = rawY + block.y;
      if (blockX < 0 || blockX >= game.getGridSize() || blockY < 0 || blockY >= game.getGridSize()) {
        inBounds = false;
        break;
      }
    }

    // Determine final position (exact or grace region)
    let finalPosition = { x: rawX, y: rawY };
    let isValid = inBounds && game.isValidMove(draggedPieceIndex, rawX, rawY);
    
    // If raw position is invalid, try grace region
    if (!isValid) {
      const gracePosition = findClosestValidPosition(event, draggedPieceIndex);
      if (gracePosition) {
        finalPosition = gracePosition;
        isValid = true;
      }
    }

    if (dragPosition && (dragPosition.x !== finalPosition.x || dragPosition.y !== finalPosition.y)) {
      playDragClick();
    }

    setDragPosition(finalPosition);
    setIsValidDrop(isValid);
  }, [draggedPieceIndex, draggedBlockIndex, game, gameState.pieces, dragPosition, playDragClick, findClosestValidPosition]);

  const handlePointerUp = useCallback((event?: PointerEvent) => {
    if (draggedPieceIndex !== null && dragPosition && gridRef.current) {
      // Always check collision and bounds on drop
      const piece = gameState.pieces[draggedPieceIndex];
      let inBounds = true;
      for (const block of piece.blocks) {
        const blockX = dragPosition.x + block.x;
        const blockY = dragPosition.y + block.y;
        if (blockX < 0 || blockX >= game.getGridSize() || blockY < 0 || blockY >= game.getGridSize()) {
          inBounds = false;
          break;
        }
      }
      
      const isValidMove = game.isValidMove(draggedPieceIndex, dragPosition.x, dragPosition.y);

      let finalPosition = null;
      
      if (inBounds && isValidMove) {
        finalPosition = dragPosition;
      } else {
        // Try grace region if we have pointer coordinates
        if (event) {
          finalPosition = findClosestValidPosition(event, draggedPieceIndex);
        }
      }
      
      if (finalPosition) {
        // Check if piece is moving to a new position
        const isNewPosition = !originalPosition || 
          finalPosition.x !== originalPosition.x || 
          finalPosition.y !== originalPosition.y;
        
        if (isNewPosition) {
          playDropSuccess();
          game.incrementNumMoves();
        }
        
        game.setPiecePosition(draggedPieceIndex, finalPosition.x, finalPosition.y);
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
  }, [draggedPieceIndex, dragPosition, game, gameState.pieces, originalPosition, updateGameState, playDropSuccess, playDropFail, findClosestValidPosition]);

  // Attach global listeners for pointer move/up
  useEffect(() => {
    if (draggedPieceIndex !== null) {
      const move = (e: PointerEvent) => {
        e.preventDefault();
        handlePointerMove(e);
      };
      const up = (e: PointerEvent) => {
        e.preventDefault();
        handlePointerUp(e);
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