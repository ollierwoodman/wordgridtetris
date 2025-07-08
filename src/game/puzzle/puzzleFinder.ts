// GRID_SIZE should be the only constant you need to change to generate new solutions
const GRID_SIZE = 8;
// ==================================================================================

const HAS_EMPTY_TILE = (GRID_SIZE * GRID_SIZE) % 4 === 1;
const NUM_PIECES = (GRID_SIZE * GRID_SIZE - (HAS_EMPTY_TILE ? 1 : 0)) / 4;
const NUM_PIECE_COMBOS = 50; // 62 unique piece combos for 6x6 grid
const MAX_NUM_SOLUTIONS_PER_COMBO = 100;
const TIME_LIMIT_PER_PIECE_COMBO_MS = 60000; // 60 seconds per combo

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

// Bitboard helpers for up to 8x8 grid
function getBitIndex(x: number, y: number): number {
  return y * GRID_SIZE + x;
}

function canPlaceBitboard(grid: bigint, placement: PiecePlacement): boolean {
  const shape = TETRIS_PIECE_SHAPES[placement.pieceIndex][placement.rotation];
  for (const block of shape) {
    const gx = placement.x + block.x;
    const gy = placement.y + block.y;
    if (gx < 0 || gx >= GRID_SIZE || gy < 0 || gy >= GRID_SIZE) {
      return false;
    }
    const bit = 1n << BigInt(getBitIndex(gx, gy));
    if ((grid & bit) !== 0n) return false;
  }
  return true;
}

function placePieceBitboard(grid: bigint, placement: PiecePlacement): bigint {
  const shape = TETRIS_PIECE_SHAPES[placement.pieceIndex][placement.rotation];
  let newGrid = grid;
  for (const block of shape) {
    const gx = placement.x + block.x;
    const gy = placement.y + block.y;
    const bit = 1n << BigInt(getBitIndex(gx, gy));
    newGrid |= bit;
  }
  return newGrid;
}

// Helper to check if all empty regions are fillable (size % 4 == 0), except for up to NUM_EMPTY_TILES regions of size 1
function checkFillableRegions(grid: bigint): boolean {
  // Track which cells have been visited during flood fill
  const visited = new Set<number>();

  const regionSizes = [];

  // Iterate over every cell in the grid
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      const cellIndex = getBitIndex(x, y);
      const cellBit = 1n << BigInt(cellIndex);

      // Skip if this cell is filled or already visited
      if ((grid & cellBit) !== 0n) continue;
      if (visited.has(cellIndex)) continue;

      // Begin a new flood fill for this region
      let regionSize = 0;
      const stack: [number, number][] = [[x, y]];
      visited.add(cellIndex);

      // Perform flood fill (DFS)
      while (stack.length > 0) {
        const [currentX, currentY] = stack.pop()!;
        regionSize++;

        // Check all four neighbors (up, down, left, right)
        const neighbors: [number, number][] = [
          [currentX, currentY - 1], // up
          [currentX, currentY + 1], // down
          [currentX - 1, currentY], // left
          [currentX + 1, currentY], // right
        ];

        for (const [nx, ny] of neighbors) {
          // Skip out-of-bounds neighbors
          if (nx < 0 || nx >= GRID_SIZE || ny < 0 || ny >= GRID_SIZE) continue;
          const neighborIndex = getBitIndex(nx, ny);
          const neighborBit = 1n << BigInt(neighborIndex);
          // If neighbor is empty and not visited, add to stack
          if ((grid & neighborBit) === 0n && !visited.has(neighborIndex)) {
            visited.add(neighborIndex);
            stack.push([nx, ny]);
          }
        }
      }

      regionSizes.push(regionSize);
    }
  }

  // only one hole is allowed on odd grid sizes, no holes are allowed on even grid sizes
  const holeCount = regionSizes.filter((size) => size === 1).length;
  if (holeCount > (HAS_EMPTY_TILE ? 1 : 0)) return false;

  // check that there are no regions with size of 2 or 3
  if (regionSizes.some((size) => size === 2 || size === 3)) return false;

  // get regions whose size is not a multiple of 4
  const nonFourMultipleRegions = regionSizes.filter((size) => size % 4 !== 0);

  // if there are more than 1 such region, return false
  if (nonFourMultipleRegions.length > 1) return false;

  // if there are exactly 1 such region, check that it has a remainder of 1 when divided by 4
  if (nonFourMultipleRegions.length === 1) {
    if (nonFourMultipleRegions[0] % 4 !== 1) return false;
  }

  // All regions are fillable
  return true;
}

// Backtracking search
function findSolutions(
  piecesToUse: number[],
  placements: PiecePlacement[][],
  grid: bigint,
  piecesUsed: boolean[],
  solution: PiecePlacement[],
  solutions: Solution[],
  maxSolutions: number = 100,
  depth: number = 0,
  startTime: number,
  timeLimitMs: number
) {
  // Abort if time limit exceeded
  if (Date.now() - startTime > timeLimitMs) {
    return;
  }

  // Flood fill region size check: all regions must be size % 4 == 0, except for up to NUM_EMPTY_TILES single holes
  if (!checkFillableRegions(grid)) {
    return;
  }

  if (solution.length === NUM_PIECES) {
    // Check for exactly one empty tile
    const emptyTiles = [];
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const bit = 1n << BigInt(getBitIndex(x, y));
        if ((grid & bit) === 0n) emptyTiles.push({ x, y });
      }
    }
    if (emptyTiles.length === (HAS_EMPTY_TILE ? 1 : 0)) {
      emptyTiles.forEach((emptyTile) => {
        solution.push({
          pieceIndex: -1,
          rotation: 0,
          x: emptyTile.x,
          y: emptyTile.y,
        });
      });
      solutions.push(JSON.parse(JSON.stringify(solution)));
      logWithTime(`FOUND a new solution! (total: ${solutions.length})`);
      for (let i = 0; i < (HAS_EMPTY_TILE ? 1 : 0); i++) {
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
      if (canPlaceBitboard(grid, placement)) {
        const newGrid = placePieceBitboard(grid, placement);
        piecesUsed[i] = true;
        solution.push(placement);
        findSolutions(
          piecesToUse,
          placements,
          newGrid,
          piecesUsed,
          solution,
          solutions,
          maxSolutions,
          depth + 1,
          startTime,
          timeLimitMs
        );
        solution.pop();
        piecesUsed[i] = false;
        // No need to remove piece from bitboard, just use previous grid value
        if (solutions.length >= maxSolutions) {
          return;
        }
      }
    }
  }
}

// Randomly pick pieces for a puzzle with constraints
function pickRandomPieces(numPieces: number, random: SeededRandom): number[] {
  const pieceTypes = [0, 1, 2, 3, 4, 5, 6, 2, 3, 4, 5, 6]; // Final picks can only have up to one I and one O, and at least 3 unique types
  switch (numPieces) {
    case 6: // 5x5
      break;
    case 9: // 6x6
      break;
    case 12: // 7x7
      pieceTypes.push(...[0, 3, 4]); // add the possibility for up to 2 I and/or 3 S and/or Z pieces as these do not make the puzzle too much easier
      break;
    case 16: // 8x8
      pieceTypes.push(...pieceTypes); // add the possibility for up to 2 I and/or 3 S and/or Z pieces as these do not make the puzzle too much easier
      break;
    case 20: // 9x9
      pieceTypes.push(...pieceTypes);
      break;
    default:
      throw new Error(`Unsupported grid size: ${GRID_SIZE}`);
  }

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

function logWithTime(...args: unknown[]) {
  const now = new Date().toLocaleTimeString();
  console.log(`[${now}]`, ...args);
}

function main() {
  logWithTime("Starting puzzle finder...");
  logWithTime("GRID_SIZE", GRID_SIZE);
  logWithTime("NUM_PIECES", NUM_PIECES);
  logWithTime("NUM_EMPTY_TILES", HAS_EMPTY_TILE);
  logWithTime("NUM_PIECE_COMBOS", NUM_PIECE_COMBOS);
  logWithTime("MAX_NUM_SOLUTIONS_PER_COMBO", MAX_NUM_SOLUTIONS_PER_COMBO);
  logWithTime("TIME_LIMIT_PER_PIECE_COMBO_MS", TIME_LIMIT_PER_PIECE_COMBO_MS);

  const seed = "givemecombos";
  logWithTime("Using seed:", seed);
  const randomHelper = SeededRandom.fromString(seed);

  // Use random pieces with constraints
  const pieceCombos = getUniquePieceCombos(NUM_PIECE_COMBOS, randomHelper);
  logWithTime(`Generated ${NUM_PIECE_COMBOS} piece combos`);

  logWithTime("Precomputing placements...");
  // Precompute all placements for each piece
  const placements: PiecePlacement[][] = [];
  for (let i = 0; i < TETRIS_PIECE_SHAPES.length; i++) {
    placements[i] = getAllPlacementsForPiece(i);
  }

  const PUBLIC_SOLUTIONS_DIR = `./public/solutions/${GRID_SIZE}x${GRID_SIZE}/pieces`;
  const GAME_SOLUTIONS_DIR = `./src/game/puzzle/numPieceSolutions`;

  let totalNumSolutions = 0;
  for (let comboIdx = 0; comboIdx < pieceCombos.length; comboIdx++) {
    const pieceCombo = pieceCombos[comboIdx];
    logWithTime(
      `Processing piece combo ${comboIdx + 1}/${pieceCombos.length}:`,
      pieceCombo
    );
    const startCombo = Date.now();
    // Order pieces by number of placements (fewest first)
    const pieceComboSorted = [...pieceCombo].sort(
      (a, b) => placements[a].length - placements[b].length
    );
    const gridState = 0n;
    const piecesUsed = Array(NUM_PIECES).fill(false);
    const solution: PiecePlacement[] = [];
    const solutions: Solution[] = [];
    findSolutions(
      pieceComboSorted,
      placements,
      gridState,
      piecesUsed,
      solution,
      solutions,
      MAX_NUM_SOLUTIONS_PER_COMBO,
      0,
      startCombo,
      TIME_LIMIT_PER_PIECE_COMBO_MS
    );
    logWithTime(
      `Found ${solutions.length} solutions for combo ${comboIdx + 1}`
    );
    solutions.forEach((solution, index) => {
      fs.writeFileSync(
        `${PUBLIC_SOLUTIONS_DIR}/${index + totalNumSolutions}.json`,
        JSON.stringify(solution, null, 2),
        "utf-8"
      );
    });
    totalNumSolutions += solutions.length;
    fs.writeFileSync(
      `${GAME_SOLUTIONS_DIR}/${GRID_SIZE}x${GRID_SIZE}.ts`,
      `export const TOTAL_NUM_SOLUTIONS_${GRID_SIZE}x${GRID_SIZE} = ${totalNumSolutions};`,
      "utf-8"
    );
    const endCombo = Date.now();
    logWithTime(
      `Finished combo ${comboIdx + 1} in ${(endCombo - startCombo) / 1000}s`
    );
  }
  logWithTime(`Wrote ${totalNumSolutions} solutions to JSON files`);
}
main();
