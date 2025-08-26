import React from "react";
import { cn } from "@sglara/cn";
import { getPieceColor, getTileState } from "../utils/game";
import type { PlayingGridProps, TileState } from "../types/game";
import { useDragAndDrop } from "../hooks/useDragAndDrop";
import { CircleIcon, XIcon } from "lucide-react";

const ChengyuGrid: React.FC<PlayingGridProps> = ({
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

  function getTileClasses(tileState: TileState) {
    return cn(
      "relative aspect-square select-none touch-none text-white font-medium text-center rounded-[10%] bg-white dark:bg-gray-400 flex items-center justify-center",
      {
        "bg-gray-400/50 dark:bg-gray-600/50": !tileState.isInSolutionGrid,
        [`${getPieceColor(tileState.pieceIndex)} cursor-pointer`]:
          tileState.pieceIndex >= 0 &&
          (tileState.pieceIndex !== draggedPieceIndex || tileState.isGhost),
        "cursor-not-allowed": tileState.isLocked
          ? gameState.isCompleted
          : false,
        "bg-gray-800 dark:bg-gray-900 inset-shadow-sm inset-shadow-gray-200/75 dark:inset-shadow-gray-500/75":
          tileState.isEmptyTile,
        "ring-3 ring-green-500 dark:ring-green-700": tileState.isValid,
        "ring-3 ring-red-500 dark:ring-red-700": tileState.isValid === false,
      }
    );
  }

  return (
    <div
      id="playing-grid"
      ref={gridRef}
      className={cn(
        "grid gap-[2px] aspect-square relative max-h-screen max-w-screen select-none touch-none",
      )}
      style={{
        gridTemplateColumns: `repeat(${gridSize.toString()}, minmax(0, 1fr))`,
      }}
    >
      {Array.from({ length: gridSize * gridSize }).map((_, index) => {
        const x = index % gridSize;
        const y = Math.floor(index / gridSize);
        const tileState = getTileState({
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
            className={getTileClasses(tileState)}
            onClick={() => {
              handleTileClick(x, y);
            }}
            onPointerDown={
              canDrag
                ? (e) => {
                    handlePointerDown(pieceAtPosition.pieceIndex, x, y, e);
                  }
                : undefined
            }
          >
            {tileState.isValid === false && (
              <div className="absolute top-1/10 left-1/10 text-white w-full h-full">
                <XIcon className="size-1/5" />
              </div>
            )}
            {tileState.isValid === true && (
              <div className="absolute top-1/10 left-1/10 text-white w-full h-full">
                <CircleIcon className="size-1/5" />
              </div>
            )}
            {tileState.pieceIndex >= 0 &&
              (tileState.pieceIndex !== draggedPieceIndex ||
                tileState.isGhost) && (
                <>
                  {tileState.isSelected && tileState.isValid === undefined && (
                    <div className="absolute top-1/10 left-1/10 bg-white rounded-full w-1/5 h-1/5">
                      <span className="sr-only">Selected</span>
                    </div>
                  )}
                  {tileState.letter && (
                    <span className="text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl leading-0">
                      {tileState.letter}
                    </span>
                  )}
                </>
              )}
            {tileState.isEmptyTile && (
              <>
                <span className="text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl leading-0">
                  {tileState.letter}
                </span>
                <div className="absolute top-1/10 left-1/10 text-white w-full h-full">
                  <LockIcon className="size-1/5" />
                </div>
              </>
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

export default ChengyuGrid;
