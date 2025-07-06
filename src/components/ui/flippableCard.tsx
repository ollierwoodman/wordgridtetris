import { cn } from '@sglara/cn';
import React from 'react';

interface FlippableCardProps {
  frontContent: React.ReactNode;
  backContent: React.ReactNode;
  isFlipped?: boolean;
  onFlip?: () => void;
  className?: string;
  frontClassName?: string;
  backClassName?: string;
}

const FlippableCard: React.FC<FlippableCardProps> = ({
  frontContent,
  backContent,
  isFlipped = false,
  onFlip,
  className = '',
  frontClassName = '',
  backClassName = '',
}) => {
  return (
    <div
      className={cn("relative w-full h-24 [perspective:1000px]", className)}
      onClick={onFlip}
    >
      <div
        className={cn(
          "relative w-full h-full duration-500 [transform-style:preserve-3d]",
          isFlipped ? "[transform:rotateY(180deg)]" : ""
        )}
      >
        {/* Front of card */}
        <div
          className={cn(
            "absolute w-full h-full [backface-visibility:hidden] border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 shadow-md dark:shadow-gray-900/50 flex items-center justify-center p-4 cursor-pointer",
            isFlipped ? "opacity-0" : "opacity-100",
            frontClassName
          )}
        >
          {frontContent}
        </div>

        {/* Back of card */}
        <div
          className={cn(
            "absolute w-full h-full [backface-visibility:hidden] border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 shadow-md dark:shadow-gray-900/50 flex items-center justify-center p-4 [transform:rotateY(180deg)]",
            isFlipped ? "opacity-100" : "opacity-0",
            backClassName
          )}
        >
          {backContent}
        </div>
      </div>
    </div>
  );
};

export default FlippableCard; 