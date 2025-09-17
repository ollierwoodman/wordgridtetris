import { useGameSounds } from "../hooks/useSounds";
import { GOAL_IDS, useTrackMatomoGoalById } from "../hooks/useTrackGoals";
import type { Game } from "../game/logic";
import { useCallback, useReducer } from "react";
import type { HintType } from "../types/game";

interface HintContent {
  title: string;
  description: string;
}

const HINTS: Record<HintType, HintContent> = {
  theme: {
    title: "Theme",
    description: "Reveal the theme of the puzzle.",
  },
  emptyTilePosition: {
    title: "Empty Tile Position",
    description: "Reveal the position of the empty tile.",
  },
  emptyTileLetter: {
    title: "Empty Tile Letter",
    description: "Reveal the letter of the empty tile.",
  },
  firstPieceLocation: {
    title: "First Piece Location",
    description: "Reveal the location of the first piece.",
  },
  firstWord: {
    title: "First Word",
    description: "Reveal the first word.",
  },
};

interface HintsProps {
  game: Game;
}

export const Hints = ({
  game,
}: HintsProps) => {
  const { playHintReveal } = useGameSounds();
  const trackGoal = useTrackMatomoGoalById();
  const [, forceRerender] = useReducer((n: number) => n + 1, 0);

  const revealHint = useCallback(
    (hintType: HintType) => {
      switch (hintType) {
        case "theme":
          game.revealHintTheme();
          break;
        case "emptyTilePosition":
          game.revealHintEmptyTilePosition();
          break;
        case "emptyTileLetter":
          game.revealHintEmptyTileLetter();
          break;
        case "firstPieceLocation":
          game.revealHintFirstPieceLocation();
          break;
        case "firstWord":
          game.revealHintFirstWord();
          break;
        default:
          return;
      }
    },
    [game]
  );

  const handleHintReveal = useCallback(
    (hintType: HintType) => {
      revealHint(hintType);

      playHintReveal();
      trackGoal(GOAL_IDS.REVEALED_THEME);
      // Force a re-render so live hint values from `game` are reflected
      forceRerender();
    },
    [playHintReveal, trackGoal, revealHint]
  );

  return (
    <>
      {/* Use live state from game to avoid stale prop snapshot */}
      {game.getHintState().theme !== undefined && (
        <HintRow
          hintType="theme"
          game={game}
          onRevealHint={handleHintReveal}
          getHintValue={(game) => game.getHintTheme()}
        />
      )}
      {game.getHintState().emptyTilePosition !== undefined && (
        <HintRow
          hintType="emptyTilePosition"
          game={game}
          onRevealHint={handleHintReveal}
          getHintValue={(game) => {
            const position = game.getHintEmptyTilePosition();
            return position
              ? describeCoordinates(position.x, position.y)
              : null;
          }}
        />
      )}
      {game.getHintState().emptyTileLetter !== undefined && (
        <HintRow
          hintType="emptyTileLetter"
          game={game}
          onRevealHint={handleHintReveal}
          getHintValue={(game) => game.getHintEmptyTileLetter()}
        />
      )}
      <HintRow
        hintType="firstPieceLocation"
        game={game}
        onRevealHint={handleHintReveal}
        getHintValue={(game) => {
          const position = game.getHintFirstPieceLocation();
          return position
            ? describeCoordinates(position.x, position.y)
            : null;
        }}
      />
      <HintRow
        hintType="firstWord"
        game={game}
        onRevealHint={handleHintReveal}
        getHintValue={(game) => game.getHintFirstWord()}
      />
    </>
  );
};

interface HintRowProps {
  hintType: HintType;
  game: Game;
  onRevealHint: (hintType: HintType) => void;
  getHintValue: (game: Game) => string | null;
}

const HintRow = ({
  hintType,
  game,
  onRevealHint,
  getHintValue,
}: HintRowProps) => {
  const hintValue = getHintValue(game);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center dark:text-gray-200 w-full gap-4">
        <div className="flex flex-col">
          <h3 className="text-lg font-bold">{HINTS[hintType].title}</h3>
          <p className="text-gray-800 dark:text-gray-300">
            {HINTS[hintType].description}
          </p>
        </div>
      </div>
      <button
        type="button"
        title="Reveal hint"
        disabled={hintValue !== null}
        onClick={() => {
          onRevealHint(hintType);
        }}
        className="cursor-pointer rounded-full w-full bg-gray-200 text-gray-800 hover:opacity-80 px-4 py-2 disabled:bg-green-500 disabled:dark:bg-green-600 disabled:hover:opacity-100 disabled:cursor-not-allowed"
      >
        {hintValue ?? "Reveal hint"}
      </button>
    </div>
  );
};

const describeCoordinates = (x: number, y: number): string => {
  return `${getOrdinalString(x)} column, ${getOrdinalString(y)} row`;
};

const getOrdinalString = (x: number): string => {
  const xString = x.toString();
  const lastDigit = x % 10;
  const lastTwoDigits = x % 100;
  if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
    return `${xString}th`;
  }
  switch (lastDigit) {
    case 1:
      return `${xString}st`;
    case 2:
      return `${xString}nd`;
    case 3:
      return `${xString}rd`;
    default:
      return `${xString}th`;
  }
};