import type { PieceSolutionEntry, WordSolution } from "../../types/game";
import { SeededRandom } from "../../utils/random";
import { createUrl } from "../../utils/game";

const NUMBER_OF_PIECE_SOLUTIONS_BY_SOLUTION_SIZE: Record<number, number> = {
  5: 8800,
  6: 400,
};

export function getCurrentDateSeed() {
  const date = new Date();
  return `${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}`;
}

export async function fetchRandomWordSolution(solutionSize: number, seed: string = getCurrentDateSeed()): Promise<WordSolution> {
  const randomHelper = SeededRandom.fromString(seed);
  const res = await fetch(createUrl(`solutions/${solutionSize}x${solutionSize}/words/checked.json`));
  const data = await res.json();
  // Pick a random solution (array of 5 words)
  const solution = data[randomHelper.randInt(0, data.length - 1)] as WordSolution;
  solution.words = solution.words.map((word: string) => word.toUpperCase());
  solution.words = randomHelper.shuffle(solution.words);
  return solution;
}

export async function fetchRandomPieceSolution(solutionSize: number, seed: string = getCurrentDateSeed()): Promise<
  PieceSolutionEntry[]
> {
  const numAvailableSolutions = NUMBER_OF_PIECE_SOLUTIONS_BY_SOLUTION_SIZE[solutionSize]; // 0.json to [TOTAL_NUM_SOLUTIONS - 1].json
  const randomHelper = SeededRandom.fromString(seed);
  const index = randomHelper.randInt(0, numAvailableSolutions - 1);
  const res = await fetch(createUrl(`solutions/${solutionSize}x${solutionSize}/pieces/${index}.json`));
  const data = await res.json();
  return data;
}
