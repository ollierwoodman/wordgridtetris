// Override grid size for this puzzle
const GRID_SIZE = 7; // 6x6 grid
const NUM_EMPTY_TILES = (GRID_SIZE * GRID_SIZE) % 4;
const NUM_PIECES = (GRID_SIZE * GRID_SIZE - NUM_EMPTY_TILES) / 4;
const NUM_PIECE_COMBOS = 1; // 62 unique piece combos for 6x6 grid
const MAX_NUM_SOLUTIONS_PER_COMBO = 5;

// import { TETRIS_PIECES } from './constants';
import { TETRIS_PIECE_SHAPES } from "../pieceDefs.ts";
// If you see a type error for 'fs', run: npm install --save-dev @types/node
import * as fs from "fs";
import type { PiecePlacement, Solution } from "../../types/game";
import { SeededRandom } from "../../utils/random.ts";

// Generate all possible placements for a piece
function getAllPlacementsForPiece(pieceIndex: number): PiecePlacement[] {
  const placements: PiecePlacement[] = [];
  const rotations = TETRIS_PIECE_SHAPES[pieceIndex].length;
  for (let rotationIndex = 0; rotationIndex < rotations; rotationIndex++) {
    const shape = TETRIS_PIECE_SHAPES[pieceIndex][rotationIndex];
    // Find bounds for placement
    let minX = 0,
      minY = 0,
      maxX = 0,
      maxY = 0;
    for (const block of shape) {
      if (block.x < minX) minX = block.x;
      if (block.y < minY) minY = block.y;
      if (block.x > maxX) maxX = block.x;
      if (block.y > maxY) maxY = block.y;
    }
    for (let x = -minX; x <= GRID_SIZE - (maxX + 1); x++) {
      for (let y = -minY; y <= GRID_SIZE - (maxY + 1); y++) {
        placements.push({ pieceIndex, rotation: rotationIndex, x, y });
      }
    }
  }
  return placements;
}

// Check if a piece can be placed
function canPlace(grid: number[][], placement: PiecePlacement): boolean {
  const shape = TETRIS_PIECE_SHAPES[placement.pieceIndex][placement.rotation];
  for (const block of shape) {
    const gx = placement.x + block.x;
    const gy = placement.y + block.y;
    if (
      gx < 0 ||
      gx >= GRID_SIZE ||
      gy < 0 ||
      gy >= GRID_SIZE ||
      grid[gy][gx] !== -1
    ) {
      return false;
    }
  }
  return true;
}

function placePiece(grid: number[][], placement: PiecePlacement) {
  const shape = TETRIS_PIECE_SHAPES[placement.pieceIndex][placement.rotation];
  for (const block of shape) {
    const gx = placement.x + block.x;
    const gy = placement.y + block.y;
    grid[gy][gx] = placement.pieceIndex;
  }
}

function removePiece(grid: number[][], placement: PiecePlacement) {
  const shape = TETRIS_PIECE_SHAPES[placement.pieceIndex][placement.rotation];
  for (const block of shape) {
    const gx = placement.x + block.x;
    const gy = placement.y + block.y;
    grid[gy][gx] = -1;
  }
}

// Backtracking search
function findSolutions(
  piecesToUse: number[],
  placements: PiecePlacement[][],
  grid: number[][],
  piecesUsed: boolean[],
  solution: PiecePlacement[],
  solutions: Solution[],
  maxSolutions: number = 100
) {
  if (solution.length === NUM_PIECES) {
    // Check for exactly one empty tile
    const emptyTiles = [];
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        if (grid[y][x] === -1) emptyTiles.push({ x, y });
      }
    }
    if (emptyTiles.length === NUM_EMPTY_TILES) {
      emptyTiles.forEach((emptyTile) => {
        solution.push({
          pieceIndex: -1,
          rotation: 0,
          x: emptyTile.x,
          y: emptyTile.y,
        });
      });
      solutions.push(JSON.parse(JSON.stringify(solution)));
      console.log(`${new Date().toLocaleTimeString()}: Found a new solution!`);
      for (let i = 0; i < NUM_EMPTY_TILES; i++) {
        solution.pop(); // Remove the empty tile for backtracking
      }
      if (solutions.length >= maxSolutions) return;
    }
  }
  if (solutions.length >= maxSolutions) return;

  // Try each unused piece
  for (let i = 0; i < piecesToUse.length; i++) {
    if (piecesUsed[i]) continue;
    const pieceIndex = piecesToUse[i];
    // Try each possible placement for this piece
    for (const placement of placements[pieceIndex]) {
      if (canPlace(grid, placement)) {
        placePiece(grid, placement);
        piecesUsed[i] = true;
        solution.push(placement);
        findSolutions(
          piecesToUse,
          placements,
          grid,
          piecesUsed,
          solution,
          solutions,
          maxSolutions
        );
        solution.pop();
        piecesUsed[i] = false;
        removePiece(grid, placement);
        if (solutions.length >= maxSolutions) return;
      }
    }
  }
}

// Randomly pick pieces for a puzzle with constraints
function pickRandomPieces(numPieces: number, random: SeededRandom): number[] {
  const pieceTypes = [0, 1, 2, 3, 4, 5, 6, 2, 3, 4, 5, 6]; // Final picks can only have up to one I and one O, and at least 3 unique types
  // Shuffle pieceTypes and pick the first numPieces
  return pieceTypes.sort(() => random.randFloat() - 0.5).slice(0, numPieces);
}

function getUniquePieceCombos(
  numCombos: number,
  random: SeededRandom
): number[][] {
  const maxAttempts = 1000;
  const pieceCombos: number[][] = [];
  const uniquePieceCombos = new Set<string>();
  for (let i = 0; i < maxAttempts; i++) {
    const newCombo = pickRandomPieces(NUM_PIECES, random);
    const comboString = newCombo.sort((a, b) => a - b).join("");
    if (!uniquePieceCombos.has(comboString)) {
      pieceCombos.push(newCombo);
      uniquePieceCombos.add(comboString);
    }
    if (pieceCombos.length >= numCombos) return pieceCombos;
  }
  throw new Error(
    `Only found ${pieceCombos.length}/${numCombos} unique piece combos, you can increase the max attempts to find more or decrease the number of required piece combos`
  );
}

// Main function
function main() {
  const seed = "givemecombos";
  const randomHelper = SeededRandom.fromString(seed);

  // Use random pieces with constraints
  const pieceCombos = getUniquePieceCombos(NUM_PIECE_COMBOS, randomHelper);
  console.log(`Generated ${NUM_PIECE_COMBOS} piece combos`);

  console.log("Precomputing placements...");
  // Precompute all placements for each piece
  const placements: PiecePlacement[][] = [];
  for (let i = 0; i < TETRIS_PIECE_SHAPES.length; i++) {
    placements[i] = getAllPlacementsForPiece(i);
  }

  const dir = `./public/solutions/${GRID_SIZE}x${GRID_SIZE}/pieces`;

  let totalNumSolutions = 0;
  for (const pieceCombo of pieceCombos) {
    // Initialize empty grid
    const gridState = Array.from({ length: GRID_SIZE }, () =>
      Array(GRID_SIZE).fill(-1)
    );
    const piecesUsed = Array(NUM_PIECES).fill(false);
    const solution: PiecePlacement[] = [];

    console.log(`Finding solutions for piece combo ${pieceCombo}...`);
    const solutions: Solution[] = [];

    findSolutions(
      pieceCombo,
      placements,
      gridState,
      piecesUsed,
      solution,
      solutions,
      MAX_NUM_SOLUTIONS_PER_COMBO
    );
    console.log(`Found ${solutions.length} solutions`);

    solutions.forEach((solution, index) => {
      fs.writeFileSync(
        `${dir}/${index + totalNumSolutions}.json`,
        JSON.stringify(solution, null, 2),
        "utf-8"
      );
    });
    console.log(`Wrote ${solutions.length} solutions to JSON files`);

    totalNumSolutions += solutions.length;
  }

  console.log(`Wrote ${totalNumSolutions} solutions to JSON files`);
  fs.writeFileSync(
    `${dir}/total.ts`,
    `export const TOTAL_NUM_SOLUTIONS = ${totalNumSolutions};`,
    "utf-8"
  );
}

main();
