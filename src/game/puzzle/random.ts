import type { PieceSolutionEntry, WordSolution } from "../../types/game";
import { SeededRandom } from "../../utils/random";
import { createUrl } from "../../utils/game";
import { TOTAL_NUM_SOLUTIONS_6x6 } from "./numPieceSolutions/6x6";
import { TOTAL_NUM_SOLUTIONS_5x5 } from "./numPieceSolutions/5x5";
import { TOTAL_NUM_SOLUTIONS_7x7 } from "./numPieceSolutions/7x7";
import { TOTAL_NUM_SOLUTIONS_8x8 } from "./numPieceSolutions/8x8";

const NUMBER_OF_PIECE_SOLUTIONS_BY_SOLUTION_SIZE: Record<number, number> = {
  5: TOTAL_NUM_SOLUTIONS_5x5,
  6: TOTAL_NUM_SOLUTIONS_6x6,
  7: TOTAL_NUM_SOLUTIONS_7x7,
  8: TOTAL_NUM_SOLUTIONS_8x8,
  // 9: TOTAL_NUM_SOLUTIONS_9x9,
};

export function getCurrentDateSeed() {
  const date = new Date();
  return `${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}`;
}

export async function fetchRandomWordSolution(solutionSize: number, seed: string): Promise<WordSolution> {
  const randomHelper = SeededRandom.fromString(seed);
  const res = await fetch(createUrl(`solutions/${solutionSize}x${solutionSize}/words/checked.json`));
  const data = await res.json();
  const solution = data[randomHelper.randInt(0, data.length - 1)] as WordSolution;
  solution.words = solution.words.map((word: string) => word.toUpperCase());
  solution.words = randomHelper.shuffle(solution.words).slice(0, solutionSize);
  return solution;
}

export async function fetchRandomPieceSolution(solutionSize: number, seed: string): Promise<
  PieceSolutionEntry[]
> {
  const numAvailableSolutions = NUMBER_OF_PIECE_SOLUTIONS_BY_SOLUTION_SIZE[solutionSize]; // 0.json to [TOTAL_NUM_SOLUTIONS - 1].json
  const randomHelper = SeededRandom.fromString(seed);
  const index = randomHelper.randInt(0, numAvailableSolutions - 1);
  const res = await fetch(createUrl(`solutions/${solutionSize}x${solutionSize}/pieces/${index}.json`));
  const data = await res.json();
  return data;
}
