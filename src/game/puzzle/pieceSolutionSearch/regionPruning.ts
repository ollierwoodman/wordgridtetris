/**
 * Aggressive early region pruning to quickly eliminate invalid states
 * before performing expensive flood fill operations
 */

/**
 * Faster region check for early depths in the search
 * Uses simpler heuristics to avoid expensive flood fill operations
 */
export function quickRegionCheck(grid: bigint, depth: number, numPieces: number, gridSize: number): boolean {
  // For early depths, use faster checks
  if (depth < Math.floor(numPieces / 2)) {
    return quickConnectivityCheck(grid, gridSize);
  }
  
  // For deeper searches, this function indicates full check is needed
  return true; // Let the main algorithm do the full check
}

/**
 * Fast connectivity check that counts isolated single cells
 * Much faster than full flood fill for early pruning
 */
function quickConnectivityCheck(grid: bigint, gridSize: number): boolean {
  let isolatedCells = 0;
  const hasEmptyTile = (gridSize * gridSize) % 4 === 1;
  const maxIsolatedCells = hasEmptyTile ? 1 : 0;

  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const cellBit = 1n << BigInt(getBitIndex(x, y, gridSize));
      
      // Skip if cell is filled
      if ((grid & cellBit) !== 0n) continue;

      // Check if this empty cell is isolated (no empty neighbors)
      if (isIsolatedEmptyCell(grid, x, y, gridSize)) {
        isolatedCells++;
        if (isolatedCells > maxIsolatedCells) {
          return false; // Too many isolated cells
        }
      }
    }
  }

  return true;
}

/**
 * Check if an empty cell has no empty neighbors (making it isolated)
 */
function isIsolatedEmptyCell(grid: bigint, x: number, y: number, gridSize: number): boolean {
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
    
    const neighborBit = 1n << BigInt(getBitIndex(nx, ny, gridSize));
    
    // If we find an empty neighbor, this cell is not isolated
    if ((grid & neighborBit) === 0n) {
      return false;
    }
  }

  return true; // All neighbors are filled or out of bounds
}

/**
 * Early deadlock detection based on grid patterns
 */
export function hasEarlyDeadlock(grid: bigint, depth: number, gridSize: number): boolean {
  // Pattern 1: Check for small holes that can't be filled
  if (hasUnfillableHoles(grid, gridSize)) {
    return true;
  }

  // Pattern 2: Check for unreachable corners early in the game
  if (depth < 3 && hasInaccessibleCorners(grid, gridSize)) {
    return true;
  }

  // Pattern 3: Check for shapes that create impossible filling patterns
  if (hasImpossibleShapes(grid, gridSize)) {
    return true;
  }

  return false;
}

/**
 * Detect small holes (1-3 cells) that cannot be filled by tetrominos
 */
function hasUnfillableHoles(grid: bigint, gridSize: number): boolean {
  const visited = new Set<number>();
  
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const cellIndex = getBitIndex(x, y, gridSize);
      const cellBit = 1n << BigInt(cellIndex);
      
      // Skip filled cells or already visited cells
      if ((grid & cellBit) !== 0n || visited.has(cellIndex)) continue;
      
      // Find the size of this empty region using a quick flood fill
      const regionSize = getRegionSize(grid, x, y, visited, gridSize);
      
      // Regions of size 1, 2, or 3 cannot be filled by tetrominos (except for the one allowed empty tile)
      if (regionSize === 2 || regionSize === 3) {
        return true; // Unfillable hole detected
      }
    }
  }
  
  return false;
}

/**
 * Quick region size calculation without storing the full region
 */
function getRegionSize(
  grid: bigint, 
  startX: number, 
  startY: number, 
  visited: Set<number>, 
  gridSize: number
): number {
  let size = 0;
  const stack = [{ x: startX, y: startY }];
  visited.add(getBitIndex(startX, startY, gridSize));

  while (stack.length > 0) {
    const current = stack.pop();
    if (!current) continue;
    
    size++;
    const { x, y } = current;

    // Check all four neighbors
    const neighbors = [
      { x: x, y: y - 1 }, // up
      { x: x, y: y + 1 }, // down
      { x: x - 1, y: y }, // left
      { x: x + 1, y: y }, // right
    ];

    for (const neighbor of neighbors) {
      const { x: nx, y: ny } = neighbor;
      
      if (nx < 0 || nx >= gridSize || ny < 0 || ny >= gridSize) continue;
      
      const neighborIndex = getBitIndex(nx, ny, gridSize);
      const neighborBit = 1n << BigInt(neighborIndex);
      
      if ((grid & neighborBit) === 0n && !visited.has(neighborIndex)) {
        visited.add(neighborIndex);
        stack.push({ x: nx, y: ny });
      }
    }
  }

  return size;
}

/**
 * Check if corners are becoming inaccessible early in the game
 */
function hasInaccessibleCorners(grid: bigint, gridSize: number): boolean {
  const corners = [
    { x: 0, y: 0 },                           // Top-left
    { x: gridSize - 1, y: 0 },               // Top-right
    { x: 0, y: gridSize - 1 },               // Bottom-left
    { x: gridSize - 1, y: gridSize - 1 },   // Bottom-right
  ];

  for (const corner of corners) {
    const { x, y } = corner;
    const cornerBit = 1n << BigInt(getBitIndex(x, y, gridSize));
    
    // If corner is empty but has very limited access (only one path), it might become unreachable
    if ((grid & cornerBit) === 0n && hasLimitedAccess(grid, x, y, gridSize)) {
      return true;
    }
  }

  return false;
}

/**
 * Check if a position has very limited access (could become unreachable)
 */
function hasLimitedAccess(grid: bigint, x: number, y: number, gridSize: number): boolean {
  const neighbors = [
    { x: x, y: y - 1 }, // up
    { x: x, y: y + 1 }, // down
    { x: x - 1, y: y }, // left
    { x: x + 1, y: y }, // right
  ];

  let emptyNeighbors = 0;
  
  for (const neighbor of neighbors) {
    const { x: nx, y: ny } = neighbor;
    
    // Count out-of-bounds as blocked
    if (nx < 0 || nx >= gridSize || ny < 0 || ny >= gridSize) continue;
    
    const neighborBit = 1n << BigInt(getBitIndex(nx, ny, gridSize));
    
    if ((grid & neighborBit) === 0n) {
      emptyNeighbors++;
    }
  }

  // If only one or no empty neighbors, access is very limited
  return emptyNeighbors <= 1;
}

/**
 * Detect shapes that create impossible filling patterns
 */
function hasImpossibleShapes(grid: bigint, gridSize: number): boolean {
  // Check for L-shaped or T-shaped holes that are too small
  // This is a simplified heuristic - could be expanded with more pattern recognition
  
  for (let y = 1; y < gridSize - 1; y++) {
    for (let x = 1; x < gridSize - 1; x++) {
      if (hasProblematicPattern(grid, x, y, gridSize)) {
        return true;
      }
    }
  }
  
  return false;
}

/**
 * Check for problematic patterns around a specific position
 */
function hasProblematicPattern(grid: bigint, x: number, y: number, gridSize: number): boolean {
  // Check for patterns like:
  // X.X  or  X..  where X = filled, . = empty
  // ...      X..
  // X.X      X..
  
  const patterns = [
    // Cross pattern with center empty - can create hard-to-fill regions
    [
      { dx: 0, dy: 0, empty: true },   // center
      { dx: -1, dy: 0, empty: false }, // left
      { dx: 1, dy: 0, empty: false },  // right
      { dx: 0, dy: -1, empty: false }, // up
      { dx: 0, dy: 1, empty: false },  // down
    ],
  ];

  for (const pattern of patterns) {
    let matches = true;
    
    for (const cell of pattern) {
      const nx = x + cell.dx;
      const ny = y + cell.dy;
      
      if (nx < 0 || nx >= gridSize || ny < 0 || ny >= gridSize) {
        matches = false;
        break;
      }
      
      const cellBit = 1n << BigInt(getBitIndex(nx, ny, gridSize));
      const isEmpty = (grid & cellBit) === 0n;
      
      if (isEmpty !== cell.empty) {
        matches = false;
        break;
      }
    }
    
    if (matches) {
      return true; // Found a problematic pattern
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