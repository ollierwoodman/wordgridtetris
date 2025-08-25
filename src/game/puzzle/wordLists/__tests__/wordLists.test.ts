import { describe, test, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import type { WordSolution } from '../../../../types/game';

// Helper function to read and parse JSON files
function readJsonFile(filePath: string): WordSolution[] {
  const fullPath = path.join(process.cwd(), filePath);
  const fileContent = fs.readFileSync(fullPath, 'utf-8');
  return JSON.parse(fileContent) as WordSolution[];
}

describe('Word Lists Validation', () => {
  // Test each solution size from 5x5 to 8x8
  [5, 6, 7].forEach(solutionSize => {
    const strSolutionSize = solutionSize.toString();

    describe(`${strSolutionSize}x${strSolutionSize} Solution`, () => {
      const checkedPath = `public/solutions/${strSolutionSize}x${strSolutionSize}/words/checked.json`;
      const fullPath = path.join(process.cwd(), checkedPath);
      const wordLists = readJsonFile(checkedPath);

      console.log(`Found ${(wordLists.length).toString()} word lists for ${strSolutionSize}x${strSolutionSize}`);

      test(`checked.json should exist for ${strSolutionSize}x${strSolutionSize}`, () => {
        expect(fs.existsSync(fullPath), 
          `Missing checked.json file for ${strSolutionSize}x${strSolutionSize} grid`)
          .toBe(true);
      });

      const minThemesNeeded = 50;
      test(`checked.json should have at least ${minThemesNeeded.toString()} themes for ${strSolutionSize}x${strSolutionSize}`, () => {
        expect(wordLists.length,
          `checked.json should have at least ${minThemesNeeded.toString()} themes for ${strSolutionSize}x${strSolutionSize} grid`)
          .toBeGreaterThanOrEqual(minThemesNeeded);
      });

      test(`checked.json words should have length of ${strSolutionSize}`, () => {
        wordLists.forEach((theme: { theme: string; words: string[] }) => {
          theme.words.forEach(word => {
            expect(word.length, 
              `Word "${word}" in theme "${theme.theme}" should be ${strSolutionSize} characters long`)
              .toBe(solutionSize);
          });
        });
      });

      const maxThemeStringLength = 20;
      test(`each theme should have a maximum length of ${maxThemeStringLength.toString()} characters`, () => {
        wordLists.forEach((theme: { theme: string; words: string[] }) => {
          expect(theme.theme.length,
            `Theme "${theme.theme}" in checked.json should have a maximum length of ${maxThemeStringLength.toString()} characters`)
            .toBeLessThanOrEqual(maxThemeStringLength);
        });
      });

      test(`each theme should have enough words for a ${strSolutionSize}x${strSolutionSize} puzzle`, () => {
        const minWordsNeeded = solutionSize; // Minimum words needed equals grid size
        wordLists.forEach((theme: { theme: string; words: string[] }) => {
          expect(theme.words.length,
            `Theme "${theme.theme}" in checked.json should have at least ${minWordsNeeded.toString()} words`)
            .toBeGreaterThanOrEqual(minWordsNeeded);
        });
      });
    });
  });
}); 