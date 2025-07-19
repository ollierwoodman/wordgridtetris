import { describe, test, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

// Helper function to read and parse JSON files
function readJsonFile(filePath: string) {
  const fullPath = path.join(process.cwd(), filePath);
  const fileContent = fs.readFileSync(fullPath, 'utf-8');
  return JSON.parse(fileContent);
}

describe('Word Lists Validation', () => {
  // Test each solution size from 5x5 to 8x8
  [5, 6, 7].forEach(solutionSize => {
    describe(`${solutionSize}x${solutionSize} Solution`, () => {
      const checkedPath = `public/solutions/${solutionSize}x${solutionSize}/words/checked.json`;
      const fullPath = path.join(process.cwd(), checkedPath);

      test(`checked.json should exist for ${solutionSize}x${solutionSize}`, () => {
        expect(fs.existsSync(fullPath), 
          `Missing checked.json file for ${solutionSize}x${solutionSize} grid`)
          .toBe(true);
      });

      const minThemesNeeded = 10;
      test(`checked.json should have at least ${minThemesNeeded} themes for ${solutionSize}x${solutionSize}`, () => {
        const checkedWords = readJsonFile(checkedPath);
        expect(checkedWords.length,
          `checked.json should have at least ${minThemesNeeded} themes for ${solutionSize}x${solutionSize} grid`)
          .toBeGreaterThanOrEqual(minThemesNeeded);
      });

      test(`checked.json words should have length of ${solutionSize}`, () => {
        const checkedWords = readJsonFile(checkedPath);
        
        checkedWords.forEach((theme: { theme: string; words: string[] }) => {
          theme.words.forEach(word => {
            expect(word.length, 
              `Word "${word}" in theme "${theme.theme}" should be ${solutionSize} characters long`)
              .toBe(solutionSize);
          });
        });
      });

      test(`each theme should have enough words for a ${solutionSize}x${solutionSize} puzzle`, () => {
        const minWordsNeeded = solutionSize; // Minimum words needed equals grid size
        const checkedWords = readJsonFile(checkedPath);
        
        checkedWords.forEach((theme: { theme: string; words: string[] }) => {
          expect(theme.words.length,
            `Theme "${theme.theme}" in checked.json should have at least ${minWordsNeeded} words`)
            .toBeGreaterThanOrEqual(minWordsNeeded);
        });
      });
    });
  });
}); 