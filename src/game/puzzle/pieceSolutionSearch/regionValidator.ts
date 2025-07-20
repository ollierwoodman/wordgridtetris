// Helper to check if all empty regions are fillable (size % 4 == 0), except for up to NUM_EMPTY_TILES regions of size 1
export function checkFillableRegions(grid: bigint, gridSize: number, hasEmptyTile: boolean): boolean {
  const visited = new Set<number>();
  let numHoles = 0;
  let hasInvalidRegion = false;
  
  // Single pass through grid
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const cellIndex = getBitIndex(x, y, gridSize);
      const cellBit = 1n << BigInt(cellIndex);
      
      // Skip if this cell is filled or already visited
      if ((grid & cellBit) !== 0n || visited.has(cellIndex)) continue;
      
      // Begin a new flood fill for this region
      let regionSize = 0;
      const stack: [number, number][] = [[x, y]];
      visited.add(cellIndex);
      
      // Perform flood fill (DFS)
      while (stack.length > 0) {
        const current = stack.pop();
        if (!current) continue;
        const [currentX, currentY] = current;
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
          if (nx < 0 || nx >= gridSize || ny < 0 || ny >= gridSize) continue;
          const neighborIndex = getBitIndex(nx, ny, gridSize);
          const neighborBit = 1n << BigInt(neighborIndex);
          // If neighbor is empty and not visited, add to stack
          if ((grid & neighborBit) === 0n && !visited.has(neighborIndex)) {
            visited.add(neighborIndex);
            stack.push([nx, ny]);
          }
        }
      }
      
      // Check region properties immediately
      if (regionSize === 1) {
        numHoles++;
        if (numHoles > (hasEmptyTile ? 1 : 0)) return false;
      } else if (regionSize === 2 || regionSize === 3) {
        return false;
      } else if (regionSize % 4 !== 0) {
        if (hasInvalidRegion || regionSize % 4 !== 1) return false;
        hasInvalidRegion = true;
      }
    }
  }
  
  return true;
}

function getBitIndex(x: number, y: number, gridSize: number): number {
  return y * gridSize + x;
} 