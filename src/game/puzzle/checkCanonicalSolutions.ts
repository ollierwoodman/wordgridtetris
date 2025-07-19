import * as fs from 'fs';
import path from 'path';
import type { Solution } from '../../types/game';

// Convert a solution to a canonical string representation
// This will be the same for solutions that are equivalent but have pieces in different order
function getCanonicalString(solution: Solution): string {
  // Create a grid representation
  const gridSize = 9; // Max grid size we support
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
  
  // Convert grid to string, only including the actual size used
  let minX = gridSize, minY = gridSize, maxX = 0, maxY = 0;
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      if (grid[y][x] !== -1) {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
  }
  
  // Build canonical string from the used portion of the grid
  const rows: string[] = [];
  for (let y = minY; y <= maxY; y++) {
    const row: string[] = [];
    for (let x = minX; x <= maxX; x++) {
      row.push(grid[y][x].toString().padStart(2, '0'));
    }
    rows.push(row.join(','));
  }
  return rows.join('|');
}

// Import piece definitions
import { TETRIS_PIECE_SHAPES } from '../pieceDefs';

function checkSolutions(size: number): void {
  const sizeStr = size.toString();
  const solutionsDir = path.join(process.cwd(), 'public', 'solutions', sizeStr + 'x' + sizeStr, 'pieces');
  
  try {
    // Get all solution files
    const files = fs.readdirSync(solutionsDir).filter(f => f.endsWith('.json'));
    console.log('Checking ' + files.length.toString() + ' solutions for ' + sizeStr + 'x' + sizeStr + ' grid...');
    
    // Map to store canonical forms
    const canonicalForms = new Map<string, string[]>();
    
    // Process each solution file
    for (const file of files) {
      const filePath = path.join(solutionsDir, file);
      const solution = JSON.parse(fs.readFileSync(filePath, 'utf-8')) as Solution;
      
      const canonicalString = getCanonicalString(solution);
      
      // Store file paths that have this canonical form
      const existing = canonicalForms.get(canonicalString) ?? [];
      existing.push(file);
      canonicalForms.set(canonicalString, existing);
    }
    
    // Report duplicates
    let hasDuplicates = false;
    for (const files of canonicalForms.values()) {
      if (files.length > 1) {
        hasDuplicates = true;
        console.log('\nFound ' + files.length.toString() + ' canonically equivalent solutions:');
        console.log(files.join(', '));
      }
    }
    
    if (!hasDuplicates) {
      console.log('\nNo canonical duplicates found in ' + sizeStr + 'x' + sizeStr + ' solutions!');
    }
    
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
      console.log('No solutions directory found for ' + sizeStr + 'x' + sizeStr);
    } else {
      console.error('Error processing ' + sizeStr + 'x' + sizeStr + ' solutions:', err);
    }
  }
}

// Check solutions for each grid size
function main(): void {
  const sizes = [5, 6, 7, 8];
  for (const size of sizes) {
    checkSolutions(size);
  }
}

main(); 