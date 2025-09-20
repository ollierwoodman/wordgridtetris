import { describe, it, expect } from "vitest";
import { readFileSync, statSync, readdirSync } from "fs";
import { resolve, extname, join } from "path";
import { GAME_MODE_LIST, getGameModeConfig } from "../../types/gameMode";

function pathExists(pathStr: string): boolean {
	try {
		statSync(pathStr);
		return true;
	} catch {
		return false;
	}
}

function isStringArray(value: unknown): value is string[] {
	return Array.isArray(value) && value.every((v) => typeof v === "string");
}

function isThemedEntry(value: unknown): value is { theme: string; words: string[] } {
	if (typeof value !== "object" || value === null) return false;
	const maybe = value as { theme?: unknown; words?: unknown };
	return typeof maybe.theme === "string" && isStringArray(maybe.words);
}

describe("GAME_MODES solution assets", () => {
	for (const mode of GAME_MODE_LIST) {
		const cfg = getGameModeConfig(mode);

		describe(mode, () => {
			it("wordSolutionsFilePath exists and has expected content", () => {
				const abs = resolve(process.cwd(), cfg.wordSolutionsFilePath);
				expect(pathExists(abs)).toBe(true);

				const raw = readFileSync(abs, "utf-8");
				const parsed = JSON.parse(raw) as unknown;

				if (cfg.wordSolutionsType === "themed") {
					// themed files are JSON arrays of { theme, words: string[] }
					expect(Array.isArray(parsed)).toBe(true);
					const arr = parsed as unknown[];
					expect(arr.length).toBeGreaterThan(0);
					expect(isThemedEntry(arr[0])).toBe(true);
				} else if (cfg.mode === "chengyu") {
					// chengyu file is a JSON array of strings
					expect(isStringArray(parsed)).toBe(true);
					const arr = parsed as string[];
					expect(arr.length).toBeGreaterThan(0);
					expect(typeof arr[0]).toBe("string");
				} else {
					// other random types expected to be JSON arrays of strings
					expect(isStringArray(parsed)).toBe(true);
					const arr = parsed as string[];
					expect(arr.length).toBeGreaterThan(0);
					expect(typeof arr[0]).toBe("string");
				}
			});

      const strSolutionSize = cfg.solutionSize.toString();

			// Additional validations for themed word lists
			if (cfg.wordSolutionsType === "themed") {
				const fullPath = join(process.cwd(), cfg.wordSolutionsFilePath);
				const wordLists = JSON.parse(readFileSync(fullPath, "utf-8")) as { theme: string; words: string[] }[];

				const minThemesNeeded = 50;
				it(`should have at least ${String(minThemesNeeded)} themes`, () => {
					expect(wordLists.length, `wordSolutionsFilePath should have at least ${String(minThemesNeeded)} themes for mode ${mode}`).toBeGreaterThanOrEqual(minThemesNeeded);
				});

				it(`all words in each theme should have length of ${strSolutionSize}`, () => {
					wordLists.forEach((theme) => {
						theme.words.forEach((word) => {
							expect(word.length, `Word "${word}" in theme "${theme.theme}" should be ${strSolutionSize} characters long`).toBe(cfg.solutionSize);
						});
					});
				});

				const maxThemeStringLength = 20;
				it(`each theme name should have a maximum length of ${String(maxThemeStringLength)} characters`, () => {
					wordLists.forEach((theme) => {
						expect(theme.theme.length, `Theme name "${theme.theme}" should have a maximum length of ${String(maxThemeStringLength)} characters`).toBeLessThanOrEqual(maxThemeStringLength);
					});
				});

				it(`each theme should have enough words for a ${strSolutionSize}x${strSolutionSize} puzzle`, () => {
					const minWordsNeeded = cfg.solutionSize;
					wordLists.forEach((theme) => {
						expect(theme.words.length, `Theme "${theme.theme}" should contain at least ${String(minWordsNeeded)} words`).toBeGreaterThanOrEqual(minWordsNeeded);
					});
				});
        
			} else if (cfg.mode === "chengyu") {
				const chengyuList = JSON.parse(readFileSync(cfg.wordSolutionsFilePath, "utf-8")) as string[];

				it(`should be a JSON array of strings`, () => {
					const abs = resolve(process.cwd(), cfg.wordSolutionsFilePath);
					const raw = readFileSync(abs, "utf-8");
					const parsed = JSON.parse(raw) as unknown;
					expect(isStringArray(parsed)).toBe(true);
				});

				const minNumWordsNeeded = 50;
				it(`must have at least ${String(minNumWordsNeeded)} words`, () => {
					expect(chengyuList.length, `wordSolutionsFilePath should have at least ${String(minNumWordsNeeded)} words`).toBeGreaterThanOrEqual(minNumWordsNeeded);
				});

				it(`all chengyus should have length of 4`, () => {
					chengyuList.forEach((word) => {
						expect(word.length, `Chengyu "${word}" is not 4 characters long`).toBe(4);
					});
				});
      } else {
				const wordList = JSON.parse(readFileSync(cfg.wordSolutionsFilePath, "utf-8")) as string[];

				it(`wordSolutionsFilePath should be a JSON array of strings for mode ${mode}`, () => {
					const abs = resolve(process.cwd(), cfg.wordSolutionsFilePath);
					const raw = readFileSync(abs, "utf-8");
					const parsed = JSON.parse(raw) as unknown;
					expect(isStringArray(parsed)).toBe(true);
				});

				const minNumWordsNeeded = 50;
				it(`must have at least ${String(minNumWordsNeeded)} words`, () => {
					expect(wordList.length, `wordSolutionsFilePath should have at least ${String(minNumWordsNeeded)} words for mode ${mode}`).toBeGreaterThanOrEqual(minNumWordsNeeded);
				});

				it(`all words should have length of ${strSolutionSize}`, () => {
					wordList.forEach((word) => {
						expect(word.length, `Word "${word}" in wordSolutionsFilePath should be ${strSolutionSize} characters long`).toBe(cfg.solutionSize);
					});
				});
			}

			it("pieceSolutionsDirPath exists and contains JSON files (if any)", () => {
				const absDir = resolve(process.cwd(), cfg.pieceSolutionsDirPath);
				expect(pathExists(absDir)).toBe(true);
				const entries = readdirSync(absDir, { withFileTypes: true });
				const jsonFiles = entries
					.filter((e) => e.isFile() && extname(e.name).toLowerCase() === ".json")
					.map((e) => e.name);
				// Some directories may be empty in dev; if not empty, expect JSON presence
				if (entries.length > 0) {
					expect(jsonFiles.length).toBeGreaterThan(0);
				}
			});
		});
	}
});
