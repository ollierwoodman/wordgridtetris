import { TOTAL_NUM_SOLUTIONS_4x4 } from "../game/puzzle/numPieceSolutions/4x4";
import { TOTAL_NUM_SOLUTIONS_5x5 } from "../game/puzzle/numPieceSolutions/5x5";
import { TOTAL_NUM_SOLUTIONS_6x6 } from "../game/puzzle/numPieceSolutions/6x6";
import { TOTAL_NUM_SOLUTIONS_7x7 } from "../game/puzzle/numPieceSolutions/7x7";

export interface GameModeConfig {
  mode: GameMode;
  wordSolutionsFilePath: string;
  wordSolutionsType: "themed" | "random";
  pieceSolutionsDirPath: string;
  numPieceSolutions: number;
  solutionSize: number;
  displayName: string;
  description: string;
  urlPath: string;
  seedPrefix: string;
  // Disabled modes keep their config and word lists but are unreachable: they are
  // hidden from the puzzle select and their urlPath resolves to the 404 page.
  enabled: boolean;
}

export const GAME_MODE_LIST = [
  "5x5",
  "6x6",
  "7x7",
  "chengyu",
  "fra-5x5",
  "fra-6x6",
  "fra-7x7",
  "ger-5x5",
  "ger-6x6",
  "ger-7x7",
  "rus-5x5",
  "rus-6x6",
  "rus-7x7",
  "spa-5x5",
  "spa-6x6",
  "spa-7x7",
  "vie-5x5",
] as const;

export type GameMode = typeof GAME_MODE_LIST[number];

export const GAME_MODES: Record<GameMode, GameModeConfig> = {
  "5x5": {
    mode: "5x5",
    wordSolutionsFilePath: "public/solutions/5x5/words/english_themed.json",
    wordSolutionsType: "themed",
    pieceSolutionsDirPath: "public/solutions/5x5/pieces/",
    numPieceSolutions: TOTAL_NUM_SOLUTIONS_5x5,
    solutionSize: 5,
    displayName: "English 5×5",
    description: "English 5×5",
    urlPath: "/5x5",
    seedPrefix: "eng5",
    enabled: true,
  },
  "6x6": {
    mode: "6x6",
    wordSolutionsFilePath: "public/solutions/6x6/words/english_themed.json",
    wordSolutionsType: "themed",
    pieceSolutionsDirPath: "public/solutions/6x6/pieces/",
    numPieceSolutions: TOTAL_NUM_SOLUTIONS_6x6,
    solutionSize: 6,
    displayName: "English 6×6",
    description: "English 6×6",
    urlPath: "/6x6",
    seedPrefix: "eng6",
    enabled: true,
  },
  "7x7": {
    mode: "7x7",
    wordSolutionsFilePath: "public/solutions/7x7/words/english_themed.json",
    wordSolutionsType: "themed",
    pieceSolutionsDirPath: "public/solutions/7x7/pieces/",
    numPieceSolutions: TOTAL_NUM_SOLUTIONS_7x7,
    solutionSize: 7,
    displayName: "English 7×7",
    description: "English 7×7",
    urlPath: "/7x7",
    seedPrefix: "eng7",
    enabled: true,
  },
  chengyu: {
    mode: "chengyu",
    wordSolutionsFilePath: "public/solutions/8x8/words/chengyu.json",
    wordSolutionsType: "random",
    pieceSolutionsDirPath: "public/solutions/4x4/pieces/",
    numPieceSolutions: TOTAL_NUM_SOLUTIONS_4x4,
    solutionSize: 8,
    displayName: "成语",
    description: "16 Chinese chengyus",
    urlPath: "/chengyu",
    seedPrefix: "chengyu",
    enabled: true,
  },
  // French
  "fra-5x5": {
    mode: "fra-5x5",
    wordSolutionsFilePath: "public/solutions/5x5/words/french_5_letters.json",
    wordSolutionsType: "random",
    pieceSolutionsDirPath: "public/solutions/5x5/pieces/",
    numPieceSolutions: TOTAL_NUM_SOLUTIONS_5x5,
    solutionSize: 5,
    displayName: "French 5×5",
    description: "French 5×5",
    urlPath: "/french-5x5",
    seedPrefix: "fr5",
    enabled: false,
  },
  "fra-6x6": {
    mode: "fra-6x6",
    wordSolutionsFilePath: "public/solutions/6x6/words/french_6_letters.json",
    wordSolutionsType: "random",
    pieceSolutionsDirPath: "public/solutions/6x6/pieces/",
    numPieceSolutions: TOTAL_NUM_SOLUTIONS_6x6,
    solutionSize: 6,
    displayName: "French 6×6",
    description: "French 6×6",
    urlPath: "/french-6x6",
    seedPrefix: "fr6",
    enabled: false,
  },
  "fra-7x7": {
    mode: "fra-7x7",
    wordSolutionsFilePath: "public/solutions/7x7/words/french_7_letters.json",
    wordSolutionsType: "random",
    pieceSolutionsDirPath: "public/solutions/7x7/pieces/",
    numPieceSolutions: TOTAL_NUM_SOLUTIONS_7x7,
    solutionSize: 7,
    displayName: "French 7×7",
    description: "French 7×7",
    urlPath: "/french-7x7",
    seedPrefix: "fr7",
    enabled: false,
  },
  // German
  "ger-5x5": {
    mode: "ger-5x5",
    wordSolutionsFilePath: "public/solutions/5x5/words/german_5_letters.json",
    wordSolutionsType: "random",
    pieceSolutionsDirPath: "public/solutions/5x5/pieces/",
    numPieceSolutions: TOTAL_NUM_SOLUTIONS_5x5,
    solutionSize: 5,
    displayName: "German 5×5",
    description: "German 5×5",
    urlPath: "/german-5x5",
    seedPrefix: "de5",
    enabled: false,
  },
  "ger-6x6": {
    mode: "ger-6x6",
    wordSolutionsFilePath: "public/solutions/6x6/words/german_6_letters.json",
    wordSolutionsType: "random",
    pieceSolutionsDirPath: "public/solutions/6x6/pieces/",
    numPieceSolutions: TOTAL_NUM_SOLUTIONS_6x6,
    solutionSize: 6,
    displayName: "German 6×6",
    description: "German 6×6",
    urlPath: "/german-6x6",
    seedPrefix: "de6",
    enabled: false,
  },
  "ger-7x7": {
    mode: "ger-7x7",
    wordSolutionsFilePath: "public/solutions/7x7/words/german_7_letters.json",
    wordSolutionsType: "random",
    pieceSolutionsDirPath: "public/solutions/7x7/pieces/",
    numPieceSolutions: TOTAL_NUM_SOLUTIONS_7x7,
    solutionSize: 7,
    displayName: "German 7×7",
    description: "German 7×7",
    urlPath: "/german-7x7",
    seedPrefix: "de7",
    enabled: false,
  },
  // Russian
  "rus-5x5": {
    mode: "rus-5x5",
    wordSolutionsFilePath: "public/solutions/5x5/words/russian_5_letters.json",
    wordSolutionsType: "random",
    pieceSolutionsDirPath: "public/solutions/5x5/pieces/",
    numPieceSolutions: TOTAL_NUM_SOLUTIONS_5x5,
    solutionSize: 5,
    displayName: "Russian 5×5",
    description: "Russian 5×5",
    urlPath: "/russian-5x5",
    seedPrefix: "ru5",
    enabled: false,
  },
  "rus-6x6": {
    mode: "rus-6x6",
    wordSolutionsFilePath: "public/solutions/6x6/words/russian_6_letters.json",
    wordSolutionsType: "random",
    pieceSolutionsDirPath: "public/solutions/6x6/pieces/",
    numPieceSolutions: TOTAL_NUM_SOLUTIONS_6x6,
    solutionSize: 6,
    displayName: "Russian 6×6",
    description: "Russian 6×6",
    urlPath: "/russian-6x6",
    seedPrefix: "ru6",
    enabled: false,
  },
  "rus-7x7": {
    mode: "rus-7x7",
    wordSolutionsFilePath: "public/solutions/7x7/words/russian_7_letters.json",
    wordSolutionsType: "random",
    pieceSolutionsDirPath: "public/solutions/7x7/pieces/",
    numPieceSolutions: TOTAL_NUM_SOLUTIONS_7x7,
    solutionSize: 7,
    displayName: "Russian 7×7",
    description: "Russian 7×7",
    urlPath: "/russian-7x7",
    seedPrefix: "ru7",
    enabled: false,
  },
  // Spanish
  "spa-5x5": {
    mode: "spa-5x5",
    wordSolutionsFilePath: "public/solutions/5x5/words/spanish_5_letters.json",
    wordSolutionsType: "random",
    pieceSolutionsDirPath: "public/solutions/5x5/pieces/",
    numPieceSolutions: TOTAL_NUM_SOLUTIONS_5x5,
    solutionSize: 5,
    displayName: "Spanish 5×5",
    description: "Spanish 5×5",
    urlPath: "/spanish-5x5",
    seedPrefix: "es5",
    enabled: false,
  },
  "spa-6x6": {
    mode: "spa-6x6",
    wordSolutionsFilePath: "public/solutions/6x6/words/spanish_6_letters.json",
    wordSolutionsType: "random",
    pieceSolutionsDirPath: "public/solutions/6x6/pieces/",
    numPieceSolutions: TOTAL_NUM_SOLUTIONS_6x6,
    solutionSize: 6,
    displayName: "Spanish 6×6",
    description: "Spanish 6×6",
    urlPath: "/spanish-6x6",
    seedPrefix: "es6",
    enabled: false,
  },
  "spa-7x7": {
    mode: "spa-7x7",
    wordSolutionsFilePath: "public/solutions/7x7/words/spanish_7_letters.json",
    wordSolutionsType: "random",
    pieceSolutionsDirPath: "public/solutions/7x7/pieces/",
    numPieceSolutions: TOTAL_NUM_SOLUTIONS_7x7,
    solutionSize: 7,
    displayName: "Spanish 7×7",
    description: "Spanish 7×7",
    urlPath: "/spanish-7x7",
    seedPrefix: "es7",
    enabled: false,
  },
  // Vietnamese
  "vie-5x5": {
    mode: "vie-5x5",
    wordSolutionsFilePath: "public/solutions/5x5/words/vietnamese_random.json",
    wordSolutionsType: "random",
    pieceSolutionsDirPath: "public/solutions/5x5/pieces/",
    numPieceSolutions: TOTAL_NUM_SOLUTIONS_5x5,
    solutionSize: 5,
    displayName: "Vietnamese 5×5",
    description: "Vietnamese 5×5",
    urlPath: "/vietnamese-5x5",
    seedPrefix: "vi5",
    enabled: false,
  },
};

// The modes players can actually reach. Prefer this over GAME_MODE_LIST anywhere
// modes are offered, counted or navigated to; GAME_MODE_LIST still covers every
// mode ever played, so historical stats keep resolving their display names.
export const ENABLED_GAME_MODE_LIST: GameMode[] = GAME_MODE_LIST.filter(
  (mode) => GAME_MODES[mode].enabled
);

export function isGameModeEnabled(mode: GameMode): boolean {
  return GAME_MODES[mode].enabled;
}

export function getGameModeFromPath(path: string): GameMode | null {
  // Handle base path
  if (path === "/") {
    return "5x5";
  }

  // Remove leading slash
  const cleanPath = path.startsWith("/") ? path.substring(1) : path;

  // Find matching game mode
  for (const mode of ENABLED_GAME_MODE_LIST) {
    const config = GAME_MODES[mode];
    if (config.urlPath === path || cleanPath === mode) {
      return mode;
    }
  }

  return null;
}

export function getGameModeConfig(mode: GameMode): GameModeConfig {
  return GAME_MODES[mode];
}

export function isValidGameMode(mode: string): mode is GameMode {
  return mode in GAME_MODES;
}
