import React from "react";
import { cn } from "@sglara/cn";
import { getPieceColor, getTileContent } from "../utils/game";
import type { PlayingGridProps, TileContent } from "../types/game";
import { useDragAndDrop } from "../hooks/useDragAndDrop";

const PlayingGrid: React.FC<PlayingGridProps> = ({
  game,
  gameState,
  updateGameState,
  handleTileClick,
}) => {
  const {
    draggedPieceIndex,
    dragPosition,
    isValidDrop,
    gridRef,
    handlePointerDown,
  } = useDragAndDrop({
    game,
    gameState,
    updateGameState,
    isCompleted: gameState.isCompleted,
  });

  const gridSize = game.getGridSize();

  function getTileClasses(tileContent: TileContent) {
    return cn(
      "relative aspect-square select-none touch-none text-white font-bold text-center rounded-[10%] bg-white dark:bg-gray-400 flex items-center justify-center",
      {
        "ring-4 ring-green-400": tileContent.isValid,
        "ring-4 ring-red-400": tileContent.isValid === false,
        "shadow-xl/30 dark:shadow-xl/0": tileContent.isInSolutionGrid,
        "bg-gray-400/50 dark:bg-gray-600/50": !tileContent.isInSolutionGrid,
        [`${getPieceColor(tileContent.pieceIndex)} cursor-pointer`]:
          tileContent.pieceIndex >= 0,
        "cursor-not-allowed": tileContent.isLocked
          ? gameState.isCompleted
          : false,
        "bg-gray-800 dark:bg-gray-900 inset-shadow-sm inset-shadow-gray-200/75 dark:inset-shadow-gray-500/75":
          tileContent.isEmptyTile,
        "z-10 opacity-50": tileContent.isGhost,
      }
    );
  }

  return (
    <div
      id="playing-grid"
      ref={gridRef}
      className={cn(
        "grid gap-[8px] aspect-square relative max-h-screen max-w-screen select-none touch-none",
        {
          "gap-[6px]": gridSize === 10,
          "gap-[4px]": gridSize === 11,
          "gap-[2px]": gridSize === 12,
          "gap-[0px]": gridSize > 12,
        }
      )}
      style={{
        gridTemplateColumns: `repeat(${gridSize.toString()}, minmax(0, 1fr))`,
      }}
    >
      {Array.from({ length: gridSize * gridSize }).map((_, index) => {
        const x = index % gridSize;
        const y = Math.floor(index / gridSize);
        const tileContent = getTileContent({
          x,
          y,
          draggedPieceIndex,
          dragPosition,
          isValidDrop,
          gameState,
          game,
        });
        const pieceAtPosition = game.getPieceAtPosition(x, y);
        const canDrag =
          pieceAtPosition &&
          draggedPieceIndex === null &&
          !gameState.isCompleted;
        return (
          <div
            key={index}
            className={getTileClasses(tileContent)}
            onClick={() => { handleTileClick(x, y); }}
            onPointerDown={
              canDrag
                ? (e) => { handlePointerDown(pieceAtPosition.pieceIndex, x, y, e); }
                : undefined
            }
          >
            {tileContent.isSelected && (
              <div className="absolute top-1/8 left-1/8 bg-white rounded-full w-1/8 h-1/8 flex items-center justify-center">
                <span className="sr-only">Selected</span>
              </div>
            )}
            {tileContent.isEmptyTile && (
              <div className="absolute top-1/8 left-1/8 text-white">
                <LockIcon />
              </div>
            )}
            {tileContent.letter && (
              <span className="text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl">
                {tileContent.letter}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};

const LockIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("size-1/4", className)}
    >
      <path
        fillRule="evenodd"
        d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z"
        clipRule="evenodd"
      />
    </svg>
  );
};

export default PlayingGrid;
