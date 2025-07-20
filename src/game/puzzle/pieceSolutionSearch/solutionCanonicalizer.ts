import { TETRIS_PIECE_SHAPES } from "../../pieceDefs.ts";
import type { Solution } from "../../../types/game.ts";

// Function to get a canonical string representation of a solution
// This will be the same for solutions that are equivalent but have pieces in different order
export function getCanonicalString(solution: Solution, gridSize: number): string {
  // Create a grid representation
  const grid = Array.from<unknown, number[]>({ length: gridSize }, () => Array.from<unknown, number>({ length: gridSize }, () => -1));
  
  // Fill grid with piece indices
  for (const placement of solution) {
    if (placement.pieceIndex === -1) continue; // Skip empty tiles
    const shape = TETRIS_PIECE_SHAPES[placement.pieceIndex][placement.rotation];
    for (const block of shape) {
      const x = placement.x + block.x;
      const y = placement.y + block.y;
      grid[y][x] = placement.pieceIndex;
    }
  }
  
  // Convert grid to string
  const rows: string[] = [];
  for (let y = 0; y < gridSize; y++) {
    const row: string[] = [];
    for (let x = 0; x < gridSize; x++) {
      row.push(grid[y][x].toString().padStart(2, '0'));
    }
    rows.push(row.join(','));
  }
  return rows.join('|');
} 