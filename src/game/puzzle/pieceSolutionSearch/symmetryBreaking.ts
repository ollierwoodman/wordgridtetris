import type { PiecePlacement } from "../../../types/game.ts";

/**
 * Enhanced symmetry breaking constraints to reduce search space
 * by eliminating equivalent solutions early in the search
 */

export function isPlacementAllowed(
  placement: PiecePlacement, 
  depth: number, 
  gridSize: number
): boolean {
  // Existing I piece restriction - cannot be placed at x = 0
  if (placement.pieceIndex === 0 && placement.x === 0) {
    return false;
  }
  
  // NEW: Force first piece to upper-left quadrant to break rotation/reflection symmetry
  if (depth === 0) {
    if (placement.x >= Math.floor(gridSize / 2) || placement.y >= Math.floor(gridSize / 2)) {
      return false;
    }
  }
  
  // NEW: Force second piece to be in upper half or left half to break more symmetries
  if (depth === 1) {
    if (placement.x >= Math.floor(gridSize / 2) && placement.y >= Math.floor(gridSize / 2)) {
      return false;
    }
  }
  
  // NEW: Restrict I piece to vertical orientation only (horizontal removed from piece defs)
  // This is already handled by the piece definitions, but adding explicit check
  if (placement.pieceIndex === 0) {
    // I piece should be vertical - this constraint is already in piece defs
    return true;
  }
  
  return true;
}

/**
 * Check if a position is near a corner (within 1 tile)
 */
export function isNearCorner(x: number, y: number, gridSize: number): boolean {
  const maxIndex = gridSize - 1;
  return (
    (x <= 1 && y <= 1) ||           // Top-left corner
    (x >= maxIndex - 1 && y <= 1) || // Top-right corner  
    (x <= 1 && y >= maxIndex - 1) || // Bottom-left corner
    (x >= maxIndex - 1 && y >= maxIndex - 1) // Bottom-right corner
  );
}

/**
 * Check if a position is on an edge
 */
export function isEdge(x: number, y: number, gridSize: number): boolean {
  return x === 0 || y === 0 || x === gridSize - 1 || y === gridSize - 1;
}

/**
 * Check if a position is in a corner
 */
export function isCorner(x: number, y: number, gridSize: number): boolean {
  const maxIndex = gridSize - 1;
  return (
    (x === 0 && y === 0) ||           // Top-left
    (x === maxIndex && y === 0) ||   // Top-right
    (x === 0 && y === maxIndex) ||   // Bottom-left
    (x === maxIndex && y === maxIndex) // Bottom-right
  );
}

/**
 * Check if piece is considered "large" (L, J, T pieces)
 */
export function isLargePiece(pieceIndex: number): boolean {
  // I=0, O=1, T=2, S=3, Z=4, L=5, J=6
  // L, J, T pieces are considered "large" and should be placed strategically
  return pieceIndex === 2 || pieceIndex === 5 || pieceIndex === 6;
}

/**
 * Check if a position is near corner or edge (within strategic placement zone)
 */
export function isNearCornerOrEdge(x: number, y: number, gridSize: number): boolean {
  return isNearCorner(x, y, gridSize) || isEdge(x, y, gridSize);
} 