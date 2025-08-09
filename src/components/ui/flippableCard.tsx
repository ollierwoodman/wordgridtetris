import { cn } from '@sglara/cn';
import React, { type MouseEventHandler } from 'react';

interface FlippableCardProps {
  frontContent: React.ReactNode;
  backContent: React.ReactNode;
  isFlipped: boolean;
  onClick: MouseEventHandler<HTMLDivElement>;
  className?: string;
  frontClassName?: string;
  backClassName?: string;
}

const FlippableCard: React.FC<FlippableCardProps> = ({
  frontContent,
  backContent,
  isFlipped = false,
  className = '',
  onClick,
  frontClassName = '',
  backClassName = '',
}) => {
  return (
    <div
      className={cn("relative w-full p-2 md:p-4 [perspective:1000px] select-none", className)}
      onClick={onClick}
    >
      <div
        className={cn(
          "relative w-full h-full duration-1000 [transform-style:preserve-3d]",
          isFlipped ? "[transform:rotateY(180deg)]" : ""
        )}
      >
        {/* Front of card */}
        <div
          className={cn(
            "absolute w-full h-full [backface-visibility:hidden] rounded-full bg-gray-600 dark:bg-gray-800 shadow-xl/20 dark:shadow-xl/40 text-white flex items-center justify-center p-4 cursor-pointer",
            isFlipped ? "opacity-0" : "opacity-100",
            frontClassName
          )}
        >
          {frontContent}
        </div>

        {/* Back of card */}
        <div
          className={cn(
            "absolute w-full h-full [backface-visibility:hidden] rounded-full bg-gray-600 dark:bg-gray-800 shadow-xl/20 dark:shadow-xl/40 text-white flex items-center justify-center p-4 [transform:rotateY(180deg)]",
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