const GRID_SIZE = 4;
const NUM_PIECE_COMBOS = 166;
const MAX_NUM_UNIQUE_SOLUTIONS_PER_COMBO = 100;
const TIME_LIMIT_PER_PIECE_COMBO_MINS = 5;
// ==================================================================================

// Dependent constants
const HAS_EMPTY_TILE = (GRID_SIZE * GRID_SIZE) % 4 === 1;
const NUM_PIECES = (GRID_SIZE * GRID_SIZE - (HAS_EMPTY_TILE ? 1 : 0)) / 4;

// import { TETRIS_PIECES } from './constants';
import { TETRIS_PIECE_SHAPES } from "../../pieceDefs.ts";
// If you see a type error for 'fs', run: npm install --save-dev @types/node
import * as fs from "fs";
import type { PiecePlacement, Solution } from "../../../types/game.ts";
import { SeededRandom } from "../../../utils/random.ts";

// Import extracted modules
import { loadProgress, saveProgress } from "./progressTracker.ts";
import { checkFillableRegions } from "./regionValidator.ts";
import { getUniquePieceCombos } from "./pieceComboGenerator.ts";
import {
  getBitIndex,
  canPlaceBitboard,
  placePieceBitboard,
} from "./bitboardUtils.ts";
import { getCanonicalString } from "./solutionCanonicalizer.ts";

// Import optimization modules
import {
  isPlacementAllowed as isSymmetryAllowed,
  isLargePiece,
  isNearCornerOrEdge,
} from "./symmetryBreaking.ts";
import { getAllPlacementsForPieceOrdered } from "./placementOrdering.ts";
import { quickRegionCheck, hasEarlyDeadlock } from "./regionPruning.ts";

// Progress tracking
const PROGRESS_FILE = `./src/game/puzzle/pieceSolutionSearch/${GRID_SIZE.toString()}x${GRID_SIZE.toString()}_progress.json`;

// Function to check if a piece placement is allowed based on position restrictions
function isPlacementAllowed(placement: PiecePlacement, depth: number): boolean {
  // Use enhanced symmetry breaking constraints
  return (
    isSymmetryAllowed(placement, depth, GRID_SIZE) &&
    checkPieceSpecificConstraints(placement, depth)
  );
}

// Additional piece-specific constraints
function checkPieceSpecificConstraints(
  placement: PiecePlacement,
  depth: number
): boolean {
  // For early depths, apply stricter constraints on large pieces
  if (depth < 3 && isLargePiece(placement.pieceIndex)) {
    if (!isNearCornerOrEdge(placement.x, placement.y, GRID_SIZE)) {
      return false;
    }
  }
  return true;
}

// Generate all possible placements for a piece (strategically ordered)
function getAllPlacementsForPiece(pieceIndex: number): PiecePlacement[] {
  return getAllPlacementsForPieceOrdered(pieceIndex, GRID_SIZE);
}

// Backtracking search
function findSolutions(
  piecesToUse: number[],
  placements: PiecePlacement[][],
  grid: bigint,
  piecesUsed: boolean[],
  solution: PiecePlacement[],
  solutions: Solution[],
  canonicalSolutions: Set<string>,
  maxSolutions = 100,
  depth = 0,
  startTime: number,
  timeLimitMs: number,
  emptyTileCount = GRID_SIZE * GRID_SIZE // Start with all tiles empty
) {
  // Abort if time limit exceeded
  if (Date.now() - startTime > timeLimitMs) {
    return;
  }

  // NEW: Early deadlock detection for fast pruning
  if (hasEarlyDeadlock(grid, depth, GRID_SIZE)) {
    return;
  }

  // NEW: Use quick region check for early depths, full check for later depths
  const useQuickCheck = quickRegionCheck(grid, depth, NUM_PIECES, GRID_SIZE);
  if (useQuickCheck) {
    // Quick check passed, but we may need full check for deeper depths
    if (depth >= Math.floor(NUM_PIECES / 2)) {
      if (!checkFillableRegions(grid, GRID_SIZE, HAS_EMPTY_TILE)) {
        return;
      }
    }
  } else {
    // Quick check failed
    return;
  }

  if (solution.length === NUM_PIECES) {
    // Use tracked empty tile count instead of scanning grid
    if (emptyTileCount === (HAS_EMPTY_TILE ? 1 : 0)) {
      // If we need to add an empty tile, find its position
      if (HAS_EMPTY_TILE) {
        // We only need to scan once to find the single empty tile
        for (let y = 0; y < GRID_SIZE; y++) {
          for (let x = 0; x < GRID_SIZE; x++) {
            const bit = 1n << BigInt(getBitIndex(x, y, GRID_SIZE));
            if ((grid & bit) === 0n) {
              solution.push({
                pieceIndex: -1,
                rotation: 0,
                x,
                y,
              });
              break;
            }
          }
          if (solution[solution.length - 1]?.pieceIndex === -1) break;
        }
      }

      // Check if this solution is canonically unique
      const canonicalString = getCanonicalString(solution, GRID_SIZE);
      if (!canonicalSolutions.has(canonicalString)) {
        canonicalSolutions.add(canonicalString);
        solutions.push(JSON.parse(JSON.stringify(solution)) as Solution);
        logWithTime(
          `FOUND a new unique solution! (total: ${solutions.length.toString()})`
        );
      }

      // Remove empty tile for backtracking if we added one
      if (HAS_EMPTY_TILE) {
        solution.pop();
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
      if (
        canPlaceBitboard(grid, placement, depth, GRID_SIZE, isPlacementAllowed)
      ) {
        const newGrid = placePieceBitboard(grid, placement, GRID_SIZE);
        piecesUsed[i] = true;
        solution.push(placement);
        findSolutions(
          piecesToUse,
          placements,
          newGrid,
          piecesUsed,
          solution,
          solutions,
          canonicalSolutions,
          maxSolutions,
          depth + 1,
          startTime,
          timeLimitMs,
          emptyTileCount - 4 // Each piece covers exactly 4 tiles
        );
        solution.pop();
        piecesUsed[i] = false;
        if (solutions.length >= maxSolutions) {
          return;
        }
      }
    }
  }
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
  logWithTime(
    "MAX_NUM_SOLUTIONS_PER_COMBO",
    MAX_NUM_UNIQUE_SOLUTIONS_PER_COMBO
  );
  logWithTime("TIME_LIMIT_PER_PIECE_COMBO_MINS", TIME_LIMIT_PER_PIECE_COMBO_MINS);

  const seed = "givemecombos";
  logWithTime("Using seed:", seed);
  const randomHelper = SeededRandom.fromString(seed);

  // Load progress from previous runs
  const progress = loadProgress(PROGRESS_FILE);
  logWithTime(
    `Loaded progress: ${progress.totalSolutions.toString()} solutions found, ${progress.completedCombos.length.toString()} combinations completed`
  );
  logWithTime(`Last run: ${progress.lastRun}`);

  // Use random pieces with constraints
  const pieceCombos = getUniquePieceCombos(
    NUM_PIECE_COMBOS,
    NUM_PIECES,
    randomHelper
  );
  logWithTime(`Generated ${NUM_PIECE_COMBOS.toString()} piece combos`);

  logWithTime("Precomputing placements...");
  // Precompute all placements for each piece
  const placements: PiecePlacement[][] = [];
  for (let i = 0; i < TETRIS_PIECE_SHAPES.length; i++) {
    placements[i] = getAllPlacementsForPiece(i);
  }

  const PUBLIC_SOLUTIONS_DIR = `./public/solutions/${GRID_SIZE.toString()}x${GRID_SIZE.toString()}/pieces`;
  const GAME_SOLUTIONS_DIR = `./src/game/puzzle/numPieceSolutions`;

  // Track canonical solutions across all piece combinations
  const canonicalSolutions = new Set<string>();
  let totalNumSolutions = progress.totalSolutions;

  // Create overall progress bar for remaining piece combinations
  const remainingCombos = pieceCombos.filter(
    (combo) =>
      !progress.completedCombos.includes(combo.sort((a, b) => a - b).join(""))
  );

  logWithTime(
    `${remainingCombos.length.toString()} combinations remaining to process`
  );

  for (const pieceCombo of remainingCombos) {
    const comboString = pieceCombo.sort((a, b) => a - b).join("");
    logWithTime(`Processing piece combo: ${pieceCombo.toString()}`);
    const startCombo = Date.now();

    // Order pieces by number of placements (fewest first)
    const pieceComboSorted = [...pieceCombo].sort(
      (a, b) => placements[a].length - placements[b].length
    );

    const gridState = 0n;
    const piecesUsed = Array(NUM_PIECES).fill(false) as boolean[];
    const solution: PiecePlacement[] = [];
    const solutions: Solution[] = [];

    findSolutions(
      pieceComboSorted,
      placements,
      gridState,
      piecesUsed,
      solution,
      solutions,
      canonicalSolutions,
      MAX_NUM_UNIQUE_SOLUTIONS_PER_COMBO,
      0,
      startCombo,
      TIME_LIMIT_PER_PIECE_COMBO_MINS * 60 * 1000,
      GRID_SIZE * GRID_SIZE // Start with all tiles empty
    );

    logWithTime(
      `Found ${solutions.length.toString()} unique solutions for combo`
    );
    solutions.forEach((solution, index) => {
      fs.writeFileSync(
        `${PUBLIC_SOLUTIONS_DIR}/${(
          index + totalNumSolutions
        ).toString()}.json`,
        JSON.stringify(solution, null, 2),
        "utf-8"
      );
    });
    totalNumSolutions += solutions.length;
    fs.writeFileSync(
      `${GAME_SOLUTIONS_DIR}/${GRID_SIZE.toString()}x${GRID_SIZE.toString()}.ts`,
      `export const TOTAL_NUM_SOLUTIONS_${GRID_SIZE.toString()}x${GRID_SIZE.toString()} = ${totalNumSolutions.toString()};`,
      "utf-8"
    );
    const endCombo = Date.now();
    logWithTime(
      `Finished combo in ${((endCombo - startCombo) / 1000).toFixed(2)}s`
    );

    // Update and save progress
    progress.completedCombos.push(comboString);
    progress.totalSolutions = totalNumSolutions;
    progress.lastRun = new Date().toISOString();
    saveProgress(PROGRESS_FILE, progress);

    logWithTime(
      `Processed ${progress.completedCombos.length.toString()}/${NUM_PIECE_COMBOS.toString()} combinations`
    );
  }

  logWithTime(
    `Wrote ${totalNumSolutions.toString()} unique solutions to JSON files`
  );
}
main();
