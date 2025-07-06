import type { PieceSolutionEntry, WordSolution } from "../../types/game";
import { SeededRandom } from "../../utils/random";

function getCurrentDate() {
  const date = new Date();
  return `${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}`;
}

export async function fetchRandomWordSolution(): Promise<WordSolution> {
  const seed = `${getCurrentDate()}-word-solution`;
  const randomHelper = SeededRandom.fromString(seed);
  const res = await fetch("/solutions/words/checked.json");
  const data = await res.json();
  // Pick a random solution (array of 5 words)
  const solution = data[randomHelper.randInt(0, data.length - 1)] as WordSolution;
  solution.words = solution.words.map((word: string) => word.toUpperCase());
  solution.words = randomHelper.shuffle(solution.words);
  return solution;
}

export async function fetchRandomPieceSolution(): Promise<
  PieceSolutionEntry[]
> {
  const numAvailableSolutions = 8800; // 0.json to [TOTAL_NUM_SOLUTIONS - 1].json
  const seed = `${getCurrentDate()}-piece-solution`;
  const randomHelper = SeededRandom.fromString(seed);
  const index = randomHelper.randInt(0, numAvailableSolutions - 1);
  const res = await fetch(`/solutions/pieces/${index}.json`);
  const data = await res.json();
  return data;
}
  