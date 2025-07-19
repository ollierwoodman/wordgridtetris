import { describe, test, expect } from 'vitest';
import { SPECIAL_DATE_WORD_LISTS } from '../specialDates';

describe('Special Date Word Lists', () => {
  describe('Structure', () => {
    test('should have valid date keys in MM-DD format', () => {
      const dateKeys = Object.keys(SPECIAL_DATE_WORD_LISTS);
      
      dateKeys.forEach(dateKey => {
        const [month, day] = dateKey.split('-').map(Number);
        expect(month).toBeGreaterThanOrEqual(1);
        expect(month).toBeLessThanOrEqual(12);
        expect(day).toBeGreaterThanOrEqual(1);
        expect(day).toBeLessThanOrEqual(31);
      });
    });

    test('each date should have an array of solutions', () => {
      Object.values(SPECIAL_DATE_WORD_LISTS).forEach(solutions => {
        expect(Array.isArray(solutions)).toBe(true);
        solutions.forEach(solution => {
          expect(solution).toHaveProperty('greeting');
          expect(solution).toHaveProperty('wordSolutions');
          expect(typeof solution.greeting).toBe('string');
          expect(solution.greeting.length).toBeGreaterThan(0);
        });
      });
    });
  });

  describe('Word Solutions', () => {
    test('word solutions should be valid for supported grid sizes', () => {
      Object.values(SPECIAL_DATE_WORD_LISTS).forEach(solutions => {
        solutions.forEach(solution => {
          Object.entries(solution.wordSolutions).forEach(([size, wordList]) => {
            const gridSize = Number(size);
            expect([5, 6, 7]).toContain(gridSize); // Only valid grid sizes
            
            if (wordList.length > 0) {
              wordList.forEach(wordSolution => {
                expect(wordSolution).toHaveProperty('theme');
                expect(wordSolution).toHaveProperty('words');
                expect(Array.isArray(wordSolution.words)).toBe(true);
                
                // Check word lengths match grid size
                wordSolution.words.forEach(word => {
                  if (word.length > 0) { // Skip empty strings
                    expect(word.length).toBe(gridSize);
                  }
                });
              });
            }
          });
        });
      });
    });
  });

  describe('Special Days Coverage', () => {
    test('each holiday should have a unique greeting', () => {
      const greetings = new Set();
      Object.values(SPECIAL_DATE_WORD_LISTS).forEach(solutions => {
        solutions.forEach(solution => {
          expect(greetings.has(solution.greeting)).toBe(false);
          greetings.add(solution.greeting);
        });
      });
    });
  });

  describe('Content Validation', () => {
    test('words should only contain valid characters', () => {
      Object.values(SPECIAL_DATE_WORD_LISTS).forEach(solutions => {
        solutions.forEach(solution => {
          Object.values(solution.wordSolutions).forEach(wordList => {
            wordList.forEach(wordSolution => {
              wordSolution.words.forEach(word => {
                if (word.length > 0) {
                  expect(word).toMatch(/^[A-Za-z]+$/); // Only uppercase or lowercase letters
                }
              });
            });
          });
        });
      });
    });

    test('themes should be non-empty strings', () => {
      Object.values(SPECIAL_DATE_WORD_LISTS).forEach(solutions => {
        solutions.forEach(solution => {
          Object.values(solution.wordSolutions).forEach(wordList => {
            wordList.forEach(wordSolution => {
              expect(typeof wordSolution.theme).toBe('string');
              expect(wordSolution.theme.length).toBeGreaterThan(0);
            });
          });
        });
      });
    });
  });
});
