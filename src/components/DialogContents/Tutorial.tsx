import {
  HeartIcon,
  KeyboardIcon,
  MouseIcon,
  SmartphoneIcon,
} from "lucide-react";
import { Game } from "../../game/logic";
import { AnimatedPuzzleDemo } from "../../utils/svg";

interface TutorialProps {
  game?: Game;
}

const Tutorial: React.FC<TutorialProps> = ({ game }) => {
    return (
    <div className="space-y-4">
      <p className="text-gray-800 dark:text-gray-300">
        Drag and drop the {game?.getNumPieces() ?? 6} game pieces into the{" "}
        {game?.getSolutionSize() ?? 9}x{game?.getSolutionSize() ?? 9} grid in
        the center to form {game?.getSolutionSize() ?? 5} horizontal words.
      </p>
      
      <div className="flex justify-center items-center w-full px-16 rounded-lg">
        <AnimatedPuzzleDemo className="w-full h-full bg-gray-300 dark:bg-gray-800 object-contain text-gray-400/50 dark:text-gray-600/50 p-2 rounded-lg" />
      </div>

      <div className="flex flex-row gap-2 items-center text-lg font-bold dark:text-gray-200">
        <SmartphoneIcon />
        <MouseIcon />
        <h3>Touch/mouse controls</h3>
      </div>
      <p className="text-gray-800 dark:text-gray-300">
        Move pieces by tapping, dragging and dropping them.
      </p>
      <div className="flex flex-row gap-2 items-center text-lg font-bold dark:text-gray-200">
        <KeyboardIcon />
        <h3>Keyboard controls</h3>
      </div>
      <p className="text-gray-800 dark:text-gray-300">
        Use the spacebar to cycle through the pieces and the arrow keys to move pieces around.
      </p>

      <div className="flex flex-row gap-2 items-center text-lg font-bold dark:text-gray-200">
        <HeartIcon />
        <h3>Tips</h3>
      </div>
      <p className="text-gray-800 dark:text-gray-300">
        Each of the {game?.getSolutionSize() ?? 5} words in the puzzle's
        solution are related to a common theme
      </p>
      {game?.getEmptyTilePositions() &&
        game.getEmptyTilePositions().length > 0 && (
          <p className="text-gray-800 dark:text-gray-300">
            There is {game.getEmptyTilePositions().length} empty tile
            {game.getEmptyTilePositions().length > 1 ? "s" : ""} on the grid.
            The tile's letter is revealed when the puzzle is solved
          </p>
        )}
      <p className="text-gray-800 dark:text-gray-300">
        The pieces are already in the correct orientation, so you don't need to
        rotate them
      </p>
    </div>
  );
};

export default Tutorial;
