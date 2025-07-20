import { TETRIS_PIECE_SHAPES } from "../../pieceDefs.ts";
import type { PiecePlacement } from "../../../types/game.ts";

// Bitboard helpers for up to 8x8 grid
export function getBitIndex(x: number, y: number, gridSize: number): number {
  return y * gridSize + x;
}

export function canPlaceBitboard(
  grid: bigint, 
  placement: PiecePlacement, 
  depth: number, 
  gridSize: number,
  isPlacementAllowed: (placement: PiecePlacement, depth: number) => boolean
): boolean {
  // First check position restrictions
  if (!isPlacementAllowed(placement, depth)) {
    return false;
  }

  const shape = TETRIS_PIECE_SHAPES[placement.pieceIndex][placement.rotation];
  for (const block of shape) {
    const gx = placement.x + block.x;
    const gy = placement.y + block.y;
    if (gx < 0 || gx >= gridSize || gy < 0 || gy >= gridSize) {
      return false;
    }
    const bit = 1n << BigInt(getBitIndex(gx, gy, gridSize));
    if ((grid & bit) !== 0n) return false;
  }
  return true;
}

export function placePieceBitboard(grid: bigint, placement: PiecePlacement, gridSize: number): bigint {
  const shape = TETRIS_PIECE_SHAPES[placement.pieceIndex][placement.rotation];
  let newGrid = grid;
  for (const block of shape) {
    const gx = placement.x + block.x;
    const gy = placement.y + block.y;
    const bit = 1n << BigInt(getBitIndex(gx, gy, gridSize));
    newGrid |= bit;
  }
  return newGrid;
} 