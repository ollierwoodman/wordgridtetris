import React from 'react';
import { cn } from "@sglara/cn";
import { getPieceColor } from '../utils/game';
import type { GameMode } from '../types/gameMode';

interface NotFoundProps {
  setGameMode: (mode: GameMode) => void;
}

const NotFound: React.FC<NotFoundProps> = ({ setGameMode }) => {
  const tileClasses = "aspect-square select-none touch-none text-white font-bold text-center rounded-[10%] flex items-center justify-center w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28";

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-gray-300 dark:bg-gray-900 p-4">
      <div className="flex flex-col items-center justify-center">
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className={cn(tileClasses, getPieceColor(0))}>
            <span className="text-2xl md:text-3xl lg:text-4xl font-bold">4</span>
          </div>
          <div className={cn(tileClasses, getPieceColor(0))}>
            <span className="text-2xl md:text-3xl lg:text-4xl font-bold">0</span>
          </div>
          <div className={cn(tileClasses, getPieceColor(0))}>
            <span className="text-2xl md:text-3xl lg:text-4xl font-bold">4</span>
          </div>
        </div>
        <p className="text-gray-600 dark:text-gray-300 text-3xl font-bold mb-8">
          Page not found
        </p>
        <button
          className="rounded-full bg-gray-600 dark:bg-gray-800 shadow-xl/20 dark:shadow-xl/40 text-white text-xl flex items-center justify-center px-4 py-2 cursor-pointer hover:opacity-80 transition-opacity duration-200"
          onClick={() => {
            setGameMode('5x5');
          }}
        >
          Go to 5×5 Blockle
        </button>
      </div>
    </div>
  );
};

export default NotFound;