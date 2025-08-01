import type { PieceSolutionEntry, WordSolution } from "../../types/game";
import { SeededRandom } from "../../utils/random";
import { createUrl } from "../../utils/game";
import { TOTAL_NUM_SOLUTIONS_4x4 } from "./numPieceSolutions/4x4";
import { TOTAL_NUM_SOLUTIONS_6x6 } from "./numPieceSolutions/6x6";
import { TOTAL_NUM_SOLUTIONS_5x5 } from "./numPieceSolutions/5x5";
import { TOTAL_NUM_SOLUTIONS_7x7 } from "./numPieceSolutions/7x7";
import { getDateSlug, SPECIAL_DATE_WORD_LISTS } from "./wordLists/specialDates";

const NUMBER_OF_PIECE_SOLUTIONS_BY_SOLUTION_SIZE: Record<number, number> = {
  4: TOTAL_NUM_SOLUTIONS_4x4,
  5: TOTAL_NUM_SOLUTIONS_5x5,
  6: TOTAL_NUM_SOLUTIONS_6x6,
  7: TOTAL_NUM_SOLUTIONS_7x7,
};

export function getCurrentDateSeed() {
  const date = new Date();
  const strYear = date.getFullYear().toString();
  const strMonth = (date.getMonth() + 1).toString();
  const strDay = date.getDate().toString();
  return `${strYear}${strMonth}${strDay}`;
}

function getRandomSpecialDateWordList(solutionSize: number, randomHelper: SeededRandom): WordSolution | null {
  const dateSlug = getDateSlug(new Date());
  const currentDateEntries = SPECIAL_DATE_WORD_LISTS[dateSlug];
  
  if (!Array.isArray(currentDateEntries) || currentDateEntries.length === 0) {
    return null;
  }

  const currentDateEntryIndex = randomHelper.randInt(0, currentDateEntries.length - 1);
  const currentDateEntry = currentDateEntries[currentDateEntryIndex];
  
  const solutionWords = currentDateEntry.wordSolutions[solutionSize];
  if (!Array.isArray(solutionWords) || solutionWords.length === 0) {
    return null;
  }

  const currentSolutionSizeCurrentDateWordListIndex = randomHelper.randInt(0, solutionWords.length - 1);
  const wordSolution = solutionWords[currentSolutionSizeCurrentDateWordListIndex];
  wordSolution.greeting = currentDateEntry.greeting;
  return wordSolution;
}

export async function fetchRandomWordSolution(solutionSize: number, seed: string): Promise<WordSolution> {
  const randomHelper = SeededRandom.fromString(seed);

  let solution = getRandomSpecialDateWordList(solutionSize, randomHelper);

  // If no special date word list is found, fetch a random word solution from the checked.json file
  if (solution === null) {
    const res = await fetch(createUrl(`solutions/${String(solutionSize)}x${String(solutionSize)}/words/checked.json`));
    const data = (await res.json()) as WordSolution[];
    solution = data[randomHelper.randInt(0, data.length - 1)];
  }

  solution.words = solution.words.map((word: string) => word.toUpperCase());
  solution.words = randomHelper.shuffle(solution.words).slice(0, solutionSize);
  return solution;
}

export async function fetchRandomPieceSolution(solutionSize: number, seed: string): Promise<PieceSolutionEntry[]> {
  const randomHelper = SeededRandom.fromString(seed);
  
  // Special case for 8x8: fetch 4 random 4x4 solutions and translate them
  if (solutionSize === 8) {
    return await fetchCombined4x4Solutions(randomHelper);
  }
  
  // Original logic for other sizes
  const numAvailableSolutions = NUMBER_OF_PIECE_SOLUTIONS_BY_SOLUTION_SIZE[solutionSize];
  const index = randomHelper.randInt(0, numAvailableSolutions - 1);
  const res = await fetch(createUrl(`solutions/${String(solutionSize)}x${String(solutionSize)}/pieces/${String(index)}.json`));
  const data = (await res.json()) as PieceSolutionEntry[];
  return data;
}

async function fetchCombined4x4Solutions(randomHelper: SeededRandom): Promise<PieceSolutionEntry[]> {
  const combinedSolution: PieceSolutionEntry[] = [];
  
  // Define quadrant offsets: [x_offset, y_offset]
  const quadrantOffsets = [
    [0, 0], // top-left
    [4, 0], // top-right
    [0, 4], // bottom-left
    [4, 4], // bottom-right
  ];
  
  // Fetch 4 random 4x4 solutions
  for (let quadrant = 0; quadrant < 4; quadrant++) {
    const numAvailable4x4Solutions = NUMBER_OF_PIECE_SOLUTIONS_BY_SOLUTION_SIZE[4];
    const index = randomHelper.randInt(0, numAvailable4x4Solutions - 1);
    const res = await fetch(createUrl(`solutions/4x4/pieces/${String(index)}.json`));
    const quadrantSolution = (await res.json()) as PieceSolutionEntry[];
    
    // Translate coordinates for this quadrant
    const [xOffset, yOffset] = quadrantOffsets[quadrant];
    const translatedSolution = quadrantSolution.map(placement => ({
      ...placement,
      x: placement.x + xOffset,
      y: placement.y + yOffset,
    }));
    
    combinedSolution.push(...translatedSolution);
  }
  
  return combinedSolution;
}
