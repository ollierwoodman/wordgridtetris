import { SeededRandom } from "../../../utils/random.ts";

// Randomly pick pieces for a puzzle with constraints
export function pickRandomPieces(numPieces: number, random: SeededRandom): number[] {
  const pieceTypes = [0, 1, 2, 3, 4, 5, 6, 2, 3, 4, 5, 6]; // Final picks can only have up to one I and one O, and at least 3 unique types
  switch (numPieces) {
    case 4: // 4x4
      pieceTypes.push(...[0, 1, 2, 3, 4, 5, 6]);
      break;
    case 6: // 5x5
      break;
    case 9: // 6x6
      break;
    case 12: // 7x7
      pieceTypes.push(...[0, 1]); // add an I and an O
      break;
    case 16: // 8x8
      pieceTypes.push(...[0, 1, 2, 3, 4, 5, 6]);
      break;
    default:
      throw new Error(`Unsupported grid size for ${numPieces.toString()} pieces`);
  }

  // Shuffle pieceTypes and pick the first numPieces
  return pieceTypes.sort(() => random.randFloat() - 0.5).slice(0, numPieces);
}

export function getUniquePieceCombos(
  numCombos: number,
  numPieces: number,
  random: SeededRandom
): number[][] {
  const maxAttempts = 1000;
  const pieceCombos: number[][] = [];
  const uniquePieceCombos = new Set<string>();
  for (let i = 0; i < maxAttempts; i++) {
    const newCombo = pickRandomPieces(numPieces, random);
    const comboString = newCombo.sort((a, b) => a - b).join("");
    if (!uniquePieceCombos.has(comboString)) {
      pieceCombos.push(newCombo);
      uniquePieceCombos.add(comboString);
    }
    if (pieceCombos.length >= numCombos) return pieceCombos;
  }
  throw new Error(
    `Only found ${pieceCombos.length.toString()}/${numCombos.toString()} unique piece combos, you can increase the max attempts to find more or decrease the number of required piece combos`
  );
} 