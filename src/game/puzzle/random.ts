import type { PieceSolutionEntry, WordSolution } from "../../types/game";
import { SeededRandom } from "../../utils/random";
import { createUrl } from "../../utils/game";
import { TOTAL_NUM_SOLUTIONS_6x6 } from "./numPieceSolutions/6x6";
import { TOTAL_NUM_SOLUTIONS_5x5 } from "./numPieceSolutions/5x5";
import { TOTAL_NUM_SOLUTIONS_7x7 } from "./numPieceSolutions/7x7";
import { TOTAL_NUM_SOLUTIONS_8x8 } from "./numPieceSolutions/8x8";
import { getDateSlug, SPECIAL_DATE_WORD_LISTS } from "./wordLists/specialDates";

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

function getRandomSpecialDateWordList(solutionSize: number, randomHelper: SeededRandom): WordSolution | null {
  const dateSlug = getDateSlug(new Date());

  const currentDateEntries = SPECIAL_DATE_WORD_LISTS[dateSlug];
  if (!currentDateEntries) {
    return null;
  }

  const currentDateEntryIndex = randomHelper.randInt(0, currentDateEntries.length - 1);

  const currentDateEntry = currentDateEntries[currentDateEntryIndex];
  if (!currentDateEntry.wordSolutions[solutionSize]) {
    return null;
  }

  const currentSolutionSizeCurrentDateWordListIndex = randomHelper.randInt(0, currentDateEntry.wordSolutions[solutionSize].length - 1);
  const wordSolution = currentDateEntry.wordSolutions[solutionSize][currentSolutionSizeCurrentDateWordListIndex];
  wordSolution.greeting = currentDateEntry.greeting;
  return wordSolution;
}

export async function fetchRandomWordSolution(solutionSize: number, seed: string): Promise<WordSolution> {
  const randomHelper = SeededRandom.fromString(seed);

  let solution = getRandomSpecialDateWordList(solutionSize, randomHelper);

  // If no special date word list is found, fetch a random word solution from the checked.json file
  if (solution === null) {
    const res = await fetch(createUrl(`solutions/${solutionSize}x${solutionSize}/words/checked.json`));
    const data = await res.json();
    solution = data[randomHelper.randInt(0, data.length - 1)] as WordSolution;
  }

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
