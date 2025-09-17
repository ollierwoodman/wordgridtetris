export type GameMode = "5x5" | "6x6" | "7x7" | "chengyu";

export interface GameModeConfig {
  mode: GameMode;
  solutionSize: number;
  displayName: string;
  description: string;
  urlPath: string;
}

export const GAME_MODES: Record<GameMode, GameModeConfig> = {
  "5x5": {
    mode: "5x5",
    solutionSize: 5,
    displayName: "5×5",
    description: "Beginner difficulty",
    urlPath: "/5x5",
  },
  "6x6": {
    mode: "6x6",
    solutionSize: 6,
    displayName: "6×6",
    description: "Intermediate difficulty",
    urlPath: "/6x6",
  },
  "7x7": {
    mode: "7x7",
    solutionSize: 7,
    displayName: "7×7",
    description: "Advanced difficulty",
    urlPath: "/7x7",
  },
  chengyu: {
    mode: "chengyu",
    solutionSize: 8,
    displayName: "成语",
    description: "Chinese idiom puzzle",
    urlPath: "/chengyu",
  },
  // endless: {
  //   mode: "endless",
  //   solutionSize: 6,
  //   displayName: "Endless",
  //   description: "Endless mode",
  //   urlPath: "/endless",
  // },
};

export const GAME_MODE_LIST: GameMode[] = [
  "5x5",
  "6x6",
  "7x7",
  // "endless",
  "chengyu",
];

export function getGameModeFromPath(path: string): GameMode | null {
  // Handle base path
  if (path === "/") {
    return "5x5";
  }

  // Remove leading slash
  const cleanPath = path.startsWith("/") ? path.substring(1) : path;

  // Find matching game mode
  for (const mode of Object.keys(GAME_MODES) as GameMode[]) {
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
