import { HeartIcon, KeyboardIcon, SmartphoneIcon, TrophyIcon } from "lucide-react";

const Tutorial = () => {
  return (
    <div className="space-y-4">
      <div className="flex flex-row gap-2 items-center text-lg font-bold dark:text-gray-200">
        <TrophyIcon />
        <h3>Objective</h3>
      </div>
      <p className="text-gray-800 dark:text-gray-300">
        You must move the 6 game pieces around the grid and place them in the
        center 5x5 grid to form 5 words.
      </p>

      
      <div className="flex flex-row gap-2 items-center text-lg font-bold dark:text-gray-200">
        <SmartphoneIcon />
        <h3>Touch controls</h3>
      </div>
      <p className="text-gray-800 dark:text-gray-300">
        You can move the pieces around the grid by dragging and dropping them.
      </p>

      
      <div className="flex flex-row gap-2 items-center text-lg font-bold dark:text-gray-200">
        <KeyboardIcon />
        <h3>Keyboard controls</h3>
      </div>
      <p className="text-gray-800 dark:text-gray-300">
        You can move the pieces around the grid by clicking and dragging them.
      </p>
      <p className="text-gray-800 dark:text-gray-300">
        You can also use the arrow keys to move the pieces around the grid.
      </p>
      <p className="text-gray-800 dark:text-gray-300">
        You can click to select a piece to move or use the spacebar to cycle
        through them.
      </p>

      
      <div className="flex flex-row gap-2 items-center text-lg font-bold dark:text-gray-200">
        <HeartIcon />
        <h3>Tips</h3>
      </div>
        <p className="text-gray-800 dark:text-gray-300">
          Each of the five words in the puzzle's solution are related to a
          common theme which can be revealed by using hints
        </p>
        <p className="text-gray-800 dark:text-gray-300">
          One tile on the grid is empty, but you can reveal its position and
          letter by using hints
        </p>
        <p className="text-gray-800 dark:text-gray-300">
          The pieces are already in the correct orientation, so you don't need
          to rotate them
        </p>
    </div>
  );
};

export default Tutorial;
