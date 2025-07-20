import * as fs from "fs";

export interface ProgressState {
  completedCombos: string[];  // Array of completed piece combinations (sorted and joined)
  totalSolutions: number;     // Total number of solutions found so far
  lastRun: string;           // ISO timestamp of last run
}

export function createProgressFile(gridSize: number): string {
  return `./src/game/puzzle/pieceSolutionSearch/${gridSize.toString()}x${gridSize.toString()}_progress.json`;
}

export function loadProgress(progressFile: string): ProgressState {
  try {
    if (fs.existsSync(progressFile)) {
      return JSON.parse(fs.readFileSync(progressFile, 'utf-8')) as ProgressState;
    }
  } catch (error) {
    console.error('Error loading progress file:', error);
  }
  return { completedCombos: [], totalSolutions: 0, lastRun: new Date().toISOString() };
}

export function saveProgress(progressFile: string, progress: ProgressState): void {
  try {
    // Ensure directory exists
    const dir = progressFile.substring(0, progressFile.lastIndexOf('/'));
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(progressFile, JSON.stringify(progress, null, 2));
  } catch (error) {
    console.error('Error saving progress file:', error);
  }
} 