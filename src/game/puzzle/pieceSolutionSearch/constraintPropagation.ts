import type { PiecePlacement } from "../../../types/game.ts";
import { TETRIS_PIECE_SHAPES } from "../../pieceDefs.ts";

/**
 * Look-ahead constraint propagation to detect impossible states early
 * and prune branches that cannot lead to valid solutions
 */

interface EmptyRegion {
  cells: { x: number; y: number }[];
  size: number;
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

/**
 * Check if remaining pieces can possibly fit in the current grid state
 */
export function canRemainingPiecesFit(
  grid: bigint,
  remainingPieceIndices: number[],
  placements: PiecePlacement[][],
  gridSize: number
): boolean {
  if (remainingPieceIndices.length === 0) return true;

  const emptyRegions = getEmptyRegions(grid, gridSize);
  const requiredSpace = remainingPieceIndices.length * 4;
  const availableSpace = emptyRegions.reduce((sum, region) => sum + region.size, 0);

  // Quick space check
  if (availableSpace < requiredSpace) return false;

  // More sophisticated geometric check
  return canPlacePiecesInRegions(remainingPieceIndices, emptyRegions, placements);
}

/**
 * Get all empty regions in the grid
 */
function getEmptyRegions(grid: bigint, gridSize: number): EmptyRegion[] {
  const visited = new Set<number>();
  const regions: EmptyRegion[] = [];

  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const cellIndex = getBitIndex(x, y, gridSize);
      const cellBit = 1n << BigInt(cellIndex);

      // Skip if this cell is filled or already visited
      if ((grid & cellBit) !== 0n || visited.has(cellIndex)) continue;

      // Find the connected empty region
      const region = floodFillRegion(grid, x, y, visited, gridSize);
      if (region.size > 0) {
        regions.push(region);
      }
    }
  }

  return regions;
}

/**
 * Flood fill to find a connected empty region
 */
function floodFillRegion(
  grid: bigint,
  startX: number,
  startY: number,
  visited: Set<number>,
  gridSize: number
): EmptyRegion {
  const cells: { x: number; y: number }[] = [];
  const stack: { x: number; y: number }[] = [{ x: startX, y: startY }];
  
  let minX = startX, maxX = startX, minY = startY, maxY = startY;
  
  visited.add(getBitIndex(startX, startY, gridSize));

  while (stack.length > 0) {
    const current = stack.pop();
    if (!current) continue;
    const { x, y } = current;
    cells.push({ x, y });

    // Update bounds
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;

    // Check all four neighbors
    const neighbors = [
      { x: x, y: y - 1 }, // up
      { x: x, y: y + 1 }, // down
      { x: x - 1, y: y }, // left
      { x: x + 1, y: y }, // right
    ];

    for (const neighbor of neighbors) {
      const { x: nx, y: ny } = neighbor;
      
      // Skip out-of-bounds neighbors
      if (nx < 0 || nx >= gridSize || ny < 0 || ny >= gridSize) continue;
      
      const neighborIndex = getBitIndex(nx, ny, gridSize);
      const neighborBit = 1n << BigInt(neighborIndex);
      
      // If neighbor is empty and not visited, add to stack
      if ((grid & neighborBit) === 0n && !visited.has(neighborIndex)) {
        visited.add(neighborIndex);
        stack.push({ x: nx, y: ny });
      }
    }
  }

  return {
    cells,
    size: cells.length,
    minX,
    maxX,
    minY,
    maxY,
  };
}

/**
 * Check if the given pieces can be placed geometrically in the available regions
 */
function canPlacePiecesInRegions(
  remainingPieceIndices: number[],
  emptyRegions: EmptyRegion[],
  placements: PiecePlacement[][]
): boolean {
  // Sort pieces by number of possible placements (most constrained first)
  const sortedPieces = [...remainingPieceIndices].sort(
    (a, b) => placements[a].length - placements[b].length
  );

  // Sort regions by size (smallest first - most constraining)
  const sortedRegions = [...emptyRegions].sort((a, b) => a.size - b.size);

  // Try to assign each piece to a region where it can fit
  return canAssignPiecesToRegions(sortedPieces, sortedRegions, placements, new Set());
}

/**
 * Recursive function to try assigning pieces to regions
 */
function canAssignPiecesToRegions(
  remainingPieces: number[],
  regions: EmptyRegion[],
  placements: PiecePlacement[][],
  usedRegions: Set<number>
): boolean {
  if (remainingPieces.length === 0) return true;

  const pieceIndex = remainingPieces[0];
  const restPieces = remainingPieces.slice(1);

  // Try to place this piece in each available region
  for (let regionIndex = 0; regionIndex < regions.length; regionIndex++) {
    if (usedRegions.has(regionIndex)) continue;

    const region = regions[regionIndex];
    
    // Quick check: can this piece possibly fit in this region's bounding box?
    if (canPieceFitInRegion(pieceIndex, region, placements[pieceIndex])) {
      // Mark this region as used and try the rest
      usedRegions.add(regionIndex);
      
      if (canAssignPiecesToRegions(restPieces, regions, placements, usedRegions)) {
        return true;
      }
      
      // Backtrack
      usedRegions.delete(regionIndex);
    }
  }

  return false;
}

/**
 * Check if a piece can potentially fit in a region's bounding box
 */
function canPieceFitInRegion(
  pieceIndex: number,
  region: EmptyRegion,
  placements: PiecePlacement[]
): boolean {
  const regionWidth = region.maxX - region.minX + 1;
  const regionHeight = region.maxY - region.minY + 1;

  // Check if any rotation of this piece can fit in the region's bounding box
  for (const placement of placements) {
    if (placement.pieceIndex !== pieceIndex) continue;

    const shape = TETRIS_PIECE_SHAPES[pieceIndex][placement.rotation];
    
    // Calculate piece bounds
    let minX = 0, maxX = 0, minY = 0, maxY = 0;
    for (const block of shape) {
      if (block.x < minX) minX = block.x;
      if (block.x > maxX) maxX = block.x;
      if (block.y < minY) minY = block.y;
      if (block.y > maxY) maxY = block.y;
    }
    
    const pieceWidth = maxX - minX + 1;
    const pieceHeight = maxY - minY + 1;
    
    // If this rotation fits in the region's bounding box, the piece can potentially fit
    if (pieceWidth <= regionWidth && pieceHeight <= regionHeight) {
      return true;
    }
  }

  return false;
}

/**
 * Get bit index for grid position
 */
function getBitIndex(x: number, y: number, gridSize: number): number {
  return y * gridSize + x;
}

/**
 * Advanced constraint check: detect patterns that make completion impossible
 */
export function hasImpossiblePatterns(
  grid: bigint,
  remainingPieceCount: number,
  gridSize: number
): boolean {
  // Check for patterns that make completion impossible
  
  // Pattern 1: Too many small isolated regions
  const regions = getEmptyRegions(grid, gridSize);
  const smallRegions = regions.filter(r => r.size < 4);
  
  // Can't have more small regions than we have empty tiles allowed
  const hasEmptyTile = (gridSize * gridSize) % 4 === 1;
  const maxSmallRegions = hasEmptyTile ? 1 : 0;
  
  if (smallRegions.length > maxSmallRegions) {
    return true;
  }
  
  // Pattern 2: Remaining space cannot accommodate remaining pieces
  const totalEmptySpace = regions.reduce((sum, r) => sum + r.size, 0);
  const requiredSpace = remainingPieceCount * 4 + (hasEmptyTile ? 1 : 0);
  
  if (totalEmptySpace !== requiredSpace) {
    return true;
  }
  
  // Pattern 3: Check for unreachable corners/edges due to piece constraints
  if (hasUnreachableAreas(regions)) {
    return true;
  }
  
  return false;
}

/**
 * Check if there are areas that cannot be reached by any remaining pieces
 */
function hasUnreachableAreas(regions: EmptyRegion[]): boolean {
  // This is a simplified check - in practice, this could be much more sophisticated
  // For now, just check if we have very small, isolated regions that would be hard to fill
  
  const verySmallRegions = regions.filter(r => r.size === 1 || r.size === 2 || r.size === 3);
  
  // These small regions are problematic unless we have exactly the right pieces
  if (verySmallRegions.length > 0) {
    // If we have small regions but not enough pieces to potentially create valid arrangements
    const totalSmallSpace = verySmallRegions.reduce((sum, r) => sum + r.size, 0);
    const hasEmptyTile = (regions.reduce((sum, r) => sum + r.size, 0)) % 4 === 1;
    
    // If we have odd-sized regions that can't form valid tetromino patterns
    if (totalSmallSpace > (hasEmptyTile ? 1 : 0)) {
      return true;
    }
  }
  
  return false;
} 