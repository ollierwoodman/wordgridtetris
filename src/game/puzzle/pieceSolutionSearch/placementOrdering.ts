import type { PiecePlacement } from "../../../types/game.ts";
import { TETRIS_PIECE_SHAPES } from "../../pieceDefs.ts";
import { isCorner, isEdge, isNearCorner } from "./symmetryBreaking.ts";

/**
 * Strategic placement ordering to prioritize high-value positions
 * and reduce search time by trying better placements first
 */

interface PlacementWithScore {
  placement: PiecePlacement;
  score: number;
}

/**
 * Generate all possible placements for a piece, ordered by strategic value
 */
export function getAllPlacementsForPieceOrdered(
  pieceIndex: number, 
  gridSize: number
): PiecePlacement[] {
  const placements = generateAllPlacements(pieceIndex, gridSize);
  
  // Score and sort placements by strategic value
  const placementsWithScores: PlacementWithScore[] = placements.map(placement => ({
    placement,
    score: getPlacementScore(placement, pieceIndex, gridSize)
  }));
  
  // Sort by score (descending - higher scores first)
  placementsWithScores.sort((a, b) => b.score - a.score);
  
  return placementsWithScores.map(item => item.placement);
}

/**
 * Generate all possible placements for a piece (without ordering)
 */
function generateAllPlacements(pieceIndex: number, gridSize: number): PiecePlacement[] {
  const placements: PiecePlacement[] = [];
  const rotations = TETRIS_PIECE_SHAPES[pieceIndex].length;
  
  for (let rotationIndex = 0; rotationIndex < rotations; rotationIndex++) {
    const shape = TETRIS_PIECE_SHAPES[pieceIndex][rotationIndex];
    
    // Find bounds for placement
    let minX = 0, minY = 0, maxX = 0, maxY = 0;
    for (const block of shape) {
      if (block.x < minX) minX = block.x;
      if (block.y < minY) minY = block.y;
      if (block.x > maxX) maxX = block.x;
      if (block.y > maxY) maxY = block.y;
    }
    
    // Generate all valid positions
    for (let x = -minX; x <= gridSize - (maxX + 1); x++) {
      for (let y = -minY; y <= gridSize - (maxY + 1); y++) {
        placements.push({ pieceIndex, rotation: rotationIndex, x, y });
      }
    }
  }
  
  return placements;
}

/**
 * Calculate strategic score for a placement
 * Higher scores indicate more desirable placements
 */
function getPlacementScore(
  placement: PiecePlacement, 
  pieceIndex: number, 
  gridSize: number
): number {
  let score = 0;
  const { x, y } = placement;
  
  // Base position scoring
  if (isCorner(x, y, gridSize)) {
    score += 15; // Corners are very valuable
  } else if (isEdge(x, y, gridSize)) {
    score += 10; // Edges are valuable
  } else if (isNearCorner(x, y, gridSize)) {
    score += 8; // Near corners are good
  } else {
    // Center positions get lower scores, prefer outer positions
    const centerDistance = Math.min(
      Math.abs(x - gridSize/2), 
      Math.abs(y - gridSize/2)
    );
    score += Math.floor(centerDistance * 2); // Further from center is better
  }
  
  // Piece-specific scoring
  score += getPieceSpecificScore(placement, pieceIndex, gridSize);
  
  // Rotation preference (some rotations are more constraining)
  score += getRotationScore(placement, pieceIndex);
  
  // Position compactness (prefer positions that don't spread too wide early)
  score += getCompactnessScore(placement);
  
  return score;
}

/**
 * Get piece-specific scoring bonuses
 */
function getPieceSpecificScore(
  placement: PiecePlacement, 
  pieceIndex: number, 
  gridSize: number
): number {
  const { x, y } = placement;
  let score = 0;
  
  switch (pieceIndex) {
    case 0: // I piece
      // I pieces work well along edges
      if (isEdge(x, y, gridSize) || isEdge(x, y + 3, gridSize)) {
        score += 5;
      }
      // Prefer vertical I pieces in corners
      if (isCorner(x, y, gridSize) || isCorner(x, y + 3, gridSize)) {
        score += 3;
      }
      break;
      
    case 1: // O piece
      // O pieces work well in corners and don't create odd shapes
      if (isCorner(x, y, gridSize)) {
        score += 8;
      }
      if (isNearCorner(x, y, gridSize)) {
        score += 5;
      }
      break;
      
    case 2: // T piece
      // T pieces are versatile, prefer edge positions for the stem
      if (isEdge(x, y, gridSize)) {
        score += 4;
      }
      // Avoid very center positions early
      if (x > 1 && x < gridSize - 2 && y > 1 && y < gridSize - 2) {
        score -= 2;
      }
      break;
      
    case 3: // S piece
    case 4: // Z piece
      // S and Z pieces work well along edges
      if (isEdge(x, y, gridSize)) {
        score += 3;
      }
      break;
      
    case 5: // L piece  
    case 6: // J piece
      // L and J pieces work well in corners
      if (isCorner(x, y, gridSize) || isNearCorner(x, y, gridSize)) {
        score += 6;
      }
      // These pieces have long sides, prefer edge positions
      if (isEdge(x, y, gridSize)) {
        score += 4;
      }
      break;
  }
  
  return score;
}

/**
 * Score based on rotation preference
 */
function getRotationScore(placement: PiecePlacement, pieceIndex: number): number {
  // Some rotations create more constraints than others
  // This is piece-specific knowledge
  
  switch (pieceIndex) {
    case 0: // I piece
      // Only one rotation available (vertical), so no preference
      return 0;
      
    case 1: // O piece
      // Only one effective rotation, so no preference  
      return 0;
      
    case 2: // T piece
      // Prefer T pointing up (rotation 0) as it's less constraining
      return placement.rotation === 0 ? 2 : 0;
      
    case 3: // S piece
    case 4: // Z piece
      // Prefer horizontal orientation (usually rotation 0)
      return placement.rotation === 0 ? 1 : 0;
      
    case 5: // L piece
    case 6: // J piece
      // Prefer orientations where the long side is horizontal
      return placement.rotation === 0 || placement.rotation === 2 ? 1 : 0;
      
    default:
      return 0;
  }
}

/**
 * Score based on how compact/spread out the placement is
 */
function getCompactnessScore(placement: PiecePlacement): number {
  const { x, y } = placement;
  
  // Prefer placements that don't spread too far from origin early in the game
  // This encourages building outward from a corner/edge rather than scattered placement
  const spreadScore = -(Math.abs(x - 0) + Math.abs(y - 0)) * 0.1;
  
  return Math.floor(spreadScore);
} 