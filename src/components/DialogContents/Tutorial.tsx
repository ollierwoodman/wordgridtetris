import {
  EyeOffIcon,
  HeartIcon,
  KeyboardIcon,
  SmartphoneIcon,
  TrophyIcon,
} from "lucide-react";
import { Game } from "../../game/logic";
import { useShowTutorial } from "../../hooks/useLocalStorage";
import { useGameSounds } from "../../hooks/sounds";

interface TutorialProps {
  game?: Game;
  onClose?: () => void;
}

const Tutorial: React.FC<TutorialProps> = ({ game, onClose }) => {
  const [, setShowTutorial] = useShowTutorial();
  const { playMenuClick } = useGameSounds();

  const handleDontShowAgain = () => {
    playMenuClick();
    setShowTutorial(false);
    onClose?.();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-row gap-2 items-center text-lg font-bold dark:text-gray-200">
        <TrophyIcon />
        <h3>Objective</h3>
      </div>
      <p className="text-gray-800 dark:text-gray-300">
        Drag and drop the {game?.getNumPieces() ?? 6} game pieces into the{" "}
        {game?.getSolutionSize() ?? 9}x{game?.getSolutionSize() ?? 9} grid in
        the center to form {game?.getSolutionSize() ?? 5} horizontal words.
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
        Each of the {game?.getSolutionSize() ?? 5} words in the puzzle's
        solution are related to a common theme which can be revealed by using
        hints
      </p>
      {game?.getEmptyTilePositions() &&
        game.getEmptyTilePositions().length > 0 && (
          <p className="text-gray-800 dark:text-gray-300">
            There is {game.getEmptyTilePositions().length} empty tile
            {game.getEmptyTilePositions().length > 1 ? "s" : ""} on the grid.
            The tile{game.getEmptyTilePositions().length > 1 ? "s" : ""} also
            take the place of an unknown letter in a word.
          </p>
        )}
      <p className="text-gray-800 dark:text-gray-300">
        The pieces are already in the correct orientation, so you don't need to
        rotate them
      </p>

      {/* Don't show again button */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={handleDontShowAgain}
          className="cursor-pointer flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
        >
          <EyeOffIcon className="size-4" />
          Don't show this again
        </button>
      </div>
    </div>
  );
};

export default Tutorial;
