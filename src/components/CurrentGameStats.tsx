import { useEffect, useState } from "react";
import { Clock12Icon, MoveIcon } from "lucide-react";
import type { Game } from "../game/logic";
import { formatDurationMs } from "../utils/game";
import { cn } from "@sglara/cn";

interface CurrentGameStatsProps {
  game: Game;
}

export const CurrentGameStats: React.FC<CurrentGameStatsProps> = ({ game }) => {
  const [elapsedMs, setElapsedMs] = useState<number>(game.getElapsedMs());

  useEffect(() => {
    // Initial tick
    setElapsedMs(game.getElapsedMs());

    if (game.isPuzzleCompleted()) {
      return;
    }

    const id = window.setInterval(() => {
      if (game.isPuzzleCompleted()) {
        setElapsedMs(game.getElapsedMs());
        window.clearInterval(id);
      } else {
        setElapsedMs(game.getElapsedMs());
      }
    }, 1000);

    return () => {
      window.clearInterval(id);
    };
  }, [game]);

  return (
    <div className="flex flex-row flex-wrap justify-center items-center gap-8 text-gray-600 dark:text-white text-sm md:text-base font-bold text-center text-balance">
      <p className="inline-flex items-center gap-2">
        <MoveIcon className="size-5 md:size-8" />
        {game.getNumMoves()}
      </p>
      <p className="inline-flex items-center gap-2">
        <Clock12Icon
          className={cn(
            "size-5 md:size-8 animate-spin",
            game.isPuzzleCompleted() && "animate-none"
          )}
        />
        {formatDurationMs(elapsedMs)}
      </p>
    </div>
  );
};

export default CurrentGameStats;
